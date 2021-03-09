import create from 'zustand';

import { PostsResponse } from '../models/posts-response.interface';
import { PostsState } from '../models/posts-state.interface';
import { getPosts } from '../utils/posts.utils';

const usePostsStore = create<PostsState>(set => ({
  loading: true,
  offset: 0,
  post: null,
  posts: [],
  total: 0,
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  setPost: async (postId: string) => {
    const fetchPost: PostsResponse = await getPosts(null, postId, null);
    if (fetchPost && fetchPost.posts.length > 0) {
      set({ post: fetchPost.posts[0] });
    }
  },
  setPosts: async (offset: number, postId: string, tag: string) => {
    const fetchPosts: PostsResponse = await getPosts(offset, postId, tag);
    if (fetchPosts && fetchPosts.posts.length > 0) {
      set((state: PostsState) => ({
        ...state,
        posts: fetchPosts.posts,
        total: fetchPosts.total_posts
      }));
    }
  },
  addPosts: async (offset: number, tag: string) => {
    const addedPosts: PostsResponse = await getPosts(offset, '', tag);
    if (addedPosts && addedPosts.posts.length > 0) {
      set((state: PostsState) => ({
        ...state,
        offset,
        posts: state.posts.concat(addedPosts.posts)
      }));
    }
  }
}));

export default usePostsStore;
