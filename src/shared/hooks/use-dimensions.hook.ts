import { useEffect, useState } from 'react';

/**
 * Debounce function.
 * @param fn Function
 * @param ms Miliseconds
 * @returns Debounce
 */
const debounce = (fn: Function, ms: number) => {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, ms);
  };
};

/**
 * Debounced dimensions hook.
 * @returns Dimensions
 */
export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 250);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  return { dimensions };
};
