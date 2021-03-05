import { State } from 'zustand';

import { Post } from './post.interface';

export interface PostsState extends State {
  loading: boolean;
  offset: number;
  posts: Post[];
  title: string;
  setLoading: (loading: boolean) => void;
  setPosts: (offset: number, postId: string, tag: string) => void;
  addPosts: (offset: number, tag: string) => void;
}
