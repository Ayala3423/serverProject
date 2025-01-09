import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Photos.css";
import { deleteRequest, createRequest, updateRequest, slowLoadRequest } from '../../../../ServerRequests';
import { triggerError } from "../../../DisplayError/DisplayError";

function Photos() {
  const { albumId } = useParams();
  const location = useLocation();
  const albumTitle = location.state?.title || "No Title"; // ברירת מחדל אם אין נתונים
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const newPhotoRef = useRef({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState(null);

  const limit = 10;

  useEffect(() => {
    if (photos.length === 0) loadPhotos();
  }, [photos.length]);

  const loadPhotos = () => {
    setLoading(true);
    const start = (page - 1) * limit;
    (async () => {
      try {
        const data = await slowLoadRequest('photos', 'albumId', albumId, start, limit)
        setHasMore(data.length === limit);
        setPhotos((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleDelete = (idToDelete) => {
    (async () => {
      try {
        await deleteRequest('photos', idToDelete);
        setPhotos((prev) => prev.filter((item) => item.id !== idToDelete));
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleEdit = (photoToEdit) => {
    setPhotoToEdit(photoToEdit);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveEditPhoto = () => {
    const updatedLength = newPhotoRef.current.LengthPixel.value.trim();
    const updatedWidth = newPhotoRef.current.WidthPixel.value.trim();
    const updatedColor = newPhotoRef.current.Photocolor.value.trim().replace("#", ""); // מסירים את ה-#
    const updatedTitle = newPhotoRef.current.PhotoTitle.value.trim();

    if (updatedLength && updatedWidth && updatedColor && updatedTitle) {
      const updatedPhoto = {
        title: updatedTitle,
        url: `https://via.placeholder.com/${updatedWidth}x${updatedLength}/${updatedColor}`,
        thumbnailUrl: `https://via.placeholder.com/150/${updatedColor}`,
      };

      (async () => {
        try {
          await updateRequest('photos', photoToEdit.id, updatedPhoto);
          setPhotos(
            photos.map((photo) =>
              photo.id === photoToEdit.id
                ? { ...photo, ...updatedPhoto }
                : photo
            )
          );
          setPhotoToEdit(null);
          setShowModal(false);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      triggerError("All fields must be filled out!");
    }
  };

  const handleAddPhoto = () => {
    setShowModal(prev => !prev);
  };

  const handleSavePhoto = () => {
    const newPhotoLength = newPhotoRef.current.LengthPixel.value.trim();
    const newPhotoWidth = newPhotoRef.current.WidthPixel.value.trim();
    const newPhotoColor = newPhotoRef.current.Photocolor.value.trim().replace("#", ""); // מסירים את ה-# מהקוד
    const newPhotoTitle = newPhotoRef.current.PhotoTitle.value.trim();

    if (newPhotoLength && newPhotoWidth && newPhotoColor) {
      const newPhoto = {
        albumId: parseInt(albumId, 10),
        title: newPhotoTitle,
        url: `https://via.placeholder.com/${newPhotoWidth}x${newPhotoLength}/${newPhotoColor}`,
        thumbnailUrl: `https://via.placeholder.com/150/${newPhotoColor}`,
      };
      (async () => {
        try {
          const data = await createRequest('photos', newPhoto);
          setPhotos([...photos, { ...data, isVisible: true }]);
          setShowModal(false);
        } catch (error) {
          console.log(error);
        }
      })()
    } else {
      triggerError("All fields must be filled out!");
    }
  };

  return (
    <div className="photos-container">
      <div className="photos-header">
        <h2 className="AlbumNumber">Album {albumId}</h2>
        <h2>Title: {albumTitle}</h2>
        <h2>Photos</h2>
        <div className="button-group">
          <button onClick={handleAddPhoto}>Add</button>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <label htmlFor="Photo-Title">Photo Title</label>
                <input
                  type="text"
                  id="Photo-Title"
                  ref={(el) => (newPhotoRef.current["PhotoTitle"] = el)}
                  defaultValue={isEditing ? photoToEdit.title : null}
                />
                <label htmlFor="Photo-Length-Pixel">Photo Length Pixel</label>
                <input
                  type="number"
                  id="Length-Pixel"
                  ref={(el) => (newPhotoRef.current["LengthPixel"] = el)}
                  defaultValue={isEditing ? photoToEdit.url.split("/")[3].split("x")[0] : null}
                />
                <label htmlFor="Photo-Width-Pixel">Photo Width Pixel</label>
                <input
                  type="number"
                  id="Width-Pixel"
                  ref={(el) => (newPhotoRef.current["WidthPixel"] = el)}
                  defaultValue={isEditing ? (photoToEdit.url.split("/")[3].split("x")[1] ? photoToEdit.url.split("/")[3].split("x")[1] : photoToEdit.url.split("/")[3].split("x")[0]) : null}
                />
                <label htmlFor="Photo-Color">Photo Color</label>
                <input
                  type="color"
                  id="Photo-color"
                  ref={(el) => (newPhotoRef.current["Photocolor"] = el)}
                  defaultValue={
                    isEditing
                      ? `#${photoToEdit.url.split("/")[4]}` // מוסיף את ה-#
                      : "#000000" // צבע ברירת מחדל
                  }
                />
                <button onClick={photoToEdit ? handleSaveEditPhoto : handleSavePhoto}>
                  {photoToEdit ? "Update" : "Save"}
                </button>
                <button onClick={() => {
                  setIsEditing(false);
                  setShowModal(false)
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <h3>Title: {photo.title}</h3>
            <button onClick={() => handleDelete(photo.id)}>Delete</button>
            <button onClick={() => handleEdit(photo)}>Edit</button>
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