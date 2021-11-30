import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

// Components
import { Icon } from '../../shared/ui/Icon';
import Loader from '../../shared/ui/Loader/Loader';

// Hooks
import { useSharedUtils } from '../../shared/hooks/use-shared-utils.hook';

// Models
import { Contributor } from '../../shared/models/contributor.interface';
import { SharedState } from '../../shared/models/shared-state.interface';

// Stores
import useSharedStore from '../../shared/store/shared.store';

export const Contributors = (): ReactElement => {
  const { contributorGet } = useSharedUtils();

  // Component state
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Set contributors by environment and subtitle on mount.
  useEffect(() => {
    process.env.REACT_APP_CONTRIBUTORS &&
      setContributors(JSON.parse(process.env.REACT_APP_CONTRIBUTORS));
    setSubtitle({ document: 'Contributors', text: 'Contributors' });

    return () => {
      setContributors([]);
    };
    // eslint-disable-next-line
  }, []);

  // Set contributor meta data per hashtag.
  useEffect(() => {
    const getContributorMetaData = async () => {
      if (!loaded && contributors?.length > 0) {
        const contributorsCurrent = [];
        for (let i = 0; i < contributors.length; i++) {
          const contributor = { ...contributors[i] };
          // Get meta data from api
          const contributorMetaData = await contributorGet(contributors[i].tag);
          if (contributorMetaData?.total_posts) {
            // Set contributor total posts
            Object.assign(contributor, {
              total_posts: contributorMetaData?.total_posts
            });
            contributorsCurrent.push(contributor);
          }
          if (i === contributors.length - 1) {
            setLoaded(true);
            setContributors(contributorsCurrent);
          }
        }
      }
    };
    getContributorMetaData();
    // eslint-disable-next-line
  }, [contributors, loaded]);

  return (
    <>
      <Transition
        show={!loaded}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Loader
          classes="bottom-8 fixed left-1/2 transform -translate-x-1/2 z-20 lg:bottom-12 xl:bottom-16"
          size={10}
        />
      </Transition>
      <Transition
        show={loaded}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={clsx(
          'box-border flex justify-center pb-4 px-4 pt-16 w-full',
          'md:pt-24 md:px-8 lg:items-center lg:pb-8 xl:px-12 3xl:pt-32 3xl:px-16 4xl:pt-40 4xl:px-24',
          isMobile && 'tap-highlight'
        )}
      >
        {contributors?.length > 0 ? (
          <section className="w-full flex flex-col md:flex-row md:flex-wrap md:justify-center xl:w-3/4 2xl:w-2/3 3xl:w-1/2">
            {contributors.map(contributor => (
              <div
                key={contributor.name}
                className="box-border flex flex-col py-2 md:p-2 md:w-1/2 lg:w-1/3"
              >
                <div className="bg-menu p-2 shadow-md w-full md:p-4">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <span className="text-xl truncate lg:text-2xl">
                      {contributor.name}
                    </span>
                    <img
                      alt={contributor.name}
                      src={contributor.image}
                      className="flex-shrink-0 object-cover h-8 ml-2 rounded-full w-8 md:h-10 md:w-10 md:ml-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href={contributor.href}
                      rel="noreferrer"
                      target="_blank"
                      className="flex items-center group"
                    >
                      <Icon
                        classes="mr-2"
                        color={clsx(
                          isDesktop &&
                            'duration-200 transition-colors group-hover:text-hover'
                        )}
                        icon={['fas', 'external-link-alt']}
                        size="text-md"
                      />
                      <span
                        className={clsx(
                          isDesktop &&
                            'duration-200 transition-colors group-hover:text-hover'
                        )}
                      >
                        Link
                      </span>
                    </a>
                    <Link
                      to={'/tagged/' + contributor.tag}
                      className={clsx(
                        'text-sm w-max',
                        isDesktop &&
                          'duration-200 transition-colors hover:text-hover'
                      )}
                    >
                      {`Show ${contributor.total_posts} posts`}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="text-center">No contributors found.</section>
        )}
      </Transition>
    </>
  );
};
