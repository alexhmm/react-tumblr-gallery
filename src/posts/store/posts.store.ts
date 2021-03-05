import create from 'zustand';

import { Post } from '../models/post.interface';
import { getPosts } from '../utils/posts.utils';

const usePostsStore = create<{ offset: number; posts: Post[] }>(set => ({
  offset: 0,
  posts: [],
  setPosts: async (offset: number, postId: string, tag: string) => {
    set({ posts: await getPosts(offset, postId, tag) });
  },
  addPosts: async (offset: number, tag: string) => {
    const addedPosts = await getPosts(offset, '', tag);
    if (addedPosts && addedPosts.length > 0) {
      set((state: any) => ({
        ...state,
        offset,
        posts: state.posts.concat(addedPosts)
      }));
    }
  }
}));

export default usePostsStore;
