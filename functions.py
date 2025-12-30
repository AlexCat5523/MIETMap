import sqlite3


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
    db = sqlite3.connect('data\classrooms2.db')
    cur = db.cursor()
    chosen = set()
    
    building = list(cur.execute('SELECT value FROM buildings WHERE id=?', (building, )).fetchone())[0]
    
    for i in cur.execute('SELECT * FROM classrooms WHERE room LIKE ? AND day=? AND dayNumber=? AND time=?', (f'{building}___%', day, str(int(week) - 1), t, )):
        if '[Лек]' in i[4]:
            chosen.add(i[:-1])
        else:
            chosen.add(i)

    chosen = divide_classes_by_floors(chosen)
    
    return chosen