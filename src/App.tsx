import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AppRouter from './shared/components/AppRouter/AppRouter.component';
import Menu from './shared/components/Menu/Menu.component';
import Theme from './shared/components/Theme/Theme.component';
import Title from './shared/components/Title/Title.component';
import { setAppMetaData } from './shared/utils/shared.utils';

const App = () => {
  useEffect(() => {
    setAppMetaData();
  }, []);

  return (
    <Router>
      <Menu />
      <Title />
      <Theme />
      <AppRouter />
    </Router>
  );
};

export default App;
