import { State } from 'zustand';

import { Post } from './post.interface';

export interface PostsState extends State {
  loading: boolean;
  offset: number;
  post: Post | null;
  posts: Post[];
  total: number;
  setLoading: (loading: boolean) => void;
  setPost: (postId: string) => void;
  setPosts: (offset: number, postId: string, tag: string) => void;
  addPosts: (offset: number, tag: string) => void;
}
