import { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './posts.scss';
import Post from '../../components/post/Post.component';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';
import { wait } from '../../utils/posts.utils';

const Posts = (): ReactElement => {
  const { tagged } = useParams<{
    tagged: string;
  }>();

  // Posts store state
  const [
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

  /**
   * Set post elements on posts change.
   */
  useEffect(() => {
    const setElements = async () => {
      // Check if posts were added
      if (posts.length > postElements.length) {
        setLoading(true);
        const elements: JSX.Element[] = [];
        const startIndex =
          postElements.length - (postElements.length - postElements.length);
        for (let i = startIndex; i < posts.length; i++) {
          await wait(100);
          elements.push(<Post key={posts[i].id} post={posts[i]} />);
          setPostElements(postElements.concat(elements));
          // Set loading to false after last element is rendered
          if (i === posts.length - 1) {
            setLoading(false);
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
    if (tagged !== tag) {
      setLoading(true);
      setPostElements([]);
      setPosts(0, null, tagged);
      setTag(tagged);
    }
    // eslint-disable-next-line
  }, [tagged]);

  /**
   * Handler to add posts.
   */
  const onAddPosts = () => {
    setLoading(true);
    addPosts(offset + 20, tagged);
  };

  return (
    <section className='posts'>
      {postElements}
      {!loading && posts.length < total && (
        <div onClick={onAddPosts} className='posts-more'>
          more
        </div>
      )}
    </section>
  );
};

export default Posts;
