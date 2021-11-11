import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import clsx from 'clsx';

// Components
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui/IconButton';

// Hooks
import { useSharedUtils } from '../hooks/use-shared-utils.hook';

// Models
import { MenuExternalLink, MenuLink } from '../models/menu-link.interface';
import { SharedState } from '../models/shared-state.interface';

// Stores
import useSharedStore from '../store/shared.store';

export const Menu = (): ReactElement => {
  const history = useHistory();
  const { menuExternalLinksGet, menuLinksGet } = useSharedUtils();

  // Menu element references
  // const menuSearchElem = useRef<HTMLInputElement>(null);

  // Shared store state
  const [theme, setTheme] = useSharedStore((state: SharedState) => [
    state.theme,
    state.setTheme
  ]);

  // Component state
  const [menu, setMenu] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Effects on component mount
  useEffect(() => {
    // Set application theme on mount
    setTheme(localStorage.getItem('theme') || 'light');
    // eslint-disable-next-line
  }, []);

  /**
   * Search for tags.
   */
  const search = useCallback(() => {
    if (searchValue) {
      let searchVal = searchValue;
      if (searchVal.charAt(0) === '#') {
        searchVal = searchVal.substring(1, searchVal.length);
      }
      toggleMenu();
      // if (menuSearchElem.current) {
      //   menuSearchElem.current.blur();
      // }
      setSearchValue('');
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
      <section
        onClick={toggleMenu}
        className={clsx(
          'duration-200 fixed flex h-8 items-center justify-end right-4 top-4 transition-all z-40',
          'md:h-12 md:right-8 md:text-xl xl:right-12 xl:top-8 3xl:right-16 4xl:h-16 4xl:right-24 4xl:top-12 4xl:text-3xl',
          isDesktop && 'cursor-pointer hover:text-hover',
          isMobile && 'tap-highlight'
        )}
      >
        {menu ? 'Close' : 'Menu'}
      </section>
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
              'box-border flex flex-col justify-between h-full pb-4 px-4 pt-16 w-full',
              'md:px-8 md:pb-8 md:pt-24 4xl:pb-12 4xl:px-12 4xl:pt-32'
            )}
          >
            <div className="flex flex-col">
              <div className="flex items-center w-full">
                <IconButton
                  classes="mr-4"
                  icon={['fas', theme === 'light' ? 'moon' : 'sun']}
                  onClick={toggleTheme}
                />
                <Icon icon={['fas', 'search']} classes="mr-2 p-2" />
                <input
                  placeholder="Search"
                  onKeyPress={event => {
                    if (event.key === 'Enter') {
                      search();
                    }
                  }}
                  onChange={event => setSearchValue(event.target.value)}
                  style={{
                    borderBottom: '2px',
                    borderBottomStyle: 'solid'
                  }}
                  value={searchValue}
                  className="py-1 w-full"
                ></input>
              </div>
              <nav className="flex flex-col font-medium items-end pt-8 tap-highlight-0 sm:pt-16">
                {menuLinksGet().map((link: MenuLink, index: number) => {
                  return (
                    <Link
                      key={index}
                      to={link.to}
                      onClick={toggleMenu}
                      className={clsx(
                        'py-2 text-xl sm:text-2xl xl:py-3 xl:text-3xl 3xl:text-4xl',
                        isDesktop &&
                          'duration-200 transition-colors hover:text-hover',
                        isMobile && 'active:text-hover'
                      )}
                    >
                      {link.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap mt-4 xl:mt-8">
                {menuExternalLinksGet().map(
                  (link: MenuExternalLink, index: number) => {
                    return (
                      <a
                        key={index}
                        href={link.to}
                        rel="noreferrer"
                        target="_blank"
                        className="flex group items-center pb-1 pr-4 tap-highlight-0"
                      >
                        <Icon
                          color={clsx(
                            isDesktop &&
                              'duration-200 transition-colors group-hover:text-hover'
                          )}
                          icon={link.icon}
                        />
                        <span
                          className={clsx(
                            'ml-2 text-app ',
                            isDesktop &&
                              'duration-200 transition-colors group-hover:text-hover'
                          )}
                        >
                          {link.title}
                        </span>
                      </a>
                    );
                  }
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
                        'duration-200 transition-colors hover:text-hover'
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
                        'duration-200 transition-colors hover:text-hover'
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
