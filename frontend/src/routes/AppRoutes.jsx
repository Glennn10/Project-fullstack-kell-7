import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Home from '../pages/Home';
import Books from '../pages/Books';
import Loans from '../pages/Loans';
import Returns from '../pages/Returns';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="books" element={<Books />} />
      <Route path="loans" element={<Loans />} />
      <Route path="returns" element={<Returns />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
    <Route
      path="dashboard"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <Dashboard />
        </ProtectedRoute>
      )}
    />
  </Routes>
);

export default AppRoutes;
