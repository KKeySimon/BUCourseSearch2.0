import * as React from "react";
import { Link } from "react-router-dom";

export const NavigationBar = () => {
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
};
