import { useState, useRef } from 'react';
import './Post.css';
import Comment from '../../Comment/Comment.jsx';

function Post({ userId, postId, title, body, setPosts, posts }) {
    const [idEditing, setIdEditing] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [postComments, setPostComments] = useState(null);
    const [showAddCommentModal, setShowAddCommentModal] = useState(false);
    const newCommentRef = useRef({});
    const inputRefs = useRef({
        title: null,
        body: null,
    });

    const handleDelete = (idToDelete) => {
        fetch(`http://localhost:3000/posts/${idToDelete}`, {
            method: 'DELETE',
        }).then(() => {
            setPosts((prev) => prev.filter((item) => item.id !== idToDelete));
        });
    };

    const handleEdit = (idToEdit) => {
        const updatedTitle = inputRefs.current.title?.value.trim();
        const updatedBody = inputRefs.current.body?.value.trim();
        if (!updatedTitle || !updatedBody) {
            alert('Title and Body cannot be empty');
            return;
        }

        fetch(`http://localhost:3000/posts/${idToEdit}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
        }).then(() => {
            setPosts(
                posts.map((post) =>
                    post.id === idToEdit
                        ? { ...post, title: updatedTitle, body: updatedBody }
                        : post
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
        setShowComments(false); // סגירת התגובות כשסוגרים את החלונית
    };

    const handleShowComments = () => {
        const getComments = async () => {
            try {
                const data = await getRequest('comments', 'postId', postId);
                setPostComments(data);
                setShowComments(true);
            } catch (error) {
                console.log(error);
            }
        }
        getComments();
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    const handleAddComment = () => {
        setShowAddCommentModal(prev => !prev);
    };

    const handleSaveComment = () => {
        const newCommentName = newCommentRef.current.title.value.trim();
        const newCommentBody = newCommentRef.current.body.value.trim();
        const newId = postComments.length ? JSON.stringify(JSON.parse(postComments[postComments.length - 1].id) + 1) : "1";
        if (newCommentName && newCommentBody) {
            const newComment = {
                postId: parseInt(postId, 10),
                id: newId,
                name: newCommentName,
                email: JSON.parse(localStorage.getItem('currentUser')).email,
                body: newCommentBody,
            };

            fetch('http://localhost:3000/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment),
            }).then(() => {
                setPostComments([...postComments, { ...newComment, isVisible: true }]);
                setShowAddCommentModal(false); // סגירת ה-Modal
            });
        }
    };

    return (
        <>
            <h2>Posted By: {userId}</h2>
            <h2>Id: {postId}</h2>
            <h2>Title: {title}</h2>
            <button onClick={handleShowDetails}>More Details</button>

            {showDetails && (
                <div className="details-modal">
                    <div className="modal-content">
                        <h2>Post Details</h2>
                        <button onClick={() => handleDelete(postId)}>Delete Post</button>
                        <p><strong>Posted By:</strong> {userId}</p>
                        <p><strong>Id:</strong> {postId}</p>

                        {idEditing === postId ? (
                            <>
                                <input ref={(el) => (inputRefs.current.title = el)} type="text" defaultValue={title} />
                                <textarea ref={(el) => (inputRefs.current.body = el)} defaultValue={body} />
                            </>
                        ) : (
                            <>
                                <h2>Title: {title}</h2>
                                <p>Body: {body}</p>
                            </>
                        )}

                        {idEditing === postId ? (
                            <button onClick={() => handleEdit(postId)}>Save</button>
                        ) : (
                            <button onClick={() => setIdEditing(postId)}>Edit</button>
                        )}

                        <button onClick={handleShowComments}>Comments</button>
                        <button onClick={handleCloseDetails}>Close</button>
                    </div>

                    {showComments && (
                        <div className="comments-modal-content">
                            <div className="button-group">
                                <button onClick={handleAddComment}>Add</button>
                                {showAddCommentModal && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <h2>Add New Comment</h2>
                                            <label htmlFor="comment-name">Comment Name</label>
                                            <input
                                                type="text"
                                                id="comment-title"
                                                ref={(el) => (newCommentRef.current["title"] = el)}
                                                placeholder="Enter comment title"
                                            />
                                            <label htmlFor="comment-content">Comment Content</label>
                                            <textarea
                                                id="comment-content"
                                                ref={(el) => (newCommentRef.current["body"] = el)}
                                                placeholder="Enter comment content"
                                                rows="5"
                                            ></textarea>
                                            <button onClick={handleSaveComment}>Save</button>
                                            <button onClick={() => setShowAddCommentModal(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h3>Comments:</h3>
                            <div className="comments">
                                {postComments ? (
                                    postComments.map((comment) => (
                                        <Comment
                                            key={comment.id}
                                            id={comment.id}
                                            email={comment.email}
                                            name={comment.name}
                                            body={comment.body}
                                            setPostComments={setPostComments}
                                        />
                                    ))
                                ) : (
                                    <h2>Loading comments...</h2>
                                )}
                            </div>
                            <button onClick={handleCloseComments}>Close Comments</button>
                        </div>
                    )}
                </div>
            )}

        </>
    );
}

export default Post;
