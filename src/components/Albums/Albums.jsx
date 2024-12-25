import { useState, useEffect } from 'react'
import './Albums.css'
import Album from './Album/Album.jsx'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";


function Albums() {
  const { userId } = useParams();
  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/albums/?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setAlbums(data))

  }, [])

  return (
    <>
        <h1>Albums</h1>
        <div className='albums'>
          {albums ? (albums.map((album) => {
            return (
              <div key={album.id} className='album'>
                <Album id={album.id} title={album.title} />

              </div>);
          })) : <h2>loading...</h2>}
        </div>
    </>
  )
}

export default Albums
