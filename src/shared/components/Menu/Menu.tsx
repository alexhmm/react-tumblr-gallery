import { Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Components
import Icon from '../../ui/Icon2/Icon';

// Stores
import usePostsStore, { PostsStore } from '../../../posts/store/posts.store';
import useSharedStore, { SharedStore } from '../../store/shared.store';

import './Menu.scss';

const Menu = (): ReactElement => {
  // React router history
  const history = useHistory();

  // Menu element references
  const menuBtnElem = useRef<HTMLDivElement>(null);
  const menuContainerElem = useRef<HTMLDivElement>(null);
  const menuSearchElem = useRef<HTMLInputElement>(null);

  // Shared store state
  const [theme, setTheme] = useSharedStore((state: SharedStore) => [
    state.theme,
    state.setTheme
  ]);

  // Posts store state
  const [limit, setPosts] = usePostsStore((state: PostsStore) => [
    state.limit,
    state.setPosts
  ]);

  // Component state
  const [menu, setMenu] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Effects on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));

    // Set application theme on mount
    setTheme(localStorage.getItem('theme') || 'light');
    // eslint-disable-next-line
  }, []);

  // Set opacity on mounted state
  useEffect(() => {
    if (mounted && menuBtnElem.current) {
      menuBtnElem.current.style.opacity = '1';
    }
  }, [mounted]);

  /**
   * Search for tags.
   */
  const search = () => {
    if (searchValue) {
      let searchVal = searchValue;
      if (searchVal.charAt(0) === '#') {
        searchVal = searchVal.substring(1, searchVal.length);
      }
      toggleMenu();
      if (menuSearchElem.current) {
        menuSearchElem.current.blur();
      }
      setSearchValue('');
      setPosts(limit, 0, searchVal.toLocaleLowerCase());
      history.push('/tagged/' + searchVal.toLocaleLowerCase());
    }
  };

  /**
   * Toggles menu.
   */
  const toggleMenu = () => {
    if (menuContainerElem && menuContainerElem.current) {
      menuContainerElem.current.style.transform = menu
        ? 'translateX(100%)'
        : 'translateX(0%)';
      setMenu(!menu);
    }
  };

  /**
   * Toggles theme.
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Fragment>
      <section ref={menuBtnElem} onClick={toggleMenu} className="menu-button">
        {menu ? 'Close' : 'Menu'}
      </section>
      {menu && (
        <section onClick={toggleMenu} className="menu-backdrop"></section>
      )}
      <section ref={menuContainerElem} className="menu-container">
        <div className="menu-container-content">
          <div className="menu-container-content-theme">
            <Icon
              button
              size={18}
              onClick={toggleTheme}
              style={{ padding: 8 }}
              classes={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}
            />
          </div>
          <div className="menu-container-content-top">
            <input
              ref={menuSearchElem}
              placeholder="Search"
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  search();
                }
              }}
              onChange={event => setSearchValue(event.target.value)}
              value={searchValue}
              className="menu-container-content-top-search"
            ></input>
            <nav className="menu-container-content-top-nav">
              <Link
                to="/"
                onClick={toggleMenu}
                className="menu-container-content-top-nav-item"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={toggleMenu}
                className="menu-container-content-top-nav-item"
              >
                About
              </Link>
              {process.env.REACT_APP_CONTRIBUTORS && (
                <Link
                  to="/contributors"
                  onClick={toggleMenu}
                  className="menu-container-content-top-nav-item"
                >
                  Contributors
                </Link>
              )}
            </nav>
          </div>
          <div className="menu-container-content-bottom">
            <div className="menu-container-content-bottom-social">
              {process.env.REACT_APP_SOCIAL_FACEBOOK && (
                <a
                  href={
                    'https://www.facebook.com/' +
                    process.env.REACT_APP_SOCIAL_FACEBOOK
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  Facebook
                </a>
              )}
              {process.env.REACT_APP_SOCIAL_GITHUB && (
                <a
                  href={
                    'https://github.com/' + process.env.REACT_APP_SOCIAL_GITHUB
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  Github
                </a>
              )}
              {process.env.REACT_APP_SOCIAL_SNAPCHAT && (
                <a
                  href={
                    'https://story.snapchat.com/s/' +
                    process.env.REACT_APP_SOCIAL_SNAPCHAT
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  Snapchat
                </a>
              )}
              {process.env.REACT_APP_SOCIAL_INSTAGRAM && (
                <a
                  href={
                    'https://instagram.com/' +
                    process.env.REACT_APP_SOCIAL_INSTAGRAM
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              )}

              {process.env.REACT_APP_SOCIAL_TIKTOK && (
                <a
                  href={
                    'https://www.tiktok.com/@' +
                    process.env.REACT_APP_SOCIAL_TIKTOK
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  TikTok
                </a>
              )}
              {process.env.REACT_APP_SOCIAL_TWITCH && (
                <a
                  href={
                    'https://www.twitch.tv/' +
                    process.env.REACT_APP_SOCIAL_TWITCH
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  Twitch
                </a>
              )}
              {process.env.REACT_APP_SOCIAL_TWITTER && (
                <a
                  href={
                    'https://twitter.com/' +
                    process.env.REACT_APP_SOCIAL_TWITTER
                  }
                  className="menu-container-content-bottom-social-item"
                  rel="noreferrer"
                  target="_blank"
                >
                  Twitter
                </a>
              )}
            </div>
            <div className="menu-container-content-bottom-info">
              <div className="menu-container-content-bottom-info-copyright">
                <Icon size={14} classes="far fa-copyright" />
                <span className="menu-container-content-bottom-info-copyright-text">
                  {process.env.REACT_APP_COPYRIGHT}
                </span>
              </div>
              <a
                href="https://www.tumblr.com/"
                rel="noreferrer"
                target="_blank"
                className="menu-container-content-bottom-info-powered"
              >
                <span className="menu-container-content-bottom-info-powered-text">
                  powered by
                </span>
                <Icon size={14} classes="fab fa-tumblr" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Menu;
