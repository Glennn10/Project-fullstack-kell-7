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
import MyBooks from '../pages/MyBooks';
import ManageBooks from '../pages/ManageBooks';
import ManageCategories from '../pages/ManageCategories';
import ManageLoans from '../pages/ManageLoans';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="books" element={<Books />} />
      <Route path="loans" element={<Loans />} />
      <Route path="returns" element={<Returns />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="my-books"
        element={(
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        )}
      />
    </Route>
    <Route
      path="dashboard"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <Dashboard />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/books"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageBooks />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/categories"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageCategories />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/loans"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageLoans />
        </ProtectedRoute>
      )}
    />
  </Routes>
);

export default AppRoutes;
