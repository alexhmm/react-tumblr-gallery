import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './posts.scss';
import Post from '../../components/Post/Post.component';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';

const Posts = (): ReactElement => {
  const { postId, tag } = useParams<{
    postId: string;
    tag: string;
  }>();

  // Posts state
  const [postElements, setPostElements] = useState<ReactNode[]>([]);

  // Posts store state
  const [
    offset,
    posts,
    setPosts,
    addPosts
  ] = usePostsStore((state: PostsState) => [
    state.offset,
    state.posts,
    state.setPosts,
    state.addPosts
  ]);

  /**
   * Set posts on component mount
   */
  useEffect(() => {
    setPosts(offset, postId, tag);
  }, []);

  /**
   * Set post elements on posts change.
   */
  useEffect(() => {
    const elements: JSX.Element[] = [];
    // Check if posts were added
    if (posts.length > postElements.length) {
      const startIndex =
        postElements.length - (postElements.length - postElements.length);
      for (let i = startIndex; i < posts.length; i++) {
        elements.push(<Post key={posts[i].id} post={posts[i]} />);
      }
      setPostElements(postElements.concat(elements));
    }
  }, [posts]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = () => {
    addPosts(offset + 20, tag);
  };

  return (
    <section className='posts'>
      {postElements}
      <div onClick={onAddPosts}>more</div>
    </section>
  );
};

export default Posts;
