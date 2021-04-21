import { ReactNode } from 'react';
import { State } from 'zustand';

import { Post } from './post.interface';

export interface PostsState extends State {
  keyUsed: boolean;
  limit: number;
  loading: boolean;
  offset: number;
  post: Post | null;
  postHover: number | null;
  postElements: ReactNode[];
  posts: Post[];
  tag: string | null;
  total: number;
  wheelUsed: boolean;
  setKeyUsed: (keyUsed: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPost: (postId: string | null) => void;
  setPostHover: (postId: number | null) => void;
  setPostElements: (postElements: ReactNode[]) => void;
  setPosts: (limit: number, offset: number | null, tag: string | null) => void;
  addPosts: (limit: number, offset: number, tag: string) => void;
  setTag: (tag: string) => void;
  setWheelUsed: (wheelUsed: boolean) => void;
}
