import { ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import Loader from '../../../shared/ui/Loader/Loader';
import Post from '../../components/Post/Post';

// Models
import { PostsState } from '../../models/posts-state.interface';
import { SharedState } from '../../../shared/models/shared-state.interface';

// Stores
import usePostsStore from '../../store/posts.store';
import useSharedStore from '../../../shared/store/shared.store';

// Styles
import './Posts.scss';

const Posts = (): ReactElement => {
  // Tagged route param
  const { tagged } = useParams<{
    tagged: string;
  }>();

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
    state.postElementsL,
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

  // Posts element references
  const postsEmptyElem = useRef<HTMLDivElement>(null);
  const postsLoadingElem = useRef<HTMLDivElement>(null);

  // Component state
  const [mounted, setMounted] = useState<boolean>(false);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

    // Reset post
    setPost(null);

    // eslint-disable-next-line
  }, []);

  // Effect on loading and mounted state change
  useEffect(() => {
    if (loading && mounted && postsLoadingElem.current) {
      postsLoadingElem.current.style.opacity = '1';
    } else if (!loading && mounted && postsLoadingElem.current) {
      postsLoadingElem.current.style.opacity = '0';
    }

    if (!posts[tagged ? tagged : '/']) {
      // Set no result feedback visible
      if (!loading && mounted && postsEmptyElem.current) {
        postsEmptyElem.current.style.opacity = '1';
      }
    }
    // eslint-disable-next-line
  }, [loading, mounted, posts, tagged]);

  // Detect post changes
  useEffect(() => {
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
      setPosts(limit, tagged);
    }
    // eslint-disable-next-line
  }, [postElements, posts, tagged]);

  // Set store tag on state change
  useEffect(() => {
    if (tagged !== tag) {
      setTag(tagged);
    }

    // Set document title based on tag
    !tagged && setSubtitle(null);
    tagged && setSubtitle({ document: `#${tagged}`, text: `#${tagged}` });
    // eslint-disable-next-line
  }, [tagged]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = () => {
    if (
      posts[tagged ? tagged : '/'] &&
      posts[tagged ? tagged : '/'].total >=
        posts[tagged ? tagged : '/'].offset + limit
    ) {
      setLoading(true);
      // addPosts(limit, offset + limit, tagged);
      addPosts(limit, posts[tagged ? tagged : '/'].offset + limit, tagged);
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
        className="posts"
      >
        <div ref={postsLoadingElem} className="posts-loading">
          <Loader size={10} />
        </div>
        {/* {tag ? postElements[tag] : postElementsL} */}
        {postElements[tagged ? tagged : '/']}
        <div ref={postsEmptyElem} className="posts-empty">
          No results found{tagged && `: #${tagged}.`}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Posts;
