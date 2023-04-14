import * as React from "react";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAWGesQWs4XJMfvSzmH7KWJh3Tne2pEj28",
  authDomain: "bucoursesearch.firebaseapp.com",
  projectId: "bucoursesearch",
  storageBucket: "bucoursesearch.appspot.com",
  messagingSenderId: "1072026572586",
  appId: "1:1072026572586:web:1cdb57515636b266b1f053",
  measurementId: "G-ZMHYPSV5E3",
};

// Initialize the app with a null auth variable, limiting the server's access
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const dbRef = ref("/")

const dbRef = ref(db);


export default function Header(){
  const [date, setDate] = useState("")
  get(child(dbRef, `/date`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      setDate(snapshot.val().gigaLit)
    } else {
      console.log("No data available");
    }
  })
  
  
  return (
    <div>
    <header className="coursearch-masthead">
      <div className="coursearch-masthead-branding">
        <a href="/phpbin/course-search/">Boston University <span>Course Search 2.0</span></a> 
      </div>
    </header>
    <p className="pppp">Last Updated at {date}</p>
    </div>
  );
};
