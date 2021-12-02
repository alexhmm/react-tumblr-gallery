import { Link } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import clsx from 'clsx';

type TagProps = {
  color?: string;
  tag: string;
};

export const Tag = (props: TagProps) => {
  if (!process.env.REACT_APP_TAGS_EXCLUDE?.includes(props.tag)) {
    return (
      <Link
        key={props.tag}
        to={'/tagged/' + props.tag}
        className={clsx(
          'mr-1 text-posts-tag z-40 ',
          isDesktop &&
            'border-b-2 border-transparent duration-200 transition-colors',
          isDesktop && !props.color && 'hover:text-app',
          isMobile && 'tap-highlight',
          props.color && props.color
        )}
      >
        #{props.tag}
      </Link>
    );
  } else {
    return null;
  }
};
