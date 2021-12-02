import { isDesktop, isMobile } from 'react-device-detect';
import clsx from 'clsx';

// Components
import { Icon } from '../ui/Icon';

// Models
import { MenuExternalLink as IMenuExternalLink } from '../models/menu-link.interface';

type MenuExternalLinkProps = {
  link: IMenuExternalLink;
};

export const MenuExternalLink = (props: MenuExternalLinkProps) => {
  return (
    <a
      href={props.link.to}
      rel="noreferrer"
      target="_blank"
      className={clsx(
        'flex group items-center mb-1 mr-4',
        isMobile && 'tap-highlight'
      )}
    >
      <Icon
        classes={clsx(isDesktop && 'border-b-2 border-transparent')}
        icon={props.link.icon}
      />
      <span
        className={clsx(
          'ml-2',
          isDesktop &&
            'border-b-2 border-transparent duration-200 transition-colors group-hover:border-app'
        )}
      >
        {props.link.title}
      </span>
    </a>
  );
};
