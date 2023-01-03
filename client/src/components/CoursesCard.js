import SectionsCard from "./SectionsCard"

const CoursesCard =  ({ courses }) => {
    return (
        <div>
            <h3>{courses.course_id}</h3>
            <p>{courses.name}</p>
            <div>
                {courses.sections.map(sections => (
                    <SectionsCard key={sections.section_full_name} sections={sections}/>
                ))}
            </div>
        </div>
        
    )
}

export default CoursesCard