import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isDesktop, isFirefox, isMobile } from 'react-device-detect';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

// Components
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui/IconButton';
import { MenuCustomTag } from './MenuCustomTag';
import { MenuExternalLink } from './MenuExternalLink';

// Hooks
import { useSharedUtils } from '../hooks/use-shared-utils.hook';

// Models
import { CustomTag } from '../models/custom-tag.interface';
import {
  MenuExternalLink as IMenuExternalLink,
  MenuLink
} from '../models/menu-link.interface';
import { SharedState } from '../models/shared-state.interface';

// Stores
import useSharedStore from '../store/shared.store';

export const Menu = (): ReactElement => {
  const history = useHistory();
  const {
    customTagsGet,
    menuExternalLinksGet,
    menuLinksGet
  } = useSharedUtils();

  // Menu element references
  const menuSearchElem = useRef<HTMLInputElement>(null);

  // Shared store state
  const [theme, setTheme] = useSharedStore((state: SharedState) => [
    state.theme,
    state.setTheme
  ]);

  // Component state
  const [customTags, setCustomTags] = useState<CustomTag[]>([]);
  const [menu, setMenu] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Set application theme (and custom tags) on mount
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light');
    const getCustomTags = async () => {
      setCustomTags(await customTagsGet());
    };
    process.env.REACT_APP_TAGS_CUSTOM && getCustomTags();
    // eslint-disable-next-line
  }, []);

  /**
   * Search for tags.
   */
  const onSearch = useCallback(() => {
    if (searchValue) {
      let searchVal = searchValue;
      if (searchVal.charAt(0) === '#') {
        searchVal = searchVal.substring(1, searchVal.length);
      }
      toggleMenu();
      setSearchValue('');
      // #BUG: Firefox mobile crash on input blur
      if (menuSearchElem.current && !isFirefox) {
        menuSearchElem.current.blur();
      }
      history.push('/tagged/' + searchVal.toLocaleLowerCase());
    }
    // eslint-disable-next-line
  }, [searchValue]);

  /**
   * Toggles menu.
   */
  const toggleMenu = useCallback(() => {
    setMenu(!menu);
    // eslint-disable-next-line
  }, [menu]);

  /**
   * Toggles theme.
   */
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // eslint-disable-next-line
  }, [theme]);

  return (
    <>
      <button
        onClick={toggleMenu}
        className={clsx(
          'fixed flex items-center justify-end right-4 top-4 text-lg z-40',
          'md:right-8 md:text-xl md:top-8 xl:right-12 xl:top-10 3xl:right-16 3xl:top-12 4xl:right-20 4xl:text-3xl 4xl:top-14',
          isDesktop &&
            'border-b-2 border-transparent duration-200 transition-colors hover:border-app',
          isMobile && 'tap-highlight'
        )}
      >
        {menu ? 'Close' : 'Menu'}
      </button>
      {menu && (
        <section
          onClick={toggleMenu}
          className={'fixed h-screen left-0 top-0 w-screen z-30'}
        ></section>
      )}

      <section
        className={clsx(
          'duration-500 ease-in-fast-out-slow fixed h-screen right-0 top-0 transform transition-all w-full z-30',
          'sm:shadow-menu sm:w-[480px]',
          menu ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="bg-menu duration-200 ease-in-out h-full transition-colors w-full">
          <div
            className={clsx(
              'box-border flex flex-col justify-between h-full px-4 py-8 w-full',
              'md:px-8 md:py-12 4xl:px-12 4xl:py-16'
            )}
          >
            <div className="flex flex-col">
              <div>
                <IconButton
                  classes="mb-2 tap-highlight lg:mb-4"
                  icon={['fas', theme === 'light' ? 'moon' : 'sun']}
                  onClick={toggleTheme}
                />
              </div>
              <div className="flex items-center">
                <IconButton
                  classes="justify-start mr-4"
                  icon={['fas', 'search']}
                  onClick={onSearch}
                />
                <div className="border-app border-b-2 relative w-full">
                  <input
                    placeholder="Search"
                    ref={menuSearchElem}
                    value={searchValue}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        onSearch();
                      }
                    }}
                    onChange={event => setSearchValue(event.target.value)}
                    className="placeholder-sub py-1 left-0 w-full"
                  />
                  <Transition
                    show={searchValue.length > 0}
                    enter="transition-opacity duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute h-8 right-0 top-0"
                  >
                    <IconButton
                      icon={['fas', 'times']}
                      iconSize="text-md"
                      onClick={() => setSearchValue('')}
                    />
                  </Transition>
                </div>
              </div>
              <nav className="flex flex-col font-medium items-center pt-8 sm:pt-16">
                {menuLinksGet().map((link: MenuLink, index: number) => {
                  return (
                    <Link
                      key={index}
                      to={link.to}
                      onClick={toggleMenu}
                      className={clsx(
                        'border-b border-transparent my-1 tap-highlight text-lg lg:border-b-2 lg:my-2 lg:text-xl 3xl:text-2xl',
                        isDesktop &&
                          'duration-200 transition-all hover:border-app'
                      )}
                    >
                      {link.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex flex-col">
              {customTags?.length > 0 && (
                <div className="flex flex-wrap justify-center mt-4 xl:mt-8">
                  {customTags.map((customTag: CustomTag, index: number) => (
                    <MenuCustomTag
                      classes={customTag.classes}
                      key={index}
                      name={customTag.name}
                      tag={customTag.tag}
                      // styles="bg-[#2a7230] px-2 rounded-full hover:bg-icon"
                      styles={customTag.styles}
                      onClick={toggleMenu}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap justify-center mt-4 xl:mt-8">
                {menuExternalLinksGet().map(
                  (link: IMenuExternalLink, index: number) => (
                    <MenuExternalLink key={index} link={link} />
                  )
                )}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs xl:mt-8">
                <div className="flex items-center">
                  <Icon
                    color="text-sub"
                    icon={['far', 'copyright']}
                    size="text-xs"
                  />
                  <span className="ml-2 text-sub">
                    {process.env.REACT_APP_COPYRIGHT}
                  </span>
                </div>
                <div className="flex items-center">
                  <a
                    href="https://www.tumblr.com/policy/de/impressum"
                    rel="noreferrer"
                    target="_blank"
                    className={clsx(
                      'mr-4',
                      isDesktop &&
                        'border-b border-transparent duration-200 transition-colors hover:border-app',
                      isMobile && 'tap-highlight'
                    )}
                  >
                    Imprint
                  </a>
                  <a
                    href="https://www.tumblr.com/privacy/de"
                    rel="noreferrer"
                    target="_blank"
                    className={clsx(
                      isDesktop &&
                        'border-b border-transparent duration-200 transition-colors hover:border-app',
                      isMobile && 'tap-highlight'
                    )}
                  >
                    Privacy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
