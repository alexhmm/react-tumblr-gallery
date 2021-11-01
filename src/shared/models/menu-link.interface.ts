export interface MenuLink {
  title: string;
  to: string;
}

export interface MenuExternalLink extends MenuLink {
  icon: string;
}
