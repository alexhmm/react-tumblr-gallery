import './Loader.scss';

type LoaderProps = {
  size: number;
};

const Loader = (props: LoaderProps) => {
  return (
    <div className="loader">
      <div
        className="bounce1"
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
      <div
        className="bounce2"
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
      <div
        className="bounce3"
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
    </div>
  );
};

export default Loader;
