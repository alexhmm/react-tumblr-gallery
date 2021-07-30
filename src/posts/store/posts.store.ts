import { ReactNode } from 'react';
import create from 'zustand';

// Models
import { PostsResponse } from '../models/posts-response.interface';
import { PostsState } from '../models/posts-state.interface';

// Utils
import { getPostById, getPosts } from '../utils/posts.utils';

const usePostsStore = create<PostsState>((set, get) => ({
  limit: process.env.REACT_APP_API_LIMIT
    ? parseInt(process.env.REACT_APP_API_LIMIT, 10)
    : 20,
  loading: true,
  navUsed: false,
  offset: 0,
  post: null,
  postElementsL: {},
  posts: {},
  tag: null,
  total: 0,
  addPosts: async (limit: number, offset: number, tag: string | null) => {
    const addedPosts: PostsResponse = await getPosts(limit, offset, tag);
    if (addedPosts && addedPosts.posts.length > 0) {
      set((state: PostsState) => ({
        ...state,
        posts: {
          ...state.posts,
          [tag ?? '/']: {
            ...state.posts[tag ?? '/'],
            offset,
            posts: state.posts[tag ?? '/'].posts.concat(addedPosts.posts)
          }
        },
        tag
      }));
    }
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  setNavUsed: (navUsed: boolean) => {
    if (navUsed) {
      set({ navUsed });
      setTimeout(() => {
        set({ navUsed: false });
      }, 250);
    }
  },
  setPost: async (postId: string | null) => {
    if (postId) {
      // Get store posts
      const posts = get().posts;
      const tag = get().tag;
      if (posts && posts[tag ?? '/']?.posts) {
        const post = posts[tag ?? '/'].posts.find(
          post => post.id_string === postId
        );
        if (post) {
          // Set post by posts match
          set({ post });
        } else {
          // Get post from Tumblr API
          const fetchPost: PostsResponse = await getPostById(postId);
          if (fetchPost && fetchPost.posts.length > 0) {
            set({ post: fetchPost.posts[0] });
          }
        }
      } else {
        // Get post from Tumblr API
        const fetchPost: PostsResponse = await getPostById(postId);
        if (fetchPost && fetchPost.posts.length > 0) {
          set({ post: fetchPost.posts[0] });
        }
      }
    } else {
      set({ post: null });
    }
  },
  setPostElements: (postElements: ReactNode[], tag: string | null) =>
    set((state: PostsState) => ({
      ...state,
      postElementsL: {
        ...state.postElementsL,
        [tag ?? '/']: postElements
      }
    })),
  setPosts: async (limit: number, tag: string | null) => {
    // Fetch tumblr posts
    const fetchPosts: PostsResponse = await getPosts(limit, 0, tag);
    if (fetchPosts && fetchPosts.posts.length > 0) {
      // Set initial posts for specific tag.
      set((state: PostsState) => ({
        ...state,
        loading: false,
        posts: {
          ...state.posts,
          // Create tag based object
          [tag ?? '/']: {
            offset: 0,
            posts: fetchPosts.posts,
            total: fetchPosts.total_posts
          }
        },
        tag
      }));
    } else {
      set((state: PostsState) => ({
        ...state,
        loading: false,
        tag
      }));
    }
  },
  setTag: (tag: string) => set({ tag })
}));

export default usePostsStore;
