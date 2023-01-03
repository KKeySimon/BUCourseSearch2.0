const CoursesCard =  ({ courses }) => {
    return (
        <div>
            <h3>{courses.course_id}</h3>
            <p>{courses.name}</p>
        </div>
    )
}

export default CoursesCard