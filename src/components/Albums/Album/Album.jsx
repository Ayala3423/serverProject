import { useState, useRef, useContext } from 'react';
import './Album.css';
import { AlbumsContext } from '../Albums.jsx';

function Album({ id, title }) {
    const [idEditing, setIdEditing] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const titleRef = useRef();
    const { albums, setAlbums } = useContext(AlbumsContext);

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
        <div className="album-item">
            <div className="album-header">
                <span className="album-id">Id: {id}</span>
                <div className="album-buttons">
                    {idEditing === id ? (
                        <button onClick={() => handleEdit(id)}>Save</button>
                    ) : (
                        <button onClick={() => setIdEditing(id)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(id)}>Delete</button>
                    <button onClick={handleShowDetails}>More Details</button>
                </div>
            </div>
            <div className="album-title">
                {idEditing === id ? (
                    <input ref={titleRef} type="text" defaultValue={title} />
                ) : (
                    <h2>{title}</h2>
                )}
            </div>
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
        </div>
    );
}

export default Album;
