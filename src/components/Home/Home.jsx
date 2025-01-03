import { useState, useEffect, useRef } from 'react';
import Post from '../Posts/Post/Post.jsx';
import { Link, useParams, Outlet, useNavigate } from 'react-router-dom';
import './Home.css';
import { getAllRequest } from '../../serverRequests.jsx';

function Home() {
  const { userId } = useParams();
  const [allPosts, setAllPosts] = useState();  // שימוש בקונטקסט לפוסטים
  const [currentUser, setCurrentUser] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filtersRef = useRef({ search: '', id: '', title: '' });

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    const getAllPosts = async () => {
      try {
        const data = await getAllRequest('posts');
        setAllPosts(data.map(item => ({
          ...item,          // שומר את כל השדות הקיימים באובייקט
          isVisible: true    // הוספת השדה החדש
        })));
      }catch(error){
        console.log(error); 
      }
    }
    getAllPosts();
  }, [userId]);

const handleLogOut = () => {
  localStorage.removeItem('currentUser');
  navigate("/login");
};

const handleSearch = () => {
  const { search, id, title } = filtersRef.current;
  setAllPosts((prev) =>
    prev.map((comp) => ({
      ...comp,
      isVisible:
        (!search || comp.title.toLowerCase().includes(search)) &&
        (!id || comp.id.toString() === id) &&
        (!title || comp.title.toLowerCase().includes(title))
    }))
  );
};

const updateFilter = (key, value) => {
  filtersRef.current[key] = value;
  handleSearch();
};

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
      <div className='searchPost'>
        <div className="search-bar">
          <input type="text" placeholder="Search..." onChange={(e) => updateFilter('search', e.target.value.toLowerCase())} />
          <button onClick={() => setShowFilterModal(true)}>Filters</button>
        </div>
        {showFilterModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Advanced Filters</h2>
              <input type="text" placeholder="Filter by ID" onChange={(e) => updateFilter('id', e.target.value)} />
              <input type="text" placeholder="Filter by Title" onChange={(e) => updateFilter('title', e.target.value.toLowerCase())} />
              <button onClick={() => setShowFilterModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <div className="allPosts">
        {allPosts && allPosts.length > 0 ? (
          allPosts.filter((post) => post.isVisible).length > 0 ? (
            allPosts.filter((post) => post.isVisible).map((post) => (
              <div key={post.id} className="post">
                <Post userId={post.userId} postId={post.id} title={post.title} body={post.body} setPosts={setAllPosts} posts={allPosts} />
              </div>
            ))
          ) : (
            <h2>No tasks found.</h2>
          )
        ) : (
          <h2>Loading tasks...</h2>
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
