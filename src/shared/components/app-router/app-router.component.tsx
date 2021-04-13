import { FunctionComponent } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Pages
import About from '../../pages/about/about.page';
import Contributors from '../../pages/contributors/contributors.page';
import PostDetail from '../../../posts/pages/post-detail/post-detail.page';
import Posts from '../../../posts/pages/posts/posts.page';

import './app-router.scss';

const routes = [
  { path: '/', name: 'Home', Component: Posts },
  { path: '/about', name: 'About', Component: About },
  { path: '/contributors', name: 'Contributors', Component: Contributors },
  { path: '/post/:postId', name: 'PostDetail', Component: PostDetail },
  { path: '/post/:postId/:caption', name: 'PostDetail', Component: PostDetail },
  { path: '/tagged/:tagged', name: 'Posts', Component: Posts }
];

const AppRouter = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        timeout={250}
        classNames='fade'
        key={location.key}
        unmountOnExit={true}
      >
        <section className='route'>
          <Switch location={location}>
            {routes.map(
              ({
                path,
                Component
              }: {
                path: string;
                Component: FunctionComponent;
              }) => (
                <Route key={path} exact path={path} children={<Component />} />
              )
            )}
          </Switch>
        </section>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AppRouter;
