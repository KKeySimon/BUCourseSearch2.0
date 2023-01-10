import React, { Component, useState } from "react"
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

//This could've  been an array, but being able to see which index is which college helps
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

let hubToggle = Array(21)

let hubToggleArr = {0 : "Philosophical Inquiry and Life's Meanings",
  1 : "Aesthetic Exploration",
  2 : "Historical Consciousness",
  3 : "Scientific Inquiry I",
  4 : "Scientific Inquiry II",
  5 : "Social Inquiry I",
  6 : "Social Inquiry II",
  7 : "Quantitative Reasoning I",
  8 : "Quantitative Reasoning II",
  9 : "The Individual in Community",
  10 : "Global Citizenship and Intercultural Literacy",
  11 : "Ethical Reasoning",
  12 : "First-Year Writing Seminar",
  13 : "Writing, Research, and Inquiry",
  14 : "Writing-Intensive Course",
  15 : "Oral and/or Signed Communication",
  16 : "Digital/Multimedia Expression",
  17 : "Critical Thinking",
  18 : "Research and Information Literacy",
  19 : "Teamwork/Collaboration",
  20 : "Creativity/Innovation"
}

for (let i = 0; i < hubToggle.length; i++) {
  hubToggle[i] = false;
}

function changeHub(i) {
  hubToggle[i] = !hubToggle[i]
  console.log(hubToggle)
}

