import { FunctionComponent, useRef } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Pages
import { About } from '../../info/pages/About';
import { Contributors } from '../../info/pages/Contributors';
import { PostDetail } from '../../posts/pages/PostDetail';
import { Posts } from '../../posts/pages/Posts';

import './styles/AppRouter.scss';

const routes = [
  { path: '/', name: 'Home', Component: Posts },
  { path: '/about', name: 'About', Component: About },
  { path: '/contributors', name: 'Contributors', Component: Contributors },
  { path: '/post/:postId', name: 'PostDetail', Component: PostDetail },
  { path: '/post/:postId/:caption', name: 'PostDetail', Component: PostDetail },
  { path: '/tagged/:tagged', name: 'Posts', Component: Posts }
];

export const AppRouter = () => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition
        nodeRef={nodeRef}
        timeout={200}
        classNames="fade"
        key={location.key}
        unmountOnExit={true}
      >
        <section className="absolute left-0 top-0 w-full">
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
