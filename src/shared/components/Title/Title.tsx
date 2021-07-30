import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useHistory } from 'react-router-dom';

// Components
import Icon from '../../ui/Icon/Icon';

// Models
import { BlogInfo } from '../../models/blog-info.interface';
import { SharedState } from '../../models/shared-state.interface';

// Stores
import useSharedStore from '../../store/shared.store';

// Styles
import './Title.scss';

// Utils
import { getBlogInfo } from '../../utils/shared.utils';

const Title = (): ReactElement => {
  const history = useHistory();

  // Title element reference
  const titleElem = useRef<HTMLDivElement>(null);

  // Component state
  const [mounted, setMounted] = useState<boolean>(false);

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
        const blogInfo: BlogInfo = await getBlogInfo();
        if (blogInfo) {
          setTitle(blogInfo.title);
        }
      };
      getInfo();
    }

    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

    // eslint-disable-next-line
  }, []);

  // Effect on title / subtitle change
  useEffect(() => {
    if (mounted && title && titleElem.current) {
      titleElem.current.style.opacity = '1';
    }

    // Set document title
    if (title) {
      document.title = title
        ? subtitle?.document
          ? `${title} •  ${subtitle.document}`
          : title
        : '';
    }

    // eslint-disable-next-line
  }, [mounted, title, subtitle]);

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
  const onClickHome = () => {
    // history.replace('/');
    history.push('/');
  };

  return (
    <header
      ref={titleElem}
      onClick={subtitle ? onClickBack : onClickHome}
      className={`title ${subtitle ? 'title-sub' : 'title-home'}`}
    >
      {subtitle ? (
        <Fragment>
          <Icon
            button
            classes="fas fa-arrow-left"
            size={16}
            style={{ padding: 8 }}
          />
          <span className="title-sub-text">{subtitle.text}</span>
        </Fragment>
      ) : (
        <Fragment>{title}</Fragment>
      )}
    </header>
  );
};

export default Title;
