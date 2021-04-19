import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

// Components
import Icon from '../../../shared/components/icon/icon.component';
import Spinner from '../../../shared/components/spinner/spinner.component';
import Zoomable from 'react-instagram-zoom';

// Hooks
import useDimensions from '../../../shared/hooks/use-dimensions.hook';

// Models
import { Contributor } from '../../../shared/models/contributor.interface';
import { Post } from '../../models/post.interface';
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

  // Post detail element references
  const postDetailElem = useRef<HTMLDivElement>(null);
  const postDetailBackdropElem = useRef<HTMLDivElement>(null);
  const postDetailContainerElem = useRef<HTMLDivElement>(null);
  const postDetailContributorElem = useRef<HTMLAnchorElement>(null);
  const postDetailLoadingElem = useRef<HTMLDivElement>(null);

  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Posts store state
  const [post, posts, setPost] = usePostsStore((state: PostsState) => [
    state.post,
    state.posts,
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
  const [postNext, setPostNext] = useState<string | null>(null);
  const [postPrev, setPostPrev] = useState<string | null>(null);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

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
    if (postId) {
      setPost(postId);
    }

    // Cleanup on unmount component
    return () => {
      setContributor(null);
      setLoaded(false);
      // setPost(null);
    };
    // eslint-disable-next-line
  }, [postId]);

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
    if (post?.id_string === postId) {
      // Set document title
      setSubtitle(post?.summary.toUpperCase() || '');

      // Set post date
      setDate(dayjs.unix(post.timestamp).format('LL'));

      // Get post contributor
      if (process.env.REACT_APP_CONTRIBUTORS && post?.tags) {
        const contributors: Contributor[] = JSON.parse(
          process.env.REACT_APP_CONTRIBUTORS
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
    // eslint-disable-next-line
  }, [post, postId]);

  // Set prev and next post ids
  useEffect(() => {
    if (post?.id_string === postId && posts?.length > 0) {
      const index = posts.findIndex(
        (singlePost: Post) => singlePost.id_string === post?.id_string
      );
      index > 0 && setPostPrev(posts[index - 1].id_string);
      index < posts.length - 1 && setPostNext(posts[index + 1].id_string);
    }
    // eslint-disable-next-line
  }, [post, postId, posts]);

  // useEffect(() => {
  //   console.log('prev next', post?.summary, postPrev, postNext);
  // }, [postNext, postPrev]);

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
      process.env.REACT_APP_CONTRIBUTORS
    ) {
      postDetailContributorElem.current.style.opacity = '1';
    }
    // eslint-disable-next-line
  }, [contributor, mounted, loaded]);

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
      <div ref={postDetailBackdropElem} className='post-detail-backdrop'></div>
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
          {postPrev && (
            <Link
              replace
              to={`/post/${postPrev}`}
              className='post-detail-container-prev'
            >
              <div className='post-detail-container-prev-button'>
                <Icon
                  classes='fas fa-chevron-left'
                  style={{ color: 'white' }}
                />
              </div>
            </Link>
          )}
          {postNext && (
            <Link
              replace
              to={`/post/${postNext}`}
              className='post-detail-container-next'
            >
              <div className='post-detail-container-next-button'>
                <Icon
                  classes='fas fa-chevron-right'
                  style={{ color: 'white' }}
                />
              </div>
            </Link>
          )}
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
