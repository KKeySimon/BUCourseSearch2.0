import * as React from "react";
import supabase from "../config/supabaseClient";
import { useEffect } from 'react';
import SearchBox from "./SearchBox";

//Our current data is Sections -> Courses
//It should be Courses -> Sections so we will edit it here
function parseData(data) {
  var array = []
  for (let i = 0; i < data.length; i++) {
    if (i === 0 || (i !== 0 && data[i].course_id !== data[i - 1].course_id)) {
      array.push(data[i].Courses)
      delete data[i].Courses
      var temp = array.pop()
      temp.sections = []
      temp.sections.push(data[i])
      array.push(temp)
    } else {
      temp = array.pop()
      temp.sections.push(data[i])
      array.push(temp)
    }
  }
  console.log(array)
}

const Main = () => {
  //Testing purposes (logs the joined data from sections and courses)
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('Sections')
        .select(`*,
          Courses (
            *
          )
        `)

        if (error) {
          console.log(error)
        }
        if (data) {
          console.log(data)
          parseData(data)
        }
    }
    fetchCourses()

  }, [])

  return (
    <main className="coursearch-main">
      <header className="coursearch-header">
      <p>Search our database of over 7,000 courses.</p>
      </header>

      <div className="description">
        <p>Perform a basic search by entering keywords you would expect to find in the course description or by entering a full course number (example: CAS XX 123).  If you would like to see expected course offerings for a particular semester, select that semester in the drop-down box. If you would like to see all courses expected to be offered in the future, select “Future Semesters.”</p>
        <p>To perform a more targeted search, select Additional Search Options</p>
      </div>
      <SearchBox />

      <div className="additional-info">
        <button className="coursearch-options-expand" type="button" data-selection-count="" ><strong>^</strong> Additional Search Options</button>
      </div>
    </main>
  );
};

export default Main
