const SectionsCard =  ({ sections }) => {
    return (
        <div>
            <p>{sections.section_full_name + " --- " +  sections.instructor}</p>
        </div>
    )
}

export default SectionsCard