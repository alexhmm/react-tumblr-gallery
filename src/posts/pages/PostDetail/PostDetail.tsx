import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useSwipeable } from 'react-swipeable';

// Components
import Icon from '../../../shared/ui/Icon/Icon';
import Loader from '../../../shared/ui/Loader/Loader';
import Zoomable from 'react-instagram-zoom';

// Hooks
import useDimensions from '../../../shared/hooks/use-dimensions.hook';

// Models
import { Contributor } from '../../../shared/models/contributor.interface';
import { PostsState } from '../../models/posts-state.interface';
import { SharedState } from '../../../shared/models/shared-state.interface';

// Stores
import usePostsStore from '../../store/posts.store';
import useSharedStore from '../../../shared/store/shared.store';

// Styles
import './PostDetail.scss';

// Utils
import { setPostSourceDetail } from '../../utils/posts.utils';
import { Post } from '../../models/post.interface';

const PostDetail = (): ReactElement => {
  const dimensions = useDimensions();

  // React router history
  const history = useHistory();

  // Post detail element references
  const postDetailElem = useRef<HTMLDivElement>(null);
  const postDetailBackdropElem = useRef<HTMLDivElement>(null);
  const postDetailContainerElem = useRef<HTMLDivElement>(null);
  const postDetailContainerNextElem = useRef<HTMLDivElement>(null);
  const postDetailContainerPrevElem = useRef<HTMLDivElement>(null);
  const postDetailLoadingElem = useRef<HTMLDivElement>(null);

  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Posts store state
  const [
    limit,
    navUsed,
    post,
    posts,
    tag,
    addPosts,
    setNavUsed,
    setPost
  ] = usePostsStore((state: PostsState) => [
    state.limit,
    state.navUsed,
    state.post,
    state.posts,
    state.tag,
    state.addPosts,
    state.setNavUsed,
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
  const [init, setInit] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [postNext, setPostNext] = useState<string | null>(null);
  const [postPrev, setPostPrev] = useState<string | null>(null);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

    dayjs.extend(LocalizedFormat);

    // eslint-disable-next-line
  }, []);

  // Effect on mounted
  useEffect(() => {
    if (mounted && postDetailLoadingElem.current) {
      postDetailLoadingElem.current.style.opacity = '1';
    }
  }, [mounted]);

  // Add event listeners on keyboard / wheel use to navigate to prev / next post.
  useEffect(() => {
    const onKeyUse = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && postPrev) {
        onPostPrev();
      } else if (event.key === 'ArrowRight' && postNext) {
        onPostNext();
      }
      setNavUsed(true);
    };

    const onWheelUse = (event: WheelEvent) => {
      if (event.deltaY < 0 && postPrev) {
        onPostPrev();
      } else if (event.deltaY > 0 && postNext) {
        onPostNext();
      }
      setNavUsed(true);
    };

    if (!navUsed) {
      window.addEventListener('keyup', onKeyUse, { passive: true });
      window.addEventListener('wheel', onWheelUse, { passive: true });
    }

    return () => {
      window.removeEventListener('keyup', onKeyUse);
      window.removeEventListener('wheel', onWheelUse);
    };
    // eslint-disable-next-line
  }, [navUsed, postPrev, postNext]);

  // Effect on postId param
  useEffect(() => {
    if (postId) {
      setPost(postId);
    }

    // Cleanup on unmount component
    return () => {
      setContributor(null);
      setLoaded(false);
    };
    // eslint-disable-next-line
  }, [postId, posts]);

  // Style prev / next elements
  useEffect(() => {
    const prevElemRef = postDetailContainerPrevElem.current;
    const nextElemRef = postDetailContainerNextElem.current;
    if (postPrev && prevElemRef) {
      prevElemRef.style.cursor = 'pointer';
      prevElemRef.style.opacity = '1';
    }
    if (!postPrev && prevElemRef) {
      prevElemRef.style.cursor = 'auto';
      prevElemRef.style.opacity = '0';
    }
    if (postNext && nextElemRef) {
      nextElemRef.style.cursor = 'pointer';
      nextElemRef.style.opacity = '1';
    }
    if (!postNext && nextElemRef) {
      nextElemRef.style.cursor = 'auto';
      nextElemRef.style.opacity = '0';
    }
  }, [postPrev, postNext]);

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
    if (post?.id_string === postId && init) {
      setSubtitle({
        document: post?.summary.toUpperCase() || '',
        text: 'Posts'
      });
      setInit(false);

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
    if (
      post?.id_string === postId &&
      posts[tag ? tag : '/']?.posts?.length > 0
    ) {
      const index = posts[tag ? tag : '/'].posts.findIndex(
        (singlePost: Post) => singlePost.id_string === post?.id_string
      );
      index > 0 &&
        setPostPrev(posts[tag ? tag : '/'].posts[index - 1].id_string);
      index < posts[tag ? tag : '/'].posts.length - 1 &&
        setPostNext(posts[tag ? tag : '/'].posts[index + 1].id_string);

      // Add more posts on last posts item
      index === posts[tag ? tag : '/'].posts.length - 1 &&
        posts[tag ? tag : '/'].total >= posts[tag ? tag : '/'].offset + limit &&
        addPosts(limit, posts[tag ? tag : '/'].offset + limit, tag ? tag : '');
    }
    // eslint-disable-next-line
  }, [post, postId, posts, tag]);

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
   * Handler on next post navigation.
   */
  const onPostNext = useCallback(() => {
    if (postNext) {
      history.replace(`/post/${postNext}`);
    }
  }, [history, postNext]);

  /**
   * Handler on previous post navigation.
   */
  const onPostPrev = useCallback(() => {
    if (postPrev) {
      history.replace(`/post/${postPrev}`);
    }
  }, [history, postPrev]);

  /**
   * Handlers on image swipe.
   * Navigates to previous or next post.
   */
  const onImgSwipeHandlers = useSwipeable({
    onSwipedLeft: () => onPostNext(),
    onSwipedRight: () => onPostPrev()
  });

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
    <Fragment>
      <div ref={postDetailElem} className="post-detail">
        <div ref={postDetailLoadingElem} className="post-detail-loading">
          <Loader size={10} />
        </div>
        <div
          ref={postDetailBackdropElem}
          className="post-detail-backdrop"
        ></div>
        {post && post.id_string === postId && (
          <article
            ref={postDetailContainerElem}
            className="post-detail-container"
          >
            <section className="post-detail-container-caption">
              {post.summary && (
                <div className="post-detail-container-caption-title">
                  {post.summary}
                </div>
              )}
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  to={'/tagged/' + tag}
                  className="post-detail-container-caption-tag"
                >
                  {'#' + tag}
                </Link>
              ))}
            </section>
            <Zoomable
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              releaseAnimationTimeout={250}
              className="post-detail-container-src"
            >
              <img
                {...onImgSwipeHandlers}
                alt={post?.caption}
                src={imgSrc}
                onLoad={() => setLoaded(true)}
                className="post-detail-container-src"
              />
              <Fragment>
                {postPrev && (
                  <div
                    ref={postDetailContainerPrevElem}
                    onClick={onPostPrev}
                    className="post-detail-container-src-prev"
                  >
                    <div className="post-detail-container-src-prev-icon">
                      <Icon
                        classes="fas fa-chevron-left"
                        style={{ color: 'white' }}
                      />
                    </div>
                  </div>
                )}
                {postNext && (
                  <div
                    ref={postDetailContainerNextElem}
                    onClick={onPostNext}
                    className="post-detail-container-src-next"
                  >
                    <div className="post-detail-container-src-next-icon">
                      <Icon
                        classes="fas fa-chevron-right"
                        style={{ color: 'white' }}
                      />
                    </div>
                  </div>
                )}
              </Fragment>
            </Zoomable>
            <section className="post-detail-container-info">
              <div className="post-detail-container-info-group">
                <div className="post-detail-container-info-group-notes">
                  <Icon
                    classes="fas fa-heart"
                    size={16}
                    style={{ color: 'rgb(226, 72, 85)' }}
                  />
                  <span className="post-detail-container-info-group-text">
                    {post.note_count}
                  </span>
                </div>
                {contributor && (
                  <a
                    href={contributor.href}
                    className="post-detail-container-info-group-contributor"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon classes="fas fa-camera" size={16} />
                    <span className="post-detail-container-info-group-text">
                      {contributor.name}
                    </span>
                  </a>
                )}
              </div>
              <div className="post-detail-container-info-date">
                {date && <span>{date}</span>}
              </div>
            </section>
          </article>
        )}
      </div>
    </Fragment>
  );
};

export default PostDetail;
