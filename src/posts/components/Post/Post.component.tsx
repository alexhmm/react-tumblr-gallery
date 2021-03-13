import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import useDimensions from '../../../shared/hooks/useDimensions.hook';

import { Post as PostType } from '../../models/post.interface';
import { setPostSourceGallery } from '../../utils/posts.utils';

import './Post.scss';

const Post = (props: { post: PostType }): ReactElement => {
  const dimensions = useDimensions();

  // Post element reference
  const postEl = useRef<HTMLDivElement>(null);

  // Component state
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState<boolean>(false);

  // Effects on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
  }, []);

  /**
   * Reset post source on resize.
   */
  useEffect(() => {
    const img = setPostSourceGallery(
      imgWidth,
      props?.post?.photos[0]?.alt_sizes
    );
    setImgSrc(img.imgSrc);
    setImgWidth(img.imgWidth);
    // eslint-disable-next-line
  }, [dimensions]);

  // Set opacity on mounted state
  useEffect(() => {
    if (imgSrc && imgWidth && mounted && postEl.current) {
      postEl.current.style.opacity = '1';
    }
  }, [imgSrc, imgWidth, mounted]);

  return (
    <article ref={postEl} className='post'>
      <Link to={'/post/' + props.post.id_string} className='post-container'>
        {/* <div className='post-title'>{props?.post?.summary}</div> */}
        <img
          alt={props?.post?.caption}
          src={imgSrc}
          className='post-container-src'
        />
      </Link>
    </article>
  );
};

export default Post;
