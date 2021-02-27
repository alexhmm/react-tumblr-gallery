/**
 * Get tumblr posts.
 * @param pageNumber Page number
 * @param postId Post id
 * @param tag Tag
 */
export const getPosts = (pageNumber: string, postId: string, tag: string) => {
  let url =
    process.env.REACT_APP_API_URL +
    '/posts?api_key=' +
    process.env.REACT_APP_API_KEY;

  // if (limit) {
  //   url = url.concat('&limit=' + limit);
  // }
  // Calculate offset by pagenumber
  if (pageNumber) {
    const offset = (parseInt(pageNumber, 10) - 1) * 20;
    url = url.concat('&offset=' + offset);
  }
  // Get posts by a given tag
  if (tag) {
    url = url.concat('&tag=' + tag);
  }
  // Get a single post by a given id
  if (postId) {
    url = url.concat('&id=' + postId + '&notes_info=true');
  }

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      return null;
    });
};
