import { useEffect, useState } from 'react'
import './Home.css'
import { BrowserRouter as Router, Route, Routes, Link, useParams, useLocation, Outlet, useNavigate } from "react-router-dom";
import Albums from "../Albums/Albums";
import Posts from "../Posts/Posts";
import Todos from "../Todos/Todos";
import Info from "../Info/Info";
function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/login");
  }

  return (
    <>
      {currentUser ? (
        <h1>name: {currentUser.username}</h1>)
        : (<h1>loading user data</h1>)}
      <nav>
        <Link to={`/home/users/${userId}/albums`}>albums</Link><br />
        <Link to={`/home/users/${userId}/posts`}>posts</Link><br />
        <Link to={`/home/users/${userId}/todos`}>todos</Link><br />
        <Link to={`/home/users/${userId}/info`}>info</Link><br />
        <button id="logOutBtn" onClick={handleLogOut}>Log Out</button>
      </nav>
      <Outlet />
    </>
  )
}

export default Home
