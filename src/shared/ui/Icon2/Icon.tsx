import { CSSProperties, forwardRef, ReactElement } from 'react';

import './Icon.scss';

type IconProps = {
  button?: boolean;
  classes: string;
  size?: number;
  style?: CSSProperties;
  onClick?: () => void;
};

export type IconRef = HTMLElement;

export const Icon = forwardRef<IconRef, IconProps>(
  (props, ref): ReactElement => {
    // Set icon classes
    const classList: string[] = ['icon'];
    props.button && classList.push('icon-button');
    classList.push(props.classes);

    // Set icon styles
    const styles = {};
    if (props.size) {
      Object.assign(styles, { fontSize: props.size });
    }
    if (props.style) {
      Object.assign(styles, { ...props.style });
    }
    return (
      <i
        ref={ref}
        className={classList.join(' ')}
        onClick={props.onClick && props.onClick}
        style={styles}
      ></i>
    );
  }
);

export default Icon;
