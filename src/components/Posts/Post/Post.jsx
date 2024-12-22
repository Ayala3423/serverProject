import { useState, useRef, useContext } from 'react';
import './Post.css';
import { PostsContext } from '../Posts.jsx'; // ייבוא הקשר

function Post({ id, title, body }) {
    const [idEditing, setIdEditing] = useState(null);
    const [showDetails, setShowDetails] = useState(false); // סטייט לפתיחת חלון
    const titleRef = useRef();
    const { posts, setPosts } = useContext(PostsContext); // שימוש ב-context

    const handleDelete = (idToDelete) => {
        fetch(`http://localhost:3000/posts/${idToDelete}`, {
            method: 'DELETE',
        }).then(() => {
            setPosts((prev) => prev.filter((item) => item.id !== idToDelete));
        });
    };

    const handleEdit = (idToEdit) => {
        const updatedTitle = titleRef.current?.value.trim();
        if (!updatedTitle) {
            alert('Title cannot be empty');
            return;
        }

        fetch(`http://localhost:3000/posts/${idToEdit}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: updatedTitle }),
        }).then(() => {
            setPosts(
                posts.map((post) =>
                    post.id === idToEdit ? { ...post, title: updatedTitle } : post
                )
            );
            setIdEditing(null);
        });
    };

    const handleShowDetails = () => {
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
    };

    return (
        <>
            <h2>Id: {id}</h2>
            {idEditing === id ? (
                <input ref={titleRef} type="text" defaultValue={title} />
            ) : (
                <h2>Title: {title}</h2>
            )}
            {idEditing === id ? (
                <button onClick={() => handleEdit(id)}>Save</button>
            ) : (
                <button onClick={() => setIdEditing(id)}>Edit</button>
            )}
            <button onClick={() => handleDelete(id)}>Delete</button>
            <button onClick={handleShowDetails}>More Details</button>

            {showDetails && (
                <div className="details-modal">
                    <div className="modal-content">
                        <h2>Post Details</h2>
                        <p><strong>Id:</strong> {id}</p>
                        <p><strong>Title:</strong> {title}</p>
                        <p><strong>body:</strong> {body}</p>
                        <button onClick={() => handleShowComments(id)}>Comments</button>
                        <button onClick={handleCloseDetails}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Post;
