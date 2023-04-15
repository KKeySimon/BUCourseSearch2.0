import * as React from "react";
import SearchBox from "./SearchBox";

const Main = () => {

  return (
    <main className="coursearch-main">
      <header className="coursearch-header">
      <p>Search our database of over 7,000 courses.</p>
      </header>

      <div className="description">
        <p>Welcome to the new and improved Boston Universty Course Search. 
          This course search will provide additional information regarding any course that you choose. 
          On top of the capabalities that the original BU Course Search displays, we provide additional useful filters.
        </p>
        <p>To perform a more targeted search, select Additional Search Options</p>
      </div>
      <SearchBox />
      
    </main>

  );
};

export default Main
