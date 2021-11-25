import { ReactNode } from 'react';
import { State } from 'zustand';

// Models
import { Post } from './post.interface';
import { PostsResponse } from './posts-response.interface';

export interface PostsState extends State {
  limit: number;
  loading: boolean;
  navUsed: boolean;
  offset: number;
  post: Post | null;
  postElements: {
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
  addPosts: (
    postsResponse: PostsResponse,
    limit: number,
    offset: number,
    tag: string | null
  ) => void;
  setLoading: (loading: boolean) => void;
  setNavUsed: (navUsed: boolean) => void;
  setPost: (post: Post | null) => void;
  setPostElements: (postElements: ReactNode[], tag: string | null) => void;
  setPosts: (postsReponse: PostsResponse, tag: string) => void;
  setTag: (tag: string | null) => void;
}
