from bs4 import BeautifulSoup
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
    print(course_id)
    print(course_name)
    print(course_sections)
    print(course_sections_url)
    print("-----------")