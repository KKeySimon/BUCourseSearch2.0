const SectionsCard =  ({ sections }) => {
    var link = sections.instructorRating !== -1 ? <a href={sections.url}>RateMyProfessor</a> : <p></p>
    return (
        <div className="rpm">
            {/* If instructor rating is -1, do not include */}
            <p>{sections.instructorRating !== -1 
                ? sections.section_full_name + " --- " +  sections.instructor + " (Rating: " + 
                    sections.instructorRating + ", Diff: " + sections.instructorDiff + ") " + 
                    sections.days + " " + Math.floor(sections.scheduleStart / 60) + ":" + (sections.scheduleStart % 60).toString().padStart(2, "0")  + "-" + 
                    Math.floor(sections.scheduleEnd / 60)+ ":" + (sections.scheduleEnd % 60).toString().padStart(2, "0")
                : sections.section_full_name + " --- " +  sections.instructor + " " +
                    sections.days + " " + Math.floor(sections.scheduleStart / 60) + ":" + (sections.scheduleStart % 60).toString().padStart(2, "0")  + "-" + 
                    Math.floor(sections.scheduleEnd / 60)+ ":" + (sections.scheduleEnd % 60).toString().padStart(2, "0")} &nbsp;&nbsp;&nbsp; {link}
            </p>
        </div>
    )
}

export default SectionsCard