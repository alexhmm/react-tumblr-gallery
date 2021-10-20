import { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import clsx from 'clsx';

// Components
import Loader from '../../shared/ui/Loader/Loader';
import { Post } from '../components/Post';

// Hooks
import { usePosts } from '../hooks/usePosts.hook';

// Models
import { PostsState } from '../models/posts-state.interface';
import { SharedState } from '../../shared/models/shared-state.interface';

// Stores
import usePostsStore from '../store/posts.store';
import useSharedStore from '../../shared/store/shared.store';

export const Posts = (): ReactElement => {
  // Tagged route param
  const { tagged } = useParams<{
    tagged: string;
  }>();

  const { getPosts } = usePosts();

  // Posts store state
  const [
    limit,
    loading,
    postElements,
    posts,
    tag,
    addPosts,
    setLoading,
    setPost,
    setPostElements,
    setPosts,
    setTag
  ] = usePostsStore((state: PostsState) => [
    state.limit,
    state.loading,
    state.postElements,
    state.posts,
    state.tag,
    state.addPosts,
    state.setLoading,
    state.setPost,
    state.setPostElements,
    state.setPosts,
    state.setTag
  ]);

  // Settings store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Effect on component mount
  useEffect(() => {
    // Reset post
    setPost(null);

    // eslint-disable-next-line
  }, []);

  // Detect post changes
  useEffect(() => {
    // Set posts
    const fetchPosts = async () => {
      setPosts(await getPosts(limit, 0, tagged), tagged);
    };

    // On existing object add further posts
    // Check if there are more loaded posts than rendered elements
    if (
      posts[tagged ? tagged : '/']?.posts?.length > 0 &&
      (posts[tagged ? tagged : '/'].posts.length >
        postElements[tagged ? tagged : '/']?.length ||
        !postElements[tagged ? tagged : '/'])
    ) {
      const setElements = async () => {
        // Set start index to push new react elements (posts) into view
        let startIndex = 0;
        // Check if there are existing post elements of the current tag
        // Set start index by post elements length
        if (
          postElements[tagged ? tagged : '/'] &&
          postElements[tagged ? tagged : '/'].length > 0
        ) {
          startIndex = postElements[tagged ? tagged : '/'].length;
        }

        // Check if new posts were added
        if (posts[tagged ? tagged : '/']?.posts?.length > startIndex) {
          setLoading(true);
          const elements: JSX.Element[] = [];

          // Iterate from calculated start index
          for (
            let i = startIndex > -1 ? startIndex : 0;
            i < posts[tagged ? tagged : '/'].posts.length;
            i++
          ) {
            // Add posts if photo type
            if (posts[tagged ? tagged : '/'].posts[i].type === 'photo') {
              elements.push(
                <Post key={i} post={posts[tagged ? tagged : '/'].posts[i]} />
              );
              if (postElements[tagged ? tagged : '/']) {
                // Concat react nodes to existing elements object
                setPostElements(
                  postElements[tagged ? tagged : '/'].concat(elements),
                  tagged
                );
              } else {
                // Insert new post elements object
                setPostElements(elements, tagged);
              }
            }
            // Set loading to false after last element is rendered
            if (i === posts[tagged ? tagged : '/'].posts.length - 1) {
              setLoading(false);
            }
          }
        }
      };
      setElements();
    } else if (!posts[tagged ? tagged : '/']?.posts) {
      setLoading(true);
      fetchPosts();
    }
    // eslint-disable-next-line
  }, [postElements, posts, tagged]);

  // Set store tag on state change
  useEffect(() => {
    if (tagged !== tag) {
      setTag(tagged);
    } else if (tagged === undefined) {
      setTag(null);
    }

    // Set document title based on tag
    !tagged && setSubtitle(null);
    tagged && setSubtitle({ document: `#${tagged}`, text: `#${tagged}` });
    // eslint-disable-next-line
  }, [tagged]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = async () => {
    if (
      posts[tagged ? tagged : '/'] &&
      posts[tagged ? tagged : '/'].total >=
        posts[tagged ? tagged : '/'].offset + limit
    ) {
      setLoading(true);
      addPosts(
        await getPosts(
          limit,
          posts[tagged ? tagged : '/'].offset + limit,
          tagged
        ),
        limit,
        posts[tagged ? tagged : '/'].offset,
        tagged
      );
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={postElements[tagged ? tagged : '/']?.length || 0}
        hasMore
        loader={null}
        next={onAddPosts}
        scrollThreshold={1}
        className="box-border flex flex-wrap px-1 py-16 w-full sm:px-2 md:px-4 md:py-20 xl:py-24 3xl:px-8 4xl:px-12 4xl:py-28"
      >
        <Transition
          show={loading}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Loader
            classes="bottom-8 fixed left-1/2 transform -translate-x-1/2 z-20 lg:bottom-12 xl:bottom-16"
            size={10}
          />
        </Transition>
        {postElements[tagged ? tagged : '/']}
        <div
          className={clsx(
            'box-border duration-500 ease-out mt-8 p-2 text-center text-2xl transition-opacity w-full z-10',
            'md:p-4 md:text-3xl xl:p-6 xl:text-4xl',
            !posts[tagged ?? '/'] && !loading ? 'opacity-100' : 'opacity-0'
          )}
        >
          No results found{tagged && `: #${tagged}`}.
        </div>
      </InfiniteScroll>
    </>
  );
};
