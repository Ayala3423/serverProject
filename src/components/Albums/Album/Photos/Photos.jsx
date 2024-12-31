import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Photos.css";

function Photos() {
  const [idEditing, setIdEditing] = useState(null);
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const newPhotoRef = useRef({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const titleRef = useRef();
  const limit = 10;

  const loadPhotos = () => {
    setLoading(true);
    const start = (page - 1) * limit;

    fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${start}&_limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setHasMore(data.length === limit);
        setPhotos((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (photos.length === 0) loadPhotos();
  }, [photos.length]);

  const handleDelete = (idToDelete) => {
    fetch(`http://localhost:3000/photos/${idToDelete}`, {
      method: 'DELETE',
    }).then(() => {
      setPhotos((prev) => prev.filter((item) => item.id !== idToDelete));
    });
  };

  const handleEdit = (idToEdit) => {
    const updatedTitle = titleRef.current?.value.trim();
    if (!updatedTitle) {
      alert('Title cannot be empty');
      return;
    }

    fetch(`http://localhost:3000/photos/${idToEdit}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle }),
    }).then(() => {
      setPhotos(
        photos.map((photo) =>
          photo.id === idToEdit ? { ...photo, title: updatedTitle } : photo
        )
      );
      setIdEditing(null);
    });
  };
  const handleAddAlbum = () => {
    setShowModal(prev => !prev);
  };

  const handleSavePhoto = () => {
    const newPhotoLength = newPhotoRef.current.LengthPixel.value.trim();
    const newPhotoWidth = newPhotoRef.current.WidthPixel.value.trim();
    const newPhotoColor = newPhotoRef.current.Photocolor.value.trim();
    const newPhotoTitle = newPhotoRef.current.PhotoTitle.value.trim();
    const newId = photos.length ? JSON.stringify(JSON.parse(photos[photos.length - 1].id) + 1) : "1";
    if (newPhotoLength && newPhotoWidth && newPhotoColor) {
      const newPhoto = {
        userId: parseInt(userId, 10),
        id: newId, // לדוגמה, יצירת ID חדש
        title: newPhotoTitle
      };

      fetch('http://localhost:3000/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      }).then(() => {
        setPhotos([...photos, { ...newPhoto, isVisible: true }]);
        setShowModal(false); // סגירת ה-Modal
      });
    }
  };
  return (
    <div className="photos-container">
      <div className="photos-header">
        <h1 className="AlbumTitle">Album {albumId}</h1>
        <h2>Photos</h2>
        <div className="button-group">
          <button onClick={handleAddAlbum}>Add</button>
          {showModal && (
            <div>
              <label htmlFor="Photo-Title">Photo Title</label>
              <input
                type="text"
                id="Photo-Title"
                ref={(el) => (newPhotoRef.current["PhotoTitle"] = el)}
                placeholder="Enter Photo Title"
              />
              <label htmlFor="Photo-Length-Pixel">Photo Length Pixel</label>
              <input
                type="number"
                id="Length-Pixel"
                ref={(el) => (newPhotoRef.current["LengthPixel"] = el)}
                placeholder="Enter Photo Length Pixel"
              />
              <label htmlFor="Photo-Width-Pixel">Photo Width Pixel</label>
              <input
                type="number"
                id="Width-Pixel"
                ref={(el) => (newPhotoRef.current["WidthPixel"] = el)}
                placeholder="Enter Photo Width Pixel"
              />
              <label htmlFor="Photo-Width-Pixel">Photo Color</label>
              <input
                type="color"
                id="Photo-color"
                ref={(el) => (newPhotoRef.current["Photocolor"] = el)}
                placeholder="Enter Photo Color"
              />

              <button onClick={handleSavePhoto}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            {idEditing === photo.id ? (
              <input ref={titleRef} type="text" defaultValue={photo.title} />
            ) : (
              <h2>Title: {photo.title}</h2>
            )}
            <button onClick={() => handleDelete(photo.id)}>Delete</button>
            {idEditing === photo.id ? (
              <button onClick={() => handleEdit(photo.id)}>Save</button>
            ) : (
              <button onClick={() => setIdEditing(photo.id)}>Edit</button>
            )}
            <img src={photo.thumbnailUrl} alt={photo.title} />
          </div>
        ))}
      </div>

      {loading ? <p>Load...</p> : hasMore ? (
        <button onClick={loadPhotos} className="load-more">
          Load More
        </button>
      ) : <p>No More Photos</p>}
    </div>
  );
}

export default Photos;
