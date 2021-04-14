import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import Spinner from '../../../shared/components/spinner/spinner.component';

// Models
import { Contributor } from '../../../shared/models/contributor.interface';
import { SharedState } from '../../../shared/models/shared-state.interface';

// Stores
import useSharedStore from '../../../shared/store/shared.store';

// Utils
import { getContributor } from '../../../shared/utils/shared.utils';

import './contributors.scss';

const Contributors = (): ReactElement => {
  // Shared store state
  const [setSubtitle] = useSharedStore((state: SharedState) => [
    state.setSubtitle
  ]);

  // Element references
  const contributorsElem = useRef<HTMLDivElement>(null);
  const contributorsLoadingElem = useRef<HTMLDivElement>(null);

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.REACT_APP_CONTRIBUTORS) {
      setContributors(JSON.parse(process.env.REACT_APP_CONTRIBUTORS));
    }

    setSubtitle('Contributors');

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

  useEffect(() => {
    if (loaded) {
      if (contributorsLoadingElem.current) {
        // Fade out loader
        contributorsLoadingElem.current.style.opacity = '0';
      }
      if (contributorsElem.current) {
        // Fade in contributors
        contributorsElem.current.style.opacity = '1';
      }
    }
  }, [loaded]);

  return (
    <div className='contributors'>
      <div ref={contributorsLoadingElem} className='contributors-loading'>
        <Spinner size={10} />
      </div>
      <div ref={contributorsElem} className='contributors-container'>
        {contributors.map((contributor: Contributor) => (
          <div key={contributor.name} className='contributors-container-item'>
            <a
              href={contributor.href}
              rel='noreferrer'
              target='_blank'
              className='contributors-container-item-title'
            >
              {contributor.name}
            </a>
            <Link
              to={'/tagged/' + contributor.tag}
              className='contributors-container-item-total'
            >
              {contributor.total_posts && `${contributor.total_posts} posts`}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
