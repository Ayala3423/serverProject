import { useState, useRef, useContext } from 'react';
import './Comment.css';
import { deleteRequest, updateRequest } from '../../ServerRequests';
import { UserContext } from '../../App';
import { triggerError } from "../DisplayError/DisplayError";

function Comment({ id, postUserId, email, name, body, setPostComments }) {
    const { currentUser, setAuthorized } = useContext(UserContext);
    const [idEditing, setIdEditing] = useState(null);
    const inputRefs = useRef({});

    const checkAuthorization = () => {
        if (currentUser && (email === currentUser.email || postUserId == currentUser.id)) {
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
                    await deleteRequest('comments', id);
                    setPostComments((prev) => prev.filter((item) => item.id !== id));
                } catch (error) {
                    triggerError(error);
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
                await updateRequest('comments', id, { name: updatedTitle, body: updatedBody });
                setPostComments(prev =>
                    prev.map((postComment) =>
                        postComment.id === id ? { ...postComment, name: updatedTitle, body: updatedBody } : postComment
                    )
                );
                setIdEditing(null);
            } catch (error) {
                triggerError(error);
            }
        })()
    };

    const handleEditClick = () => {
        if (checkAuthorization() && email === currentUser.email) {
            setIdEditing(id);
        }
        else {
            setAuthorized(false)
        }
    };

    return (
        <>
            <p>Id: {id}</p>
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