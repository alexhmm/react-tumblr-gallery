import { FunctionComponent } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import PostDetail from '../../../posts/pages/post-detail/post-detail.page';
import Posts from '../../../posts/pages/posts/posts.page';

import './app-router.scss';

/**
 * Application routes
 */
const routes = [
  { path: '/', name: 'Home', Component: Posts },
  { path: '/post/:postId', name: 'About', Component: PostDetail },
  { path: '/post/:postId/:caption', name: 'Contact', Component: PostDetail },
  { path: '/tagged/:tagged', name: 'Contact', Component: Posts }
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
