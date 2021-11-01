import { PostsResponse } from '../../posts/models/posts-response.interface';

/**
 * Get contributor meta data.
 * @param tag Tag
 * @returns Contributor meta data
 */
export const getContributor = (tag: string): Promise<PostsResponse> => {
  let url = `${process.env.REACT_APP_API_URL}/posts/?api_key=${process.env.REACT_APP_API_KEY}&type=photo&limit=1&tag=${tag}`;

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
      console.error('Error fetching posts:', error);
      return null;
    });
};

/**
 * Sets application header meta data.
 */
export const setAppMetaData = (): void => {
  // Set description
  const descriptionElem = document.getElementById('description');
  if (descriptionElem && process.env.REACT_APP_DESCRIPTION) {
    descriptionElem.setAttribute('content', process.env.REACT_APP_DESCRIPTION);
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
        src: process.env.REACT_APP_FAVICON64 && process.env.REACT_APP_FAVICON64,
        type: 'image/png'
      },
      {
        sizes: '192x192',
        src:
          process.env.REACT_APP_FAVICON192 && process.env.REACT_APP_FAVICON192,
        type: 'image/png'
      },
      {
        sizes: '512x512',
        src:
          process.env.REACT_APP_FAVICON512 && process.env.REACT_APP_FAVICON512,
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
 * Sets application theme.
 * @param theme Theme
 */
export const setAppTheme = (theme: string) => {
  // const darkColor = '#1f1f1f';
  // const lightColor = '#fafafa';

  // // Set mobile status bar
  // const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  // if (metaThemeColor) {
  //   metaThemeColor.setAttribute(
  //     'content',
  //     theme === 'light' ? lightColor : darkColor
  //   );
  // }

  // const metaStatusBar = document.querySelector(
  //   'meta[name="apple-mobile-web-app-status-bar-style"]'
  // );
  // if (metaStatusBar) {
  //   metaStatusBar.setAttribute(
  //     'content',
  //     theme === 'light' ? lightColor : darkColor
  //   );
  // }

  // // Set document theme
  // document.documentElement.setAttribute('theme', theme);
  // Tailwindcss theme
  document.documentElement.setAttribute('class', theme);
  localStorage.setItem('theme', theme);
};
