import { useState, useRef, useContext } from 'react';
import './Post.css';
import Comment from '../Comment/Comment.jsx';
import { getRequest, deleteRequest, updateRequest, deleteAllRequest, createRequest } from '../../ServerRequests.jsx'
import { UserContext } from '../../App';
import { triggerError } from "../DisplayError/DisplayError";

function Post({ userId, postId, title, body, setPosts, posts }) {
    const { currentUser, setAuthorized } = useContext(UserContext);
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
    const checkAuthorization = () => {
        if (currentUser &&userId === JSON.parse(currentUser.id)) {
            return true;
        } else {
            setAuthorized(false)
            return false;
        }
    };

    const handleDelete = () => {
        if (checkAuthorization()) {
            (async () => {
                try {
                    await deleteRequest('posts', postId);
                    setPosts((prev) => prev.filter((item) => item.id !== postId));
                    const data = await getRequest('comments', 'postId', postId);
                    await deleteAllRequest('comments', data);
                    setPostComments(data)
                } catch (error) {
                    console.log(error);
                }
            })()
        }
    };

    const handleEdit = () => {
        const updatedTitle = inputRefs.current.title?.value.trim();
        const updatedBody = inputRefs.current.body?.value.trim();
        if (!updatedTitle || !updatedBody) {
            triggerError('Title and Body cannot be empty');
            return;
        }
        (async () => {
            try {
                await updateRequest('posts', postId, { title: updatedTitle, body: updatedBody });
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? { ...post, title: updatedTitle, body: updatedBody }
                            : post
                    )
                );
                setIdEditing(null);
            } catch (error) {
                console.log(error);
            }
        })();
    };

    const handleEditClick = () => {
        if (checkAuthorization()) {
            setIdEditing(postId);
        }
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
                email: currentUser.email,
                body: newCommentBody,
            };
            (async () => {
                try {
                    const data = await createRequest('comments', newComment);
                    setPostComments([...postComments, { ...data, isVisible: true }]);
                    setShowAddCommentModal(false); // סגירת ה-Modal
                } catch (error) {
                    console.log(error);
                }
            })()
        }
        else {
            triggerError("All fields must be filled out!")
        }
    };

    return (
        <div id='post'>
            <div className="post-ids">
                <span>Posted By: {userId}</span>
                <span>Id: {postId}</span>
            </div>
            <h3 id='postTitle'>{title}</h3>
            <button id="moreDetailsBtn" onClick={handleShowDetails}>More Details</button>

            {showDetails && (
                <div className="details-modal">
                    <div className="modal-content">
                        <h2>Post Details</h2>
                        <p><strong>Posted By:</strong> {userId}</p>
                        <p><strong>Id:</strong> {postId}</p>

                        {idEditing === postId ? (
                            <>
                                <input ref={(el) => (inputRefs.current.title = el)} type="text" defaultValue={title} id='titleInputPost' />
                                <textarea ref={(el) => (inputRefs.current.body = el)} defaultValue={body} id='bodyInputPost' />
                            </>
                        ) : (
                            <>
                                <h3>{title}</h3>
                                <p>{body}</p>
                            </>
                        )}

                        {idEditing === postId ? (
                            <button onClick={handleEdit}>Save</button>
                        ) : (
                            <button onClick={handleEditClick}>Edit</button>
                        )}
                        <button onClick={handleDelete}>Delete Post</button>
                        <button onClick={handleShowComments}>Comments</button>
                        <button onClick={handleCloseDetails}>Close</button>
                    </div>

                    {showComments && (
                        <div className="comments-modal-content">
                            <div className="button-group">
                                <button onClick={handleCloseComments}>Close Comments</button>
                                {currentUser && <button onClick={handleAddComment}>Add</button>}
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
                            <div className="comments">
                                <h3>Comments:</h3>
                                {postComments ? (
                                    postComments.map((comment) => (
                                        <div id="comment">
                                            <Comment
                                                key={comment.id}
                                                id={comment.id}
                                                postUserId={userId}
                                                email={comment.email}
                                                name={comment.name}
                                                body={comment.body}
                                                setPostComments={setPostComments}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <h2>Loading comments...</h2>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default Post;
