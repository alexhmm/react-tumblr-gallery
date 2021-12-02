import { isDesktop, isMobile } from 'react-device-detect';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';

// Components
import { Icon } from './Icon';

type IconButtonProps = {
  classes?: string;
  icon: IconProp;
  iconClasses?: string;
  iconColor?: string;
  iconSize?: string;
  padding?: string;
  onClick: () => void;
};

export const IconButton = (props: IconButtonProps) => {
  return (
    <button
      className={clsx(
        'group rounded-lg',
        props.classes && props.classes,
        props.padding ?? 'p-2',
        isDesktop && 'duration-200 transition-colors hover:bg-icon',
        isMobile && 'tap-highlight'
      )}
      onClick={props.onClick}
    >
      <Icon
        classes={clsx(props.iconClasses && props.iconClasses)}
        color={clsx(props.iconColor ?? 'text-app')}
        icon={props.icon}
        size={props.iconSize}
      />
    </button>
  );
};
