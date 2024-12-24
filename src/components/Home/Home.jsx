import { useState, useEffect } from 'react';
import { PostsProvider, usePosts } from '../PostsContext.jsx'; // ייבוא הקונטקסט
import Post from '../Posts/Post/Post.jsx';
import { Link, useParams, Outlet, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const { userId } = useParams();
  const { posts, setPosts } = usePosts();  // שימוש בקונטקסט לפוסטים
  const [currentUser, setCurrentUser] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    fetch(`http://localhost:3000/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data));  // שמירת כל הפוסטים בקונטקסט
  }, [setPosts]);

  const handleLogOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/login");
  };

  return (
    <PostsProvider>
      <div className='homePage'>
        <header className="header">
          {currentUser ? (
            <div className="profile">
              <span className="username">Welcome, {currentUser.username}</span>
              <Link to={`/home/users/${userId}`} onClick={() => setShowAllPosts(true)} className='homeLink'>Home</Link><br />
            </div>
          ) : (
            <span className="loading">Loading user data...</span>
          )}
        </header>
        {showAllPosts && <div className='posts'>
          <h1>All Posts</h1>
          {posts ? (
            posts.map((post) => (
              <div key={post.id} className='post'>
                <Post id={post.id} title={post.title} body={post.body} />
              </div>
            ))
          ) : <h2>loading...</h2>}
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
    </PostsProvider>
  );
}

export default Home;
