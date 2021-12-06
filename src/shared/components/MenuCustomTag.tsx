import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import clsx from 'clsx';

type MenuCustomTagProps = {
  classes?: string;
  name?: string;
  styles?: CSSProperties;
  tag: string;
  onClick: () => void;
};

export const MenuCustomTag = (props: MenuCustomTagProps) => {
  return (
    <Link
      key={props.tag}
      to={'/tagged/' + props.tag}
      className={clsx(
        'mb-2 mr-2',
        isDesktop && 'duration-200 transition-colors',
        isDesktop &&
          !props.classes &&
          !props.styles &&
          'border-b-2 border-transparent hover:border-app',
        isMobile && 'tap-highlight-transparent',
        props.classes && props.classes
      )}
      onClick={props.onClick}
      style={props.styles && props.styles}
    >
      {props.name ?? props.tag}
    </Link>
  );
};
