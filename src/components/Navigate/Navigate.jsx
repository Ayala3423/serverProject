import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams, Outlet, useNavigate } from 'react-router-dom';
import './Navigate.css';
import { UserContext } from '../../App';

function Navigate() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigate("/home");
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
                {userId ?
                    <>
                        <Link to={`/users/${userId}/albums`} onClick={() => setShowAllPosts(false)}>albums</Link><br />
                        <Link to={`/users/${userId}/posts`} onClick={() => setShowAllPosts(false)}>posts</Link><br />
                        <Link to={`/users/${userId}/todos`} onClick={() => setShowAllPosts(false)}>todos</Link><br />
                        <Link to={`/users/${userId}/info`} onClick={() => setShowAllPosts(false)}>info</Link><br />
                        <button id="logOutBtn" onClick={handleLogOut}>Log Out</button>
                    </> :
                    <><Link to={`/login`} onClick={() => setShowAllPosts(false)}>albums</Link><br />
                        <Link to={`/login`} onClick={() => setShowAllPosts(false)}>posts</Link><br />
                        <Link to={`/login`} onClick={() => setShowAllPosts(false)}>todos</Link><br />
                        <Link to={`/login`} onClick={() => setShowAllPosts(false)}>info</Link><br />
                        <Link id="logInLink" to={`/login`} onClick={() => setShowAllPosts(false)}>Login</Link><br />
                    </>
                }
            </nav>
            <Outlet />
        </div>

    );
}

export default Navigate;
