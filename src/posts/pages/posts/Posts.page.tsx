import React, { useEffect, useState } from 'react';

import './Posts.scss';
import Post from '../../components/Post/Post.component';

const Posts = () => {
  // Posts state
  const [posts, setPosts]: any[] = useState([]);

  useEffect(() => {
    // Code to run on component mount
    // Set state after fetch success
    fetchPosts().then(data => {
      if (data) {
        setPosts([...data.response.posts]);
      }
    });
  }, []);

  // Fetch tumblr posts
  const fetchPosts = async () => {
    let url =
      process.env.REACT_APP_API_URL +
      '/posts?api_key=' +
      process.env.REACT_APP_API_KEY;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  // Components array
  const postElements: any[] = [];

  // Push posts to components array
  for (let post of posts) {
    postElements.push(<Post key={post.id} post={post} />);
  }

  return <section className='posts'>{postElements}</section>;
};

export default Posts;
