import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import useDimensions from '../../../shared/hooks/useDimensions.hook';

import { Post as PostType } from '../../models/post.interface';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';
import { setPostSourceGallery } from '../../utils/posts.utils';

import './Post.scss';

const Post = (props: { post: PostType }): ReactElement => {
  const dimensions = useDimensions();

  // Posts store state
  const [postHover, setPostHover] = usePostsStore((state: PostsState) => [
    state.postHover,
    state.setPostHover
  ]);

  // Post element references
  const postElem = useRef<HTMLDivElement>(null);
  const postContainerElem = useRef<HTMLAnchorElement>(null);

  // Component state
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [tags, setTags] = useState<ReactNode[]>([]);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
  }, []);

  // Effect on dimensions change.
  useEffect(() => {
    // Reset post source on resize
    const img = setPostSourceGallery(
      imgWidth,
      props?.post?.photos[0]?.alt_sizes
    );
    setImgSrc(img.imgSrc);
    setImgWidth(img.imgWidth);
    // eslint-disable-next-line
  }, [dimensions]);

  // Effect on loaded & mounted state
  useEffect(() => {
    if (imgSrc && imgWidth && loaded && mounted && postElem.current) {
      // Fade in post
      postElem.current.style.opacity = '1';
    }
  }, [imgSrc, imgWidth, loaded, mounted]);

  // Effect on post hover change
  useEffect(() => {
    if (postContainerElem.current && postHover && postHover === props.post.id) {
      // Colorize hovered post element
      postContainerElem.current.style.filter = 'grayscale(0)';
    } else if (
      postContainerElem.current &&
      postHover &&
      postHover !== props.post.id
    ) {
      // Grayscale all post elements instead of hovered one
      postContainerElem.current.style.filter = 'grayscale(1)';
    } else if (postContainerElem.current && !postHover) {
      // Colorize all post elements on non hover
      postContainerElem.current.style.filter = 'grayscale(0)';
    }
  }, [postHover, props.post.id]);

  // Effect on post change
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

  /**
   * Handler on post container mouse enter.
   */
  const onPostMouseEnter = () => {
    setPostHover(props.post.id);
  };

  /**
   * Handler on post container mouse leave.
   */
  const onPostMouseLeave = () => {
    setPostHover(null);
  };

  return (
    <article ref={postElem} className='post'>
      <Link
        to={'/post/' + props.post.id_string}
        onMouseEnter={onPostMouseEnter}
        onMouseLeave={onPostMouseLeave}
        ref={postContainerElem}
        className='post-container'
      >
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
