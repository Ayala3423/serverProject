import { useState, useEffect } from 'react'
import './Photos.css'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

function Albums() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/albums/?albumId=${albumId}`)
      .then((response) => response.json())
      .then((data) => setPhotos(data))

  }, [])

  return (
    <>
      <h1>photos</h1>
      
    </>
  )
}

export default Albums
