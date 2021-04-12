import { ReactElement } from 'react';

import './icon.scss';

const Icon = (props: {
  button?: boolean;
  classes: string;
  size?: number;
}): ReactElement => {
  const classList: string[] = ['icon'];
  props.button && classList.push('icon-button');
  classList.push(props.classes);
  return (
    <i
      className={classList.join(' ')}
      style={props.size ? { fontSize: props.size } : {}}
    ></i>
  );
};

export default Icon;
