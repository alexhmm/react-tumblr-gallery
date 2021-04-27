import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import useDimensions from '../../../shared/hooks/use-dimensions.hook';

import { Post as PostType } from '../../models/post.interface';
import { setPostSourceGallery } from '../../utils/posts.utils';

import './post.scss';

const Post = (props: { post: PostType }): ReactElement => {
  const dimensions = useDimensions();

  // Post element references
  const postElem: any = useRef<HTMLDivElement>(null);
  const postContainerElem = useRef<HTMLAnchorElement>(null);

  // Component state
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [tags, setTags] = useState<ReactNode[]>([]);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
  }, []);

  // Effect on dimensions change.
  useEffect(() => {
    // Reset post source on resize
    const img = setPostSourceGallery(
      imgWidth,
      props?.post?.photos[0]?.alt_sizes
    );
    setImgSrc(img.imgSrc);
    setImgWidth(img.imgWidth);
    // eslint-disable-next-line
  }, [dimensions]);

  // Effect on loaded & mounted state
  useEffect(() => {
    if (imgSrc && imgWidth && loaded && mounted && postElem.current) {
      // Fade in post
      postElem.current.style.opacity = '1';
    }
  }, [imgSrc, imgWidth, loaded, mounted]);

  // Effect on post change
  useEffect(() => {
    // TODO: Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>.
    const tagElements: ReactNode[] = [];
    for (const tag of props?.post?.tags) {
      tagElements.push(
        <Link
          key={tag}
          to={'/tagged/' + tag}
          className="post-container-caption-content-tag"
        >
          {'#' + tag}
        </Link>
      );
    }
    setTags(tagElements);
  }, [props.post, setTags]);

  return (
    <article ref={postElem} className="post">
      <Link
        to={'/post/' + props.post.id_string}
        ref={postContainerElem}
        className="post-container"
      >
        <div className="post-container-caption">
          <div className="post-container-caption-content">
            {props?.post?.summary && (
              <div className="post-container-caption-content-title">
                {props?.post?.summary}
              </div>
            )}
            {tags && tags}
          </div>
        </div>
        <div className="post-container-photo">
          <img
            alt={props?.post?.caption}
            src={imgSrc}
            onLoad={() => setLoaded(true)}
            className="post-container-photo-src"
          />
        </div>
      </Link>
    </article>
  );
};

export default Post;
