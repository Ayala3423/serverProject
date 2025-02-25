import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";
import './App.css';
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Navbar from "./components/Navbar/Navbar";
import Albums from './components/Albums/Albums';
import Posts from './components/Posts/Posts';
import Todos from './components/Todos/Todos';
import Info from './components/Info/Info';
import Photos from './components/Albums/Album/Photos/Photos';
import Authorization from "./components/Authorization/Authorization";
import DisplayError from "./components/DisplayError/DisplayError";

export const UserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authorized, setAuthorized] = useState(true);

  // טעינת הנתונים מ-localStorage כאשר האפליקציה נטענת
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, authorized, setAuthorized }}>
      <Router>
        <Authorization>
        <DisplayError />
          <Routes>
            {/* מסלולים ראשיים */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />

            {/* מסלול המשתמשים */}
            <Route path="/users/:userId" element={<Navbar />}>
              <Route path="home" element={<Home />} />
              <Route path="albums" element={<Albums />} />
              <Route path="albums/:albumId/photos" element={<Photos />} />
              <Route path="posts" element={<Posts />} />
              <Route path="todos" element={<Todos />} />
              <Route path="info" element={<Info />} />
            </Route>

            {/* מסלול 404 */}
            <Route path="*" element={<h1>404 Page Not Found</h1>} />
          </Routes>
        </Authorization>

      </Router>
    </UserContext.Provider>
  );
}
export default App;