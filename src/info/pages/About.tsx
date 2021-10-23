import { ReactElement, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

// Models
import { SharedState } from '../../shared/models/shared-state.interface';

// Stores
import useSharedStore from '../../shared/store/shared.store';

export const About = (): ReactElement => {
  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Element references

  useEffect(() => {
    setSubtitle({ document: 'About', text: 'About' });
    // eslint-disable-next-line
  }, []);

  return (
    <Transition
      show={process.env.REACT_APP_ABOUT ? true : false}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="flex justify-center w-full"
    >
      {process.env.REACT_APP_ABOUT && (
        <section
          dangerouslySetInnerHTML={{ __html: process.env.REACT_APP_ABOUT }}
          className={clsx(
            'box-border flex flex-col justify-center pb-4 px-4 pt-16 text-center w-full',
            'md:pt-24 md:px-8 lg:px-0 lg:pb-8 xl:w-[960px] 3xl:pt-32 4xl:pt-40'
          )}
        ></section>
      )}
    </Transition>
  );
};
