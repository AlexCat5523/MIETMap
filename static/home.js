const URL = 'http://127.0.0.1:5000/'

let btn = document.getElementById('navbutton');

let storedclassrooms = []
let storedroomnames = []

// Get all classes from the selected options
async function getclasses() {
    let lis = [document.getElementById('buildings').value, document.getElementById('days').value, 
        document.getElementById('weeks').value, document.getElementById('time').value]
    
    let res = await makerequest(lis)
    
    putclasses(res)

    storedclassrooms = res['info']
}


// Select occupied classes on the map (clears previously occupied classes)
function putclasses(data) {
    let all_rooms = document.getElementsByClassName('classroom')

    for (let i = 0 ; i < all_rooms.length; i++) {
        let room = all_rooms[i];
        if (room.childElementCount != 0) {
            room.removeChild(room.childNodes[0])
            room.style.backgroundColor = ''
        }
    }
    for (let i = 1; i < 4; i++) {
        let floor = data['info'][String(i)]

        for (let j = 0; j < floor.length; j++) {
            let room = String(parseInt(floor[j][0].split(' ')[0]))
            storedroomnames.push(room)
            let maproom = document.getElementById(room.slice(-3))
            
            maproom.appendChild(document.createElement('div'))
            maproom.style.backgroundColor = 'red'
            maproom.childNodes[0].textContent = room
        }
    }
}


function showStoredclass(classroom) {
    let room = []
    if (storedroomnames.includes(classroom)) {
        let floor = storedclassrooms[classroom[1]]
        for (let i = 0; i < floor.length; i++) {
            if (floor[i].includes(classroom)) {
                room = floor[i]
            }
        }
    }
    console.log('roominfo', room)
    return room
}


function closure(id) {
    let floor = document.getElementById('floor' + id[id.length - 1])
    if (floor.classList.contains('closed')) {
        floor.classList.remove('closed')
    } else {
        floor.classList.add('closed')
    }
}


function selectFloor(id) {
    let chosenfloor = id[id.length - 1]
    let floor = document.getElementById('floor' + chosenfloor)

    let closers = document.getElementsByClassName('closer')
    let chosencloser = document.getElementById('closer' + chosenfloor)
    for (let i = 0; i < 3; i++) {
        if (closers[i].classList.contains('not_visible') == 0) {
            closers[i].classList.add('not_visible')
            if (document.getElementById('floor' + i).classList.contains('closed') == 0) {
                document.getElementById('floor' + i).classList.add('closed')
                floor.classList.remove('closed')
            }
        }
    }
    if (chosencloser.classList.contains('not_visible')) {
        chosencloser.classList.remove('not_visible')
    }
}



// Function for making requests with supplied data
function makerequest(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', URL);

        xhr.send(data);

        xhr.onload = function() 
        {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText))
            } else {
                reject(new Error('Не удалось подключиться к серверу!'))
            }
        }
    });
}


btn.addEventListener('click', getclasses);

document.querySelectorAll('.classroom').forEach(element => {
    element.addEventListener('mouseover', 
        function() 
    { 
        if (element.childElementCount != 0) 
        {
        showStoredclass(element.childNodes[0].textContent)
        }
    })
})