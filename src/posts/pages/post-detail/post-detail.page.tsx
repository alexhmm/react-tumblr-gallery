import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

// Components
import Spinner from '../../../shared/components/spinner/spinner';

// Hooks
import useDimensions from '../../../shared/hooks/useDimensions.hook';

// Models
import { PostsState } from '../../models/posts-state.interface';

// Stores
import usePostsStore from '../../store/posts.store';

// Styles
import './post-detail.scss';

// Utils
import { setPostSourceDetail } from '../../utils/posts.utils';

const PostDetail = (): ReactElement => {
  const dimensions = useDimensions();
  const history = useHistory();

  // Post detail element references
  const postDetailContainerElem = useRef<HTMLDivElement>(null);
  const postDetailLoadingElem = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (mounted && postDetailLoadingElem.current) {
      postDetailLoadingElem.current.style.opacity = '1';
    }
  }, [mounted]);

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
    if (
      mounted &&
      loaded &&
      postDetailContainerElem?.current &&
      postDetailLoadingElem.current &&
      post?.id_string === postId
    ) {
      postDetailContainerElem.current.style.opacity = '1';
      postDetailLoadingElem.current.style.opacity = '0';
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
    <div className='post-detail'>
      <div ref={postDetailLoadingElem} className='post-detail-loading'>
        <Spinner size={10} />
      </div>
      <div onClick={onBackdropClick} className='post-detail-backdrop'></div>
      {post && post.id_string === postId && (
        <div ref={postDetailContainerElem} className='post-detail-container'>
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
