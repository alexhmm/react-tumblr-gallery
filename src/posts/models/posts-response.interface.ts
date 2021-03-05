import { BlogInfo } from '../../shared/models/blog-info.interface';
import { Post } from './post.interface';

export interface PostsResponse {
  blog: BlogInfo;
  posts: Post[];
  total_posts: number;
}
