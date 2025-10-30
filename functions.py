import requests
import sqlite3
import time
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
TEST_GROUP = 'ПИН-24'


def get_unformatted_groups() -> list:
    SCH_URI = 'https://orioks.miet.ru/api/v1/schedule/groups'
    schedule_resp = requests.get(SCH_URI, headers=header)
    js = schedule_resp.json()

    lis = list()
    for i in js:
        lis.append(f'{str(i["id"])} {str(i["name"].split()[0])}')
    return lis
        

def write_all_groups_into_file():
    unformatted_groups = get_unformatted_groups()
    
    with open('data/bachelors.txt', 'a', encoding='utf-8') as f:
        for i in unformatted_groups:
            group = i.split()[1]
            if str(group[-1]) in '0123456789' and ('ДПП' not in group and 'ДПК' not in group):
                f.write(group)
                f.write('\n')

# Get information from Content (received from request_to_schedule) and Group
def get_content_from_group(content, group) -> list:
    lis = list()
    for i in content:
        day, dayNumber, Time, Class, Room = int(i['Day']) - 1, int(i['DayNumber']), i['Time']['Code'], i['Class']['Name'], i['Room']['Name']
        teacher = i['Class']['TeacherFull']
        
        lesson = [Room, day, dayNumber % 2, Time, Class, teacher, group]
        if lesson not in lis:
            lis.append(lesson)
            
    return lis

def insert_group_schedule_into_db(array=list):
    for i in sorted(array, key=lambda x: x[1]):
        db = sqlite3.connect('data\classrooms.db')
        cur = db.cursor()
        
        cur.execute('INSERT INTO classrooms VALUES (?, ?, ?, ?, ?, ?, ?)', i)
        db.commit()


def request_to_schedule(one_group=False):  # ~ 2.15s for 10 operations (so for all 200 groups it'll take ~43s to complete)
    lis = list()
    bugs = list()
    if not one_group:
        with open('data/bachelors.txt', 'r', encoding='utf-8') as f:
            reader = f.readlines()
            for i in reader:
                group = i[:-1]
                payload = {'group': group}
                response = requests.post(SCHEDULE_URL, data=payload)
                content = response.json()['Data']
                
                try:
                    insert_group_schedule_into_db(get_content_from_group(content, group))
                    print(f'Insertion completed for {i}')
                except: 
                    print(f"ERROR WITH GROUP {i}")
                    bugs.append(i)
                time.sleep(1.5)
    else:
        group = TEST_GROUP
        payload = {'group': group}
        response = requests.post(SCHEDULE_URL, data=payload)
        content = response.json()['Data']
        
        lis.append(get_content_from_group(content, group))
    
    print(bugs)


def divide_classes_by_floors(classes=set()) -> dict:
    res = {
        '1': list(),
        '2': list(),
        '3': list()
    }
    for i in list(classes):
        floor = i[0][1]
        res[floor].append(i)
        
    return res


def get_classes(building, day, week, t) -> dict:
    db = sqlite3.connect('data\classrooms.db')
    cur = db.cursor()
    chosen = set()
    
    building = list(cur.execute('SELECT value FROM buildings WHERE id=?', (building, )).fetchone())[0]
    
    for i in cur.execute('SELECT * FROM classrooms WHERE room LIKE ? AND day=? AND dayNumber=? AND time=?', (f'{building}___%', day, week, t, )):
        if '[Лек]' in i[4]:
            chosen.add(i[:-1])
        else:
            chosen.add(i)

    chosen = divide_classes_by_floors(chosen)
    
    return chosen