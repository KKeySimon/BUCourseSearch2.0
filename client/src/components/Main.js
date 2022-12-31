import * as React from "react";

export default function Main() {
  return (
    <main class="coursearch-main">
      <header class="coursearch-header">
      <p>Search our database of over 7,000 courses.</p>
      </header>

      <div class="description">
        <p>Perform a basic search by entering keywords you would expect to find in the course description or by entering a full course number (example: CAS XX 123).  If you would like to see expected course offerings for a particular semester, select that semester in the drop-down box. If you would like to see all courses expected to be offered in the future, select “Future Semesters.”</p>
        <p>To perform a more targeted search, select Additional Search Options</p>
      </div>

      <div class="coursearch-searchfields">
        <label class="searchbar">
          Keyword or Full Course Number (example: CAS XX 123) 
          <input class="coursearch-searchfields-keyword-field" type="search" name="search_adv_all" value=""></input>
        </label>

        <label class="dropdown" >
          Semester
          <select class="coursearch-searchfields-semester-select" name="yearsem_adv">
          <option value="2023-SPRG" selected="selected" >Spring 2023</option>
          <option value="*"  >Future Semesters</option>
        </select>
        </label>

        <span class="search">
          <button id="search-submit" type="submit" class="coursearch-searchfields-submit">Search</button>
        </span>
      </div>

      <div class="additional-info">
        <button class="coursearch-options-expand" type="button" data-selection-count="" ><strong>^</strong> Additional Search Options</button>
      </div>
    </main>
  );
};
