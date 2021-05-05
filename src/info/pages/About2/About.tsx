import { Fragment, ReactElement, useEffect, useRef } from 'react';

import useSharedStore, {
  SharedStore
} from '../../../shared/store/shared.store';

import './About.scss';

const About = (): ReactElement => {
  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedStore) => [
    state.setSubtitle
  ]);

  // Element references
  const aboutElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (aboutElem.current) {
        aboutElem.current.style.opacity = '1';
      }
    }, 500);

    setSubtitle({ document: 'About', text: 'About' });
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <div ref={aboutElem} className="about">
        {process.env.REACT_APP_ABOUT && (
          <div
            dangerouslySetInnerHTML={{ __html: process.env.REACT_APP_ABOUT }}
            className="about-container"
          ></div>
        )}
      </div>
    </Fragment>
  );
};

export default About;
