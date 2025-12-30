from flask import Flask, render_template, request, jsonify, redirect, url_for
from credentials import *
from functions import *
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY


@app.route('/', methods=['GET', 'POST', 'FETCH'])
def main():
    nav_data = {
        'buildings': ['Первый корпус', 'Третий корпус', 'Четвертый корпус'],
        'days': ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        'weeks': ['1-й числитель', '1-й знаменатель', '2-й числитель', '2-й знаменатель'],
        'time': [f'{i}-я пара' for i in range(1, 9)],
    }
    
    if request.method == 'POST':
        try:
            reqdata = request.data.decode('utf-8').split(',')
            building = reqdata[0]
            day = reqdata[1]
            week = reqdata[2]
            time = reqdata[3]
            
            classes = get_classes(building, day, week, time)
            for i in classes:
                print(classes[i])
            return {'info': classes}
        except (TypeError, IndexError) as e:
            print('ERROR in POST request:', e)
        
    return render_template('home.html', nav_data=nav_data)


if __name__=='__main__':
    app.run(debug=True)