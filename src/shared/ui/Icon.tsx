import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';

type IconProps = {
  color?: string;
  classes?: string;
  icon: IconProp;
  iconClasses?: string;
  size?: string;
  onClick?: () => void;
};

export const Icon = (props: IconProps): ReactElement => {
  return (
    <div
      onClick={props.onClick && props.onClick}
      className={clsx('flex items-center', props.classes && props.classes)}
    >
      <FontAwesomeIcon
        icon={props.icon}
        className={clsx(
          props.color ?? 'text-app',
          props.iconClasses && props.iconClasses,
          props.size && props.size,
          !props.size && 'text-lg'
        )}
      />
    </div>
  );
};
