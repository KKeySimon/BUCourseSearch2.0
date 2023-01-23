import SectionsCard from "./SectionsCard"

const CoursesCard =  ({ courses }) => {
    return (
        <div className="course-card-container">
            <section className="pre-section-info">
                <h2 className="course-id">{courses.course_id}</h2>
                <h3 className="course-name">{courses.name}</h3>

                <div className="course-prereq">
                <h5 >{courses.prereqs}</h5>
                    {courses.hubs.map(hub => {
                        return ( <div key={hub.name}>
                                <dt className="hubs">{hub}</dt>     
                                </div>
                                )
                    })
                    }
                </div >
                <p className="course-desc">{courses.description}</p>
            </section>


            <section className="course-sections-container">
                <h3 id="sections">Sections</h3>

                <div className="course-sections">
                    {courses.sections.map(sections => (
                        <SectionsCard key={sections.section_full_name} sections={sections}/>
                    ))}
                </div>
            </section>
        </div>
        
    )
}

export default CoursesCard