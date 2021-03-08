import React, { ReactElement, useEffect } from 'react';

import { SharedState } from '../../models/shared-state.interface';
import useSharedStore from '../../store/shared.store';

import './navigation.scss';

const Navigation = (): ReactElement => {
  // Shared store state
  const [theme, setTheme] = useSharedStore((state: SharedState) => [
    state.theme,
    state.setTheme
  ]);

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light');
    // eslint-disable-next-line
  }, []);

  /**
   * Toggles application theme
   */
  const onToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className='navigation'>
      <input placeholder='Search' className='navigation-search'></input>
      <section className='navigation-menu'>Menu</section>
      <section onClick={onToggleTheme} className='navigation-theme'>
        <div className='navigation-theme-container'></div>
      </section>
    </nav>
  );
};

export default Navigation;
