from bs4 import BeautifulSoup
import pandas as pd
import requests

# Online version
url = "https://www.bu.edu/phpbin/course-search/search.php?page=w0&pagesize=-1&adv=1&nolog=&search_adv_all=&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all&pagesize=10"

result = requests.get(url)
doc = BeautifulSoup(result.text, "html.parser")

# # Offline Version
# with open("sample.html", "r") as f:
#     doc = BeautifulSoup(f, "html.parser")

course_list = doc.find_all("li", {"class":"coursearch-result"})

for course in course_list:
    #i.e. CAS CS 112
    course_id = course.find("h6").text
    #i.e. Introduction to Computer Science 2
    course_name = course.find("h2").text

    course_sections = course.find("a", {"class":"coursearch-result-sections-link"}).text
    course_sections_url = "https://www.bu.edu" + course.find("a", {"class":"coursearch-result-sections-link"})['href']
    course_sections_html = BeautifulSoup(requests.get(course_sections_url).text, "html.parser")
    course_sections_table = course_sections_html.find_all("table")
    course_df = pd.read_html(str(course_sections_table))[0]

    course_description_box = course.find("div", {"class":"coursearch-result-content-description"}).find_all("p")
    course_description = course_description_box[4].text
    course_prereq = course_description_box[0].text
    course_hub_list = course.find_all("li", {"class":None})

    print(course_id)
    print(course_name)
    print(course_sections)
    print(course_df)

    print(course_prereq)
    print(course_description)
    for hub in course_hub_list:
        print(hub.text)
    print("-----------")