import { useContext } from "react";
import { Link, useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../../App";

function Navbar() {
  const { currentUser, setCurrentUser, setAuthorized } = useContext(UserContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/home");
  };

  const handleGuestRequests = () => {
    setAuthorized(false);
  };

  const getNavItemClass = (path) =>
    location.pathname === path ? "navItem active" : "navItem";

  return (
    <div className="homePage">
      <header className="header">
        <div className="profile">
          <span className="username">
            Welcome, {currentUser ? currentUser.name : "Guest"}
          </span>
        </div>
        <Link to={userId ? `/users/${userId}/home` : `/home`} className="homeLink">Home</Link>
      </header>

      <nav>
        {userId ? (
          <>
            <Link to={`/users/${userId}/albums`} className={getNavItemClass(`/users/${userId}/albums`)}>Albums</Link><br />
            <Link to={`/users/${userId}/posts`} className={getNavItemClass(`/users/${userId}/posts`)}>Posts</Link><br />
            <Link to={`/users/${userId}/todos`} className={getNavItemClass(`/users/${userId}/todos`)}>Todos</Link><br />
            <Link to={`/users/${userId}/info`} className={getNavItemClass(`/users/${userId}/info`)}>Info</Link>
            <button id="logOutBtn" onClick={handleLogOut}>Log Out</button>
          </>
        ) : (
          <>
            <button id="navItem" onClick={handleGuestRequests}>Albums</button><br />
            <button id="navItem" onClick={handleGuestRequests}>Posts</button><br />
            <button id="navItem" onClick={handleGuestRequests}>Todos</button><br />
            <button id="navItem" onClick={handleGuestRequests}>Info</button>
            <Link id="logInLink" to={`/login`}>Login</Link>
          </>
        )}
      </nav>
      <Outlet />
    </div>
  );

}

export default Navbar;
