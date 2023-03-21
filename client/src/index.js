import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWGesQWs4XJMfvSzmH7KWJh3Tne2pEj28",
  authDomain: "bucoursesearch.firebaseapp.com",
  projectId: "bucoursesearch",
  storageBucket: "bucoursesearch.appspot.com",
  messagingSenderId: "1072026572586",
  appId: "1:1072026572586:web:1cdb57515636b266b1f053",
  measurementId: "G-ZMHYPSV5E3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);