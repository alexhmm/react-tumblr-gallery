import React, { ReactElement, useEffect } from 'react';

import { SharedState } from '../../models/shared-state.interface';
import useSharedStore from '../../store/shared.store';

import './theme.scss';

const Theme = (): ReactElement => {
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
    <section onClick={onToggleTheme} className='theme'>
      <div className='theme-container'></div>
    </section>
  );
};

export default Theme;
