import create from 'zustand';

import { Post } from '../models/post.interface';
import { PostsState } from '../models/posts-state.interface';
import { getPosts } from '../utils/posts.utils';

const usePostsStore = create<PostsState>(set => ({
  loading: true,
  offset: 0,
  posts: [],
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  setPosts: async (offset: number, postId: string, tag: string) => {
    const fetchPosts: Post[] = await getPosts(offset, postId, tag);
    if (fetchPosts && fetchPosts.length > 0) {
      set({ posts: fetchPosts });
    }
  },
  addPosts: async (offset: number, tag: string) => {
    const addedPosts: Post[] = await getPosts(offset, '', tag);
    if (addedPosts && addedPosts.length > 0) {
      set((state: PostsState) => ({
        ...state,
        offset,
        posts: state.posts.concat(addedPosts)
      }));
    }
  }
}));

export default usePostsStore;
