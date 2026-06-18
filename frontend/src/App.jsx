import { useState, useEffect } from 'react';
import SplashScreen from './components/common/SplashScreen';
import CustomScrollbar from './components/common/CustomScrollbar';
import AppRoutes from './routes/AppRoutes';
import './styles/application.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let removeTimer;

    const displayTimer = setTimeout(() => {
      setFadeOut(true);

      removeTimer = setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }, 1700);

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen fadeOut={fadeOut} />}
      <CustomScrollbar />
      <AppRoutes />
    </>
  );
}

export default App;
