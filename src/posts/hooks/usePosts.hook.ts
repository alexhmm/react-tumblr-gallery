import { wqhd, xl } from '../../shared/utils/breakpoints';

// Models
import { PhotoSource } from '../models/photo-source.interface';
import { Post } from '../models/post.interface';
import { PostsResponse } from '../models/posts-response.interface';
import { PostsState } from '../models/posts-state.interface';

// Stores
import usePostsStore from '../store/posts.store';

export const usePosts = () => {
  // Posts store state
  const [posts, tag] = usePostsStore((state: PostsState) => [
    state.posts,
    state.tag
  ]);

  /**
   * Fetch GET post by id.
   * @param postId Post id
   * @returns Post
   */
  const fetchPostById = (postId: string): Promise<PostsResponse> => {
    let url = `${process.env.REACT_APP_API_URL}/posts/?api_key=${process.env.REACT_APP_API_KEY}&id=${postId}&notes_info=true`;

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
        console.error('Error fetching post:', error);
        return null;
      });
  };

  /**
   * Calculates image source by current dimensions.
   * @param innerWidth Inner width
   * @param photos Photos
   * @returns Image source
   */
  const getImageSource = (
    innerWidth: number,
    photos: PhotoSource[]
  ): { imgSrc: string | undefined; imgWidth: number } => {
    // Get all image urls
    let imgSrc;
    let imgWidth = 0;

    for (let i = photos?.length - 1; i > -1; i--) {
      if (photos[i].width >= innerWidth) {
        // Set source if image width is bigger than window width
        imgSrc = photos[i].url;
        imgWidth = photos[i].width;
        break;
      }
      if (i === 0 && !imgSrc) {
        // If no match set biggest possible image width
        imgSrc = photos[i].url;
        imgWidth = photos[i].width;
      }
    }
    return {
      imgSrc,
      imgWidth
    };
  };

  /**
   * GET posts.
   * @param limit Limit
   * @param offset Offset
   * @param tag Tag
   * @returns PostsResponse
   */
  const getPosts = async (
    limit: number,
    offset: number | null,
    tag: string | null
  ): Promise<PostsResponse> => {
    let url = `${process.env.REACT_APP_API_URL}/posts/?api_key=${process.env.REACT_APP_API_KEY}&type=photo&limit=${limit}`;

    // Get posts by a given tag
    if (tag) {
      url = url.concat('&tag=' + tag);
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
        return data.response;
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        return null;
      });
  };

  /**
   * GET post by id.
   * @param postId Post id
   * @returns Post
   */
  const getPost = async (postId: string | null): Promise<Post | null> => {
    if (postId) {
      if (posts && posts[tag ?? '/']?.posts) {
        const post = posts[tag ?? '/'].posts.find(
          post => post.id_string === postId
        );
        if (post) {
          // Set post by posts match
          return post;
        } else {
          // Get post from Tumblr API
          const fetchPost: PostsResponse = await fetchPostById(postId);
          if (fetchPost && fetchPost.posts.length > 0) {
            return fetchPost.posts[0];
          }
        }
      } else {
        // Get post from Tumblr API
        const fetchPost: PostsResponse = await fetchPostById(postId);
        if (fetchPost && fetchPost.posts.length > 0) {
          return fetchPost.posts[0];
        }
      }
    }
    return null;
  };

  /**
   * Sets photo post source in detail.
   * @param photos Photos
   * @returns Image source
   */
  const setPostSourceDetail = (
    photos: PhotoSource[]
  ): { imgSrc: string | undefined; imgWidth: number } => {
    // Set current window width
    // Small devices load bigger images to get a good zoom experience
    const windowWidth = window.innerWidth < 992 ? 992 : window.innerWidth;

    return getImageSource(
      // currentImgWidth,
      windowWidth,
      photos
    );
  };

  /**
   * Sets photo post source in gallery.
   * @param photos Photos
   * @returns Image source
   */
  const setPostSourceGallery = (
    photos: PhotoSource[]
  ): { imgSrc: string | undefined; imgWidth: number } => {
    // Set current window width
    const windowWidth = window.innerWidth;
    let containerWidth = window.innerWidth / 2;
    if (windowWidth > xl - 1) {
      containerWidth = windowWidth / 3;
    }
    if (windowWidth > wqhd) {
      containerWidth = windowWidth / 4;
    }

    return getImageSource(containerWidth, photos);
  };

  return {
    getImageSource,
    getPosts,
    getPost,
    setPostSourceDetail,
    setPostSourceGallery
  };
};
