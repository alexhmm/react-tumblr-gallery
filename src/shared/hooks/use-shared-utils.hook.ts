// Models
import { BlogInfo } from '../models/blog-info.interface';
import { MenuLink, MenuExternalLink } from '../models/menu-link.interface';

export const useSharedUtils = () => {
  /**
   * Get tumblr blog info.
   * @returns Tumblr blog info
   */
  const blogInfoGet = (): Promise<BlogInfo> => {
    let url =
      process.env.REACT_APP_API_URL +
      '/info?api_key=' +
      process.env.REACT_APP_API_KEY;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data.response.blog;
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        return null;
      });
  };

  /**
   * Returns social menu links by environment variables.
   * @returns MenuSocialLink array
   */
  const menuExternalLinksGet = (): MenuExternalLink[] => {
    const externalLinks: MenuExternalLink[] = [];
    if (process.env.REACT_APP_SOCIAL_FACEBOOK) {
      externalLinks.push({
        icon: 'fab fa-facebook',
        title: 'Facebook',
        to: `https://www.facebook.com/${process.env.REACT_APP_SOCIAL_FACEBOOK}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_GITHUB) {
      externalLinks.push({
        icon: 'fab fa-github',
        title: 'Github',
        to: `https://www.facebook.com/${process.env.REACT_APP_SOCIAL_GITHUB}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_SNAPCHAT) {
      externalLinks.push({
        icon: 'fab fa-snapchat',
        title: 'Snapchat',
        to: `https://story.snapchat.com/s/${process.env.REACT_APP_SOCIAL_SNAPCHAT}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_INSTAGRAM) {
      externalLinks.push({
        icon: 'fab fa-instagram',
        title: 'Instagram',
        to: `https://instagram.com/${process.env.REACT_APP_SOCIAL_INSTAGRAM}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_TIKTOK) {
      externalLinks.push({
        icon: 'fab fa-tiktok',
        title: 'TikTok',
        to: `https://www.tiktok.com/@${process.env.REACT_APP_SOCIAL_TIKTOK}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_TWITCH) {
      externalLinks.push({
        icon: 'fab fa-twitch',
        title: 'Twitch',
        to: `https://www.twitch.tv/${process.env.REACT_APP_SOCIAL_TWITCH}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_TWITTER) {
      externalLinks.push({
        icon: 'fab fa-twitter',
        title: 'Twitter',
        to: `https://twitter.com/${process.env.REACT_APP_SOCIAL_TWITTER}`
      });
    }
    return externalLinks;
  };

  /**
   * Returns menu links by environment variables.
   * @returns MenuLink array
   */
  const menuLinksGet = (): MenuLink[] => {
    const links: MenuLink[] = [
      {
        title: 'Home',
        to: '/'
      }
    ];

    if (process.env.REACT_APP_ABOUT) {
      links.push({
        title: 'About',
        to: '/about'
      });
    }

    if (process.env.REACT_APP_CONTRIBUTORS) {
      links.push({
        title: 'Contributors',
        to: '/contributors'
      });
    }

    return links;
  };

  return {
    blogInfoGet,
    menuExternalLinksGet,
    menuLinksGet
  };
};
