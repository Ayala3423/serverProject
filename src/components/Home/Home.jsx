import { useState, useEffect, useRef } from 'react';
import Post from '../Post/Post.jsx';
import { useParams } from 'react-router-dom';
import './Home.css';
import Navigate from '../Navbar/Navbar.jsx'
import { getAllRequest } from '../../ServerRequests.jsx';

function Home() {
  const { userId } = useParams();
  const [allPosts, setAllPosts] = useState();  // שימוש בקונטקסט לפוסטים
  const [showFilterBar, setShowFilterBar] = useState(false);
  const filtersRef = useRef({ search: '', id: '', title: '' });

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllRequest('posts');
        const sortedPosts = [...data].sort((a, b) => parseInt(a.userId) - parseInt(b.userId));
        setAllPosts(sortedPosts.map(item => ({
          ...item,          // שומר את כל השדות הקיימים באובייקט
          isVisible: true    // הוספת השדה החדש
        })));
      } catch (error) {
        console.log(error);
      }
    })()
  }, [userId]);

  const handleSearch = () => {
    const { search, id, title } = filtersRef.current;
    setAllPosts((prev) =>
      [...prev
        .map((comp) => ({
          ...comp,
          isVisible:
            (!search || comp.title.toLowerCase().includes(search)) &&
            (!id || comp.id.toString().includes(id)) && // תיקון התנאי
            (!title || comp.title.toLowerCase().includes(title)),
        }))]
        .sort((a, b) => parseInt(a.userId) - parseInt(b.userId))
    );
  };

  const updateFilter = (key, value) => {
    filtersRef.current[key] = value;
    handleSearch();
  };

  return (
    <div className='homePage'>
      <Navigate />
      <div className='posts'>
        <h1>All Posts</h1>
        <div className='searchPost'>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => updateFilter('search', e.target.value.toLowerCase())}
            />
            <button onClick={() => setShowFilterBar(!showFilterBar)}>
              Filters
            </button>
          </div>
          {showFilterBar && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Filter by ID"
                onChange={(e) => updateFilter('id', e.target.value)}
              />
              <button onClick={() => setShowFilterBar(false)}>Close</button>
            </div>
          )}
        </div>
        <div id="allPosts">
          {allPosts && allPosts.length > 0 ? (
            allPosts.filter((post) => post.isVisible).length > 0 ? (
              allPosts.filter((post) => post.isVisible).map((post) => (
                <div key={post.id} className="post">
                  <Post userId={post.userId} postId={post.id} title={post.title} body={post.body} setPosts={setAllPosts} posts={allPosts} />
                </div>
              ))
            ) : (
              <h2>No Posts found.</h2>
            )
          ) : (
            <h2>Loading Posts...</h2>
          )}
        </div>
      </div>


    </div>

  );
}

export default Home;