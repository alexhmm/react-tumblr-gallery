import { ReactNode } from 'react';
import { State } from 'zustand';

// Models
import { Post } from './post.interface';

export interface PostsState extends State {
  limit: number;
  loading: boolean;
  navUsed: boolean;
  offset: number;
  post: Post | null;
  postElementsL: {
    [tag: string]: ReactNode[];
  };
  posts: {
    [tag: string]: {
      offset: number;
      posts: Post[];
      total: number;
    };
  };
  tag: string | null;
  total: number;
  addPosts: (limit: number, offset: number, tag: string | null) => void;
  setLoading: (loading: boolean) => void;
  setNavUsed: (navUsed: boolean) => void;
  setPost: (postId: string | null) => void;
  setPostElements: (postElements: ReactNode[], tag: string | null) => void;
  setPosts: (limit: number, tag: string | null) => void;
  setTag: (tag: string) => void;
}
