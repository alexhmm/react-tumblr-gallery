import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isDesktop } from 'react-device-detect';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import clsx from 'clsx';

// Components
import { Icon } from '../../shared/ui/Icon';

// Hooks
import { useDimensions } from '../../shared/hooks/use-dimensions.hook';
import { usePosts } from '../hooks/usePosts.hook';

// Models
import { Contributor } from '../../shared/models/contributor.interface';
import { Post as IPost } from '../models/post.interface';

export const Post = (props: { post: IPost }): ReactElement => {
  const { dimensions } = useDimensions();
  const { setPostSourceGallery } = usePosts();

  // Component state
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Effect on component mount
  useEffect(() => {
    dayjs.extend(LocalizedFormat);
  }, []);

  // Effect on dimensions change.
  useEffect(() => {
    // Reset post source on resize
    const img = setPostSourceGallery(props?.post?.photos[0]?.alt_sizes);
    setImgSrc(img.imgSrc);
    // eslint-disable-next-line
  }, [dimensions]);

  useEffect(() => {
    if (props.post) {
      // Set post date
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
    <article
      className={clsx(
        'box-border duration-500 flex items-center justify-center p-1 tap-highlight-post transition-opacity w-1/2 z-10',
        'sm:p-2 md:p-4 xl:p-6 xl:w-1/3 3xl:p-8 4xl:w-1/4',
        loaded ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        className={clsx(
          'relative w-full',
          isDesktop && 'duration-300 ease-in-out group transition-all'
        )}
      >
        <div className="flex justify-center overflow-hidden z-20">
          <img
            alt={props?.post?.caption}
            src={imgSrc}
            onLoad={() => setLoaded(true)}
            className={clsx(
              isDesktop &&
                'box-border duration-300 ease-in-out filter max-h-[1920px] max-w-full object-cover overflow-hidden transition-all group-hover:brightness-[.25]'
            )}
          />
          <Link
            to={'/post/' + props.post.id_string}
            className="absolute h-full left-0 top-0 w-full z-30"
          />
          <div
            className={clsx(
              'absolute h-full left-0 top-0 w-full',
              isDesktop ? 'block' : 'hidden',
              isDesktop &&
                'duration-300 ease-in-out opacity-0 transition-opacity group-hover:opacity-100'
            )}
          >
            <div className="absolute hidden items-center left-4 top-4 sm:flex 3xl:left-6 3xl:top-6 4xl:left-8 4xl:top-8">
              <div className="flex items-center">
                <Icon
                  color="text-like"
                  icon={['fas', 'heart']}
                  size="text-md"
                />
                <span className="ml-2 text-white">
                  {props?.post?.note_count}
                </span>
              </div>
              {contributor && (
                <a
                  href={contributor.href}
                  rel="noreferrer"
                  target="_blank"
                  className="duration-200 ease-in-out flex group items-center ml-4 transition-opacity z-40 sm:flex"
                >
                  <Icon
                    color="text-white"
                    icon={['fas', 'camera']}
                    size="text-md"
                  />
                  <span className="ml-2 text-white">{contributor.name}</span>
                </a>
              )}
            </div>
            <div
              className={clsx(
                'absolute bottom-4 flex flex-col left-4',
                'xl:w-[calc(100%-32px)] 3xl:bottom-6 3xl:left-6 3xl:w-[calc(100%-48px)] 4xl:bottom-8 4xl:h-[28px] 4xl:left-8 4xl:text-xl 2 4xl:w-[calc(100%-64px)]'
              )}
            >
              {date && (
                <div className="pb-1 text-posts-tag text-sm 3xl:pb-2">
                  {date}
                </div>
              )}
              <div
                className={clsx(
                  'mr-3 overflow-hidden text-white text-xl truncate uppercase w-full whitespace-nowrap',
                  'lg:pb-1 3xl:text-2xl 3xl:pb-2'
                )}
              >
                {props?.post?.summary}
              </div>
              <div className="hidden flex-wrap w-full lg:flex">
                {props?.post?.tags?.map((tag: string) => (
                  <Link
                    key={tag}
                    to={'/tagged/' + tag}
                    className="duration-200 mr-1 text-posts-tag transition-colors z-40 hover:text-white"
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
