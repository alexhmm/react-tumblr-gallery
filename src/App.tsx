import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import AppRouter from './shared/components/app-router/app-router.component';
import Menu from './shared/components/menu/menu.component';
import Title from './shared/components/title/title.component';
import Theme from './shared/components/theme/theme.component';

// Utils
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
