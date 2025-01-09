import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams, Outlet, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { UserContext } from '../../App';

function Navbar() {
    const { currentUser, setCurrentUser, setAuthorized } = useContext(UserContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigate("/home");
    };

    const handleGuestRequests = () => {
        setAuthorized(false);
    };

    return (
        <div className='homePage'>
            <header className="header">
                {currentUser ? (
                    <div className="profile">
                        <span className="username">Welcome, {currentUser.name || "Guset"}</span>
                    </div>
                ) : (
                    <span className="loading">Loading user data...</span>
                )}
                <Link to={userId ? `/users/${userId}/home` : `/home`} onClick={() => setShowAllPosts(true)} className='homeLink'>Home</Link><br />
            </header>

            <nav>
                <>
                    {/* <button onClick={handleGuestRequests}>albums</button>
                    <button onClick={handleGuestRequests}>posts</button>
                    <button onClick={handleGuestRequests}>todos</button>
                    <button onClick={handleGuestRequests}>info</button>
                    {userId ? <button id="logOutBtn" onClick={handleLogOut}>Log Out</button> : 
                    } */}
                </>
                {userId?
                    <>
                        <Link to={`/users/${userId}/albums`}>albums</Link><br />
                        <Link to={`/users/${userId}/posts`}>posts</Link><br />
                        <Link to={`/users/${userId}/todos`}>todos</Link><br />
                        <Link to={`/users/${userId}/info`}>info</Link><br />
                        <button id="logOutBtn" onClick={handleLogOut}>Log Out</button>
                    </> :
                    <>
                        <button onClick={handleGuestRequests}>albums</button>
                        <button onClick={handleGuestRequests}>posts</button>
                        <button onClick={handleGuestRequests}>todos</button>
                        <button onClick={handleGuestRequests}>info</button>
                        <Link id="logInLink" to={`/login`}>Login</Link><br />
                    </>
                }
            </nav>
            <Outlet />
        </div>

    );
}

export default Navbar;
