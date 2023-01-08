import { useState } from "react"
import supabase from "../config/supabaseClient"
import CoursesCard from "./CoursesCard"

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
  return array
}

//I can't make a query call for unavailable since it's labeled false or true
//I can't seem to do false || true in the query for booleans so I'll
//manually take the data out with this function
function checkAvailable(data, available) {
  if (available === 'False') {
    return data
  } else {
    let arr = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].availability === true) {
        arr.push(data[i])
      }
    }
    return arr
  }
}


let collegeToggle = Array(25)
for (let i = 0; i < collegeToggle.length; i++) {
  collegeToggle[i] = false;
}

//This could've been an array, but I'm too lazy to change it
let collegeToggleDict = {
  0: "CAS",
  1: "CDS",
  2: "CFA",
  3: "CGS",
  4: "COM",
  5: "ENG",
  6: "EOP",
  7: "GMS",
  8: "GRS",
  9: "HUB",
  10: "KHC",
  11: "LAW",
  12: "MED",
  13: "MET",
  14: "OTP",
  15: "PDP",
  16: "QST",
  17: "SAR",
  18: "SDM",
  19: "SED",
  20: "SHA",
  21: "SPH",
  22: "SSW",
  23: "STH",
  24: "XRG"
}

function changeClass(ind) {
  collegeToggle[ind] = !collegeToggle[ind]
  console.log(collegeToggle)
}

function filterColleges(data, colleges, filterColleges) {
  if (filterColleges) {
    let arr = []
    for (let i = 0; i < data.length; i++) {
      if (colleges.some(substring => data[i].course_id.includes(substring))){
        arr.push(data[i])
      }
    }
    console.log(arr)
    return arr;
  } else {
    return data
  }
}
  

