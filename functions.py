import requests
import sqlite3
from credentials import *


class Lesson():
    def __init__(self, day=int, dayNumber=int, Time=int, lesson=str, room=str, teacher=str):
        self.day = day
        self.dayNumber = dayNumber
        self.Time = Time
        self.lesson = lesson
        self.room = room
        self.teacher = teacher
        
        self.info = [self.day, self.dayNumber, self.Time, self.lesson, self.room, self.teacher]
    
    def print_lesson(self):
        days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', "Суббота"]
        weeks = {
            0: 'Числитель',
            1: 'Знаменатель'
        }
        
        information_to_print = ['День', 'Неделя', 'Пара', 'Предмет', 'Аудитория', 'Преподаватель']
        self.info[0] = days[self.info[0]]
        self.info[1] = weeks[self.info[1]]
        
        for i in range(len(self.info)):
            print(f'{information_to_print[i]}: {self.info[i]}')
            


SCHEDULE_URL = 'https://miet.ru/schedule/data'
# group = 'ДПК-20-905/1'
# payload = {'group': group}
# response = requests.post(url, data=payload)
# content = response.json()['Data']
# print(content)


def get_unformatted_groups():
    SCH_URI = 'https://orioks.miet.ru/api/v1/schedule/groups'
    schedule_resp = requests.get(SCH_URI, headers=header)
    js = schedule_resp.json()

    for i in js:
        with open('data/unformatted_groups.txt', 'a', encoding='utf-8') as f:
            f.write(f'{str(i["id"])} {str(i["name"].split()[0])}')
            f.write('\n')
        
        
def add_all_groups():
    all_groups = set()
    
    with open('data/unformatted_groups.txt', 'r', encoding='utf-8') as f:
        reader = f.readlines()
        for i in reader:
            group = i[:-1].split()[1]
            if str(group[-1]) in '0123456789' and ('ДПП' not in group and 'ДПК' not in group):
                all_groups.add(group)

    for i in all_groups:
        with open('data/bachelors.txt', 'a', encoding='utf-8') as f2:
            f2.write(i)
            f2.write('\n')

def get_content_from_group(content):
    lis = list()
    for i in content:
        day, dayNumber, Time, Class, Room = int(i['Day']) - 1, int(i['DayNumber']), i['Time']['Code'], i['Class']['Name'], i['Room']['Name']
        teacher = i['Class']['TeacherFull']
        
        lesson = [Room, day, dayNumber % 2, Time, Class, teacher, group]
        if lesson not in lis:
            lis.append(lesson)


def insert_group_schedule_into_db(array=list):
    for i in sorted(array, key=lambda x: x[1]):
        db = sqlite3.connect('data\classrooms.db')
        cur = db.cursor()
        
        cur.execute('INSERT INTO classrooms VALUES (?, ?, ?, ?, ?, ?, ?)', i)
        db.commit()