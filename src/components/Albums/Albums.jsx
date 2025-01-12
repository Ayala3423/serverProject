import { useState, useEffect, useRef } from 'react'
import './Albums.css'
import Album from './Album/Album.jsx'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { getRequest, createRequest } from '../../ServerRequests.jsx';
import { triggerError } from "../DisplayError/DisplayError";

function Albums() {
  const { userId } = useParams();
  const [albums, setAlbums] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newAlbumRef = useRef({});
  const [showFilterBar, setShowFilterBar] = useState(false);
  const filtersRef = useRef({ search: '', id: '', title: '' });

  useEffect(() => {
    (async () => {
      try {
        const data = await getRequest('albums', 'userId', userId);
        setAlbums(data.map(item => ({
          ...item,          // שומר את כל השדות הקיימים באובייקט
          isVisible: true    // הוספת השדה החדש
        })));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [userId])

  const handleSearch = () => {
    const { search, id, title } = filtersRef.current;
    setAlbums((prev) =>
      prev.map((comp) => ({
        ...comp,
        isVisible:
          (!search || comp.title.toLowerCase().includes(search)) &&
          (!id || comp.id.toString().includes(id)) &&
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
    if (newAlbumTitle) {
      const newAlbum = {
        userId: parseInt(userId, 10),
        title: newAlbumTitle
      };
      (async () => {
        try {
          const data = await createRequest('albums', newAlbum);
          setAlbums([...albums, { ...data, isVisible: true }]);
          setShowModal(false);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    else {
      triggerError("All fields must be filled out!")
    }
  };

  return (
    <div className='allAlbums'>
      <h1 id='albumsTitle'>Albums</h1>
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
            <button onClick={() => setShowFilterBar(true)}>Filters</button>
          </div>
          {showFilterBar && (
            <div className="search-bar">
              <input type="text" placeholder="Filter by ID" onChange={(e) => updateFilter('id', e.target.value)} />
              <button onClick={() => setShowFilterBar(false)}>Close</button>
            </div>
          )}
        </div>
      </div>

      <div className="albums">
        {albums && albums.length > 0 && 
          albums.filter((album) => album.isVisible).length > 0 ? (
            albums.filter((album) => album.isVisible).map((album) => (
              <div key={album.id} className="album">
                <Album albumId={album.id} title={album.title} setAlbums={setAlbums} albums={albums} />
              </div>
            ))
          ) : (
            <h2>No albums found.</h2>
          )}
      </div>
    </div>
  )
}

export default Albums