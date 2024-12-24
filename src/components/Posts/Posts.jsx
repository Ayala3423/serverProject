import { useState, useEffect, useContext, useRef } from 'react';
import './Posts.css';
import { PostsContext } from '../PostsContext'; // ייבוא הקונטקסט
import Post from './Post/Post.jsx'
import { useParams } from 'react-router-dom';

function Posts() {
    const { userId } = useParams();  // קבלת ה-userId מה-URL
    const { posts, setPosts } = useContext(PostsContext); // שימוש בקונטקסט לפוסטים
    const [showModal, setShowModal] = useState(false);
    const newPostRef = useRef({});

    useEffect(() => {
        // כאן אפשר להוריד את הפוסטים של המשתמש הספציפי
        fetch(`http://localhost:3000/posts/?userId=${userId}`)
            .then((response) => response.json())
            .then((data) => setPosts(data));  // עדכון הקונטקסט עם פוסטים של המשתמש הספציפי
    }, [userId, setPosts]);

    const handleAddPost = () => {
        setShowModal(prev => !prev);
    };

    const handleSavePost = () => {
        const newPostTitle = newPostRef.current.title.value.trim();
        const newPostBody = newPostRef.current.body.value.trim();
        if (newPostTitle && newPostBody) {
            const newPost = {
                id: JSON.stringify(JSON.parse(posts[posts.length - 1].id) + 1), // לדוגמה, יצירת ID חדש
                title: newPostTitle,
                body: newPostBody,
                userId: parseInt(userId, 10),
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
            <div className='posts'>
                {posts ? (
                    posts.map((post) => (
                        <div key={post.id} className='post'>
                            <Post id={post.id} title={post.title} body={post.body} />
                        </div>
                    ))
                ) : <h2>loading...</h2>}
            </div>
        </>
    );
}

export default Posts;
