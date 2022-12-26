# Make sure terminal is in current folder and run "pip install -r requirements.txt" to use code
from bs4 import BeautifulSoup
import pandas as pd
import requests
import base64
from csv import writer

#Goes from grab_search_data -> grab_course_data -> grab_sections_data
def grab_search_data():
    # Online version
    url = "https://www.bu.edu/phpbin/course-search/search.php?page=w0&pagesize=-1&adv=1&nolog=&search_adv_all=&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all&pagesize=10"
    result = requests.get(url)
    doc = BeautifulSoup(result.text, "html.parser")

    # # Offline Version
    # with open("sample.html", "r") as f:
    #     doc = BeautifulSoup(f, "html.parser")

    course_list = doc.find_all("li", {"class":"coursearch-result"})
    data = {}


    # CSV File Header
    with open('firstTenResultsWebScrape.csv', 'w') as f:
        create = writer(f)
        header = ['Name', 'Course', 'Description', 'Prerequisites', 'Credits', 'Hub Unit(s)', 'Section(s)', 'Professor(s)']
        create.writerow(header)
        
        for course in course_list:
            # i.e. CAS CS 112
            course_id = course.find("h6").text
            data[course_id] = grab_course_data(course)
        for key in data.values():  
            create.writerow(key.values())


def grab_course_data(course):
    course_id = course.find("h6").text
    course_name = course.find("h2").text
    course_sections = course.find("a", {"class":"coursearch-result-sections-link"}).text
    course_sections_url = "https://www.bu.edu" + course.find("a", {"class":"coursearch-result-sections-link"})['href']
    course_sections_html = BeautifulSoup(requests.get(course_sections_url).text, "html.parser")
    course_sections_table = course_sections_html.find_all("table")
    course_df = pd.read_html(str(course_sections_table))[0]

    course_description_box = course.find("div", {"class":"coursearch-result-content-description"}).find_all("p")
    course_description = course_description_box[4].text
    course_prereq = course_description_box[0].text
    course_credit = course_description_box[5].text
    course_hub_list = course.find_all("li", {"class":None})
    
    course_sections = grab_sections_data(course_df)
    
    course_instructors = course_df['Instructor'].tolist()
    course_instructors = list(dict.fromkeys(course_instructors))
    # print(course_instructors)
    # print(course_name)
    # print(course_sections)
    # print(course_df)

    # print(course_prereq)
    # print(course_description)
    # print(course_credit)
    
    hub_list = []
    for hub in course_hub_list:
        hub_list.append(hub.text)
        # print(hub.text)

    return {
        "course": course_id,
        "name": course_name,
        "description": course_description,
        "prereqs": course_prereq,
        "credits": course_credit,
        "hubs": hub_list,
        "sections": course_sections,
        # "course_schedule": course_df,
        "professors": course_instructors
    }

def grab_sections_data(course_df):
    course_sections = {}
    for ind in course_df.index:
        section = {}
        section["instructor"] = course_df['Instructor'][ind]
        if pd.isna(section["instructor"]):
            section["instructorData"] = None
        else:
            section["instructorData"] = grab_rmp_data(section["instructor"])

        section["type"] = course_df["Type"][ind]
        section["location"] = course_df["Location"][ind]
        section["schedule"] = course_df["Schedule"][ind]

        # Parse Schedule Data
        # 

        if pd.isna(course_df["Notes"][ind]):
            section["availability"] = True
        elif "Class Full" or "Class Closed" in course_df["Notes"][ind]:
            section["availability"] = False
        else:
            section["availability"] = True
        course_sections[course_df['Section'][ind]] = section
    return course_sections

def grab_rmp_data(prof):
    bu_school_id = 124
    # prof = "Christine Papadakis"
    
    url = "https://www.ratemyprofessors.com" \
        "/search/teachers?query=%s&sid=%s" % (prof.replace(" ", "%20"), base64.b64encode(("School-%s" % bu_school_id)
                                                                                 .encode('ascii')).decode('ascii'))
    doc = requests.get(url).text
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
    data["rating"] = rating
    data["difficulty"] = difficulty
    # print(data)
    return data

    # if professor is not None:
    #     data = {}
    #     data["rating"] = professor.rating
    #     data["difficulty"] = professor.difficulty
    #     data["numRatings"] = professor.num_rating
    #     if professor.would_take_again is not None:
    #         data["takeAgain"] = round(professor.would_take_again, 1)
    #     else:
    #         data["takeAgain"] = None
    #     return data
    # else:
    #     None

if __name__ == '__main__':
    grab_search_data()