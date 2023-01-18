import SectionsCard from "./SectionsCard"

const CoursesCard =  ({ courses }) => {
    return (
        <div>
            <h3>{courses.course_id}</h3>
            <h3>{courses.name}</h3>
            <h5>{courses.prereqs}</h5>
            {courses.hubs.map(hub => {
                return ( <div key={hub.name}>
                        <dt>{hub}</dt>     
                        </div>
                        )
            })
            }
            <p>{courses.description}</p>
            <p>Sections</p>
            <div>
                {courses.sections.map(sections => (
                    <SectionsCard key={sections.section_full_name} sections={sections}/>
                ))}
            </div>
        </div>
        
    )
}

export default CoursesCard