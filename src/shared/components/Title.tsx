import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import clsx from 'clsx';

// Components
import { Icon } from '../ui/Icon';

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
    <button
      disabled={!subtitle}
      onClick={subtitle ? onClickBack : onClickHome}
      className={clsx(
        'duration-200 fixed flex group items-center left-4 max-w-[calc(100%-90px)] opacity-0 overflow-hidden text-lg top-4 transition-all whitespace-nowrap z-20',
        'md:left-8 md:max-w-[calc(100%-160px)] md:text-xl md:top-8 xl:left-12 xl:max-w-[calc(100%-200px)] xl:top-10',
        '3xl:left-16 3xl:max-w-[calc(100%-240px)] 3xl:top-12 4xl:left-20 4xl:text-3xl 4xl:top-12',
        init && title && 'opacity-100',
        isDesktop && 'disabled:cursor-default',
        isMobile && 'tap-highlight'
      )}
    >
      {subtitle ? (
        <>
          <Icon
            color={clsx(isDesktop && 'border-b-2 border-transparent')}
            icon={['fas', 'arrow-left']}
          />
          <span
            className={clsx(
              'ml-2 truncate md:ml-4',
              isDesktop &&
                subtitle &&
                'border-b-2 border-transparent duration-200 transition-colors group-hover:border-app'
            )}
          >
            {subtitle.text}
          </span>
        </>
      ) : (
        <span className={clsx(isDesktop && 'border-b-2 border-transparent')}>
          {title}
        </span>
      )}
    </button>
  );
};

export default Title;
