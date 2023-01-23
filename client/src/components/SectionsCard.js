const SectionsCard =  ({ sections }) => {
    return (
        <div className="rpm">
            {/* If instructor rating is -1, do not include */}
            <p>{sections.instructorRating !== -1 
                ? sections.section_full_name + " --- " +  sections.instructor + " (Rating: " + 
                    sections.instructorRating + ", Diff: " + sections.instructorDiff + ")"
                : sections.section_full_name + " --- " +  sections.instructor}</p>
        </div>
    )
}

export default SectionsCard