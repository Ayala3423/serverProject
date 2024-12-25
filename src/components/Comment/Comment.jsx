import { useState, useRef } from 'react';
import './Comment.css';

function Comment({ id, email, name, body, setPostComments }) {
    const [idEditing, setIdEditing] = useState(null);
    const titleRef = useRef();

    const handleDelete = () => {
        if (email == JSON.parse(localStorage.getItem('currentUser')).email) {
            fetch(`http://localhost:3000/comments/${id}`, {
                method: 'DELETE',
            }).then(() => {
                setPostComments((prev) => prev.filter((item) => item.id !== id));
            });
        }
        else {
            alert('You Didnt Write This Comment!')
        }
    };

    const handleEdit = (idToEdit) => {
        const updatedTitle = titleRef.current?.value.trim();
        if (!updatedTitle) {
            alert('Title cannot be empty');
            return;
        }

        fetch(`http://localhost:3000/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: updatedTitle }),
        }).then(() => {
            setPostComments(
                posts.map((post) =>
                    post.id === idToEdit ? { ...post, title: updatedTitle } : post
                )
            );
            setIdEditing(null);
        });
    };

    return (
        <>
            <h2>Id: {id}</h2>
            {idEditing === id ? (
                <input ref={titleRef} type="text" defaultValue={name} />
            ) : (
                <>
                <h2>Email: {email}</h2>
                <h2>Title: {name}</h2>
                <h2>Body: {body}</h2>
                </>

            )}
            {idEditing === id ? (
                <button onClick={() => handleEdit(id)}>Save</button>
            ) : (
                <button onClick={() => setIdEditing(id)}>Edit</button>
            )}
            <button onClick={() => handleDelete(id)}>Delete</button>
        </>
    );
}

export default Comment;
