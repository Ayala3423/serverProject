import { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import { deleteRequest, getRequest, updateRequest, deleteAllRequest } from '../../../ServerRequests'
import './Album.css';
import { triggerError } from "../../DisplayError/DisplayError";

function Album({ albumId, title, setAlbums, albums }) {
    const { userId } = useParams();
    const [idEditing, setIdEditing] = useState(null);
    const titleRef = useRef();

    const handleDelete = () => {
        (async () => {
            try {
                await deleteRequest('albums', albumId);
                setAlbums((prev) => prev.filter((item) => item.id !== albumId));
                const data = await getRequest('photos', 'albumId', albumId);
                await deleteAllRequest('photos', data);
            } catch (error) {
                console.log(error);
            }
        })();
    };

    const handleEdit = () => {
        const updatedTitle = titleRef.current?.value.trim();
        if (!updatedTitle) {
            triggerError("This is an error message");
            return;
        }
        (async () => {
            try {
                await updateRequest('albums', albumId, { title: updatedTitle });
                setAlbums(
                    albums.map((album) =>
                        album.id === albumId ? { ...album, title: updatedTitle } : album
                    )
                );
                setIdEditing(null);
            } catch (error) {
                console.log(error);
            }
        })();
    };

    return (
        <div className="album-item">
            <div className="album-header">
                <span className="album-id">Id: {albumId}</span>
                <div className="album-buttons">
                    {idEditing === albumId ? (
                        <button onClick={handleEdit}>Save</button>
                    ) : (
                        <button onClick={() => setIdEditing(albumId)}>Edit</button>
                    )}
                    <button onClick={handleDelete}>Delete</button>
                    <Link
                        to={`/users/${userId}/albums/${albumId}/photos`}
                        className='photosLink'
                        state={{ title }}>
                        More Details
                    </Link>
                </div>
            </div>
            <div className="album-title">
                {idEditing === albumId ? (
                    <input ref={titleRef} type="text" defaultValue={title} id='titleInputAlbum' />
                ) : (
                    <h2>{title}</h2>
                )}
            </div>
        </div>
    );
}

export default Album;