import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';

// Styles
import './posts-tag.scss';

const PostsTag = () => {
  // Posts store state
  const [tag] = usePostsStore((state: PostsState) => [state.tag]);

  // Component state
  const [mounted, setMounted] = useState<boolean>(false);

  // Component element reference
  const postsTagElem = useRef<HTMLDivElement>(null);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
    // eslint-disable-next-line
  }, []);

  // Effect on mounted and tag state change
  useEffect(() => {
    if (mounted && tag && postsTagElem.current) {
      postsTagElem.current.style.opacity = '1';
    }
  }, [mounted, tag]);

  return (
    <div ref={postsTagElem} className='posts-tag-container'>
      <span>#{tag}</span>
      <Link to='/'>
        <div className='posts-tag-container-button'>
          <div className='posts-tag-container-button-line-1'></div>
          <div className='posts-tag-container-button-line-2'></div>
        </div>
      </Link>
    </div>
  );
};

export default PostsTag;
