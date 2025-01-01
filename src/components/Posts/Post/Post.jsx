// import { useState, useRef } from 'react';
// import './Post.css';
// import Comment from '../../Comment/Comment.jsx';

// function Post({ UserId, id, title, body, setPosts, posts }) {
//     const [idEditing, setIdEditing] = useState(null); // סטייט שמנהל את מצב העריכה
//     const [showDetails, setShowDetails] = useState(false);
//     const [showComments, setShowComments] = useState(false);
//     const [postComments, setPostComments] = useState(null);

//     // אובייקט ref שמחזיק את ההפניות לכותרת ולגוף
//     const inputRefs = useRef({
//         title: null,
//         body: null,
//     });

//     const handleDelete = (idToDelete) => {
//         fetch(`http://localhost:3000/posts/${idToDelete}`, {
//             method: 'DELETE',
//         }).then(() => {
//             setPosts((prev) => prev.filter((item) => item.id !== idToDelete));
//         });
//     };

//     const handleEdit = (idToEdit) => {
//         const updatedTitle = inputRefs.current.title?.value.trim();
//         const updatedBody = inputRefs.current.body?.value.trim();
//         if (!updatedTitle || !updatedBody) {
//             alert('Title and Body cannot be empty');
//             return;
//         }

//         fetch(`http://localhost:3000/posts/${idToEdit}`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
//         }).then(() => {
//             setPosts(
//                 posts.map((post) =>
//                     post.id === idToEdit
//                         ? { ...post, title: updatedTitle, body: updatedBody }
//                         : post
//                 )
//             );
//             setIdEditing(null); // יוצא ממצב עריכה אחרי השמירה
//         });
//     };

//     const handleShowDetails = () => {
//         setShowDetails(true);
//     };

//     const handleCloseDetails = () => {
//         setShowDetails(false);
//     };

//     const handleShowComments = (postId) => {
//         fetch(`http://localhost:3000/comments/?postId=${postId}`)
//             .then((response) => response.json())
//             .then((data) => setPostComments(data));
//         setShowComments(true);
//     };

//     return (
//         <>
//             <h2>Posted By: {UserId}</h2>
//             <h2>Id: {id}</h2>
//             <h2>Title: {title}</h2>
//             <button onClick={handleShowDetails}>More Details</button>

//             {showDetails && (
//                 <div className="details-modal">
//                     <div className="modal-content">
//                         <h2>Post Details</h2>

//                         <button onClick={() => handleDelete(id)}>Delete Post</button>
//                         <p><strong>Posted By:</strong> {UserId}</p>
//                         <p><strong>Id:</strong> {id}</p>

//                         {/* כותרת ו-body */}
//                         {idEditing === id ? (
//                             <>
//                                 <input ref={(el) => (inputRefs.current.title = el)} type="text" defaultValue={title} />
//                                 <textarea ref={(el) => (inputRefs.current.body = el)} defaultValue={body} />
//                             </>
//                         ) : (
//                             <>
//                                 <h2>Title: {title}</h2>
//                                 <p>Body: {body}</p>
//                             </>
//                         )}

//                         {/* כפתור שמירה/עריכה */}
//                         {idEditing === id ? (
//                             <button onClick={() => handleEdit(id)}>Save</button>
//                         ) : (
//                             <button onClick={() => setIdEditing(id)}>Edit</button>
//                         )}

//                         <div className="comments">
//                             {showComments && (
//                                 postComments ? (
//                                     postComments.map((comment) => (
//                                         <Comment id={comment.id} email={comment.email} name={comment.name} body={comment.body} setPostComments={setPostComments} />
//                                     ))
//                                 ) : (
//                                     <h2>No comments</h2>
//                                 )
//                             )}
//                         </div>

//                         <button onClick={() => handleShowComments(id)}>Comments</button>
//                         <button onClick={handleCloseDetails}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default Post;
import { useState, useRef } from 'react';
import './Post.css';
import Comment from '../../Comment/Comment.jsx';

function Post({ UserId, id, title, body, setPosts, posts }) {
    const [idEditing, setIdEditing] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [postComments, setPostComments] = useState(null);

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

    const handleShowComments = (postId) => {
        fetch(`http://localhost:3000/comments/?postId=${postId}`)
            .then((response) => response.json())
            .then((data) => setPostComments(data));
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    return (
        <>
            <h2>Posted By: {UserId}</h2>
            <h2>Id: {id}</h2>
            <h2>Title: {title}</h2>
            <button onClick={handleShowDetails}>More Details</button>

            {showDetails && (
                <div className="details-modal">
                    <div className="modal-content">
                        <h2>Post Details</h2>

                        <button onClick={() => handleDelete(id)}>Delete Post</button>
                        <p><strong>Posted By:</strong> {UserId}</p>
                        <p><strong>Id:</strong> {id}</p>

                        {idEditing === id ? (
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

                        {idEditing === id ? (
                            <button onClick={() => handleEdit(id)}>Save</button>
                        ) : (
                            <button onClick={() => setIdEditing(id)}>Edit</button>
                        )}

                        <button onClick={() => handleShowComments(id)}>Comments</button>
                        <button onClick={handleCloseDetails}>Close</button>
                    </div>

                    {/* חלונית התגובות */}
                    {showComments && (
                        <div className="comments-modal">
                            <div className="comments-modal-content">
                                <button onClick={handleAddComment}>Add Comment</button>
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
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Post;
