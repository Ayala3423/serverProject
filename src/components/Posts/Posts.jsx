import { useState, useEffect, createContext } from 'react'
import './Posts.css'
import Post from './Post/Post.jsx'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

export const PostsContext = createContext(null)

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
      <PostsContext.Provider value={{ posts, setPosts }}>
        <h1>Posts</h1>
        <div className='posts'>
          {posts ? (posts.map((post) => {
            return (
              <>
                <div key={post.id} className='post'>
                  <Post id={post.id} title={post.title} body={post.body} />
                </div>
              </>);
          })) : <h2>loading...</h2>}
        </div>
      </PostsContext.Provider>
    </>
  )
}

export default Posts
