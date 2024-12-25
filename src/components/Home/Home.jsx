import { useState, useEffect, useMemo } from 'react';
import Post from '../Posts/Post/Post.jsx';
import { Link, useParams, Outlet, useNavigate } from 'react-router-dom';
import './Home.css';
import Search from '../Search/Search.jsx'

function Home() {
  const { userId } = useParams();
  const [allPosts, setAllPosts] = useState();  // שימוש בקונטקסט לפוסטים
  const [currentUser, setCurrentUser] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    fetch(`http://localhost:3000/posts`)
      .then((response) => response.json())
      .then((data) => setAllPosts(data.map(item => ({
        ...item,          // שומר את כל השדות הקיימים באובייקט
        isVisible: true    // הוספת השדה החדש
      }))));  // שמירת כל הפוסטים בקונטקסט
  }, [allPosts]);

  const handleLogOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/login");
  };

  // משתנה מחושב לשמירת הפוסטים הנראים
  const visibleAllPosts = useMemo(() => {
    return allPosts?.filter((post) => post.isVisible) || [];
  }, [allPosts]);

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
        <Link to={`/home/users/${userId}`} onClick={() => setShowAllPosts(true)} className='homeLink'>Home</Link><br />
      </header>
      {showAllPosts && <div className='posts'>
        <h1>All Posts</h1>
        <Search setComponent={setAllPosts} />
        <div className="posts">
          {allPosts && allPosts.length > 0 ? (
            visibleAllPosts.length > 0 ? (
              visibleAllPosts.map((post) => (
                <div key={post.id} className="post">
                  <Post
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    setAllPosts={setAllPosts}
                    allPosts={allPosts}
                  />
                </div>
              ))
            ) : (
              <h2>No posts found.</h2>
            )
          ) : (
            <h2>Loading posts...</h2>
          )}
        </div>
      </div>}
      <nav>
        <Link to={`/home/users/${userId}/albums`} onClick={() => setShowAllPosts(false)}>albums</Link><br />
        <Link to={`/home/users/${userId}/posts`} onClick={() => setShowAllPosts(false)}>posts</Link><br />
        <Link to={`/home/users/${userId}/todos`} onClick={() => setShowAllPosts(false)}>todos</Link><br />
        <Link to={`/home/users/${userId}/info`} onClick={() => setShowAllPosts(false)}>info</Link><br />
        <button id="logOutBtn" onClick={handleLogOut}>Log Out</button>
      </nav>
      <Outlet />
    </div>
  );
}

export default Home;
