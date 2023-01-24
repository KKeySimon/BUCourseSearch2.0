import React, { Component, useState } from "react"
import supabase from "../config/supabaseClient"
import CoursesCard from "./CoursesCard"

//It's a forcst!
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

//This could've  been an array, but being able to see which index for which college helps
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
  const [additional, setAdditional] = useState(false)
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
    <div className="parent-container">
      <div className="coursearch-searchfields">
        <div className="searchbar">
          <label htmlFor="search">Keyword or Full Course Number</label>
          <input 
          type="text"
          className="coursesearch-searchfields-keyword-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="CAS XX 123">
          </input>
        </div>

        <div className="additional-dropdown-options-first-section">
          <label className="dropdown" >
            Semester
            <select className="coursearch-searchfields-semester-select">
              <option value="2023-SPRG">Spring 2023</option>
              <option value="Future-Semesters"  >Future Semesters</option>
            </select>
          </label>
        </div>

          <button type="button" className="search" onClick={handleSubmit}>
            Search
          </button>
      </div>

      <div className="additional-info">
          <button type="button" onClick={() => setAdditional(!additional)} ><strong>^</strong> Additional Search Options </button>

          
          { additional && <div className="hidden-dropdown-menu">
          <div className="additional-dropdown-input-first-section">
            <div className="additional-searchbar">
              <section className="additional-dropdown-input-container">
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
              </section>

              <section className="additional-dropdown-container">
                <label className="dropdown" >
                  Exclude Unavailable Courses
                  <select className="coursearch-searchfields-semester-select"
                  value={available}
                  onChange={(e) => setAvailable(e.target.value)}>
                    <option value="False">False</option>
                    <option value="True">True</option>
                  </select>
                </label>

                <label className="dropdown" >
                All or Any
                <select className="coursearch-searchfields-semester-select"
                value={allOrAny}
                onChange={(e) => setAllOrAny(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Any">Any</option>
                </select>
              </label>
              </section>
          </div>
        </div>


        
          {/* College Checkboxes */}
          <div className="outter-checkbox-container">
            <h2 className="colleges">Colleges</h2>
            <section className="inner-checkbox-container">
              <label><input type="checkbox" onClick={event => changeClass(1, event)} /> CDS</label>
              <label><input type="checkbox" onClick={event => changeClass(2, event)} /> CFA</label>
              <label><input type="checkbox" onClick={event => changeClass(3, event)} /> CGS</label>
              <label><input type="checkbox" onClick={event => changeClass(4, event)} /> COM</label>
              <label><input type="checkbox" onClick={event => changeClass(5, event)} /> ENG</label>
              <label><input type="checkbox" onClick={event => changeClass(6, event)} /> EOP</label>
              <label><input type="checkbox" onClick={event => changeClass(7, event)} /> GMS</label>
              <label><input type="checkbox" onClick={event => changeClass(8, event)} /> GRS</label>
              <label><input type="checkbox" onClick={event => changeClass(9, event)} /> HUB</label>
              <label><input type="checkbox" onClick={event => changeClass(10, event)} /> KHC</label>
              <label><input type="checkbox" onClick={event => changeClass(11, event)} /> LAW</label>
              <label><input type="checkbox" onClick={event => changeClass(12, event)} /> MED</label>
              <label><input type="checkbox" onClick={event => changeClass(13, event)} /> MET</label>
              <label><input type="checkbox" onClick={event => changeClass(14, event)} /> OTP</label>
              <label><input type="checkbox" onClick={event => changeClass(15, event)} /> PDP</label>
              <label><input type="checkbox" onClick={event => changeClass(16, event)} /> QST</label>
              <label><input type="checkbox" onClick={event => changeClass(17, event)} /> SAR</label>
              <label><input type="checkbox" onClick={event => changeClass(18, event)} /> SDM</label>
              <label><input type="checkbox" onClick={event => changeClass(19, event)} /> SED</label>
              <label><input type="checkbox" onClick={event => changeClass(20, event)} /> SHA</label>
              <label><input type="checkbox" onClick={event => changeClass(21, event)} /> SPH</label>
              <label><input type="checkbox" onClick={event => changeClass(22, event)} /> SSW</label>
              <label><input type="checkbox" onClick={event => changeClass(23, event)} /> STH</label>
              <label><input type="checkbox" onClick={event => changeClass(24, event)} /> XRG</label>
            </section>
          </div>

        
          <div className="bu-hub-areas">
            {/* Hub Checkboxes */}
            <h2 className="bu-hub-title">BU HUB Areas</h2>
            <div className="bu-hub-areas-checkbox">
              <section className="first-row">
                <div className="first-row-child">
                  <p>Philosophical, Aesthetic, and Historical Interpretation</p>
                  <label><input type="checkbox" onClick={event => changeHub(0, event)} /> Philosophical Inquiry and Life's Meanings (PLM)</label>
                  <label><input type="checkbox" onClick={event => changeHub(1, event)} /> Aesthetic Exploration (AEX)</label>
                  <label><input type="checkbox" onClick={event => changeHub(2, event)} /> Historical Consciousness (HCO)</label>
                </div>
                
                <div className="first-row-child">
                  <p>Scientific and Social Inquiry</p>
                  <label><input type="checkbox" onClick={event => changeHub(3, event)} /> Scientific Inquiry I (SI1)</label>
                  <label><input type="checkbox" onClick={event => changeHub(4, event)} /> Scientific Inquiry II (SI2)</label>
                  <label><input type="checkbox" onClick={event => changeHub(5, event)} /> Social Inquiry I (SO1)</label>
                  <label><input type="checkbox" onClick={event => changeHub(6, event)} /> Social Inquiry II (SO2)</label>
                </div>
              </section>

              <section className="second-row">
                <div className="second-row-child">
                  <p>Quantitative Reasoning</p>
                  <label><input type="checkbox" onClick={event => changeHub(7, event)} /> Quantitative Reasoning I (QR1)</label>
                  <label><input type="checkbox" onClick={event => changeHub(8, event)} /> Quantitative Reasoning II (QR2)</label>
                </div>

                <div className="second-row-child">
                  <p>Diversity, Civic Engagement, and Global Citizenship</p>
                  <label><input type="checkbox" onClick={event => changeHub(9, event)} /> The Individual in Community (IIC)</label>
                  <label><input type="checkbox" onClick={event => changeHub(10, event)} /> Global Citizenship and Intercultural Literacy (GCI)</label>
                  <label><input type="checkbox" onClick={event => changeHub(11, event)} /> Ethical Reasoning (ETR)</label>
                </div>
              </section>

              <section className="third-row">
                <div className="third-row-child">
                  <p>Communication</p>
                  <label><input type="checkbox" onClick={event => changeHub(12, event)} /> First-Year Writing Seminar (FYW)</label>
                  <label><input type="checkbox" onClick={event => changeHub(13, event)} /> Writing, Research, and Inquiry (WRI)</label>
                  <label><input type="checkbox" onClick={event => changeHub(14, event)} /> Writing-Intensive Course (WIN)</label>
                  <label><input type="checkbox" onClick={event => changeHub(15, event)} /> Oral and/or Signed Communication (OSC)</label>
                  <label><input type="checkbox" onClick={event => changeHub(16, event)} /> Digital/Multimedia Expression (DME)</label>
                </div>

                <div className="third-row-child">
                  <p>Intellectual Toolkit</p>
                  <label><input type="checkbox" onClick={event => changeHub(17, event)} /> Critical Thinking (CRT)</label>
                  <label><input type="checkbox" onClick={event => changeHub(18, event)} /> Research and Information Literacy (RIL)</label>
                  <label><input type="checkbox" onClick={event => changeHub(19, event)} /> Teamwork/Collaboration (TWC)</label>
                  <label><input type="checkbox" onClick={event => changeHub(20, event)} /> Creativity/Innovation (CRI)</label>
                </div>
              </section>
           </div>
          </div>
          
          <div className="require-courses-input">
            <p>
              Input your required courses/unavailable times to filter out courses that overlap with those intervals
            </p>
            <ScheduleFilter />
          </div>
          
          </div>}
      </div>

      <div className="database-container">
          {formError && <p>{formError}</p>}
          
          <div>
            {fetchError && (<p>{fetchError}</p>)}
            {courses && (
              <div className="course-info">
                {courses.map(courses => (
                  <CoursesCard key={courses.course_id} courses={courses}/>
                ))}
              </div>
            )}
          </div>
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

let dayArr = ["M", "T", "W", "R", "F", "S", "U"]
let visualDayArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
let processVisualInput = (weekdays, start, end) => {
  let days = ""
  for (let i = 0; i < weekdays.length; i++) {
    if (weekdays[i] === true) {
      days = days + " " + visualDayArr[i]
    }
  }
  let result = days + " " + start + " " + end + " "
  return result
}

let processData = (weekdays, start, end) => {
  let days = ""
  for (let i = 0; i < weekdays.length; i++) {
    if (weekdays[i] === true) {
      days = days + dayArr[i]
    }
  }
  let startInt = parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1])
  let endInt = parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1])
  return {"days": days, "start": startInt, "end": endInt}
}

