import { CSSProperties, ReactElement } from 'react';

import './icon.scss';

const Icon = (props: {
  button?: boolean;
  classes: string;
  size?: number;
  style?: CSSProperties;
  onClick?: () => void;
}): ReactElement => {
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
      className={classList.join(' ')}
      onClick={props.onClick && props.onClick}
      style={styles}
    ></i>
  );
};

export default Icon;
