import { FiBookOpen, FiCornerDownLeft, FiGrid, FiLogOut, FiRepeat, FiTag, FiUsers } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const navItems = [
  { label: 'Ringkasan', path: '/dashboard', icon: FiGrid },
  { label: 'Kelola Buku', path: '/dashboard/books', icon: FiBookOpen },
  { label: 'Kategori', path: '/dashboard/categories', icon: FiTag },
  { label: 'Peminjaman', path: '/dashboard/loans', icon: FiRepeat },
  { label: 'Pengembalian', path: '/dashboard/returns', icon: FiCornerDownLeft },
  { label: 'Anggota', path: '/dashboard/members', icon: FiUsers },
];

const DashboardShell = ({ children, note = 'Cek data sebelum menutup perpustakaan.' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || 'Pustakawan';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="library-admin">
      <aside className="library-admin__sidebar">
        <Link to="/dashboard" className="library-admin__brand">
          <span><img src="/Logo.png" alt="" aria-hidden="true" /></span>
          <div><strong>MinjemDong!</strong><small>Meja petugas</small></div>
        </Link>
        <span className="library-admin__nav-label">Jelajahi meja</span>
        <nav className="library-admin__nav" aria-label="Navigasi admin">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={label} to={path} end={path === '/dashboard'}>
              <Icon aria-hidden="true" /><span>{label}</span><i aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
        <div className="library-admin__sidebar-note"><span>Catatan meja</span><p>{note}</p><i aria-hidden="true" /></div>
        <div className="library-admin__profile">
          <span>{displayName.charAt(0).toUpperCase()}</span>
          <div><strong>{displayName}</strong><small>{user?.email || 'Administrator'}</small></div>
          <button type="button" onClick={handleLogout} aria-label="Keluar"><FiLogOut /></button>
        </div>
      </aside>
      <main className="library-admin__main">{children}</main>
    </div>
  );
};

export default DashboardShell;
