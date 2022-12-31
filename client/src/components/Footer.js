import * as React from "react";

export default function Footer() {
  return (
    <footer class="coursearch-footer">
      <div class="container">
        <ul class="coursearch-footer-links">
        <li><a href="https://www.bu.edu/academics/bulletin/">Bulletin</a></li>

        <li><a href="https://www.bu.edu/link/bin/uiscgi_studentlink.pl/uismpl/?ModuleName=menu.pl&NewMenu=Home">Student Link</a></li>

        <li><a href="http://www.bu.edu/help/tech/">Contact</a></li>

        <li><a href="https://www.bu.edu/advising/">Undergraduate Advising</a></li>
        </ul>

        <div class="coursearch-footer-copyright">
        <p>© 2022 Boston University Course Search 2.0</p>
        </div>

        <div class="coursearch-footer-branding">
        <a class="coursearch-footer-masterplate" href="https://www.bu.edu">
        <img src="./client/public/images/bu.png" alt="logo"></img>
        </a>
        </div>
      </div>
    </footer>
  );
};