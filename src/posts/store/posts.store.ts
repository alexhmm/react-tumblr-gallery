import { ReactNode } from 'react';
import create, { State } from 'zustand';
import { Post } from '../models/post.interface';

import { PostsResponse } from '../models/posts-response.interface';
import { getPostById, getPosts } from '../utils/posts.utils';

export interface PostsStore extends State {
  limit: number;
  loading: boolean;
  navUsed: boolean;
  offset: number;
  post: Post | null;
  postHover: number | null;
  postElements: ReactNode[];
  posts: Post[];
  tag: string | null;
  total: number;
  setLoading: (loading: boolean) => void;
  setNavUsed: (navUsed: boolean) => void;
  setPost: (postId: string | null) => void;
  setPostHover: (postId: number | null) => void;
  setPostElements: (postElements: ReactNode[]) => void;
  setPosts: (limit: number, offset: number | null, tag: string | null) => void;
  addPosts: (limit: number, offset: number, tag: string) => void;
  setTag: (tag: string) => void;
}

const usePostsStore = create<PostsStore>((set, get) => ({
  limit: process.env.REACT_APP_API_LIMIT
    ? parseInt(process.env.REACT_APP_API_LIMIT, 10)
    : 20,
  loading: true,
  navUsed: false,
  offset: 0,
  post: null,
  postHover: null,
  postElements: [],
  posts: [],
  tag: null,
  total: 0,
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
      const post = posts.find(post => post.id_string === postId);
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
      set({ post: null });
    }
  },
  setPostHover: (postId: number | null) => {
    set({ postHover: postId });
  },
  setPostElements: (postElements: ReactNode[]) => set({ postElements }),
  setPosts: async (
    limit: number,
    offset: number | null,
    tag: string | null
  ) => {
    // Reset state
    set((state: PostsStore) => ({
      ...state,
      offset: 0,
      posts: [],
      total: 0
    }));

    // Fetch tumblr posts
    const fetchPosts: PostsResponse = await getPosts(limit, offset, tag);
    if (fetchPosts && fetchPosts.posts.length > 0) {
      set((state: PostsStore) => ({
        ...state,
        loading: false,
        posts: fetchPosts.posts,
        tag,
        total: fetchPosts.total_posts
      }));
    } else {
      set((state: PostsStore) => ({
        ...state,
        loading: false,
        tag
      }));
    }
  },
  addPosts: async (limit: number, offset: number, tag: string) => {
    const addedPosts: PostsResponse = await getPosts(limit, offset, tag);
    if (addedPosts && addedPosts.posts.length > 0) {
      set((state: PostsStore) => ({
        ...state,
        offset,
        posts: state.posts.concat(addedPosts.posts)
      }));
    } else {
      set({ loading: false });
    }
  },
  setTag: (tag: string) => set({ tag })
}));

export default usePostsStore;
