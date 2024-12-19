import { useState, useEffect } from 'react'
import './Posts.css'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

function Posts() {
  const { userId } = useParams();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/posts/?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))

  }, [])

  return (
    <>
      <h1>posts</h1>
      <div className='posts'>
        {posts ? (posts.map((post) => {
          return (<div key={post.id} className='post'>
            <h2>Id: {post.id}</h2>
            <h2>Title: {post.title}</h2>
          </div>);
        })) : <h2>loading...</h2>}
      </div>
    </>
  )
}

export default Posts
