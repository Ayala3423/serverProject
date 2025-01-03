import { useState, useEffect, useRef } from 'react'
import './Albums.css'
import Album from './Album/Album.jsx'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { getRequest } from '../../serverRequests.jsx';

function Albums() {
  const { userId } = useParams();
  const [albums, setAlbums] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newAlbumRef = useRef({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filtersRef = useRef({ search: '', id: '', title: '' });

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const data = await getRequest('albums', 'userId', userId);
        setAlbums(data.map(item => ({
          ...item,          // שומר את כל השדות הקיימים באובייקט
          isVisible: true    // הוספת השדה החדש
        })));
      } catch (error) {
        console.log(error);
      }
    }
    getAlbums();
  }, [])

  const handleSearch = () => {
    const { search, id, title } = filtersRef.current;
    setAlbums((prev) =>
      prev.map((comp) => ({
        ...comp,
        isVisible:
          (!search || comp.title.toLowerCase().includes(search)) &&
          (!id || comp.id.toString() === id) &&
          (!title || comp.title.toLowerCase().includes(title))
      }))
    );
  };

  const updateFilter = (key, value) => {
    filtersRef.current[key] = value;
    handleSearch();
  };

  const handleAddAlbum = () => {
    setShowModal(prev => !prev);
  };

  const handleSaveAlbum = () => {
    const newAlbumTitle = newAlbumRef.current.title.value.trim();
    const newAlbumBody = newAlbumRef.current.body.value.trim();
    const newId = albums.length ? JSON.stringify(JSON.parse(albums[albums.length - 1].id) + 1) : "1";
    if (newAlbumTitle && newAlbumBody) {
      const newAlbum = {
        userId: parseInt(userId, 10),
        id: newId, // לדוגמה, יצירת ID חדש
        title: newAlbumTitle
      };

      fetch('http://localhost:3000/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlbum),
      }).then(() => {
        setAlbums([...albums, { ...newAlbum, isVisible: true }]);
        setShowModal(false); // סגירת ה-Modal
      });
    }
  };

  return (
    <>
      <h1>Albums</h1>
      
      <div className="button-group">

        <div className='addAlbum'>
          <button onClick={handleAddAlbum}>Add</button>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add NewAlbum</h2>
                <label htmlFor="Album-title">Album Title</label>
                <input
                  type="text"
                  id="Album-title"
                  ref={(el) => (newAlbumRef.current["title"] = el)}
                  placeholder="Enter Album title"
                />
                <button onClick={handleSaveAlbum}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className='searchAlbum'>
          <div className="search-bar">
            <input type="text" placeholder="Search..." onChange={(e) => updateFilter('search', e.target.value.toLowerCase())} />
            <button onClick={() => setShowFilterModal(true)}>Filters</button>
          </div>
          {showFilterModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Advanced Filters</h2>
                <input type="text" placeholder="Filter by ID" onChange={(e) => updateFilter('id', e.target.value)} />
                <input type="text" placeholder="Filter by Title" onChange={(e) => updateFilter('title', e.target.value.toLowerCase())} />
                <button onClick={() => setShowFilterModal(false)}>Close</button>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="albums">
        {albums && albums.length > 0 ? (
          albums.filter((album) => album.isVisible).length > 0 ? (
            albums.filter((album) => album.isVisible).map((album) => (
              <div key={album.id} className="album">
                <Album albumId={album.id} title={album.title} setAlbums={setAlbums} albums={albums} />
              </div>
            ))
          ) : (
            <h2>No tasks found.</h2>
          )
        ) : (
          <h2>Loading tasks...</h2>
        )}
      </div>

    </>
  )
}

export default Albums
