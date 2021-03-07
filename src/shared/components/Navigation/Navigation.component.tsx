import React, { ReactElement } from 'react';

import './navigation.scss';

const Navigation = (): ReactElement => {
  return (
    <nav className='navigation'>
      <input placeholder='Search' className='navigation-search'></input>
      <section className='navigation-menu'>Menu</section>
    </nav>
  );
};

export default Navigation;
