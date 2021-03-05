/**
 * Get tumblr blog info.
 * @returns Tumblr blog info
 */
export const getBlogInfo = () => {
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
      console.log('data', data.response.blog);
      return data.response.blog;
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      return null;
    });
};
