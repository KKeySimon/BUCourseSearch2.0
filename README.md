# BUCourseSearch2.0

This project looks to implement many of the features lacking in BU's course search.
This mainly comes in form of filters that will be added such as
- Minimum RateMyProfessor score
- Maximum RateMyProf difficulty
- Whether or not class is full
- Conflicts with current course schedule

For Project Members:
run "pip3 install -r requirements.txt" for development

TODO:
- [ ] Currently, if user collapses the additional search filters, every option is reset. Rather than disabling the div, we should render then not render the div depending on if button is pressed
- [ ] Let code run until it scans last course and fix errors as we go (batch 431 done out of 816)
- [ ] Stop site from making me think 'what a sad day to have eyes'
------------------------------------------------------------------------------
- [x] Figure out how to update the databases in batches automatically, with logs indicating which batches failed
- [x] Put everything other than Keyword under Additional Search Options
- [x] Add schedule/checkmark related filters
- [x] Implement schedule overlapping algo
- [x] Set default value of instructorDiff when webscraping to above 5 if RMP page doesn't exist for this person