const URL = 'http://127.0.0.1:5000/'

let btn = document.getElementById('navbutton');

let storedclassrooms = []   // An array to store occupied classrooms from the request
let storedroomnames = []    // An array to store classroom names (Example: [1201, 3240, e.t.c])
globalfloor = 0

// Get all classes from the selected options
async function getclasses() {
    let lis = [document.getElementById('buildings').value, document.getElementById('days').value, 
        document.getElementById('weeks').value, document.getElementById('time').value]
    
    let res = await makerequest(lis)

    storedclassrooms = res['info']
    storedroomnames = []
    
    putclasses(res)
}


// Select occupied classes on the map (clears previously occupied classes)
function putclasses(data) {
    let all_rooms = document.getElementsByClassName('classroom')

    for (let i = 0 ; i < all_rooms.length; i++) {
        let room = all_rooms[i];
        if (room.childElementCount != 0) {
            room.removeChild(room.childNodes[0])
            room.removeChild(room.childNodes[0])
            room.style.backgroundColor = ''
        }
    }

    for (let i = 1; i < 4; i++) {
        let floor = data['info'][String(i)]

        for (let j = 0; j < floor.length; j++) {
            let room = String(parseInt(floor[j][0].split(' ')[0]))
            floor[j][0] = room
            storedroomnames.push(room)
            let maproom = document.getElementById(room.slice(-3))   // Classroom that will be added to the map
            
            maproom.appendChild(document.createElement('div'))
            maproom.style.backgroundColor = 'red'
            maproom.childNodes[0].textContent = room
        }
    }

    for (let i = 0; i < storedroomnames.length; i++) {
        createInfoDiv(storedroomnames[i], document.getElementById(storedroomnames[i].slice(-3)))
    }
    // fillFreeRooms()
}

// Function that creates info div for a room if it's occupied
function createInfoDiv(room, maproom) {
    let info = showClassInfo(room)

    let names = ['Аудитория: ', 'День: ', 'Неделя: ', "Время: ", 'Предмет: ', 'Преподаватель: ', 'Группа: ']
    let classes = ['auditorium', 'day', 'week', "period", 'lecture', 'teacher', 'group']

    maproom.appendChild(document.createElement('div'))
    let infodiv = maproom.childNodes[1]
    infodiv.classList.add('info')
    infodiv.appendChild(document.createElement('ul'))
    let list = infodiv.childNodes[0]

    for (let i = 0; i < 7; i++) {
        let list_value = list.appendChild(document.createElement('li'))
        list_value.appendChild(document.createElement('span'))
        list_value.appendChild(document.createElement('span'))
        list_value.childNodes[0].textContent = names[i]
        list_value.childNodes[1].classList.add(classes[i])
        list_value.childNodes[1].textContent = info[i]
    }
    // infodiv.appendChild(document.createElement('div'))
}

// Function that shows info about class (if the classroom is occupied)
function showClassInfo(classroom) {
    let room = []
    if (storedroomnames.includes(classroom)) {
        let floor = storedclassrooms[classroom[1]]
        for (let i = 0; i < floor.length; i++) {
            if (floor[i].includes(classroom)) {
                room = floor[i]
            }
        }
    }
    return room
}


function fillFreeRooms() {
    let floor = globalfloor + 1
    let building = document.getElementById('buildings').value
    let free = document.getElementById('allroomsList')
    let numberOfrooms = 0
    if (building == 1) {
        numberOfrooms = 5
    } else {
        numberOfrooms = 156
    }

    for (let i = 0; i < numberOfrooms; i++) {
        let j = i
        if (parseInt(building) == 1) {
            roomnumber = '120' + String(j)
        } else {
            if (i < 10) {
                j = '0' + String(parseInt(i) + 1)
            } 
            roomnumber = String(parseInt(building) + 1) + floor + String(j)
        }
        console.log(roomnumber)
        if (storedroomnames.includes(roomnumber) == 0) {
            free.appendChild(document.createElement('li'))
            free.childNodes[i].textContent = roomnumber
        }
    }
}


// Function that closes and opens the floor by click of a button
function closure(id) {
    let floor = document.getElementById('floor' + id[id.length - 1])
    if (floor.classList.contains('closed')) {
        floor.classList.remove('closed')
    } else {
        floor.classList.add('closed')
    }
}

// Function to select floor to be displayed
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
    globalfloor = chosenfloor
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

// document.querySelectorAll('.classroom').forEach(element => {
//     element.addEventListener('mouseover', 
//         function() 
//     { 
//         if (element.childElementCount != 0) 
//         {
//         showClassInfo(element.childNodes[0].textContent)
//         }
//     })
// })