class ScheduleFilter extends Component {
constructor() {
  super();
  this.state = {
    // should be a list of dictionaries with key "start", "end", and "days"
    visualList: [],
    data: [],
    weekdays: [false, false, false, false, false, false, false],
    startTime: '',
    endTime: ''
  };
}

setStartTime = (event) => {
  this.setState({startTime: event.target.value});
}
setEndTime = (event) => {
  this.setState({endTime: event.target.value});
}

setWeekdays = (i) => {
  let weekdaysTemp = this.state.weekdays
  weekdaysTemp[i] = !weekdaysTemp[i]
  this.setState({weekdays: weekdaysTemp})
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
  visualList.push(processVisualInput(this.state.weekdays, this.state.startTime, this.state.endTime));
  data.push(processData(this.state.weekdays, this.state.startTime, this.state.endTime))
  console.log(visualList)
  console.log(data)
  currentSchedule = data
  this.setState({data: data})
  this.setState({visualList: visualList});
  let weekdays = document.getElementsByClassName('weekdayCheck')
  for (var i = 0; i < weekdays.length; i++) {
    weekdays[i].checked = false;
  }
  this.setState({weekdays: [false, false, false, false, false, false, false]})
  this.setState({startTime: ""})
  this.setState({endTime: ""})
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
    <div className="schedule">

      <label><input className="input-bottom" type="time" value={this.state.startTime} onChange={this.setStartTime}/>Start Time</label>
      <label><input className="input-bottom" type="time" value={this.state.endTime} onChange={this.setEndTime}/>End Time</label>

      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(0, event)} /> Monday</label>
      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(1, event)} /> Tuesday</label>
      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(2, event)} /> Wednesday</label>
      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(3, event)} /> Thursday</label>
      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(4, event)} /> Friday</label>
      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(5, event)} /> Saturday</label>
      <label><input type="checkbox" className="weekdayCheck" onClick={event => this.setWeekdays(6, event)} /> Sunday</label>

      <button className="btn-bottom"onClick={() => this.add()}>Click To Add</button>
      
      {renderData()}
    </div>
  );
}
}

export default SearchBox