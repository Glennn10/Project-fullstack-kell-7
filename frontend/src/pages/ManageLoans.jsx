import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiBookOpen, FiCalendar, FiCheck, FiClock, FiPlus, FiSearch, FiSend, FiUser, FiX } from 'react-icons/fi';
import BookVolume from '../components/common/BookVolume';
import AutocompleteSelect from '../components/common/AutocompleteSelect';
import CustomDatePicker from '../components/common/CustomDatePicker';
import DashboardShell from '../components/dashboard/DashboardShell';
import DeskStationery from '../components/dashboard/DeskStationery';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/useAuth';
import { libraryService } from '../services/libraryService';
import '../styles/pages/dashboard.css';
import '../styles/pages/manage-loans.css';

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (value, days) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const formatDate = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
  : '—';
const getCoverUrl = (cover) => {
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  return `${API_BASE_URL}/uploads/${cover.replace(/^\/?uploads\//, '')}`;
};

const ManageLoans = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [bookId, setBookId] = useState('');
  const [borrowerId, setBorrowerId] = useState('');
  const [loanDate, setLoanDate] = useState(today());
  const [dueDate, setDueDate] = useState(addDays(today(), 7));
  const [submitting, setSubmitting] = useState(false);

  const loadDesk = useCallback(async () => {
    const [bookResponse, borrowerResponse, loanResponse] = await Promise.all([
      libraryService.getBooks(),
      libraryService.getBorrowers(token),
      libraryService.getLoans(token),
    ]);
    setBooks(bookResponse.data?.data || []);
    setBorrowers(borrowerResponse.data?.data || []);
    setLoans(loanResponse.data?.data || []);
  }, [token]);

  useEffect(() => {
    let current = true;
    Promise.all([libraryService.getBooks(), libraryService.getBorrowers(token), libraryService.getLoans(token)])
      .then(([bookResponse, borrowerResponse, loanResponse]) => {
        if (!current) return;
        setBooks(bookResponse.data?.data || []);
        setBorrowers(borrowerResponse.data?.data || []);
        setLoans(loanResponse.data?.data || []);
      })
      .catch((requestError) => {
        if (current) setError(requestError.response?.data?.message || 'Catatan peminjaman belum bisa dibuka.');
      })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [token]);

  const availableBooks = useMemo(() => books.filter((book) => book.is_available !== false), [books]);
  const activeLoans = useMemo(() => loans.filter((loan) => loan.status !== 'Dikembalikan'), [loans]);
  const lateLoans = useMemo(() => loans.filter((loan) => loan.status === 'Terlambat'), [loans]);
  const tableLoans = useMemo(() => {
    if (loans.length) return loans;
    const samples = [
      { borrower_name: 'Naya Putri', status: 'Dipinjam', loan_date: '2026-06-16', due_date: '2026-06-23' },
      { borrower_name: 'Bagas Pratama', status: 'Terlambat', loan_date: '2026-06-05', due_date: '2026-06-12' },
      { borrower_name: 'Sinta Maharani', status: 'Dikembalikan', loan_date: '2026-06-02', due_date: '2026-06-09' },
      { borrower_name: 'Raka Aditya', status: 'Dipinjam', loan_date: '2026-06-18', due_date: '2026-06-25' },
    ];
    const fallbackBooks = [
      ['Laut Bercerita', 'Leila S. Chudori'],
      ['Atomic Habits', 'James Clear'],
      ['Filosofi Teras', 'Henry Manampiring'],
      ['Clean Code', 'Robert C. Martin'],
    ];
    return samples.map((sample, index) => ({
      id: `sample-${index}`,
      is_demo: true,
      book_title: books[index]?.title || fallbackBooks[index][0],
      book_author: books[index]?.author || fallbackBooks[index][1],
      cover_image: books[index]?.cover_image || null,
      staff_name: 'Admin',
      ...sample,
    }));
  }, [books, loans]);
  const filteredLoans = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return tableLoans;
    return tableLoans.filter((loan) => [loan.book_title, loan.book_author, loan.borrower_name, loan.status]
      .some((value) => value?.toLowerCase().includes(keyword)));
  }, [query, tableLoans]);
  const selectedBook = books.find((book) => String(book.id) === String(bookId));

  const closeEditor = () => {
    setEditorOpen(false);
    setBookId('');
    setBorrowerId('');
    setLoanDate(today());
    setDueDate(addDays(today(), 7));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await libraryService.createLoan({ book_id: Number(bookId), borrower_id: Number(borrowerId), loan_date: loanDate, due_date: dueDate }, token);
      setFeedback('Peminjaman sudah masuk ke buku sirkulasi. Stok buku otomatis ditandai sedang dibawa.');
      closeEditor();
      await loadDesk();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Peminjaman gagal dicatat.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (loan, status) => {
    setError('');
    try {
      await libraryService.updateLoanStatus(loan.id, {
        status,
        return_date: status === 'Dikembalikan' ? today() : null,
      }, token);
      setFeedback(status === 'Dikembalikan'
        ? `“${loan.book_title}” sudah kembali dan tersedia lagi di katalog.`
        : `“${loan.book_title}” ditandai terlambat.`);
      await loadDesk();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Status peminjaman gagal diperbarui.');
    }
  };

  return (
    <DashboardShell note="Cocokkan buku dan nama peminjam sebelum catatan disimpan.">
      <header className="loan-admin-masthead">
        <div><span>Meja sirkulasi</span><h1>Buku keluar,<br />catat jejaknya.</h1><p>Pilih buku yang tersedia dan siapa yang membawanya pulang.</p></div>
        <button type="button" onClick={() => setEditorOpen(true)} disabled={!availableBooks.length || !borrowers.length}><FiPlus /> Catat peminjaman</button>
        <DeskStationery items={['ruler', 'clips', 'stapler']} className="loan-admin-stationery" />
      </header>

      <section className="loan-admin-summary">
        <article><span>Masih dibawa</span><strong>{activeLoans.length}</strong><small>buku belum kembali</small></article>
        <article><span>Lewat waktu</span><strong>{lateLoans.length}</strong><small>perlu diingatkan</small></article>
        <article><span>Siap dipinjam</span><strong>{availableBooks.length}</strong><small>dari {books.length} buku</small></article>
      </section>

      <section className="loan-admin-toolbar">
        <label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari buku atau peminjam..." /></label>
        <div><strong>{filteredLoans.length}</strong><span>{loans.length ? 'catatan sirkulasi' : 'data contoh'}</span></div>
      </section>

      {feedback && <div className="loan-admin-feedback">{feedback}<button type="button" onClick={() => setFeedback('')}><FiX /></button></div>}
      {error && <div className="loan-admin-error"><FiBookOpen /> {error}</div>}
      {loading && <div className="dashboard-state"><i /> Membuka buku sirkulasi...</div>}

      {!loading && (
        <section className="loan-admin-ledger">
          <header><strong>Catatan peminjaman</strong><div><span>Buku</span><span>Peminjam</span><span>Tanggal</span><span>Status</span></div></header>
          {filteredLoans.map((loan) => (
            <article key={loan.id}>
              <div className="loan-admin-ledger__book"><BookVolume cover={getCoverUrl(loan.cover_image)} title={loan.book_title} className="loan-admin-mini-book" /><div><strong>{loan.book_title || 'Buku dihapus'}</strong><small>{loan.book_author || 'Penulis tidak tercatat'}</small></div></div>
              <div className="loan-admin-ledger__borrower"><FiUser /><div><strong>{loan.borrower_name || 'Peminjam tidak tercatat'}</strong><small>Dicatat oleh {loan.staff_name || 'petugas'}</small></div></div>
              <div className="loan-admin-ledger__dates"><span><FiCalendar /> {formatDate(loan.loan_date)}</span><small>Kembali {formatDate(loan.due_date)}</small></div>
              <div className="loan-admin-ledger__actions">
                <span className={`loan-admin-ledger__status is-${loan.status?.toLowerCase()}`}><i />{loan.status}</span>
                {!loan.is_demo && loan.status !== 'Dikembalikan' && (
                  <div>
                    {loan.status !== 'Terlambat' && <button type="button" onClick={() => handleStatus(loan, 'Terlambat')} title="Tandai terlambat"><FiClock /></button>}
                    <button type="button" onClick={() => handleStatus(loan, 'Dikembalikan')} title="Tandai sudah kembali"><FiCheck /></button>
                  </div>
                )}
              </div>
            </article>
          ))}
          {!filteredLoans.length && <div className="loan-admin-ledger__empty"><FiBookOpen /><strong>Belum ada catatan di halaman ini.</strong><small>Catat peminjaman baru atau ubah kata pencarian.</small></div>}
        </section>
      )}

      {editorOpen && (
        <div className="loan-editor-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
          <form className="loan-editor" onSubmit={handleSubmit}>
            <header><div><h2>Catat peminjaman</h2></div><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={closeEditor} aria-label="Tutup"><FiX /></button></header>
            <div className="loan-editor__preview">
              {selectedBook ? <BookVolume cover={getCoverUrl(selectedBook.cover_image)} title={selectedBook.title} /> : <FiBookOpen />}
              <div><small>Buku yang dibawa</small><strong>{selectedBook?.title || 'Belum dipilih'}</strong><span>{selectedBook?.author || 'Pilih dari stok yang tersedia'}</span></div>
            </div>
            <label>Buku<AutocompleteSelect value={bookId} onChange={setBookId} placeholder="Ketik judul atau penulis..." options={availableBooks.map((book) => ({ value: book.id, label: book.title, meta: book.author, searchText: `${book.title} ${book.author}` }))} /></label>
            <label>Peminjam<AutocompleteSelect value={borrowerId} onChange={setBorrowerId} placeholder="Ketik nama, email, atau nomor..." options={borrowers.map((borrower) => ({ value: borrower.id, label: borrower.name, meta: borrower.user_email || borrower.phone || 'Anggota perpustakaan', searchText: `${borrower.name} ${borrower.user_email || ''} ${borrower.phone || ''}` }))} /></label>
            <div className="loan-editor__date-grid">
              <label>Tanggal dipinjam<CustomDatePicker value={loanDate} onChange={(value) => { setLoanDate(value); setDueDate(addDays(value, 7)); }} /></label>
              <label>Batas pengembalian<CustomDatePicker value={dueDate} min={loanDate} onChange={setDueDate} /></label>
            </div>
            <button className="loan-editor__submit" type="submit" disabled={submitting || !bookId || !borrowerId || !loanDate || !dueDate}><FiSend /> {submitting ? 'Mencatat...' : 'Masukkan ke sirkulasi'}</button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
};

export default ManageLoans;
