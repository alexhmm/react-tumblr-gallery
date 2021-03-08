import React, {
  Fragment,
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { Link } from 'react-router-dom';

import './menu.scss';

const Menu = (): ReactElement => {
  // Post element reference
  const menuElem = useRef<HTMLDivElement>(null);

  // Component state
  const [menu, setMenu] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Effects on component mount
  useEffect(() => {
    // Using window.requestAnimationFrame allows an action to be take after the next DOM paint
    window.requestAnimationFrame(() => setMounted(true));
  }, []);

  // Set opacity on mounted state
  useEffect(() => {
    if (mounted && menuElem.current) {
      // menuElem.current.style.opacity = '1';
    }
  }, [mounted]);

  const toggleMenu = () => {
    if (menuElem && menuElem.current) {
      menuElem.current.style.transform = menu
        ? 'translateX(100%)'
        : 'translateX(0%)';
      setMenu(!menu);
    }
  };

  return (
    <Fragment>
      <section onClick={toggleMenu} className='menu-button'>
        {menu ? 'Close' : 'Menu'}
      </section>
      {menu && (
        <section onClick={toggleMenu} className='menu-backdrop'></section>
      )}
      <section ref={menuElem} className='menu-container'>
        <div className='menu-container-content'>
          <div className='menu-container-content-top'>
            <input
              placeholder='Search'
              className='menu-container-content-top-search'
            ></input>
            <nav className='menu-container-content-top-nav'>
              <Link to='/' className='menu-container-content-top-nav-item'>
                Home
              </Link>
              <Link to='/about' className='menu-container-content-top-nav-item'>
                About
              </Link>
            </nav>
          </div>
          <div className='menu-container-content-bottom'>
            <div className='menu-container-content-bottom-social'>
              {process.env.REACT_APP_SOCIAL_FACEBOOK && (
                <a
                  href={
                    'https://www.facebook.com/' +
                    process.env.REACT_APP_SOCIAL_FACEBOOK
                  }
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
                >
                  Facebook
                </a>
              )}
              {process.env.REACT_APP_SOCIAL_GITHUB && (
                <a
                  href={
                    'https://github.com/' + process.env.REACT_APP_SOCIAL_GITHUB
                  }
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
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
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
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
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
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
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
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
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
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
                  className='menu-container-content-bottom-social-item'
                  rel='noreferrer'
                  target='_blank'
                >
                  Twitter
                </a>
              )}
            </div>
            <div className='menu-container-content-bottom-copyright'>
              {process.env.REACT_APP_COPYRIGHT}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Menu;
