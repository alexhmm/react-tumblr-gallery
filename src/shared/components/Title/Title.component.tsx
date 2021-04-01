import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { BlogInfo } from '../../models/blog-info.interface';
import { SharedState } from '../../models/shared-state.interface';
import useSharedStore from '../../store/shared.store';
import { getBlogInfo } from '../../utils/shared.utils';

import './title.scss';

const Title = (): ReactElement => {
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
    const getInfo = async () => {
      const blogInfo: BlogInfo = await getBlogInfo();
      if (blogInfo) {
        setTitle(blogInfo.title);
      }
    };
    getInfo();

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
      document.title = title ? (subtitle ? title + subtitle : title) : '';
    }
    // eslint-disable-next-line
  }, [title, subtitle]);

  return (
    <Link to='/'>
      <header ref={titleElem} className='title'>
        {title}
      </header>
    </Link>
  );
};

export default Title;
