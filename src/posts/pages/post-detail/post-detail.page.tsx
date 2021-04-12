import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

// Components
import Icon from '../../../shared/components/icon/icon.component';
import Spinner from '../../../shared/components/spinner/spinner';
import Zoomable from 'react-instagram-zoom';

// Hooks
import useDimensions from '../../../shared/hooks/useDimensions.hook';

// Models
import { Contributor } from '../../../shared/models/contributor.interface';
import { PostsState } from '../../models/posts-state.interface';
import { SharedState } from '../../../shared/models/shared-state.interface';

// Stores
import usePostsStore from '../../store/posts.store';
import useSharedStore from '../../../shared/store/shared.store';

// Styles
import './post-detail.scss';

// Utils
import { setPostSourceDetail } from '../../utils/posts.utils';

const PostDetail = (): ReactElement => {
  const dimensions = useDimensions();
  const history = useHistory();

  // Post detail element references
  const postDetailElem = useRef<HTMLDivElement>(null);
  const postDetailBackdropElem = useRef<HTMLDivElement>(null);
  const postDetailContainerElem = useRef<HTMLDivElement>(null);
  const postDetailContributorElem = useRef<HTMLAnchorElement>(null);
  const postDetailLoadingElem = useRef<HTMLDivElement>(null);

  // Settings store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Posts store state
  const [post, setPost] = usePostsStore((state: PostsState) => [
    state.post,
    state.setPost
  ]);

  // Post id route param
  const { postId } = useParams<{
    postId: string;
  }>();

  // Component state
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [date, setDate] = useState<string | null>('');
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Effect on component mount
  useEffect(() => {
    dayjs.extend(LocalizedFormat);
  }, []);

  // Effect on mounted
  useEffect(() => {
    if (mounted && postDetailLoadingElem.current) {
      postDetailLoadingElem.current.style.opacity = '1';
    }
  }, [mounted]);

  // Effect on postId param
  useEffect(() => {
    setPost(postId);
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

    // Cleanup on unmount component
    return () => {
      setContributor(null);
      setLoaded(false);
      setPost(null);
    };
  }, [postId, setPost]);

  // Effect on dimensions and post
  useEffect(() => {
    // Reset post source on resize
    if (dimensions && post) {
      const img = setPostSourceDetail(imgWidth, post?.photos[0]?.alt_sizes);
      setImgSrc(img.imgSrc);
      setImgWidth(img.imgWidth);
    }

    // Cleanup function
    return () => {
      setImgSrc(undefined);
      setImgWidth(0);
    };

    // eslint-disable-next-line
  }, [dimensions, post]);

  // Effect on post
  useEffect(() => {
    if (post) {
      // Set document title
      setSubtitle(post?.summary.toUpperCase());

      // Set post date
      setDate(dayjs.unix(post.timestamp).format('LL'));

      // Get post contributor
      if (process.env.REACT_APP_CONTRIBUTOR && post?.tags) {
        const contributors: Contributor[] = JSON.parse(
          process.env.REACT_APP_CONTRIBUTOR
        );
        // Iterate through contributor array
        for (const contributor of contributors) {
          const matchedTag = post.tags.find(
            (tag: string) => tag === contributor.tag
          );
          if (matchedTag) {
            // Set contributor on matched tumblr post tag
            setContributor(contributor);
            break;
          }
        }
      }
    }

    // Cleanup function
    return () => {
      setContributor(null);
      setDate(null);
    };
  }, [post, setSubtitle]);

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

    if (
      contributor &&
      loaded &&
      mounted &&
      postDetailContributorElem.current &&
      process.env.REACT_APP_CONTRIBUTOR
    ) {
      postDetailContributorElem.current.style.opacity = '1';
    }
    // eslint-disable-next-line
  }, [contributor, mounted, loaded]);

  /**
   * Handler on backdrop click to navigate back to gallery.
   */
  const onBackdropClick = () => {
    history.goBack();
  };

  /**
   * Handler when pinch zoom starts.
   */
  const onTouchStart = useCallback(() => {
    if (postDetailElem.current) {
      postDetailElem.current.style.zIndex = '31';
    }
    if (postDetailBackdropElem.current) {
      postDetailBackdropElem.current.classList.add(
        'post-detail-backdrop-pinch-active'
      );
    }
  }, []);

  /**
   * Handler when pinch zoom ends.
   */
  const onTouchEnd = useCallback(() => {
    if (postDetailElem.current) {
      postDetailElem.current.style.zIndex = 'initial';
    }
    if (postDetailBackdropElem.current) {
      postDetailBackdropElem.current.classList.remove(
        'post-detail-backdrop-pinch-active'
      );
    }
  }, []);

  return (
    <div ref={postDetailElem} className='post-detail'>
      <div ref={postDetailLoadingElem} className='post-detail-loading'>
        <Spinner size={10} />
      </div>
      <div
        ref={postDetailBackdropElem}
        onClick={onBackdropClick}
        className='post-detail-backdrop'
      ></div>
      {post && post.id_string === postId && (
        <article
          ref={postDetailContainerElem}
          className='post-detail-container'
        >
          <section className='post-detail-container-caption'>
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                to={'/tagged/' + tag}
                className='post-detail-container-caption-tag'
              >
                {'#' + tag}
              </Link>
            ))}
          </section>
          <Zoomable
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            releaseAnimationTimeout={250}
            className='post-detail-container-src'
          >
            <img
              alt={post?.caption}
              src={imgSrc}
              onLoad={() => setLoaded(true)}
              className='post-detail-container-src'
            />
          </Zoomable>
          <section className='post-detail-container-date'>
            {date && <span>{date}</span>}
          </section>
        </article>
      )}
      <a
        ref={postDetailContributorElem}
        href={contributor?.href}
        className='post-detail-contributor'
        rel='noreferrer'
        target='_blank'
      >
        <Icon classes='fas fa-camera' size={18} />
        <span className='post-detail-contributor-text'>
          {contributor?.name}
        </span>
      </a>
    </div>
  );
};

export default PostDetail;
