import * as React from "react";
import SearchBox from "./SearchBox";

const Main = () => {

  return (
    <main className="coursearch-main">
      <header className="coursearch-header">
      <p>Search our database of over 7,000 courses.</p>
      </header>

      <div className="description">
        <p>Perform a basic search by entering keywords you would expect to find in the course description or by entering a full course number (example: CAS XX 123).  If you would like to see expected course offerings for a particular semester, select that semester in the drop-down box. If you would like to see all courses expected to be offered in the future, select “Future Semesters.”</p>
        <p>To perform a more targeted search, select Additional Search Options</p>
      </div>
      <SearchBox />
      
    </main>

  );
};

export default Main
