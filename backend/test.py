from datetime import datetime, timedelta

def parse_schedule(str):
    week_dict = {
        'M': 0,
        'T': 1440,
        'W': 2880,
        'R': 4320,
        'F': 5760,
        'S': 7200,
        'U': 8640
    }
    arr = str.split()
    days = arr[0]
    h = ""
    for i in range(1, len(arr)):
        h = h + arr[i]
    
    hours = h.split('-')

    t1 = datetime.strptime(hours[0], "%I:%M%p")
    t2 = datetime.strptime(hours[1], "%I:%M%p")
    delta1 = int (timedelta(hours=t1.hour, minutes=t1.minute).total_seconds() / 60)
    delta2 = int (timedelta(hours=t2.hour, minutes=t2.minute).total_seconds() / 60)

    result = []
    for i in range(0, len(days)):
        result.append((week_dict[days[i]] + delta1, week_dict[days[i]] + delta2))
    return result

course_id = "CAS CS 112"

def numfy(s):
    number = 0
    for e in [ord(c) for c in s]:
        number = (number * 0x110000) + e
    return number

def denumfy(number):
    l = []
    while(number != 0):
        l.append(chr(number % 0x110000))
        number = number // 0x110000
    return ''.join(reversed(l))

print(numfy(course_id))
print(denumfy(numfy(course_id)))
print(parse_schedule("MWF 10:10 pm-11:00 pm"))