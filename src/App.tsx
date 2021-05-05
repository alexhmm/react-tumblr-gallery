import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import AppRouter from './shared/components/AppRouter/AppRouter';
import Menu from './shared/components/Menu2/Menu';
import Title from './shared/components/Title2/Title';

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
      <AppRouter />
    </Router>
  );
};

export default App;