const SearchBox = () => {

  const [title, setTitle] = useState('')
  const [rmpRating, setRmpRating] = useState('')
  const [rmpDiff, setRmpDiff] = useState('')
  const [available, setAvailable] = useState('False')
  const [includeProf, setIncludeProf] = useState('')

  const [formError, setFormError] = useState(null)
  const [courses, setCourses] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // if (!title) {
    //   setFormError('Please fill in all the fields correctly.')
    //   return
    // }

    let input
    if (title === "") {
      input = "*"
    } else {
      input = "%"+title+"%"
    }

    let rating = -1
    if (rmpRating !== "") {
      rating = rmpRating
    }

    let diff = 5
    if (rmpDiff !== "") {
      diff = rmpDiff
    }

    let prof
    if (includeProf === "") {
      prof = "*"
    } else {
      prof = "%" + includeProf + "%"
    }

    let colleges = []
    let filterC = false
    for (let i = 0; i < collegeToggle.length; i++) {
      if (collegeToggle[i] === true) {
        colleges.push(collegeToggleDict[i])
        filterC = true
      }
    }
    const { data, error } = await supabase
    .from('Sections')
    .select(`*,
      Courses (
        *
      )
    `)
    .ilike('course_id', input)
    .gte('instructorRating', rating)
    .lte('instructorDiff', diff)
    .ilike('instructor', prof)
    //For some reason, the in command only filters the Courses portion
    //and still returns the sections and seems to have no wild card, so we will manually
    //filter on the client side
    //.in('course_id', colleges)

    if (error) {
      console.log(error)
      setFetchError('Could not fetch the courses')
      setCourses(null)
    }
    if (data) {
      //Very strange bug (for some reason data.Courses when explicitly
      //console logged, but when logging data
      //only some sections will show its Courses. Don't assume it exists or not
      //if you can't see the Courses attribute inside a Sections value)
      // console.log(data)
      setCourses(filterColleges(parseData(checkAvailable(data, available)), colleges, filterC))
      setFetchError(null)
      setFormError(null)
    }
  }

  return (
    <div>
      <form className="coursearch-searchfields" onSubmit={handleSubmit}>
        <div className="searchbar">
          <label htmlFor="search">Keyword or Full Course Number (example: CAS XX 123)</label>
          <input 
          type="text"
          className="coursesearch-searchfields-keyword-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}>
          </input>
          
          <label htmlFor="search">Minimum RateMyProfessor Rating</label>
          <input
          type="number"
          className="coursesearch-searchfields-keyword-field"
          value={rmpRating}
          onChange={(e) => setRmpRating(e.target.value)}>
          </input>

          <label htmlFor="search">Maximum RateMyProfessor Difficulty</label>
          <input
          type="number"
          className="coursesearch-searchfields-keyword-field"
          value={rmpDiff}
          onChange={(e) => setRmpDiff(e.target.value)}>
          </input>

          <label htmlFor="search">Search for a professor</label>
          <input
          type="text"
          className="coursesearch-searchfields-keyword-field"
          value={includeProf}
          onChange={(e) => setIncludeProf(e.target.value)}>
          </input>



        </div>
        <div>
          <label className="dropdown" >
            Semester
            <select className="coursearch-searchfields-semester-select" defaultValue="2023-SPRG">
              <option value="2023-SPRG">Spring 2023</option>
              <option value="Future-Semesters"  >Future Semesters</option>
            </select>
          </label>
          
          <label className="dropdown" >
            Exclude Unavailable Courses
            <select className="coursearch-searchfields-semester-select" defaultValue="False"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}>
              <option value="False">False</option>
              <option value="True">True</option>
            </select>
          </label>
        </div>

        {/* Checkboxes */}
        <div>
          <input type="checkbox" onClick={event => changeClass(0, event)} />CAS
          <input type="checkbox" onClick={event => changeClass(1, event)} />CDS
          <input type="checkbox" onClick={event => changeClass(2, event)} />CFA
          <input type="checkbox" onClick={event => changeClass(3, event)} />CGS
          <input type="checkbox" onClick={event => changeClass(4, event)} />COM
          <input type="checkbox" onClick={event => changeClass(5, event)} />ENG
          <input type="checkbox" onClick={event => changeClass(6, event)} />EOP
          <input type="checkbox" onClick={event => changeClass(7, event)} />GMS
          <input type="checkbox" onClick={event => changeClass(8, event)} />GRS
          <input type="checkbox" onClick={event => changeClass(9, event)} />HUB
          <input type="checkbox" onClick={event => changeClass(10, event)} />KHC
          <input type="checkbox" onClick={event => changeClass(11, event)} />LAW
          <input type="checkbox" onClick={event => changeClass(12, event)} />MED
          <input type="checkbox" onClick={event => changeClass(13, event)} />MET
          <input type="checkbox" onClick={event => changeClass(14, event)} />OTP
          <input type="checkbox" onClick={event => changeClass(15, event)} />PDP
          <input type="checkbox" onClick={event => changeClass(16, event)} />QST
          <input type="checkbox" onClick={event => changeClass(17, event)} />SAR
          <input type="checkbox" onClick={event => changeClass(18, event)} />SDM
          <input type="checkbox" onClick={event => changeClass(19, event)} />SED
          <input type="checkbox" onClick={event => changeClass(20, event)} />SHA
          <input type="checkbox" onClick={event => changeClass(21, event)} />SPH
          <input type="checkbox" onClick={event => changeClass(22, event)} />SSW
          <input type="checkbox" onClick={event => changeClass(23, event)} />STH
          <input type="checkbox" onClick={event => changeClass(24, event)} />XRG
        </div>

        <span className="search">
          <button id="search-submit" type="submit" className="coursearch-searchfields-submit">Search</button>
        </span>
        {formError && <p>{formError}</p>}
      </form>
      <div>
        {fetchError && (<p>{fetchError}</p>)}
        {courses && (
          <div>
            {courses.map(courses => (
              <CoursesCard key={courses.course_id} courses={courses}/>
            ))}
          </div>
        )}
      </div>
    </div>
    
  )
}

export default SearchBox