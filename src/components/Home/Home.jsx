import { useEffect, useState } from 'react'
import './Home.css'
import { BrowserRouter as Router, Route, Routes, Link, useParams, useLocation, Outlet, useNavigate } from "react-router-dom";

function Home() {
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
    <div className='homePage'>
      <header className="header">
        {currentUser ? (
          <div className="profile">
            <span className="username">Welcome, {currentUser.username}</span>
          </div>
        ) : (
          <span className="loading">Loading user data...</span>
        )}
      </header>
      <nav>
        <Link to={`/home/users/${userId}/albums`}>albums</Link><br />
        <Link to={`/home/users/${userId}/posts`}>posts</Link><br />
        <Link to={`/home/users/${userId}/todos`}>todos</Link><br />
        <Link to={`/home/users/${userId}/info`}>info</Link><br />
        <button id="logOutBtn" onClick={handleLogOut}>Log Out</button>
      </nav>
      <Outlet />
    </div>
  );
  
}

export default Home
