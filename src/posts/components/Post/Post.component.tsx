import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [tags, setTags] = useState<ReactNode[]>([]);

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

  // Set opacity on loaded & mounted state
  useEffect(() => {
    if (imgSrc && imgWidth && loaded && mounted && postEl.current) {
      postEl.current.style.opacity = '1';
    }
  }, [imgSrc, imgWidth, loaded, mounted]);

  /**
   * Set tags
   */
  useEffect(() => {
    // TODO: Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>.
    const tagElements: ReactNode[] = [];
    for (const tag of props?.post?.tags) {
      tagElements.push(
        <Link
          key={tag}
          to={'/tagged/' + tag}
          className='post-container-caption-content-tag'
        >
          {'#' + tag}
        </Link>
      );
    }
    setTags(tagElements);
  }, [props.post, setTags]);

  return (
    <article ref={postEl} className='post'>
      <Link to={'/post/' + props.post.id_string} className='post-container'>
        <div className='post-container-caption'>
          <div className='post-container-caption-content'>
            {props?.post?.summary && (
              <div className='post-container-caption-content-title'>
                {props?.post?.summary}
              </div>
            )}
            {tags && tags}
          </div>
        </div>
        <div className='post-container-photo'>
          <img
            alt={props?.post?.caption}
            src={imgSrc}
            onLoad={() => setLoaded(true)}
            className='post-container-photo-src'
          />
        </div>
      </Link>
    </article>
  );
};

export default Post;
