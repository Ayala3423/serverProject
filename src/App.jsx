import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { PostsProvider } from './components/PostsContext';  // ייבוא הקונטקסט
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Albums from './components/Albums/Albums';
import Posts from './components/Posts/Posts';
import Todos from './components/Todos/Todos';
import Info from './components/Info/Info';
import Photos from './components/Photos/Photos';

function App() {
  return (
    <PostsProvider> {/* עטיפת כל האפליקציה בקונטקסט */}
      <Router>
        <Routes>
          <Route path="/*" element={<h1>404 Page Not Found</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/home/users/:userId" element={<Home />}>
            <Route path="albums" element={<Albums />}>
              <Route path="photos" element={<Photos />} />
            </Route>
            <Route path="posts" element={<Posts />} />
            <Route path="todos" element={<Todos />} />
            <Route path="info" element={<Info />} />
          </Route>
        </Routes>
      </Router>
    </PostsProvider>
  )
}

export default App
