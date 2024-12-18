import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";

function App() {

  return (
    <>
      <Router>
        <Link to="/login">Login</Link>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
