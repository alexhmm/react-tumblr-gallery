import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import clsx from 'clsx';

// Components
import Icon from '../ui/Icon/Icon';

// Hooks
import { useSharedUtils } from '../hooks/use-shared-utils.hook';

// Models
import { BlogInfo } from '../models/blog-info.interface';
import { SharedState } from '../models/shared-state.interface';

// Stores
import useSharedStore from '../store/shared.store';

export const Title = (): ReactElement => {
  const history = useHistory();
  const { blogInfoGet } = useSharedUtils();

  // Component state
  const [init, setInit] = useState<boolean>(false);

  // Shared store state
  const [subtitle, title, setTitle] = useSharedStore((state: SharedState) => [
    state.subtitle,
    state.title,
    state.setTitle
  ]);

  // Effect on component mount
  useEffect(() => {
    if (!process.env.REACT_APP_TITLE) {
      // Get title from tumblr blog info
      const getInfo = async () => {
        const blogInfo: BlogInfo = await blogInfoGet();
        if (blogInfo) {
          setTitle(blogInfo.title);
        }
      };
      getInfo();
    }

    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setInit(true));
    // eslint-disable-next-line
  }, []);

  // Effect on title / subtitle change
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title
        ? subtitle?.document
          ? `${title} •  ${subtitle.document}`
          : title
        : '';
    }

    // eslint-disable-next-line
  }, [title, subtitle]);

  /**
   * Handler on backdrop click to navigate back.
   */
  const onClickBack = useCallback(() => {
    if (history.length > 2) {
      history.goBack();
    } else {
      onClickHome();
    }
    // eslint-disable-next-line
  }, [history]);

  /**
   * Handler on to navigate back to gallery.
   */
  const onClickHome = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <header
      onClick={subtitle ? onClickBack : onClickHome}
      className={clsx(
        'duration-200 fixed flex h-8 items-center max-w-[calc(100%-90px)] opacity-0 overflow-hidden top-4 transition-all whitespace-nowrap z-20',
        'md:h-12 md:max-w-[calc(100%-160px)] xl:max-w-[calc(100%-200px)] xl:top-8 3xl:max-w-[calc(100%-240px)] 4xl:h-16 4xl:top-12',
        init && title && 'opacity-100',
        isDesktop && 'cursor-pointer duration-200 group hover:text-primary',
        isMobile && 'tap-highlight-0',
        // 'left-2 text-xl md:left-6 md:text-2xl xl:left-10 3xl:left-14 4xl:left-20'
        // 'left-4 text-2xl md:left-8 md:text-3xl xl:left-12 3xl:left-16 4xl:left-24 4xl:text-5xl'
        'left-4 text-xl md:left-8 md:text-2xl xl:left-12 3xl:left-16 4xl:left-24 4xl:text-3xl'
        // subtitle
        //   ? 'left-2 text-xl md:left-6 md:text-2xl xl:left-10 3xl:left-14 4xl:left-20'
        //   : 'left-4 text-2xl md:left-8 md:text-3xl xl:left-12 3xl:left-16 4xl:left-24 4xl:text-5xl'
      )}
    >
      {subtitle ? (
        <>
          <Icon
            button
            classes={clsx(
              'fas fa-arrow-left p-2',
              isDesktop &&
                'duration-200 transition-colors group-hover:text-primary'
            )}
            size={16}
          />
          <span className="ml-1 truncate md:ml-2">{subtitle.text}</span>
        </>
      ) : (
        <>{title}</>
      )}
    </header>
  );
};

export default Title;
