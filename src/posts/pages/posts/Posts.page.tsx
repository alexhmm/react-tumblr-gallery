import { ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Post from '../../components/post/Post.component';
import Spinner from '../../../shared/components/spinner/spinner';

// Models
import { PostsState } from '../../models/posts-state.interface';

// Stores
import usePostsStore from '../../store/posts.store';

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
    offset,
    postElements,
    posts,
    tag,
    total,
    setLoading,
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
    state.setPostElements,
    state.setPosts,
    state.addPosts,
    state.setTag
  ]);

  // Posts element references
  const postsLoadingElem = useRef<HTMLDivElement>(null);

  // Component state
  const [mounted, setMounted] = useState<boolean>(false);

  /**
   * Set post on component mount
   */
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (loading && mounted && postsLoadingElem.current) {
      postsLoadingElem.current.style.opacity = '1';
    } else if (!loading && mounted && postsLoadingElem.current) {
      postsLoadingElem.current.style.opacity = '0';
    }
  }, [loading, mounted]);

  /**
   * Set post elements on posts change.
   */
  useEffect(() => {
    const setElements = async () => {
      // Check if posts were added
      if (posts?.length > postElements.length) {
        setLoading(true);
        const elements: JSX.Element[] = [];
        const startIndex = posts.length - limit;
        for (let i = startIndex > -1 ? startIndex : 0; i < posts.length; i++) {
          if (posts[i].type === 'photo') {
            elements.push(<Post key={posts[i].id} post={posts[i]} />);
            setPostElements(postElements.concat(elements));
            // Set loading to false after last element is rendered
            if (i === posts.length - 1) {
              setLoading(false);
            }
          }
        }
      }
    };
    setElements();
    // eslint-disable-next-line
  }, [posts]);

  /**
   * Check if param tag has changed.
   */
  useEffect(() => {
    // Reset posts
    if (tagged && tagged !== tag) {
      setTag(tagged);
    }
    setLoading(true);
    setPostElements([]);
    setPosts(limit, 0, tagged);
    // eslint-disable-next-line
  }, [tagged]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = () => {
    setLoading(true);
    addPosts(limit, offset + limit, tagged);
  };

  return (
    <section className='posts'>
      <div ref={postsLoadingElem} className='posts-loading'>
        <Spinner size={10} />
      </div>
      {postElements}
      {!loading && offset + limit < total && (
        <div onClick={onAddPosts} className='posts-more'>
          more
        </div>
      )}
    </section>
  );
};

export default Posts;
