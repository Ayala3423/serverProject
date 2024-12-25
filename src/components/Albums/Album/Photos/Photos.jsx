import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Photos.css";

function Photos() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  return (
    <div className="photos-container">
      <div className="photos-header">
        <h1 className="AlbumTitle">Album {albumId}</h1>
        <h2>Photos</h2>
      </div>
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>

      {loading ? <p>טוען...</p> : hasMore ? (
        <button onClick={loadPhotos} className="load-more">
          טען עוד
        </button>
      ) : <p>No More Photos</p>}
    </div>
  );
}

export default Photos;
