import requests
from bs4 import BeautifulSoup
from webscrape import grab_search_data
import datetime
import os
import json

def lambda_handler(event, context):
    #This block is just to get total number of courses
    result = requests.get("https://www.bu.edu/phpbin/course-search/search.php?page=w0&pagesize=10&adv=1&nolog=&search_adv_all=&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all")
    doc = BeautifulSoup(result.text, "html.parser")
    numCourses = doc.find("label", {"class":"coursearch-results-display-dropdown-label dropdown dropdown-inline"})
    numCourses = int(numCourses.text[numCourses.text.index("of ") + 3 : numCourses.text.index("of ") + 7])


    # supabase: Client = create_client(supabase_url, supabase_key)
    # int(numCourses / 5)
    date = {"gigaLit": datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")}
    requests.patch("https://bucoursesearch-default-rtdb.firebaseio.com/date.json", params={"auth": os.environ["FIREBASE_KEY"]}, data=json.dumps(date))
    for i in range(0, 1):
        url = "https://www.bu.edu/phpbin/course-search/search.php?page=" + str(i) + "&pagesize=5&adv=1&nolog=&search_adv_all=&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all&pagesize=5"
        # url = "https://www.bu.edu/phpbin/course-search/search.php?page=w0&pagesize=5&adv=1&nolog=&search_adv_all=cas+cc+222&yearsem_adv=2023-SPRG&credits=*&pathway=&hub_match=all&pagesize=5"
        try:
            data = grab_search_data(url)     
            requests.patch("https://bucoursesearch-default-rtdb.firebaseio.com/data.json", params={"auth": os.environ["FIREBASE_KEY"]}, data=json.dumps(data))
            
            
            print("program successful for batch " + str(i) + " of " + str(int(numCourses/5)) + "!")
        except Exception as e:
            print(e)
            with open("errorLog.txt", "a") as file:
                file.write("error occured in batch " + str(i) + " of " + str(int(numCourses / 5)) + "\n")
                file.write("error for batch " + str(i) + " is " + str(e) + "\n")
            pass
lambda_handler(None, None)