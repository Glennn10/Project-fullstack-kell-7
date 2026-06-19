import { Navigate, Route, Routes } from 'react-router-dom';
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
import ManageReturns from '../pages/ManageReturns';
import ManageMembers from '../pages/ManageMembers';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="buku" element={<Books />} />
      <Route path="peminjaman" element={<Loans />} />
      <Route path="pengembalian" element={<Returns />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="buku-saya"
        element={(
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        )}
      />
      <Route path="books" element={<Navigate to="/buku" replace />} />
      <Route path="loans" element={<Navigate to="/peminjaman" replace />} />
      <Route path="returns" element={<Navigate to="/pengembalian" replace />} />
      <Route path="my-books" element={<Navigate to="/buku-saya" replace />} />
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
      path="dashboard/buku"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageBooks />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/kategori"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageCategories />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/peminjaman"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageLoans />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/pengembalian"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageReturns />
        </ProtectedRoute>
      )}
    />
    <Route
      path="dashboard/anggota"
      element={(
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageMembers />
        </ProtectedRoute>
      )}
    />
    <Route path="dashboard/books" element={<Navigate to="/dashboard/buku" replace />} />
    <Route path="dashboard/categories" element={<Navigate to="/dashboard/kategori" replace />} />
    <Route path="dashboard/loans" element={<Navigate to="/dashboard/peminjaman" replace />} />
    <Route path="dashboard/returns" element={<Navigate to="/dashboard/pengembalian" replace />} />
    <Route path="dashboard/members" element={<Navigate to="/dashboard/anggota" replace />} />
  </Routes>
);

export default AppRoutes;
