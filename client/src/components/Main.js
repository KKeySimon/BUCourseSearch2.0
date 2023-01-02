import * as React from "react";

export default function Main() {
  return (
    <main className="coursearch-main">
      <header className="coursearch-header">
      <p>Search our database of over 7,000 courses.</p>
      </header>

      <div className="description">
        <p>Perform a basic search by entering keywords you would expect to find in the course description or by entering a full course number (example: CAS XX 123).  If you would like to see expected course offerings for a particular semester, select that semester in the drop-down box. If you would like to see all courses expected to be offered in the future, select “Future Semesters.”</p>
        <p>To perform a more targeted search, select Additional Search Options</p>
      </div>

      <form className="coursearch-searchfields">
        <div className="searchbar">
          <label for="search">Keyword or Full Course Number (example: CAS XX 123)</label>
          <input className="coursearch-searchfields-keyword-field" type="search"></input>
        </div>

        <label className="dropdown" >
          Semester
          <select className="coursearch-searchfields-semester-select">
          <option value="2023-SPRG" selected="selected" >Spring 2023</option>
          <option value="Future-Semesters"  >Future Semesters</option>
        </select>
        </label>

        <span className="search">
          <button id="search-submit" type="submit" className="coursearch-searchfields-submit">Search</button>
        </span>
      </form>

      <div className="additional-info">
        <button className="coursearch-options-expand" type="button" data-selection-count="" ><strong>^</strong> Additional Search Options</button>
      </div>
    </main>
  );
};
