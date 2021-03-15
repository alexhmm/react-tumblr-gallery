import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import useDimensions from '../../../shared/hooks/useDimensions.hook';

import './post-detail.scss';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';
import { setPostSourceDetail } from '../../utils/posts.utils';

const PostDetail = (): ReactElement => {
  const dimensions = useDimensions();
  const history = useHistory();

  // Post element reference
  const postElem = useRef<HTMLDivElement>(null);

  // Post id route param
  const { postId } = useParams<{
    postId: string;
  }>();

  // Posts store state
  const [post, setPost] = usePostsStore((state: PostsState) => [
    state.post,
    state.setPost
  ]);

  // Component state
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  /**
   * Set post on component mount
   */
  useEffect(() => {
    setPost(postId);
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
    // Cleanup on unmount component
    return () => {
      setLoaded(false);
      setPost(null);
    };
  }, [postId, setPost]);

  // Reset post source on resize.
  useEffect(() => {
    const img = setPostSourceDetail(imgWidth, post?.photos[0]?.alt_sizes);
    setImgSrc(img.imgSrc);
    setImgWidth(img.imgWidth);
    // eslint-disable-next-line
  }, [dimensions, post]);

  // Set opacity on mounted state
  useEffect(() => {
    if (mounted && loaded && postElem?.current && post?.id_string === postId) {
      postElem.current.style.opacity = '1';
    }
    // eslint-disable-next-line
  }, [mounted, loaded]);

  /**
   * Handler on backdrop click to navigate back to gallery.
   */
  const onBackdropClick = () => {
    history.goBack();
  };

  return (
    <div ref={postElem} className='post-detail'>
      <div onClick={onBackdropClick} className='post-detail-backdrop'></div>
      {post && post.id_string === postId && (
        <div className='post-detail-container'>
          <div className='post-detail-container-caption'>
            {post.summary && (
              <div className='post-detail-container-caption-title'>
                {post.summary}
              </div>
            )}
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                to={'/tagged/' + tag}
                className='post-detail-container-caption-tag'
              >
                {'#' + tag}
              </Link>
            ))}
          </div>
          <img
            alt={post?.caption}
            src={imgSrc}
            onLoad={() => setLoaded(true)}
            className='post-detail-container-src'
          />
        </div>
      )}
    </div>
  );
};

export default PostDetail;
