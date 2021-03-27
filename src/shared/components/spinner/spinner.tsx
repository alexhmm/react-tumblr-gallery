import './spinner.scss';

const Spinner = (props: { size: number }) => {
  return (
    <div className='spinner'>
      <div
        className='bounce1'
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
      <div
        className='bounce2'
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
      <div
        className='bounce3'
        style={{ height: props.size + 'px', width: props.size + 'px' }}
      ></div>
    </div>
  );
};

export default Spinner;
