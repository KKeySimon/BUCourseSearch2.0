from dotenv import load_dotenv
import os
from supabase import create_client, Client


load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

testCourse = {
    "name": "CAS AA 103",
    "description": "What is the African American literary tradition? In this course, we will read   poetry, slave narratives, essays, speeches, tales, short stories, and novels and   consider how culture, politics, and history shape African American literature.   Carries humanities divisional credit in CAS.  Effective Fall 2018,  this course fulfills a  single unit in each of the  following BU Hub areas: Aesthetic  Exploration,  Global Citizenship and  Intercultural Literacy. Effective Fall 2019, this   course fulfills a single unit in each of the  following BU Hub areas: Aesthetic   Exploration, Global Citizenship and  Intercultural Literacy, Critical Thinking. Effective Fall 2022, this course  fulfills a single unit in each of the following BU Hub areas: Writing-Intensive  Course, Global Citizenship and Intercultural Literacy, Critical Thinking.",
    "course": "Introduction to African American Literature",
    "prerequisites": "Prereq: First-Year Writing Seminar (WR 120 or equivalent)",
    "credits": 4,
    "hub_units": ["Global Citizenship and Intercultural Literacy", "Critical Thinking", "Writing-Intensive Course", "BU Hub Pathway: Social & Racial Justice"],
    "sections": {"A1": {"instructor": "Maryanne Boelcskevy", "instructorData": {"rating": -1, "difficulty": -1}, "type": "IND", "location": "CAS 214", "schedule": "MWF 10:10 am-11:00 am", "availability": False}},
    "professors": ["Maryanne Boelcskevy"],
    "times": ["1440", "1440", "1440"]
}

supabase: Client = create_client(url, key)
data = supabase.table("Courses").insert(testCourse).execute()
assert len(data.data) > 0



# print(SUPABASE_URL)