import { useState, useRef, useContext, createContext } from 'react';
import './Post.css';
import { PostsContext } from "../../PostsContext";
import Comment from '../../Comment/Comment.jsx'

export const CommentsContext = createContext();

function Post({ id, title, body }) {
    const [idEditing, setIdEditing] = useState(null);
    const [showDetails, setShowDetails] = useState(false); // סטייט לפתיחת חלון
    const [showComments, setShowComments] = useState(false); // סטייט לפתיחת חלון
    const [postComments, setPostComments] = useState(null); // סטייט לפתיחת חלון
    const titleRef = useRef();
    const { posts, setPosts } = useContext(PostsContext); // שימוש בקונטקסט

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
    const handleShowComments = (postId) => {
        fetch(`http://localhost:3000/comments/?postId=${postId}`)
            .then((response) => response.json())
            .then((data) => setPostComments(data));
        setShowComments(true);
    }

    return (
        <>
            <CommentsContext.Provider value={{ postComments, setPostComments }}>
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
                            {showComments && (
                                postComments ? (
                                    postComments.map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <Comment id={comment.id} email={comment.email} name={comment.name} body={comment.body} />

                                        </div>
                                    ))
                                ) : (
                                    <h2>no comments</h2>
                                )
                            )}
                            <button onClick={() => handleShowComments(id)}>Comments</button>
                            <button onClick={handleCloseDetails}>Close</button>
                        </div>
                    </div>
                )}
            </CommentsContext.Provider>
        </>
    );
}

export default Post;
