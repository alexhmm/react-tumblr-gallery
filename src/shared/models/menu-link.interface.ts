import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MenuLink {
  title: string;
  to: string;
}

export interface MenuExternalLink extends MenuLink {
  icon: IconProp;
}
