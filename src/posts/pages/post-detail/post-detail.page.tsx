import { ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import './post-detail.scss';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';

const PostDetail = (): ReactElement => {
  // Post element reference
  const postElem = useRef<HTMLDivElement>(null);

  const { postId } = useParams<{
    postId: string;
  }>();

  // Posts store state
  const [post, setPost] = usePostsStore((state: PostsState) => [
    state.post,
    state.setPost
  ]);

  // Component state
  const [mounted, setMounted] = useState<boolean>(false);

  /**
   * Set post on component mount
   */
  useEffect(() => {
    setPost(postId);
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
    // eslint-disable-next-line
  }, []);

  // Set opacity on mounted state
  useEffect(() => {
    if (mounted && postElem.current && post?.id_string === postId) {
      postElem.current.style.opacity = '1';
    }
    // eslint-disable-next-line
  }, [mounted, post]);

  return (
    <div ref={postElem} className='post-detail'>
      {post && post.id_string === postId && (
        <img
          src={post.photos[0].original_size.url}
          alt={post.photos[0].summary}
          className='post-detail-src'
        />
      )}
    </div>
  );
};

export default PostDetail;
