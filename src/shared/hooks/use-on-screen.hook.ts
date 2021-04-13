import { MutableRefObject, useEffect, useState } from 'react';

/**
 * https://usehooks.com/useOnScreen/
 * This hook allows you to easily detect when an element is visible on the screen as well as specify how much of the element should be visible before being considered on screen.
 * @param ref Ref
 * @param rootMargin Root margin
 * @returns On screen boolean
 */
const useOnScreen = <T extends Element>(
  ref: MutableRefObject<T>,
  rootMargin: string = '0px'
): boolean => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  useEffect(() => {
    if (ref && rootMargin) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update our state when observer callback fires
          setIntersecting(entry.isIntersecting);
        },
        {
          rootMargin
        }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => {
        observer.unobserve(ref.current);
      };
    }
  }, [ref, rootMargin]); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
};

export default useOnScreen;
