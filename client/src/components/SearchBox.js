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

const SearchBox = () => {

  const [title, setTitle] = useState('')
  const [formError, setFormError] = useState(null)

  const [courses, setCourses] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title) {
      setFormError('Please fill in all the fields correctly.')
      return
    }
    let input = title.replace(" ", " & ")

    const { data, error } = await supabase
    .from('Sections')
    .select(`*,
      Courses (
        *
      )
    `)
    .textSearch('course_id', input)

    if (error) {
      console.log(error)
      setFetchError('Could not fetch the courses')
      setCourses(null)
    }
    if (data) {
      console.log(data)
      setCourses(parseData(data))
      setFetchError(null)
    }
  }

  return (
    <div>
      <form className="coursearch-searchfields" onSubmit={handleSubmit}>
        <div className="searchbar">
          <label htmlFor="search">Keyword or Full Course Number (example: CAS XX 123)</label>
          <input 
          type="text" 
          id="title"
          className="coursesearch-searchfields-keyword-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}>
          </input>
        </div>

        <label className="dropdown" >
          Semester
          <select className="coursearch-searchfields-semester-select" defaultValue="2023-SPRG">
          <option value="2023-SPRG">Spring 2023</option>
          <option value="Future-Semesters"  >Future Semesters</option>
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