function filterHub(data, hubs, filter, allOrAny) {
  if (filter) {
    let arr = []
    if (allOrAny === 'All') {
      for (let i = 0; i < data.length; i++) {
        if (hubs.every(substring => data[i].hubs.includes(substring))){
          arr.push(data[i])
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (hubs.some(substring => data[i].hubs.includes(substring))){
          arr.push(data[i])
        }
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

  const [allOrAny, setAllOrAny] = useState('All')
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

    let hubs = []
    let filterH = false
    for (let i = 0; i < hubToggle.length; i++) {
      if (hubToggle[i] === true) {
        hubs.push(hubToggleArr[i])
        filterH = true
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
      console.log(data)
      setCourses(
        filterHub(
          filterColleges(
            parseData(filterSchedule(checkAvailable(data, available), currentSchedule)), 
          colleges, filterC),
        hubs, filterH, allOrAny)
      )
      setFetchError(null)
      setFormError(null)
    }
  }

  return (
    <div>
      <div className="coursearch-searchfields">
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
            <select className="coursearch-searchfields-semester-select">
              <option value="2023-SPRG">Spring 2023</option>
              <option value="Future-Semesters"  >Future Semesters</option>
            </select>
          </label>
          
          <label className="dropdown" >
            Exclude Unavailable Courses
            <select className="coursearch-searchfields-semester-select"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}>
              <option value="False">False</option>
              <option value="True">True</option>
            </select>
          </label>
        </div>
        Colleges
        {/* College Checkboxes */}
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

      
        <div>
          BU HUB Areas
          <label className="dropdown" >
            All or Any
            <select className="coursearch-searchfields-semester-select"
            value={allOrAny}
            onChange={(e) => setAllOrAny(e.target.value)}>
              <option value="All">All</option>
              <option value="Any">Any</option>
            </select>
          </label>
        </div>

        {/* Hub Checkboxes */}
        <div>
          <div>
            Philosophical, Aesthetic, and Historical Interpretation
            <input type="checkbox" onClick={event => changeHub(0, event)} />Philosophical Inquiry and Life's Meanings (PLM)
            <input type="checkbox" onClick={event => changeHub(1, event)} />Aesthetic Exploration (AEX)
            <input type="checkbox" onClick={event => changeHub(2, event)} />Historical Consciousness (HCO)
          </div>
          
          <div>
            Scientific and Social Inquiry
            <input type="checkbox" onClick={event => changeHub(3, event)} />Scientific Inquiry I (SI1)
            <input type="checkbox" onClick={event => changeHub(4, event)} />Scientific Inquiry II (SI2)
            <input type="checkbox" onClick={event => changeHub(5, event)} />Social Inquiry I (SO1)
            <input type="checkbox" onClick={event => changeHub(6, event)} />Social Inquiry II (SO2)
          </div>

          <div>
            Quantitative Reasoning
            <input type="checkbox" onClick={event => changeHub(7, event)} />Quantitative Reasoning I (QR1)
            <input type="checkbox" onClick={event => changeHub(8, event)} />Quantitative Reasoning II (QR2)
          </div>

          <div>
            Diversity, Civic Engagement, and Global Citizenship
            <input type="checkbox" onClick={event => changeHub(9, event)} />The Individual in Community (IIC)
            <input type="checkbox" onClick={event => changeHub(10, event)} />Global Citizenship and Intercultural Literacy (GCI)
            <input type="checkbox" onClick={event => changeHub(11, event)} />Ethical Reasoning (ETR)
          </div>

          <div>
            Communication
            <input type="checkbox" onClick={event => changeHub(12, event)} />First-Year Writing Seminar (FYW)
            <input type="checkbox" onClick={event => changeHub(13, event)} />Writing, Research, and Inquiry (WRI)
            <input type="checkbox" onClick={event => changeHub(14, event)} />Writing-Intensive Course (WIN)
            <input type="checkbox" onClick={event => changeHub(15, event)} />Oral and/or Signed Communication (OSC)
            <input type="checkbox" onClick={event => changeHub(16, event)} />Digital/Multimedia Expression (DME)
          </div>

          <div>
            Intellectual Toolkit
            <input type="checkbox" onClick={event => changeHub(17, event)} />Critical Thinking (CRT)
            <input type="checkbox" onClick={event => changeHub(18, event)} />Research and Information Literacy (RIL)
            <input type="checkbox" onClick={event => changeHub(19, event)} />Teamwork/Collaboration (TWC)
            <input type="checkbox" onClick={event => changeHub(20, event)} />Creativity/Innovation (CRI)
          </div>
        </div>
        
        <div>
          Input your required courses to filter overlapping courses
          Follow this exact format for filter to function
          MTWRF 11:30-15:15 (means course occurs Monday, Tuesday, Wednesday, Thursday, Friday 11:30 AM to 3:15 PM)
          <ScheduleFilter />
        </div>

        <span className="search">
          <button onClick={handleSubmit}>Search</button>
        </span>
        {formError && <p>{formError}</p>}
      </div>
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

let currentSchedule = []

//Schedule filter related code
function filterSchedule(data, schedule) {
  if (schedule.length === 0) {
    return data
  }
  var arr = []
  for (let i = 0; i < data.length; i++) {
    arr.push(data[i])
    
    for (let j = 0; j < schedule.length; j++) {
      //check for days first
      let dayOverlap = false
      for (let k = 0; k < schedule[j]["days"].length; k++) {
        //if day found...
        if (data[i].days.indexOf(schedule[j]["days"].charAt(k)) > -1) {
          dayOverlap = true;
          continue;
        }
      }
      if (dayOverlap) {
        //if overlapping, then pop and move on
        if (data[i].scheduleStart <= schedule[j]["end"] && schedule[j]["start"] <= data[i].scheduleEnd) {
          arr.pop()
          continue
        }
      }
    }
  }
  return arr
}

let dayDict = {
  'M': 'Monday',
  'T': 'Tuesday',
  'W': 'Wednesday',
  'R': 'Thursday',
  'F': 'Friday',
  'S': 'Saturday',
  'U': 'Sunday'
}
let processVisualInput = (str) => {
  let temp = str.split(" ")
  let days = temp[0]

  let result = ""
  for (let i = 0; i < days.length; i++) {
      let d = dayDict[days.charAt(i)]
      result = result + " " + d
  }

  result = result + " " + temp[1]
  return result
}

let processData = (str) => {
  let arr = str.split(" ")
  let days = arr[0]
  let hours = arr[1].split("-")
  let t1 = parseInt(hours[0].split(":")[0])*60 + parseInt(hours[0].split(":")[1])
  let t2 = parseInt(hours[1].split(":")[0]*60) + parseInt(hours[1].split(":")[1])
  return {"days": days, "start": t1, "end": t2}
}

class ScheduleFilter extends Component {
constructor() {
  super();
  this.state = {
    // should be a list of dictionaries with key "start", "end", and "days"
    visualList: [],
    data: [],
    itemName: ''
  };
}
handleChange = (event) => {
  this.setState({itemName: event.target.value});
}
delete = (index) => {
  this.state.visualList.splice(index, 1);
  this.state.data.splice(index, 1)
  this.setState({list: this.state.visualList})
  this.setState({data: this.state.data})
  currentSchedule = this.state.data
  console.log(index);
}

add = () => {
  const visualList = [...this.state.visualList]
  const data = [...this.state.data]
  visualList.push(processVisualInput(this.state.itemName));
  data.push(processData(this.state.itemName))
  currentSchedule = data
  console.log(data)
  this.setState({data: data})
  this.setState({visualList: visualList});
  this.setState({itemName: ''})
}

render() { 
  const renderData = () => {
    return this.state.visualList.map((item, index) => {
      return (
        <div key={item}>{item}  
          <button onClick={() => this.delete(index)}>Remove</button>
          </div>
      )
    })
  }

  return (
    <div>
      <input
      type="text"
      value={this.state.itemName}
      onChange={this.handleChange}
    /> <button onClick={() => this.add()}>Click to add</button>
      
      {renderData()}
    </div>
  );
}
}

export default SearchBox