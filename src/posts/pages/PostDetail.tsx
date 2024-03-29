import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import { useSwipeable } from 'react-swipeable';
import { Transition } from '@headlessui/react';
import Zoomable from 'react-instagram-zoom';
import clsx from 'clsx';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

// Components
import { Icon } from '../../shared/ui/Icon';
import { IconButton } from '../../shared/ui/IconButton';
import Loader from '../../shared/ui/Loader/Loader';
import { Tag } from '../components/Tag';

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
        tag ?? null
      );
    };

    if (post?.id_string === postId && posts[tag ?? '/']?.posts?.length > 0) {
      const index = posts[tag ?? '/'].posts.findIndex(
        (singlePost: Post) => singlePost.id_string === post?.id_string
      );
      index > 0 && setPostPrev(posts[tag ?? '/'].posts[index - 1].id_string);
      index < posts[tag ?? '/'].posts.length - 1 &&
        setPostNext(posts[tag ?? '/'].posts[index + 1].id_string);

      // Add more posts on last posts item
      index === posts[tag ?? '/'].posts.length - 1 &&
        posts[tag ?? '/'].total >= posts[tag ?? '/'].offset + limit &&
        fetchPosts();
    }
    // eslint-disable-next-line
  }, [limit, post, postId, posts, tag]);

  /**
   * Handler on next post navigation.
   */
  const onPostNext = useCallback(() => {
    loaded && postNext && history.replace(`/post/${postNext}`);
  }, [history, loaded, postNext]);

  /**
   * Handler on previous post navigation.
   */
  const onPostPrev = useCallback(() => {
    loaded && postPrev && history.replace(`/post/${postPrev}`);
  }, [history, loaded, postPrev]);

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
                {post.tags.map((tag: string, index: number) => (
                  <Tag key={index} tag={tag} />
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
                    <button
                      onClick={onPostPrev}
                      className="absolute cursor-pointer h-full group left-0 top-0 w-1/2"
                    >
                      <div className="absolute duration-200 left-2 opacity-0 p-2 top-1/2 -translate-y-1/2 transform transition-opacity group-hover:opacity-100">
                        <Icon
                          color="text-white"
                          icon={['fas', 'chevron-left']}
                        />
                      </div>
                    </button>
                  )}
                  {postPrev && isMobile && (
                    <IconButton
                      classes="absolute left-2 tap-highlight top-1/2 -translate-y-1/2"
                      icon={['fas', 'chevron-left']}
                      iconColor="text-white"
                      onClick={onPostPrev}
                    />
                  )}
                  {postNext && isDesktop && (
                    <button
                      onClick={onPostNext}
                      className="absolute cursor-pointer h-full group right-0 top-0 w-1/2"
                    >
                      <div className="absolute duration-200 opacity-0 p-2 right-2 top-1/2 -translate-y-1/2 transform transition-opacity group-hover:opacity-100">
                        <Icon
                          color="text-white"
                          icon={['fas', 'chevron-right']}
                        />
                      </div>
                    </button>
                  )}
                  {postNext && isMobile && (
                    <IconButton
                      classes="absolute right-2 tap-highlight top-1/2 -translate-y-1/2"
                      icon={['fas', 'chevron-right']}
                      iconColor="text-white"
                      onClick={onPostNext}
                    />
                  )}
                </>
              </Zoomable>
              <section
                className={clsx(
                  'absolute -bottom-8 flex h-[20px] items-center left-3 justify-between text-sm w-[calc(100%-24px)]',
                  'md:text-base 3xl:-bottom-9 3xl:left-4 3xl:w-[calc(100%-36px) 4xl:-bottom-12 4xl:h-[24px] 4xl:left-6 4xl:w-[calc(100%-48px)]'
                )}
              >
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Icon
                      color="text-like"
                      icon={['fas', 'heart']}
                      size="text-sm"
                    />
                    <span className="ml-2 text-sm">{post.note_count}</span>
                  </div>
                  <Transition
                    show={contributor ? true : false}
                    enter="duration-200 transition-opacity"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-200 transition-opacity"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="flex items-center"
                  >
                    <a
                      href={contributor?.href}
                      className="flex group items-center ml-4 tap-highlight"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Icon
                        color="text-app"
                        icon={['fas', 'camera']}
                        size="text-sm"
                      />
                      <span
                        className={clsx(
                          'ml-2 text-sm',
                          isDesktop &&
                            'border-b-2 border-transparent duration-200 transition-colors group-hover:border-app'
                        )}
                      >
                        {contributor?.name}
                      </span>
                    </a>
                  </Transition>
                </div>
                <div className="flex-wrap h-[20px] hidden items-center overflow-hidden right-3 text-sm text-sub sm:flex">
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
