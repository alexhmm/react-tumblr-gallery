// Models
import { BlogInfo } from '../models/blog-info.interface';
import { CustomTag } from '../models/custom-tag.interface';
import { MenuLink, MenuExternalLink } from '../models/menu-link.interface';
import { PostsResponse } from '../../posts/models/posts-response.interface';

export const useSharedUtils = () => {
  /**
   * Sets application header meta data.
   */
  const appMetaDataSet = (): void => {
    // Set description
    const descriptionElem = document.getElementById('description');
    if (descriptionElem && process.env.REACT_APP_DESCRIPTION) {
      descriptionElem.setAttribute(
        'content',
        process.env.REACT_APP_DESCRIPTION
      );
    }

    // Set favicon
    const faviconElem = document.getElementById('favicon');
    if (faviconElem && process.env.REACT_APP_FAVICON) {
      faviconElem.setAttribute('href', process.env.REACT_APP_FAVICON);
    }

    // Set manifest
    // Extract start url
    const fullUrl = window.location.href;
    const startUrl = fullUrl.substr(0, fullUrl.indexOf('/', 8));

    // https://stackoverflow.com/questions/52997333/how-to-create-dynamic-manifest-json-file-in-pwa-and-reactjs
    const manifestObj = {
      background_color: '#fafafa',
      description:
        process.env.REACT_APP_DESCRIPTION && process.env.REACT_APP_DESCRIPTION,
      display: 'standalone',
      icons: [
        {
          sizes: '64x64',
          src:
            process.env.REACT_APP_FAVICON64 && process.env.REACT_APP_FAVICON64,
          type: 'image/png'
        },
        {
          sizes: '192x192',
          src:
            process.env.REACT_APP_FAVICON192 &&
            process.env.REACT_APP_FAVICON192,
          type: 'image/png'
        },
        {
          sizes: '512x512',
          src:
            process.env.REACT_APP_FAVICON512 &&
            process.env.REACT_APP_FAVICON512,
          type: 'image/png'
        }
      ],
      name: process.env.REACT_APP_TITLE && process.env.REACT_APP_TITLE,
      short_name: process.env.REACT_APP_TITLE && process.env.REACT_APP_TITLE,
      start_url: startUrl,
      theme_color: '#202020'
    };

    const manifestStr = JSON.stringify(manifestObj);
    const manifestBlob = new Blob([manifestStr], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);
    const manifestElem = document.getElementById('manifest');
    if (manifestElem) {
      manifestElem.setAttribute('href', manifestURL);
    }
  };

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
   * Get contributor meta data.
   * @param tag Tag
   * @returns Contributor meta data
   */
  const contributorGet = (tag: string): Promise<PostsResponse> => {
    let url = `${process.env.REACT_APP_API_URL}/posts/?api_key=${process.env.REACT_APP_API_KEY}&limit=1&tag=${tag}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data.response;
      })
      .catch(error => {
        console.error('Error fetching contributors:', error);
        return null;
      });
  };

  /**
   * Get custom tags data.
   * @returns Custom tags data
   */
  const customTagsGet = (): Promise<CustomTag[]> => {
    let url = process.env.REACT_APP_TAGS_CUSTOM ?? '';
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data.custom_tags;
      })
      .catch(error => {
        console.error('Error fetching custom tags:', error);
        return [];
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
        icon: ['fab', 'facebook'],
        title: 'Facebook',
        to: `https://www.facebook.com/${process.env.REACT_APP_SOCIAL_FACEBOOK}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_GITHUB) {
      externalLinks.push({
        icon: ['fab', 'github'],
        title: 'Github',
        to: `https://www.facebook.com/${process.env.REACT_APP_SOCIAL_GITHUB}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_INSTAGRAM) {
      externalLinks.push({
        icon: ['fab', 'instagram'],
        title: 'Instagram',
        to: `https://instagram.com/${process.env.REACT_APP_SOCIAL_INSTAGRAM}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_SNAPCHAT) {
      externalLinks.push({
        icon: ['fab', 'snapchat'],
        title: 'Snapchat',
        to: `https://story.snapchat.com/s/${process.env.REACT_APP_SOCIAL_SNAPCHAT}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_TIKTOK) {
      externalLinks.push({
        icon: ['fab', 'tiktok'],
        title: 'TikTok',
        to: `https://www.tiktok.com/@${process.env.REACT_APP_SOCIAL_TIKTOK}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_TWITCH) {
      externalLinks.push({
        icon: ['fab', 'twitch'],
        title: 'Twitch',
        to: `https://www.twitch.tv/${process.env.REACT_APP_SOCIAL_TWITCH}`
      });
    }
    if (process.env.REACT_APP_SOCIAL_TWITTER) {
      externalLinks.push({
        icon: ['fab', 'twitter'],
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
    appMetaDataSet,
    blogInfoGet,
    contributorGet,
    customTagsGet,
    menuExternalLinksGet,
    menuLinksGet
  };
};
