import {
  Fragment,
  MouseEvent,
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
import { getPrevNextPost, setPostSourceDetail } from '../../utils/posts.utils';

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
  const postDetailContributorElem = useRef<HTMLAnchorElement>(null);
  const postDetailLoadingElem = useRef<HTMLDivElement>(null);

  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Posts store state
  const [
    limit,
    offset,
    post,
    posts,
    tag,
    total,
    addPosts,
    setPost
  ] = usePostsStore((state: PostsState) => [
    state.limit,
    state.offset,
    state.post,
    state.posts,
    state.tag,
    state.total,
    state.addPosts,
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

      // Add more posts on last posts item
      index === posts.length - 1 &&
        total >= offset + limit &&
        addPosts(limit, offset + limit, tag ? tag : '');
    }
    // eslint-disable-next-line
  }, [post, postId, posts]);

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
   * Handler on image click.
   * Navigates to previous or next post.
   */
  const onImgClick = useCallback(
    (event: MouseEvent) => {
      if (getPrevNextPost(event.clientX) === 'next' && postNext) {
        onPostNext();
      }
      if (getPrevNextPost(event.clientX) === 'prev' && postPrev) {
        onPostPrev();
      }
    },
    // eslint-disable-next-line
    [postNext, postPrev]
  );

  /**
   * Handler on image mouse move.
   * Shows or hides post navigation buttons.
   */
  const onImgMouseMove = useCallback(
    (event: MouseEvent) => {
      if (
        postDetailContainerPrevElem.current &&
        postDetailContainerNextElem.current
      ) {
        if (getPrevNextPost(event.clientX) === 'prev' && postPrev) {
          postDetailContainerPrevElem.current.style.opacity = '1';
          postDetailContainerNextElem.current.style.opacity = '0';
        }
        if (getPrevNextPost(event.clientX) === 'next' && postNext) {
          postDetailContainerPrevElem.current.style.opacity = '0';
          postDetailContainerNextElem.current.style.opacity = '1';
        }
      }
    },
    [postPrev, postNext]
  );

  /**
   * Handler on image mouse out.
   * Hides post navigation buttons.
   */
  const onImgMouseOut = useCallback(() => {
    if (
      postDetailContainerPrevElem.current &&
      postDetailContainerNextElem.current
    ) {
      postDetailContainerPrevElem.current.style.opacity = '0';
      postDetailContainerNextElem.current.style.opacity = '0';
    }
  }, []);

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
      <div ref={postDetailElem} className='post-detail'>
        <div ref={postDetailLoadingElem} className='post-detail-loading'>
          <Spinner size={10} />
        </div>
        <div
          ref={postDetailBackdropElem}
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
                {...onImgSwipeHandlers}
                alt={post?.caption}
                src={imgSrc}
                onClick={event => onImgClick(event)}
                onLoad={() => setLoaded(true)}
                onMouseMove={event => onImgMouseMove(event)}
                onMouseOut={onImgMouseOut}
                className='post-detail-container-src'
              />
              <Fragment>
                <div
                  ref={postDetailContainerPrevElem}
                  className='post-detail-container-src-prev'
                >
                  <Icon
                    classes='fas fa-chevron-left'
                    style={{ color: 'white' }}
                  />
                </div>
                <div
                  ref={postDetailContainerNextElem}
                  className='post-detail-container-src-next'
                >
                  <Icon
                    classes='fas fa-chevron-right'
                    style={{ color: 'white' }}
                  />
                </div>
              </Fragment>
            </Zoomable>
            <section className='post-detail-container-date'>
              {date && <span>{date}</span>}
            </section>
          </article>
        )}
      </div>
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
    </Fragment>
  );
};

export default PostDetail;
