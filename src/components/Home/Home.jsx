import { useState } from 'react'
import './Home.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Home() {

  return (
    <>
      <h1>name</h1>
      <Router>
        <Link to="/albums">Login</Link>
        <Link to="/posts">Login</Link>
        <Link to="/todos">Login</Link>
        <Link to="/info">Login</Link>
        <Routes>
          <Route path="/albums" element={<Albums />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Router>
    </>
  )
}

export default Home
