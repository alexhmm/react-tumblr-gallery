import { ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import Post from '../../components/post/Post.component';
import PostsTag from '../../components/posts-tag/posts-tag.component';
import Spinner from '../../../shared/components/spinner/spinner';

// Models
import { PostsState } from '../../models/posts-state.interface';
import { SharedState } from '../../../shared/models/shared-state.interface';

// Stores
import usePostsStore from '../../store/posts.store';
import useSharedStore from '../../../shared/store/shared.store';

// Styles
import './Posts.scss';

const Posts = (): ReactElement => {
  // Settings store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Tagged route param
  const { tagged } = useParams<{
    tagged: string;
  }>();

  // Posts store state
  const [
    limit,
    loading,
    offset,
    postElements,
    posts,
    tag,
    total,
    setLoading,
    setPostHover,
    setPostElements,
    setPosts,
    addPosts,
    setTag
  ] = usePostsStore((state: PostsState) => [
    state.limit,
    state.loading,
    state.offset,
    state.postElements,
    state.posts,
    state.tag,
    state.total,
    state.setLoading,
    state.setPostHover,
    state.setPostElements,
    state.setPosts,
    state.addPosts,
    state.setTag
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
    // Cleanup on component unmount
    return () => {
      setPostHover(null);
    };
    // eslint-disable-next-line
  }, []);

  // Effect on loading and mounted state change
  useEffect(() => {
    if (loading && mounted && postsLoadingElem.current) {
      postsLoadingElem.current.style.opacity = '1';
    } else if (!loading && mounted && postsLoadingElem.current) {
      postsLoadingElem.current.style.opacity = '0';
    }

    if (posts?.length < 1) {
      // Set no result feedback visible
      if (!loading && mounted && postsEmptyElem.current) {
        postsEmptyElem.current.style.opacity = '1';
      }
    }
    // eslint-disable-next-line
  }, [loading, mounted]);

  // Effect on posts state change
  useEffect(() => {
    const setElements = async () => {
      // Check if posts were added
      if (posts?.length > postElements.length) {
        setLoading(true);
        const elements: JSX.Element[] = [];
        // Set start index to push new react elements (posts) into view
        const startIndex = postElements.length;
        for (let i = startIndex > -1 ? startIndex : 0; i < posts.length; i++) {
          if (posts[i].type === 'photo') {
            elements.push(<Post key={i} post={posts[i]} />);
            setPostElements(postElements.concat(elements));
            // Set loading to false after last element is rendered
          }
          if (i === posts.length - 1) {
            setLoading(false);
          }
        }
      }
    };
    setElements();
    // eslint-disable-next-line
  }, [posts]);

  // Effect on tagged param state change
  useEffect(() => {
    // Reset posts
    if (tagged !== tag) {
      setTag(tagged);
      setLoading(true);
      setPostElements([]);
      setPosts(limit, 0, tagged);
    }
    // Set document title based on tag
    !tagged && setSubtitle('');
    tagged && setSubtitle(` • #${tagged}`);
    // eslint-disable-next-line
  }, [tagged]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = () => {
    if (total >= offset + limit) {
      setLoading(true);
      addPosts(limit, offset + limit, tagged);
    }
  };

  return (
    <InfiniteScroll
      dataLength={postElements.length}
      hasMore
      loader={null}
      next={onAddPosts}
      scrollThreshold={1}
      className='posts'
    >
      <div ref={postsLoadingElem} className='posts-loading'>
        <Spinner size={10} />
      </div>
      {tag && (
        <div className='posts-tag'>
          <PostsTag />
        </div>
      )}
      {postElements}
      <div ref={postsEmptyElem} className='posts-empty'>
        No results found {tagged && `with hashtag #${tagged}.`}
      </div>
    </InfiniteScroll>
  );
};

export default Posts;
