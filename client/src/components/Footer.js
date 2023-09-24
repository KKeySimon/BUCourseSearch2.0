import * as React from "react";
import github from "../assets/github.png"

export default function Footer() {
  return (
    <footer className="coursearch-footer">
      <div className="container">
        <ul className="coursearch-footer-links">
          <li>
            <a className="coursearch-footer-masterplate" href="https://github.com/KKeySimon/BUCourseSearch2.0">
              <img src={github} alt="GitHub" className="github-img" />
            </a>
          </li>
        </ul>

        <div className="coursearch-footer-copyright">
          <p>© 2023 Boston University Course Search 2.0</p>
        </div>
      </div>
    </footer>
  );
};