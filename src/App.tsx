import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import { AppRouter } from './shared/components/AppRouter';
import { Menu } from './shared/components/Menu';
import { Title } from './shared/components/Title';

// Hooks
import { useSharedUtils } from './shared/hooks/use-shared-utils.hook';

// Hooks

// Utils
import './shared/utils/font-awesome.util';

const App = () => {
  const { appMetaDataSet } = useSharedUtils();

  useEffect(() => {
    appMetaDataSet();
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Title />
      <Menu />
      <AppRouter />
    </Router>
  );
};

export default App;
