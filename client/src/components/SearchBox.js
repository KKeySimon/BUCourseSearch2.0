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

    if (error) {
      console.log(error)
      setFetchError('Could not fetch the courses')
      setCourses(null)
    }
    if (data) {
      setCourses(parseData(checkAvailable(data, available)))
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