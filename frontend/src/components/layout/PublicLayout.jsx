import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const Layout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavigationBar />
      <main className={isHome ? 'flex-grow-1' : 'flex-grow-1 container py-4'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
