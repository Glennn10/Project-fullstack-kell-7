import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SplashScreen from './components/common/SplashScreen';
import CustomScrollbar from './components/common/CustomScrollbar';
import AppRoutes from './routes/AppRoutes';
import './styles/application.css';

const ScrollRestoration = () => {
  const { hash, pathname, search } = useLocation();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'smooth' });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(frame);
  }, [hash, pathname, search]);

  return null;
};

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
      <ScrollRestoration />
      <CustomScrollbar />
      <AppRoutes />
    </>
  );
}

export default App;
