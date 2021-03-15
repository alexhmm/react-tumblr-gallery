import { ReactNode } from 'react';
import { State } from 'zustand';

import { Post } from './post.interface';

export interface PostsState extends State {
  loading: boolean;
  offset: number;
  post: Post | null;
  postElements: ReactNode[];
  posts: Post[];
  tag: string | null;
  total: number;
  setLoading: (loading: boolean) => void;
  setPost: (postId: string | null) => void;
  setPostElements: (postElements: ReactNode[]) => void;
  setPosts: (
    offset: number | null,
    postId: string | null,
    tag: string | null
  ) => void;
  addPosts: (offset: number, tag: string) => void;
  setTag: (tag: string) => void;
}
