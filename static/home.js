const URL = 'http://127.0.0.1:5000/'

let btn = document.getElementById('navbutton');

// Get all classes from the selected options
async function getclasses() {
    let lis = [document.getElementById('buildings').value, document.getElementById('days').value, 
        document.getElementById('weeks').value, document.getElementById('time').value]
    
    let res = await makerequest(lis)
    
    putclasses(res)
}


// Select occupied classes on the map
function putclasses(data) {
    console.log(data)
    for (let i = 1; i < 4; i++) {
        let floor = data['info'][String(i)]

        for (let j = 0; j < floor.length; j++) {
            let room = String(parseInt(floor[j][0].split(' ')[0]))
            let maproom = document.getElementById(room.slice(-3))
            console.log(room)
            
            maproom.appendChild(document.createElement('div'))
            maproom.style.backgroundColor = 'red'
            maproom.childNodes[0].textContent = room
        }
    }
}


function printhello(id) {
    let floor = document.getElementById('floor' + id[id.length - 1])
    if (floor.classList.contains('closed')) {
        floor.classList.remove('closed')
    } else {
        floor.classList.add('closed')
    }
}



// Function for making requests with data supplied
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