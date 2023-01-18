# Make sure terminal is in current folder and run "pip install -r requirements.txt" to use code
from bs4 import BeautifulSoup
import pandas as pd
import requests
import base64
from datetime import datetime, timedelta

# Grabbed from stackoverflow (not my code)
# https://stackoverflow.com/questions/12625627/python3-convert-unicode-string-to-int-representation
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

#Goes from grab_search_data -> grab_course_data -> grab_sections_data
def grab_search_data(url):
    # Online version
    #All
    # url = "https://www.bu.edu/phpbin/course-search/search.php?page=w0&pagesize=5&adv=1&nolog=&search_adv_all=cas+bi+206&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all&pagesize=5"
    # page x of size 10 (edit page=____ next to search.php?)
    #url = "https://www.bu.edu/phpbin/course-search/search.php?page=2&pagesize=10&adv=1&nolog=&search_adv_all=&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all&pagesize=10"
    
    result = requests.get(url)
    doc = BeautifulSoup(result.text, "html.parser")

    course_list = doc.find_all("li", {"class":"coursearch-result"})
    data = []

    for course in course_list:
        data.append(grab_course_data(course))
    return data


def grab_course_data(course):
    course_id = course.find("h6").text
    print(course_id)
    course_name = course.find("h2").text
    course_sections = course.find("a", {"class":"coursearch-result-sections-link"}).text
    course_sections_url = "https://www.bu.edu" + course.find("a", {"class":"coursearch-result-sections-link"})['href']
    course_sections_html = BeautifulSoup(requests.get(course_sections_url).text, "html.parser")
    course_sections_table = course_sections_html.find_all("table")
    course_df = pd.read_html(str(course_sections_table))[0]

    course_description_box = course.find("div", {"class":"coursearch-result-content-description"}).find_all("p")
    course_description = course_description_box[4].text
    course_prereq = course_description_box[0].text
    try:
        course_credit = int(course_description_box[5].text[3])
    except:
        course_credit = -1
    course_hub_list = course.find_all("li", {"class":None})
    
    course_sections = grab_sections_data(course_df, course_id)
    
    course_instructors = course_df['Instructor'].tolist()
    course_instructors = list(dict.fromkeys(course_instructors))
    if pd.isna(course_instructors).all():
        course_instructors = ["None"]
    elif pd.isna(course_instructors).any():
        arr = []
        for c in course_instructors:
            if not pd.isna(c):
                arr.append(c)
        course_instructors = arr
    
    hub_list = []
    for hub in course_hub_list:
        hub_list.append(hub.text)

    parsed_id = course_id.split()

    return {
        # CAS CS 112
        "course_id": course_id,
        # CAS
        "college": parsed_id[0],
        # CS
        "department": parsed_id[1],
        # 112
        "course": parsed_id[2],
        # Intro to Programming II
        "name": course_name,
        "description": course_description,
        "prereqs": course_prereq,
        "credits": course_credit,
        "hubs": hub_list,
        "sections": course_sections,
        "professors": course_instructors
    }

def grab_sections_data(course_df, course_id):
    course_sections = []
    course_overlap_dict = {}
    for ind in course_df.index:
        section = {}
        overlap = False
        name = course_id + " " + course_df['Section'][ind]
        if name in course_overlap_dict:
            course_overlap_dict[name] = course_overlap_dict[name] + 1
            overlap = True
        else:
            course_overlap_dict[name] = 1
        
        if overlap == True:
            name = name + " " + str(course_overlap_dict[name])
        print(name)

        section["section_full_name"] = name

        section["course_id"] = course_id
        section["section"] = course_df['Section'][ind]
        section["instructor"] = course_df['Instructor'][ind]
        if pd.isna(section["instructor"]):
            section["instructor"] = "None"
            section["instructorDiff"] = 9
            section["instructorRating"] = -1
        else:
            dict = grab_rmp_data(section["instructor"])
            section["instructorDiff"] = dict["difficulty"]
            section["instructorRating"] = dict["rating"]

        if pd.isna(course_df["Type"][ind]):
            section["type"] = "N/A"
        else:
            section["type"] = course_df["Type"][ind]

        if pd.isna(course_df["Location"][ind]):
            section["location"] = "N/A"
        else:
            section["location"] = str(course_df["Location"][ind])

        scheduleDict = parse_schedule(course_df["Schedule"][ind])

        section["days"] = scheduleDict[0]
        section["scheduleStart"] = scheduleDict[1]
        section["scheduleEnd"] = scheduleDict[2]

        if pd.isna(course_df["Notes"][ind]):
            section["availability"] = True
        elif course_df["Notes"][ind].find("Class Full") != -1 or course_df["Notes"][ind].find("Class Closed") != -1:
            section["availability"] = False
        else:
            section["availability"] = True
        course_sections.append(section)
    return course_sections

# Parse Schedule Data
# The way we determine overlap will be with just integers with it representing minutes
# There are 1440 minutes in a day, so Monday will begin at 0 (midnight) and end at 1439 (11:59 pm),
# with Tuesday starting at 1440 and so on...
# It will be organized into a list of tuples
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

    try:
        t1 = datetime.strptime(hours[0], "%I:%M%p")
        t2 = datetime.strptime(hours[1], "%I:%M%p")
        delta1 = int (timedelta(hours=t1.hour, minutes=t1.minute).total_seconds() / 60)
        delta2 = int (timedelta(hours=t2.hour, minutes=t2.minute).total_seconds() / 60)
    except:
        delta1 = -1
        delta2 = -1

    #New
    result = [days, delta1, delta2]
    #Old
    # result = []
    # for i in range(0, len(days)):
    #     result.append((week_dict[days[i]] + delta1, week_dict[days[i]] + delta2))
    return result

def grab_rmp_data(prof):
    bu_school_id = 124
    # prof = "Christine Papadakis"
    
    url = "https://www.ratemyprofessors.com" \
        "/search/teachers?query=%s&sid=%s" % (prof.replace(" ", "%20"), base64.b64encode(("School-%s" % bu_school_id)
                                                                                 .encode('ascii')).decode('ascii'))
    doc = requests.get(url).text
    print(doc)
    data = {}
    rating = -1
    difficulty = -1
    # print(url)
    
    if '"avgRating":' in doc:
        i = doc.index('"avgRating":')
        ss = doc[i+12:i+15]
        if "," in ss:
            ss = ss[0:1]
        rating = float(ss)
    if '"avgDifficulty":' in doc: 
        i = doc.index('"avgDifficulty":')
        ss = doc[i+16:i+19]
        if "," in ss:
            ss = ss[0:1]
        difficulty = float(ss)
    # if '"avgDifficulty":' in doc: 
    #     i = doc.index('"avgDifficulty":')
    #     ss = doc[i+16:i+19]
    #     if "," in ss:
    #         ss = ss[0:1]
        difficulty = float(ss)
    data["rating"] = rating
    data["difficulty"] = difficulty
    return data

if __name__ == '__main__':
    grab_rmp_data("christine+papadakis")
    # grab_search_data()