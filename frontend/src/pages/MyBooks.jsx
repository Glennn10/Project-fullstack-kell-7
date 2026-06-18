import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowRight, FiBookOpen, FiCheckCircle, FiClock, FiRotateCcw } from 'react-icons/fi';
import BookVolume from '../components/common/BookVolume';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/useAuth';
import { categoryPalette } from '../data/catalogData';
import { libraryService } from '../services/libraryService';
import '../styles/pages/my-books.css';

const tabs = [
  { id: 'active', label: 'Sedang Dipinjam', icon: FiBookOpen },
  { id: 'history', label: 'Riwayat', icon: FiRotateCcw },
];

const formatDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
};

const getCoverUrl = (coverImage) => {
  if (!coverImage) return null;
  if (/^https?:\/\//i.test(coverImage)) return coverImage;
  return `${API_BASE_URL}/uploads/${coverImage.replace(/^\/?uploads\//, '')}`;
};

const normalizeLoan = (loan, index) => {
  const returned = loan.status?.toLowerCase() === 'dikembalikan';
  const dueDate = loan.due_date ? new Date(loan.due_date) : null;
  const dayDifference = dueDate
    ? Math.ceil((dueDate.setHours(23, 59, 59, 999) - Date.now()) / 86400000)
    : null;
  const late = !returned && (loan.status?.toLowerCase() === 'terlambat' || dayDifference < 0);
  const state = late ? 'late' : dayDifference !== null && dayDifference <= 2 ? 'soon' : 'safe';
  const timing = late
    ? `Lewat ${Math.abs(dayDifference || 0)} hari`
    : dayDifference === null
      ? 'Cek ke petugas'
      : dayDifference === 0
        ? 'Kembali hari ini'
        : `Masih ${dayDifference} hari`;

  return {
    id: loan.id,
    title: loan.book_title,
    author: loan.book_author || 'Penulis tidak tercatat',
    cover: getCoverUrl(loan.cover_image),
    borrowedAt: formatDate(loan.loan_date),
    dueAt: formatDate(loan.due_date),
    returnedAt: formatDate(loan.return_date),
    timing,
    state,
    returned,
    accent: categoryPalette[index % categoryPalette.length],
  };
};

const MyBooks = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    libraryService.getMyLoans(token)
      .then((response) => {
        if (isCurrent) setLoans((response.data?.data || []).map(normalizeLoan));
      })
      .catch(() => {
        if (isCurrent) setLoadError('Data pinjaman belum bisa dimuat. Coba lagi setelah server aktif.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => { isCurrent = false; };
  }, [token]);

  const activeBooks = useMemo(() => loans.filter((loan) => !loan.returned), [loans]);
  const historyBooks = useMemo(() => loans.filter((loan) => loan.returned), [loans]);
  const visibleBooks = activeTab === 'active' ? activeBooks : historyBooks;

  return (
    <section className="my-books-page" aria-labelledby="my-books-title">
      <header className="my-books-header">
        <div>
          <span className="my-books-header__eyebrow">Rak pinjamanmu</span>
          <h1 id="my-books-title">Buku Saya</h1>
          <p>Pantau buku yang sedang dibawa, tanggal kembali, dan riwayat peminjamanmu.</p>
        </div>
        <span className="my-books-header__count"><strong>{activeBooks.length}</strong> buku aktif</span>
      </header>

      <div className="my-books-tabs" role="tablist" aria-label="Daftar buku saya">
        {tabs.map(({ id, label, icon: Icon }) => {
          const count = id === 'active' ? activeBooks.length : historyBooks.length;
          return (
            <button type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)} key={id}>
              <Icon aria-hidden="true" /> {label} <span>{count}</span>
            </button>
          );
        })}
      </div>

      {isLoading && <div className="my-books-loading" role="status"><i /> Memuat rak pinjaman...</div>}

      {!isLoading && visibleBooks.length > 0 && (
        <div className="my-books-list" role="tabpanel">
          <div className="my-books-list__heading">
            <span>{activeTab === 'active' ? 'Masih ada di tanganmu' : 'Sudah kembali ke rak'}</span>
            <p>{activeTab === 'active' ? 'Cek tanggalnya sebelum terlambat.' : 'Catatan bacaan yang pernah kamu bawa pulang.'}</p>
          </div>

          {visibleBooks.map((book) => {
            const isHistory = activeTab === 'history';
            const StateIcon = isHistory ? FiCheckCircle : book.state === 'late' ? FiAlertCircle : FiClock;
            return (
              <article className="my-loan-book" key={book.id} style={{ '--loan-accent': book.accent }}>
                <BookVolume cover={book.cover} title={book.title} className="my-loan-book__volume" />
                <div className="my-loan-book__identity">
                  <span>{isHistory ? 'Selesai dibaca' : 'Sedang dipinjam'}</span>
                  <h2>{book.title}</h2>
                  <p>oleh {book.author}</p>
                </div>
                <dl className="my-loan-book__dates">
                  <div><dt>Mulai pinjam</dt><dd>{book.borrowedAt}</dd></div>
                  <div><dt>{isHistory ? 'Dikembalikan' : 'Batas kembali'}</dt><dd>{isHistory ? book.returnedAt : book.dueAt}</dd></div>
                </dl>
                <span className={`my-loan-book__state ${isHistory ? 'is-returned' : `is-${book.state}`}`}>
                  <StateIcon aria-hidden="true" /> {isHistory ? 'Sudah kembali' : book.timing}
                </span>
              </article>
            );
          })}
        </div>
      )}

      {!isLoading && visibleBooks.length === 0 && (
        <div className="my-books-empty" role="tabpanel">
          <div className="my-books-empty__illustration" aria-hidden="true"><span><FiBookOpen /></span><i /></div>
          <span className="my-books-empty__label"><FiClock /> {loadError ? 'Rak belum bisa dibuka' : 'Rak ini masih kosong'}</span>
          <h2>{loadError || (activeTab === 'active' ? 'Belum ada buku di tanganmu.' : 'Belum ada riwayat peminjaman.')}</h2>
          <p>{activeTab === 'active' ? 'Setelah peminjaman akunmu disetujui, buku dan tanggal kembalinya akan muncul di sini.' : 'Buku yang sudah kamu kembalikan nantinya akan tersimpan rapi di sini.'}</p>
          {activeTab === 'active' && !loadError && <Link to="/books">Jelajahi katalog <FiArrowRight /></Link>}
        </div>
      )}
    </section>
  );
};

export default MyBooks;
