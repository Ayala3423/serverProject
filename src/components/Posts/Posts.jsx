import { useState, useEffect, useRef, useContext } from 'react';
import './Posts.css';
import Post from '../Post/Post.jsx'
import { useParams } from 'react-router-dom';
import { getRequest, createRequest } from '../../ServerRequests.jsx';
import { triggerError } from "../DisplayError/DisplayError.jsx";

function Posts() {
    const { userId } = useParams();
    const [posts, setPosts] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const newPostRef = useRef({});
    const [showFilterModal, setShowFilterModal] = useState(false);
    const filtersRef = useRef({ search: '', id: '', title: '' });

    useEffect(() => {
        (async () => {
            try {
                const data = await getRequest('posts', 'userId', userId);
                setPosts(data.map(item => ({
                    ...item,          // שומר את כל השדות הקיימים באובייקט
                    isVisible: true    // הוספת השדה החדש
                })));
            } catch (error) {
                console.log(error);
            }
        })()
    }, [userId]);

    const handleAddPost = () => {
        setShowModal(prev => !prev);
    };

    const handleSavePost = () => {
        const newPostTitle = newPostRef.current.title.value.trim();
        const newPostBody = newPostRef.current.body.value.trim();
        if (newPostTitle && newPostBody) {
            const newPost = {
                userId: parseInt(userId, 10),
                title: newPostTitle,
                body: newPostBody,
            };
            (async () => {
                try {
                    const data = await createRequest('posts', newPost);
                    setPosts([...posts, { ...data, isVisible: true }]);
                    setShowModal(false);
                } catch (error) {
                    console.log(error);
                }
            })()
        }
        else {
            triggerError("All fields must be filled out!")

        }
    };

    const handleSearch = () => {
        const { search, id, title } = filtersRef.current;
        setPosts((prev) =>
            prev.map((comp) => ({
                ...comp,
                isVisible:
                    (!search || ((comp.title.toLowerCase().includes(search)) || comp.body.toLowerCase().includes(search))) &&
                    (!id || comp.id.toString().includes(id)) && // תיקון התנאי
                    (!title || comp.title.toLowerCase().includes(title))
            }))
        );
    };

    const updateFilter = (key, value) => {
        filtersRef.current[key] = value;
        handleSearch();
    };

    return (
        <>
            <h1>Posts</h1>
            <div className="button-group">
                <div className='addPost'>
                    <button onClick={handleAddPost}>Add</button>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Add New Post</h2>
                                <label htmlFor="post-title">Post Title</label>
                                <input
                                    type="text"
                                    id="post-title"
                                    ref={(el) => (newPostRef.current["title"] = el)}
                                    placeholder="Enter post title"
                                />
                                <label htmlFor="post-content">Post Content</label>
                                <textarea
                                    id="post-content"
                                    ref={(el) => (newPostRef.current["body"] = el)}
                                    placeholder="Enter post content"
                                    rows="5"
                                ></textarea>
                                <button onClick={handleSavePost}>Save</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

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

            </div>

            <div className="posts">
                {posts && posts.length > 0 &&
                    posts.filter((post) => post.isVisible).length > 0 ? (
                    posts.filter((post) => post.isVisible).map((post) => (
                        <div key={post.id} className="post">
                            <Post key={post.id} userId={post.userId} postId={post.id} title={post.title} body={post.body} setPosts={setPosts} posts={posts} />
                        </div>
                    ))
                )
                    : (
                        <h2>No Posts found.</h2>
                    )}
            </div>

        </>
    );
}

export default Posts;
