import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post as PostType } from '../../models/post.interface';

import './Post.scss';

const Post = (props: { post: PostType }): ReactElement => {
  // Post element reference
  const postEl = useRef<HTMLDivElement>(null);

  // Component state
  const [mounted, setMounted] = useState<boolean>(false);

  // Effects on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
  }, []);

  // Set opacity on mounted state
  useEffect(() => {
    if (mounted && postEl.current) {
      postEl.current.style.opacity = '1';
    }
  }, [mounted]);

  return (
    <article ref={postEl} className='post'>
      <Link to={'/post/' + props.post.id_string} className='post-container'>
        {/* <div className='post-title'>{props?.post?.summary}</div> */}
        <img
          alt={props?.post?.caption}
          src={props?.post?.photos[0]?.original_size.url}
          className='post-container-src'
        />
      </Link>
    </article>
  );
};

export default Post;
