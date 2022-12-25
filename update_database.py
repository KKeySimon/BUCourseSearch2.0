import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from webscrape import grab_search_data

cred = credentials.Certificate('bucoursesearch-firebase-adminsdk-7wvqb-205b8fb3f1.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

data = grab_search_data()

for course in data:
    doc_ref = db.collection(u'Courses').document(course)
    doc_ref.set(data[course])