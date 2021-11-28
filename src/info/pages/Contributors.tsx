import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

// Components
import { Icon } from '../../shared/ui/Icon';
import Loader from '../../shared/ui/Loader/Loader';

// Models
import { Contributor } from '../../shared/models/contributor.interface';
import { SharedState } from '../../shared/models/shared-state.interface';

// Stores
import useSharedStore from '../../shared/store/shared.store';

// Utils
import { getContributor } from '../../shared/utils/shared.utils';

export const Contributors = (): ReactElement => {
  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    process.env.REACT_APP_CONTRIBUTORS &&
      setContributors(JSON.parse(process.env.REACT_APP_CONTRIBUTORS));
    setSubtitle({ document: 'Contributors', text: 'Contributors' });

    return () => {
      setContributors([]);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getContributorMetaData = async () => {
      if (!loaded && contributors?.length > 0) {
        const contributorsCurrent = [];
        for (let i = 0; i < contributors.length; i++) {
          const contributor = { ...contributors[i] };
          // Get meta data from api
          const contributorMetaData = await getContributor(contributors[i].tag);
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
          'box-border flex flex-col pb-4 px-4 pt-16 w-full',
          'md:pt-24 md:px-8 lg:items-center lg:px-0 lg:pb-8 3xl:pt-32 4xl:pt-40',
          isMobile && 'tap-highlight'
        )}
      >
        {contributors.map((contributor: Contributor, index: number) => (
          <div
            key={contributor.name}
            className={clsx(
              'box-border flex items-center',
              index < contributors.length - 1 && 'mb-4 lg:mb-6'
            )}
          >
            <img
              alt={contributor.name}
              src={contributor.image}
              className="object-cover mr-4 rounded-full w-16"
            />
            <div className="flex flex-col">
              <a
                href={contributor.href}
                rel="noreferrer"
                target="_blank"
                className="flex items-center group mb-1"
              >
                <Icon
                  classes="mr-2"
                  color={clsx(
                    isDesktop &&
                      'duration-200 transition-colors group-hover:text-hover'
                  )}
                  icon={['fas', 'external-link-alt']}
                  size="text-md lg:text-lg"
                />
                <span
                  className={clsx(
                    'text-2xl lg:text-3xl',
                    isDesktop &&
                      'duration-200 transition-colors group-hover:text-hover'
                  )}
                >
                  {contributor.name}
                </span>
              </a>
              <Link
                to={'/tagged/' + contributor.tag}
                className={clsx(
                  'text-sm text-sub w-max',
                  isDesktop && 'duration-200 transition-colors hover:text-app'
                )}
              >
                Show posts
              </Link>
            </div>
          </div>
        ))}
      </Transition>
    </>
  );
};
