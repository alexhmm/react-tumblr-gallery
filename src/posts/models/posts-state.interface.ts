import { State } from 'zustand';

import { Post } from './post.interface';

export interface PostsState extends State {
  offset: number;
  posts: Post[];
  title: string;
  setPosts: (offset: number, postId: string, tag: string) => void;
  addPosts: (offset: number, tag: string) => void;
}
