import { BlogInfo } from '../models/blog-info.interface';

/**
 * Get tumblr blog info.
 * @returns Tumblr blog info
 */
export const getBlogInfo = (): Promise<BlogInfo> => {
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
 * Sets application theme.
 * @param theme Theme
 */
export const setAppTheme = (theme: string) => {
  const darkColor = '#1f1f1f';
  const lightColor = '#fafafa';

  // Set mobile status bar
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      theme === 'light' ? lightColor : darkColor
    );
  }

  const metaStatusBar = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]'
  );
  if (metaStatusBar) {
    metaStatusBar.setAttribute(
      'content',
      theme === 'light' ? lightColor : darkColor
    );
  }

  // Set document theme
  document.documentElement.setAttribute('theme', theme);
  localStorage.setItem('theme', theme);
};
