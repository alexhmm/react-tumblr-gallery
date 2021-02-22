import React from 'react';

import './Post.scss';

const Post = (props: any) => {
  return (
    <article className='post'>
      <div className='post-title'>{props?.post?.summary}</div>
      <img
        src={props?.post?.photos[0].original_size.url}
        className='post-src'
      />
    </article>
  );
};

export default Post;
