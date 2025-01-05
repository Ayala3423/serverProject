import { useState, useRef } from 'react';
import './Comment.css';
import { deleteRequest, updateRequest } from '../../ServerRequests';

function Comment({ id, email, name, body, setPostComments }) {
    const [idEditing, setIdEditing] = useState(null);
    const inputRefs = useRef({});

    // פונקציה לבדיקה אם המשתמש מורשה לפעולה
    const checkAuthorization = () => {
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser')).email;
        if (email === currentUserEmail) {
            return true;
        } else {
            alert('You are not authorized to perform this action!');
            return false;
        }
    };

    const handleDelete = () => {
        if (checkAuthorization()) {
            (async () => {
                try {
                    await deleteRequest('comments', id);
                    setPostComments((prev) => prev.filter((item) => item.id !== id));
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
            alert('Title and Body cannot be empty');
            return;
        }
        (async () => {
            try {
                await updateRequest('comments', id, { name: updatedTitle, body: updatedBody });
                setPostComments(prev =>
                    prev.map((postComment) =>
                        postComment.id === id ? { ...postComment, name: updatedTitle, body: updatedBody } : postComment
                    )
                );
                setIdEditing(null);
            } catch (error) {
                console.log(error);
            }
        })()
    };

    const handleEditClick = () => {
        if (checkAuthorization()) {
            setIdEditing(id);
        }
    };

    return (
        <>
            <h3>Id: {id}</h3>
            <p>Email: {email}</p>
            {idEditing === id && (email === JSON.parse(localStorage.getItem('currentUser')).email) ? (
                <>
                    <input ref={(el) => (inputRefs.current.title = el)} type="text" defaultValue={name} />
                    <textarea ref={(el) => (inputRefs.current.body = el)} defaultValue={body} />
                </>
            ) : (
                <>
                    <p>Title: {name}</p>
                    <p>Body: {body}</p>
                </>
            )}
            {idEditing === id && (email === JSON.parse(localStorage.getItem('currentUser')).email) ? (
                <button onClick={handleEdit}>Save</button>
            ) : (
                <button onClick={handleEditClick}>Edit</button>
            )}
            <button onClick={handleDelete}>Delete</button>
        </>
    );
}

export default Comment;
