from dotenv import load_dotenv
import os
from supabase import create_client, Client
from webscrape import grab_search_data

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
print(url)
print(key)

supabase: Client = create_client(url, key)

data = grab_search_data()

for course in data:
    sections = course.pop("sections")
    for s in sections:
        supabase.table("Sections").insert(s)
    supabase.table("Courses").insert(course)
