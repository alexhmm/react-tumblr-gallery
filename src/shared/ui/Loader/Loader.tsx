import clsx from 'clsx';
import './Loader.scss';

type LoaderProps = {
  classes?: string;
  size: number;
};

const Loader = (props: LoaderProps) => {
  return (
    <div className={clsx('loader', props.classes && props.classes)}>
      <div
        className="bounce1 bg-loader"
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
      <div
        className="bounce2 bg-loader"
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
      <div
        className="bounce3 bg-loader"
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
    </div>
  );
};

export default Loader;
