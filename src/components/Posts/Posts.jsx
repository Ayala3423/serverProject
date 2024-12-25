import { useState, useEffect, useRef } from 'react';
import './Posts.css';
import Post from './Post/Post.jsx'
import { useParams } from 'react-router-dom';
import Search from '../Search/Search.jsx'

function Posts() {
    const { userId } = useParams();  // קבלת ה-userId מה-URL
    const [posts, setPosts] = useState(null); // שימוש בקונטקסט לפוסטים
    const [showModal, setShowModal] = useState(false);
    const newPostRef = useRef({});

    useEffect(() => {
        fetch(`http://localhost:3000/posts/?userId=${userId}`)
            .then((response) => response.json())
            .then((data) => setPosts(data.map(item => ({
                ...item,          // שומר את כל השדות הקיימים באובייקט
                isVisible: true    // הוספת השדה החדש
            }))));  // עדכון הקונטקסט עם פוסטים של המשתמש הספציפי
    }, [userId]);

    const handleAddPost = () => {
        setShowModal(prev => !prev);
    };

    const handleSavePost = () => {
        const newPostTitle = newPostRef.current.title.value.trim();
        const newPostBody = newPostRef.current.body.value.trim();
        const newId = posts.length ? JSON.stringify(JSON.parse(posts[posts.length - 1].id) + 1) : "1";
        if (newPostTitle && newPostBody) {
            const newPost = {
                userId: parseInt(userId, 10),
                id: newId, // לדוגמה, יצירת ID חדש
                title: newPostTitle,
                body: newPostBody,
            };

            fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            }).then(() => {
                setPosts([...posts, { ...newPost, isVisible: true }]);
                setShowModal(false); // סגירת ה-Modal
            });
        }
    };

    return (
        <>
            <h1>Posts</h1>
            <div className="button-group">
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
                <Search setComponent={setPosts} />
            </div>

            <div className='posts'>
                {posts ? (
                    posts.map((post) => (
                        <div key={post.id} className='post'>
                            <Post id={post.id} title={post.title} body={post.body} setPosts={setPosts} posts={posts} />
                        </div>
                    ))
                ) : <h2>loading...</h2>}
            </div>
        </>
    );
}

export default Posts;
