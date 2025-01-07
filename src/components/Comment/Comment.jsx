import { useState, useRef, useContext } from 'react';
import './Comment.css';
import { useParams } from 'react-router-dom';
import { deleteRequest, updateRequest } from '../../ServerRequests';
import { UserContext } from '../../App';


function Comment({ id, email, name, body, setPostComments }) {
    const { currentUser } = useContext(UserContext);
    const [idEditing, setIdEditing] = useState(null);
    const inputRefs = useRef({});

    // פונקציה לבדיקה אם המשתמש מורשה לפעולה
    const checkAuthorization = () => {
        if (currentUser &&email === currentUser.email) {
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
            {idEditing === id && (email === currentUser.email) ? (
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
            {idEditing === id && (email === currentUser.email) ? (
                <button onClick={handleEdit}>Save</button>
            ) : (
                <button onClick={handleEditClick}>Edit</button>
            )}
            <button onClick={handleDelete}>Delete</button>
        </>
    );
}

export default Comment;
