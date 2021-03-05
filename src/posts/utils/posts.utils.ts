/**
 * Get tumblr posts.
 * @param offset Offset
 * @param postId Post id
 * @param tag Tag
 */
export const getPosts = (offset: number, postId: string, tag: string) => {
  let url =
    process.env.REACT_APP_API_URL +
    '/posts?api_key=' +
    process.env.REACT_APP_API_KEY;

  // Get posts by a given tag
  if (tag) {
    url = url.concat('&tag=' + tag);
  }
  // Get a single post by a given id
  if (postId) {
    url = url.concat('&id=' + postId + '&notes_info=true');
  }
  // Set offset
  if (offset) {
    url = url.concat('&offset=' + offset);
  }

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data.response.posts;
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      return null;
    });
};
