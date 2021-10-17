import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { isDesktop } from 'react-device-detect';
import { useSwipeable } from 'react-swipeable';
import { Transition } from '@headlessui/react';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import clsx from 'clsx';

// Components
import Icon from '../../shared/ui/Icon/Icon';
import Loader from '../../shared/ui/Loader/Loader';
import Zoomable from 'react-instagram-zoom';

// Hooks
import { useDimensions } from '../../shared/hooks/use-dimensions.hook';
import { usePosts } from '../hooks/usePosts.hook';

// Models
import { Contributor } from '../../shared/models/contributor.interface';
import { Post } from '../models/post.interface';
import { PostsState } from '../models/posts-state.interface';
import { SharedState } from '../../shared/models/shared-state.interface';

// Stores
import usePostsStore from '../store/posts.store';
import useSharedStore from '../../shared/store/shared.store';

export const PostDetail = (): ReactElement => {
  const { dimensions } = useDimensions();
  const { getPosts, getPost, setPostSourceDetail } = usePosts();

  // React router history
  const history = useHistory();

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
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [init, setInit] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [postNext, setPostNext] = useState<string | null>(null);
  const [postPrev, setPostPrev] = useState<string | null>(null);
  const [touch, setTouch] = useState<boolean>(false);

  // Effect on component mount
  useEffect(() => {
    dayjs.extend(LocalizedFormat);

    // eslint-disable-next-line
  }, []);

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
    const fetchPost = async () => {
      setPost(await getPost(postId));
    };

    // Fetch post on mount
    if (postId) {
      fetchPost();
    }

    // Cleanup on unmount component
    return () => {
      setContributor(null);
      setLoaded(false);
    };
    // eslint-disable-next-line
  }, [postId, posts]);

  // Effect on dimensions and post
  useEffect(() => {
    // Reset post source on resize
    if (dimensions && post) {
      const img = setPostSourceDetail(post?.photos[0]?.alt_sizes);
      setImgSrc(img.imgSrc);
    }

    // Cleanup function
    return () => {
      setImgSrc(undefined);
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
    const fetchPosts = async () => {
      addPosts(
        await getPosts(limit, posts[tag ?? '/'].offset + limit, tag),
        limit,
        posts[tag ?? '/'].offset,
        tag ?? '/'
      );
    };

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
        fetchPosts();
    }
    // eslint-disable-next-line
  }, [post, postId, posts, tag]);

  /**
   * Handler on next post navigation.
   */
  const onPostNext = useCallback(() => {
    postNext && history.replace(`/post/${postNext}`);
  }, [history, postNext]);

  /**
   * Handler on previous post navigation.
   */
  const onPostPrev = useCallback(() => {
    postPrev && history.replace(`/post/${postPrev}`);
  }, [history, postPrev]);

  /**
   * Handlers on image swipe. Navigates to previous or next post.
   */
  const onImgSwipeHandlers = useSwipeable({
    onSwipedLeft: () => onPostNext(),
    onSwipedRight: () => onPostPrev()
  });

  return (
    <Fragment>
      <img
        alt={post?.caption}
        src={imgSrc}
        onLoad={() => setLoaded(true)}
        className="hidden"
      />
      <div
        className={clsx(
          'flex fixed h-screen items-center justify-center left-0 top-0 w-screen',
          touch ? 'z-30' : 'z-auto'
        )}
      >
        <Transition
          show={!loaded}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Loader
            classes="fixed left-1/2 transform -translate-x-1/2"
            size={10}
          />
        </Transition>
        <div
          className={clsx(
            'duration-200 fixed h-screen left-0 top-0 w-full transition-colors z-10',
            touch && 'bg-[#00000073] dark:bg-[#ffffff40]'
          )}
        ></div>

        {post && post.id_string === postId && (
          <Transition
            as={Fragment}
            show={loaded}
            enter="duration-300 transition-opacity"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-300 transition-opacity"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <article className="relative max-h-[65vh] max-w-full z-20 md:max-h-[70vh] xl:max-h-[80vh]">
              <section
                className={clsx(
                  'absolute flex flex-wrap h-[20px] left-3 overflow-hidden -top-8 w-[calc(100%-24px)]',
                  '3xl:left-4 3xl:-top-9 3xl:w-[calc(100%-36px)] 4xl:h-[24px] 4xl:left-6 4xl:text-xl 4xl:-top-12 4xl:w-[calc(100%-48px)]'
                )}
              >
                {post.summary && (
                  <div className="h-full mr-2 overflow-ellipsis overflow-hidden uppercase whitespace-nowrap">
                    {post.summary}
                  </div>
                )}
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    to={'/tagged/' + tag}
                    className={clsx(
                      'ml-1 overflow-clip overflow-hidden tap-highlight text-tag whitespace-nowrap',
                      isDesktop &&
                        'duration-200 transition-colors hover:text-primary visited:text-tag'
                    )}
                  >
                    {'#' + tag}
                  </Link>
                ))}
              </section>
              <Zoomable
                onTouchStart={() => setTouch(true)}
                onTouchEnd={() => setTouch(false)}
                releaseAnimationTimeout={250}
                className="max-h-[65vh] max-w-full md:max-h-[70vh] xl:max-h-[80vh]"
              >
                <img
                  {...onImgSwipeHandlers}
                  alt={post?.caption}
                  src={imgSrc}
                  className="max-h-[65vh] max-w-full md:max-h-[70vh] xl:max-h-[80vh]"
                />
                <>
                  {postPrev && isDesktop && (
                    <div
                      onClick={onPostPrev}
                      className="absolute cursor-pointer h-full group left-0 top-0 w-1/2"
                    >
                      <div className="absolute duration-200 left-2 opacity-0 p-2 top-1/2 -translate-y-1/2 transform transition-opacity group-hover:opacity-100">
                        <Icon
                          classes="fas fa-chevron-left"
                          style={{ color: 'white' }}
                        />
                      </div>
                    </div>
                  )}
                  {postNext && isDesktop && (
                    <div
                      onClick={onPostNext}
                      className="absolute cursor-pointer h-full group right-0 user-select-none top-0 w-1/2"
                    >
                      <div className="absolute duration-200 opacity-0 p-2 right-2 top-1/2 -translate-y-1/2 transform transition-opacity group-hover:opacity-100">
                        <Icon
                          classes="fas fa-chevron-right"
                          style={{ color: 'white' }}
                        />
                      </div>
                    </div>
                  )}
                </>
              </Zoomable>
              <section
                className={clsx(
                  'absolute -bottom-8 flex h-[20px] items-center left-3 justify-between text-sm w-[calc(100%-24px)]',
                  '3xl:-bottom-9 3xl:left-4 3xl:w-[calc(100%-36px) 4xl:-bottom-12 4xl:h-[24px] 4xl:left-6 4xl:text-base 4xl:w-[calc(100%-48px)]'
                )}
              >
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Icon
                      classes="fas fa-heart"
                      size={16}
                      style={{ color: 'rgb(226, 72, 85)' }}
                    />
                    <span className="ml-2">{post.note_count}</span>
                  </div>
                  <Transition
                    show={contributor ? true : false}
                    enter="duration-200 transition-opacity"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-200 transition-opacity"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <a
                      href={contributor?.href}
                      className={clsx(
                        'flex group items-center ml-4 tap-highlight xl:bottom-8 xl:left-8',
                        isDesktop &&
                          'duration-200 transition-colors hover:text-primary'
                      )}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Icon
                        classes={clsx(
                          'fas fa-camera',
                          isDesktop &&
                            'duration-200 transition-colors group-hover:text-primary'
                        )}
                        size={16}
                      />
                      <span className="ml-2">{contributor?.name}</span>
                    </a>
                  </Transition>
                </div>
                <div className="flex-wrap h-[20px] hidden items-center overflow-hidden right-3 text-tag sm:flex">
                  {date && <span>{date}</span>}
                </div>
              </section>
            </article>
          </Transition>
        )}
      </div>
    </Fragment>
  );
};
