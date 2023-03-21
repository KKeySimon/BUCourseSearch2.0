const SectionsCard =  ({ sections }) => {
    return (
        <div className="rpm">
            {/* If instructor rating is -1, do not include */}
            <p>{sections.instructorRating !== -1 
                ? sections.section_full_name + " --- " +  sections.instructor + " (Rating: " + 
                    sections.instructorRating + ", Diff: " + sections.instructorDiff + ") " + 
                    sections.days + " " + Math.floor(sections.scheduleStart / 60) + ":" + sections.scheduleStart % 60 + "-" + 
                    Math.floor(sections.scheduleEnd / 60) + ":" + sections.scheduleEnd % 60
                : sections.section_full_name + " --- " +  sections.instructor + " " +
                    sections.days + " " + Math.floor(sections.scheduleStart / 60) + ":" + sections.scheduleStart % 60 + "-" + 
                    Math.floor(sections.scheduleEnd / 60) + ":" + sections.scheduleEnd % 60}
            </p>
        </div>
    )
}

export default SectionsCard