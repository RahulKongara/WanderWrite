import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('https://wanderwrite-backend.onrender.com/post').then(res => {
      res.json().then(posts => {
        setPosts(posts);
      });
    })
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
} 

export default Home