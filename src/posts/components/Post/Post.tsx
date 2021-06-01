import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

// Components
import Icon from '../../../shared/ui/Icon/Icon';

// Hooks
import useDimensions from '../../../shared/hooks/use-dimensions.hook';

// Models
import { Contributor } from '../../../shared/models/contributor.interface';
import { Post as PostType } from '../../models/post.interface';

// Utils
import { setPostSourceGallery } from '../../utils/posts.utils';

import './Post.scss';

const Post = (props: { post: PostType }): ReactElement => {
  const dimensions = useDimensions();

  // Post element references
  const postElem: any = useRef<HTMLDivElement>(null);
  const postContainerElem = useRef<HTMLDivElement>(null);

  // Component state
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Effect on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

    dayjs.extend(LocalizedFormat);
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

  useEffect(() => {
    if (props.post) {
      // Set post date
      // console.log('timestamp', props.post.timestamp);
      setDate(dayjs.unix(props.post.timestamp).format('LL'));

      // Get post contributor
      if (process.env.REACT_APP_CONTRIBUTORS && props?.post?.tags) {
        const contributors: Contributor[] = JSON.parse(
          process.env.REACT_APP_CONTRIBUTORS
        );
        // Iterate through contributor array
        for (const contributor of contributors) {
          const matchedTag = props.post.tags.find(
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
  }, [props.post]);

  return (
    <article ref={postElem} className="post">
      <div ref={postContainerElem} className="post-container">
        <div className="post-container-photo">
          <img
            alt={props?.post?.caption}
            src={imgSrc}
            onLoad={() => setLoaded(true)}
            className="post-container-photo-src"
          />
          <div className="post-container-photo-overlay">
            <Link
              to={'/post/' + props.post.id_string}
              className="post-container-photo-overlay-link"
            />
            <div className="post-container-photo-overlay-group">
              <Link
                to={'/post/' + props.post.id_string}
                className="post-container-photo-overlay-group-notes"
              >
                <Icon
                  classes="fas fa-heart"
                  size={16}
                  style={{ color: 'rgb(226, 72, 85)' }}
                />
                <span className="post-container-photo-overlay-group-text">
                  {props?.post?.note_count}
                </span>
              </Link>
              {contributor && (
                <a
                  href={contributor.href}
                  className="post-container-photo-overlay-group-contributor"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon
                    classes="fas fa-camera"
                    size={16}
                    style={{ color: 'white' }}
                  />
                  <span className="post-container-photo-overlay-group-text">
                    {contributor.name}
                  </span>
                </a>
              )}
            </div>
            <div className="post-container-photo-overlay-content">
              {date && (
                <Link
                  to={'/post/' + props.post.id_string}
                  className="post-container-photo-overlay-content-date"
                >
                  {date}
                </Link>
              )}
              <Link
                to={'/post/' + props.post.id_string}
                className="post-container-photo-overlay-content-title"
              >
                {props?.post?.summary}
              </Link>
              <div className="post-container-photo-overlay-content-tags">
                {props?.post?.tags?.map((tag: string) => (
                  <Link
                    key={tag}
                    to={'/tagged/' + tag}
                    className="post-container-photo-overlay-content-tags-item"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
