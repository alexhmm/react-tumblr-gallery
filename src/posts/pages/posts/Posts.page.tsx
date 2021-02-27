import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './posts.scss';
import { getPosts } from './posts.utils';
import Post from '../../components/Post/Post.component';
import { Post as PostType } from '../../models/post.interface';

const Posts = (): ReactElement => {
  const { pageNumber, postId, tag } = useParams<{
    pageNumber: string;
    postId: string;
    tag: string;
  }>();

  // Posts state
  const [posts, setPosts] = useState<PostType[]>([]);

  // Code to run on component mount
  useEffect(() => {
    // Set state after fetch success
    getPosts(pageNumber, postId, tag).then(data => {
      if (data && data.response && data.response.posts) {
        setPosts([...data.response.posts]);
      }
    });
  }, [pageNumber, postId, tag]);

  // Components array
  const postElements: ReactNode[] = [];

  // Push posts to components array
  for (let post of posts) {
    postElements.push(<Post key={post.id} post={post} />);
  }

  return <section className='posts'>{postElements}</section>;
};

export default Posts;
