import React, { ReactElement } from 'react';

import { PostsState } from '../../../posts/models/posts-state.interface';
import usePostsStore from '../../../posts/store/posts.store';

import './title.scss';

const Title = (): ReactElement => {
  // Posts store state
  const [title] = usePostsStore((state: PostsState) => [state.title]);

  return <header className='title'>{title}</header>;
};

export default Title;
