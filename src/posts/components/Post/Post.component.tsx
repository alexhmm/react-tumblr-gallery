import React, { ReactElement } from 'react';
import { Post as PostType } from '../../models/post.interface';

import './post.scss';

const Post = (props: { post: PostType }): ReactElement => {
  return (
    <article className='post'>
      {/* <div className='post-title'>{props?.post?.summary}</div> */}
      <img
        alt={props?.post?.caption}
        src={props?.post?.photos[0]?.original_size.url}
        className='post-src'
      />
    </article>
  );
};

export default Post;
