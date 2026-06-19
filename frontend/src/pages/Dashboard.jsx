import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiBookOpen,
  FiClock,
  FiCornerDownLeft,
  FiGrid,
  FiLogOut,
  FiRepeat,
  FiTag,
  FiUsers,
} from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import BookVolume from '../components/common/BookVolume';
import DeskStationery from '../components/dashboard/DeskStationery';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/useAuth';
import { libraryService } from '../services/libraryService';
import '../styles/pages/dashboard.css';

const navItems = [
  { label: 'Ringkasan', path: '/dashboard', icon: FiGrid },
  { label: 'Kelola Buku', path: '/dashboard/buku', icon: FiBookOpen },
  { label: 'Kategori', path: '/dashboard/kategori', icon: FiTag },
  { label: 'Peminjaman', path: '/dashboard/peminjaman', icon: FiRepeat },
  { label: 'Pengembalian', path: '/dashboard/pengembalian', icon: FiCornerDownLeft },
  { label: 'Anggota', path: '/dashboard/anggota', icon: FiUsers },
];

const statMeta = [
  { key: 'books', label: 'Total Koleksi', detail: 'Buku yang siap dibaca', color: '#f5c84b', icon: FiBookOpen },
  { key: 'loans', label: 'Riwayat Transaksi', detail: 'Seluruh aktivitas sirkulasi', color: '#377d83', icon: FiRepeat },
  { key: 'active', label: 'Sedang Dipinjam', detail: 'Buku di tangan anggota', color: '#e96d4d', icon: FiClock },
  { key: 'overdue', label: 'Jatuh Tempo', detail: 'Perlu segera dikembalikan', color: '#927db8', icon: FiAlertTriangle },
];

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
  : '—';

const getCoverUrl = (coverImage) => {
  if (!coverImage) return null;
  if (/^https?:\/\//i.test(coverImage)) return coverImage;
  return `${API_BASE_URL}/uploads/${coverImage.replace(/^\/?uploads\//, '')}`;
};

const Dashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    Promise.all([libraryService.getBooks(), libraryService.getLoans(token)])
      .then(([booksResponse, loansResponse]) => {
        if (!isCurrent) return;
        setBooks(booksResponse.data?.data || []);
        setLoans(loansResponse.data?.data || []);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.response?.data?.message || 'Dashboard belum bisa dimuat. Pastikan server aktif.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => { isCurrent = false; };
  }, [token]);

  const statValues = useMemo(() => ({
    books: books.length,
    loans: loans.length,
    active: loans.filter((loan) => loan.status === 'Dipinjam').length,
    overdue: loans.filter((loan) => loan.status === 'Terlambat').length,
  }), [books, loans]);

  const latestLoans = loans.slice(0, 6);
  const latestBooks = books.slice(0, 5);
  const displayName = user?.name || 'Pustakawan';
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="library-admin">
      <aside className="library-admin__sidebar">
        <Link to="/dashboard" className="library-admin__brand">
          <span><img src="/Logo.png" alt="" aria-hidden="true" /></span>
          <div><strong>MinjemDong!</strong><small>Area Petugas</small></div>
        </Link>

        <span className="library-admin__nav-label">Menu Navigasi</span>
        <nav className="library-admin__nav" aria-label="Navigasi admin">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={label} to={path} end={path === '/dashboard'}>
              <Icon aria-hidden="true" /><span>{label}</span><i aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="library-admin__sidebar-note">
          <span>Pengingat Harian</span>
          <p>Jangan lupa periksa daftar buku yang jatuh tempo hari ini.</p>
          <i aria-hidden="true" />
        </div>

        <div className="library-admin__profile">
          <span aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
          <div><strong>{displayName}</strong><small>{user?.email || 'Administrator'}</small></div>
          <button type="button" onClick={handleLogout} aria-label="Keluar"><FiLogOut /></button>
        </div>
      </aside>

      <main className="library-admin__main">
        <header className="dashboard-masthead">
          <div>
            <span>Selamat datang kembali, {displayName}</span>
            <h1>Ringkasan aktivitas<br />perpustakaan hari ini</h1>
            <p>{today}</p>
          </div>
          <div className="dashboard-masthead__actions">
            <Link to="/buku">Lihat Katalog <FiArrowUpRight /></Link>
            <Link to="/">Beranda Web <FiArrowUpRight /></Link>
          </div>
          <span className="dashboard-masthead__mark" aria-hidden="true">laporan hari ini</span>
        </header>

        {loading && <div className="dashboard-state"><i /> Memuat data perpustakaan...</div>}
        {error && <div className="dashboard-state dashboard-state--error"><FiAlertTriangle /><span>{error}</span></div>}

        {!loading && !error && (
          <>
            <section className="dashboard-stats" aria-label="Ringkasan perpustakaan">
              {statMeta.map(({ key, label, detail, color, icon: Icon }, index) => (
                <article className="dashboard-stat-card" style={{ '--stat-color': color }} key={key}>
                  <div><span>{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /></div>
                  <strong>{statValues[key]}</strong>
                  <h2>{label}</h2>
                  <p>{detail}</p>
                </article>
              ))}
              <DeskStationery
                items={['ruler', 'writing-tools', 'highlighter', 'clips', 'stapler']}
                className="dashboard-stat-stationery"
              />
            </section>

            <section className="dashboard-workspace">
              <article className="loan-ledger">
                <header>
                  <div><span>Sirkulasi Aktif</span><h2>Peminjaman Terbaru</h2></div>
                  <Link to="/dashboard/peminjaman">Lihat Semua <FiArrowUpRight /></Link>
                </header>

                {latestLoans.length > 0 ? (
                  <div className="loan-ledger__rows">
                    {latestLoans.map((loan) => (
                      <div className="loan-ledger__row" key={loan.id}>
                        <div><strong>{loan.book_title || 'Judul tidak tercatat'}</strong><small>{loan.borrower_name || 'Peminjam tidak tercatat'}</small></div>
                        <span>{loan.staff_name || '—'}</span>
                        <time>{formatDate(loan.loan_date)}</time>
                        <em className={`loan-status loan-status--${loan.status?.toLowerCase() || 'unknown'}`}>{loan.status || '—'}</em>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-blank dashboard-blank--ledger">
                    <FiBookOpen aria-hidden="true" />
                    <span>Belum ada aktivitas.</span>
                    <small>Transaksi peminjaman dan pengembalian akan muncul di sini.</small>
                  </div>
                )}
              </article>

              <aside className="new-books-panel">
                <header><div><span>Koleksi Baru</span><h2>Baru Saja Ditambahkan</h2></div><i aria-hidden="true" /></header>
                {latestBooks.length > 0 ? (
                  <div className="new-books-panel__list">
                    {latestBooks.map((book, index) => (
                      <div className="new-book-item" key={book.id}>
                        <BookVolume cover={getCoverUrl(book.cover_image)} title={book.title} className="dashboard-mini-book" />
                        <div><strong>{book.title}</strong><span>{book.author || 'Penulis belum dicatat'}</span><small>{book.year || 'Tahun —'}</small></div>
                        <i style={{ '--book-index-color': statMeta[index % statMeta.length].color }} aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-blank">
                    <FiBookOpen aria-hidden="true" /><span>Belum ada koleksi baru.</span><small>Buku yang baru ditambahkan akan tampil di sini.</small>
                  </div>
                )}
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
