import { wqhd, xl } from '../../shared/utils/breakpoints';

import { PhotoSource } from '../models/photo-source.interface';
import { PostsResponse } from '../models/posts-response.interface';

/**
 * Get tumblr posts.
 * @param offset Offset
 * @param postId Post id
 * @param tag Tag
 * @returns Tumblr posts
 */
export const getPosts = (
  offset: number | null,
  postId: string | null,
  tag: string | null
): Promise<PostsResponse> => {
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
      return data.response;
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      return null;
    });
};

/**
 * Wait for x miliseconds to continue.
 * @param ms Miliseconds
 * @returns Promise
 */
export const wait = (ms: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
};

/**
 * Calculates image source by current dimensions.
 * @param currentImgWidth Current image width
 * @param innerWidth Inner width
 * @param photos Photos
 * @returns Image source
 */
const getImageSource = (
  currentImgWidth: number,
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
 * Sets photo post source in detail.
 * @param currentImgWidth Current image width
 * @param photos Photos
 * @returns Image source
 */
export const setPostSourceDetail = (
  currentImgWidth: number,
  photos: PhotoSource[]
): { imgSrc: string | undefined; imgWidth: number } => {
  // Set current window width
  // Small devices load bigger images to get a good zoom experience
  const windowWidth = window.innerWidth < 992 ? 992 : window.innerWidth;

  return getImageSource(currentImgWidth, windowWidth, photos);
};

/**
 * Sets photo post source in gallery.
 * @param currentImgWidth Current image width
 * @param photos Photos
 * @returns Image source
 */
export const setPostSourceGallery = (
  currentImgWidth: number,
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

  return getImageSource(currentImgWidth, containerWidth, photos);
};
