import { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import './Album.css';

function Album({ albumId, title, setAlbums, albums }) {
    const { userId } = useParams();
    const [idEditing, setIdEditing] = useState(null);
    const titleRef = useRef();

    const handleDelete = (idToDelete) => {
        fetch(`http://localhost:3000/albums/${idToDelete}`, {
            method: 'DELETE',
        }).then(() => {
            setAlbums((prev) => prev.filter((item) => item.id !== idToDelete));
        });
    };

    const handleEdit = (idToEdit) => {
        const updatedTitle = titleRef.current?.value.trim();
        if (!updatedTitle) {
            alert('Title cannot be empty');
            return;
        }

        fetch(`http://localhost:3000/albums/${idToEdit}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: updatedTitle }),
        }).then(() => {
            setAlbums(
                albums.map((album) =>
                    album.id === idToEdit ? { ...album, title: updatedTitle } : album
                )
            );
            setIdEditing(null);
        });
    };

    return (
        <div className="album-item">
            <div className="album-header">
                <span className="album-id">Id: {albumId}</span>
                <div className="album-buttons">
                    {idEditing === albumId ? (
                        <button onClick={() => handleEdit(albumId)}>Save</button>
                    ) : (
                        <button onClick={() => setIdEditing(albumId)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(albumId)}>Delete</button>
                    <button onClick={() => handleDelete(albumId)}>Delete</button>
                    <Link to={`/home/users/${userId}/albums/${albumId}/photos`} className='photosLink'>More Details</Link>
                </div>
            </div>
            <div className="album-title">
                {idEditing === albumId ? (
                    <input ref={titleRef} type="text" defaultValue={title} />
                ) : (
                    <h2>{title}</h2>
                )}
            </div>

        </div>
    );
}

export default Album;
