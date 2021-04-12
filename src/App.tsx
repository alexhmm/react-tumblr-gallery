import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import AppRouter from './shared/components/app-router/app-router.component';
import Menu from './shared/components/Menu2/Menu2.component';
import Title from './shared/components/Title2/Title2.component';
import Theme from './shared/components/Theme2/Theme2.component';

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
