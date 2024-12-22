import { useState, useRef, useContext } from 'react';
import './Album.css';
import { AlbumsContext } from '../Albums.jsx'; // ייבוא הקשר

function Album({ id, title }) {
    const [idEditing, setIdEditing] = useState(null);
    const [showDetails, setShowDetails] = useState(false); // סטייט לפתיחת חלון
    const titleRef = useRef();
    const { albums, setAlbums } = useContext(AlbumsContext); // שימוש ב-context

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
                        <h2>Album Details</h2>
                        <p><strong>Id:</strong> {id}</p>
                        <p><strong>Title:</strong> {title}</p>
                        <button onClick={handleCloseDetails}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Album;
