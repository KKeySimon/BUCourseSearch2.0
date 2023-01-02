import "./index.css"
import Head from "./components/Head"
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"

/*
import { Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
*/

function App() {
  return (
    <html>
      <Head />
      <body>
        <Header />
        <Main />
        <Footer />
      </body>
    </html>    
  );
}

export default App;