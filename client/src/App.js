import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

function App() {
  return (
    <div>
      <h1>BU Course Search</h1>
      <NavigationBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
