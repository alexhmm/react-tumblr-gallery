import { ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import useDimensions from '../../../shared/hooks/useDimensions.hook';

import './post-detail.scss';
import { PostsState } from '../../models/posts-state.interface';
import usePostsStore from '../../store/posts.store';
import { setPostSourceDetail } from '../../utils/posts.utils';

const PostDetail = (): ReactElement => {
  const dimensions = useDimensions();

  // Post element reference
  const postElem = useRef<HTMLDivElement>(null);

  // Post id route param
  const { postId } = useParams<{
    postId: string;
  }>();

  // Posts store state
  const [post, setPost] = usePostsStore((state: PostsState) => [
    state.post,
    state.setPost
  ]);

  // Component state
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState<boolean>(false);

  /**
   * Set post on component mount
   */
  useEffect(() => {
    setPost(postId);
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
    // eslint-disable-next-line
  }, []);

  /**
   * Reset post source on resize.
   */
  useEffect(() => {
    const img = setPostSourceDetail(imgWidth, post?.photos[0]?.alt_sizes);
    setImgSrc(img.imgSrc);
    setImgWidth(img.imgWidth);
    // eslint-disable-next-line
  }, [dimensions, post]);

  // Set opacity on mounted state
  useEffect(() => {
    if (mounted && postElem.current && post?.id_string === postId) {
      postElem.current.style.opacity = '1';
    }
    // eslint-disable-next-line
  }, [mounted, post]);

  return (
    <div ref={postElem} className='post-detail'>
      {post && post.id_string === postId && (
        <img alt={post?.caption} src={imgSrc} className='post-detail-src' />
      )}
    </div>
  );
};

export default PostDetail;
