import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './posts.scss';
import Post from '../../components/Post/Post.component';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';
import { wait } from '../../utils/posts.utils';

const Posts = (): ReactElement => {
  const { postId, tag } = useParams<{
    postId: string;
    tag: string;
  }>();

  // Posts state
  const [postElements, setPostElements] = useState<ReactNode[]>([]);

  // Posts store state
  const [
    loading,
    offset,
    posts,
    total,
    setLoading,
    setPosts,
    addPosts
  ] = usePostsStore((state: PostsState) => [
    state.loading,
    state.offset,
    state.posts,
    state.total,
    state.setLoading,
    state.setPosts,
    state.addPosts
  ]);

  /**
   * Set posts on component mount
   */
  useEffect(() => {
    setPosts(offset, postId, tag);
    // eslint-disable-next-line
  }, []);

  /**
   * Set post elements on posts change.
   */
  useEffect(() => {
    const setElements = async () => {
      const elements: JSX.Element[] = [];
      // Check if posts were added
      if (posts.length > postElements.length) {
        const startIndex =
          postElements.length - (postElements.length - postElements.length);
        for (let i = startIndex; i < posts.length; i++) {
          await wait(100);
          // console.log(i);
          elements.push(<Post key={posts[i].id} post={posts[i]} />);
          setPostElements(postElements.concat(elements));
          // Set loading to false after last element is rendered
          if (i === posts.length - 1) {
            setLoading(false);
          }
        }
      }
    };
    setElements();
    // eslint-disable-next-line
  }, [posts]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = () => {
    setLoading(true);
    addPosts(offset + 20, tag);
  };

  return (
    <section className='posts'>
      {postElements}
      {!loading && posts.length < total && (
        <div onClick={onAddPosts} className='posts-more'>
          more
        </div>
      )}
    </section>
  );
};

export default Posts;
