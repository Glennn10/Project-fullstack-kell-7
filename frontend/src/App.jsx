import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/index';
import Books from './pages/Books';
import Loans from './pages/Loans';
import Returns from './pages/Returns';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import CustomScrollbar from './components/CustomScrollbar';
import './App.css';

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
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/books"
          element={
            <Layout>
              <Books />
            </Layout>
          }
        />
        <Route
          path="/loans"
          element={
            <Layout>
              <Loans />
            </Layout>
          }
        />
        <Route
          path="/returns"
          element={
            <Layout>
              <Returns />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
