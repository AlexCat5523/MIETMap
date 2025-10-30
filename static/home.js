const URL = 'http://127.0.0.1:5000/'

let btn = document.getElementById('navbutton');


async function getclasses() {
    let lis = [document.getElementById('buildings').value, document.getElementById('days').value, 
        document.getElementById('weeks').value, document.getElementById('time').value]
    
    let res = await makerequest(lis)
}

function makerequest(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', URL);

        xhr.send(data);
        let result = 0

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