import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiCheck, FiClock, FiCornerDownLeft, FiSearch, FiUser, FiX } from 'react-icons/fi';
import BookVolume from '../components/common/BookVolume';
import CustomDatePicker from '../components/common/CustomDatePicker';
import DashboardShell from '../components/dashboard/DashboardShell';
import DeskStationery from '../components/dashboard/DeskStationery';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/useAuth';
import { libraryService } from '../services/libraryService';
import '../styles/pages/dashboard.css';
import '../styles/pages/manage-returns.css';

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
  : '—';
const getCoverUrl = (cover) => {
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  return `${API_BASE_URL}/uploads/${cover.replace(/^\/?uploads\//, '')}`;
};
const lateDays = (dueDate, returnDate = today()) => {
  if (!dueDate) return 0;
  const difference = new Date(`${returnDate}T00:00:00`) - new Date(`${String(dueDate).slice(0, 10)}T00:00:00`);
  return Math.max(0, Math.ceil(difference / 86400000));
};

const ManageReturns = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [returnDate, setReturnDate] = useState(today());
  const [condition, setCondition] = useState('Baik');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoReturned, setDemoReturned] = useState([]);

  const loadReturns = useCallback(async () => {
    const [loanResponse, bookResponse] = await Promise.all([libraryService.getLoans(token), libraryService.getBooks()]);
    setLoans(loanResponse.data?.data || []);
    setBooks(bookResponse.data?.data || []);
  }, [token]);

  useEffect(() => {
    let current = true;
    Promise.all([libraryService.getLoans(token), libraryService.getBooks()])
      .then(([loanResponse, bookResponse]) => {
        if (!current) return;
        setLoans(loanResponse.data?.data || []);
        setBooks(bookResponse.data?.data || []);
      })
      .catch((requestError) => { if (current) setError(requestError.response?.data?.message || 'Meja pengembalian belum bisa dibuka.'); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [token]);

  const realActiveLoans = useMemo(() => loans.filter((loan) => loan.status !== 'Dikembalikan'), [loans]);
  const sampleLoans = useMemo(() => {
    if (loans.length) return [];
    const fallback = [['Laut Bercerita', 'Leila S. Chudori'], ['Atomic Habits', 'James Clear'], ['Clean Code', 'Robert C. Martin']];
    return [
      { borrower_name: 'Naya Putri', loan_date: '2026-06-12', due_date: '2026-06-19', status: 'Dipinjam' },
      { borrower_name: 'Bagas Pratama', loan_date: '2026-06-02', due_date: '2026-06-09', status: 'Terlambat' },
      { borrower_name: 'Raka Aditya', loan_date: '2026-06-15', due_date: '2026-06-22', status: 'Dipinjam' },
    ].map((loan, index) => ({
      ...loan,
      id: `return-sample-${index}`,
      is_demo: true,
      book_title: books[index]?.title || fallback[index][0],
      book_author: books[index]?.author || fallback[index][1],
      cover_image: books[index]?.cover_image || null,
    })).filter((loan) => !demoReturned.includes(loan.id));
  }, [books, demoReturned, loans.length]);
  const activeLoans = realActiveLoans.length || loans.length ? realActiveLoans : sampleLoans;
  const overdueCount = activeLoans.filter((loan) => lateDays(loan.due_date) > 0).length;
  const returnedToday = loans.filter((loan) => loan.status === 'Dikembalikan' && String(loan.return_date).slice(0, 10) === today()).length;
  const filteredLoans = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return activeLoans;
    return activeLoans.filter((loan) => [loan.book_title, loan.book_author, loan.borrower_name]
      .some((value) => value?.toLowerCase().includes(keyword)));
  }, [activeLoans, query]);

  const closeReceipt = () => {
    setSelectedLoan(null);
    setReturnDate(today());
    setCondition('Baik');
    setNotes('');
  };

  const handleReturn = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (selectedLoan.is_demo) {
        setDemoReturned((current) => [...current, selectedLoan.id]);
      } else {
        await libraryService.updateLoanStatus(selectedLoan.id, {
          status: 'Dikembalikan',
          return_date: returnDate,
          return_condition: condition,
          return_notes: notes.trim() || null,
        }, token);
        await loadReturns();
      }
      setFeedback(condition === 'Baik'
        ? `“${selectedLoan.book_title}” sudah diterima dan kembali tersedia di rak.`
        : `“${selectedLoan.book_title}” sudah diterima dan dipisahkan karena kondisinya ${condition.toLowerCase()}.`);
      closeReceipt();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Pengembalian gagal dicatat.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell note="Periksa kondisi fisik buku sebelum mengembalikannya ke rak.">
      <header className="return-admin-masthead">
        <div><span>Meja penerimaan</span><h1>Sambut bukunya<br />pulang.</h1><p>Cocokkan peminjam, tanggal, dan kondisi buku sebelum kembali ke rak.</p></div>
        <div className="return-admin-stamp"><FiCornerDownLeft /><strong>TERIMA</strong><small>cek · catat · rak</small></div>
        <DeskStationery items={['highlighter', 'clips', 'ruler']} className="return-admin-stationery" />
      </header>

      <section className="return-admin-summary">
        <article><span>Menunggu pulang</span><strong>{activeLoans.length}</strong><small>buku masih dibawa</small></article>
        <article><span>Lewat batas</span><strong>{overdueCount}</strong><small>perlu dicek segera</small></article>
        <article><span>Diterima hari ini</span><strong>{returnedToday}</strong><small>transaksi selesai</small></article>
      </section>

      <section className="return-admin-toolbar">
        <label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul atau nama peminjam..." /></label>
        <div><strong>{filteredLoans.length}</strong><span>{loans.length ? 'menunggu pengembalian' : 'data contoh'}</span></div>
      </section>

      {feedback && <div className="return-admin-feedback">{feedback}<button type="button" onClick={() => setFeedback('')}><FiX /></button></div>}
      {error && <div className="return-admin-error"><FiAlertTriangle /> {error}</div>}
      {loading && <div className="dashboard-state"><i /> Menyiapkan meja penerimaan...</div>}

      {!loading && (
        <section className="return-ledger">
          <header><strong>Buku yang belum pulang</strong><div><span>Buku & peminjam</span><span>Jadwal</span><span>Catatan waktu</span><span>Aksi</span></div></header>
          {filteredLoans.map((loan) => {
            const overdue = lateDays(loan.due_date);
            return (
              <article key={loan.id}>
                <div className="return-ledger__identity">
                  <BookVolume cover={getCoverUrl(loan.cover_image)} title={loan.book_title} className="return-mini-book" />
                  <div><strong>{loan.book_title}</strong><small>{loan.book_author}</small><span><FiUser /> {loan.borrower_name}</span></div>
                </div>
                <div className="return-ledger__dates"><small>Dipinjam</small><strong>{formatDate(loan.loan_date)}</strong><small>Wajib kembali {formatDate(loan.due_date)}</small></div>
                <div className={`return-ledger__timing${overdue ? ' is-late' : ''}`}><FiClock /><div><strong>{overdue ? `${overdue} hari terlambat` : 'Masih tepat waktu'}</strong><small>{overdue ? 'Periksa catatan peminjam' : 'Belum melewati batas'}</small></div></div>
                <button type="button" className="return-ledger__receive" onClick={() => setSelectedLoan(loan)}><FiCornerDownLeft /> Terima buku</button>
              </article>
            );
          })}
          {!filteredLoans.length && <div className="return-ledger__empty"><FiCheck /><strong>Semua buku sudah pulang.</strong><small>Tidak ada pengembalian yang menunggu.</small></div>}
        </section>
      )}

      {selectedLoan && (
        <div className="return-receipt-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeReceipt(); }}>
          <form className="return-receipt" onSubmit={handleReturn}>
            <header><div><span>Slip penerimaan</span><h2>Periksa sebelum masuk rak</h2></div><button type="button" onClick={closeReceipt} aria-label="Tutup"><FiX /></button></header>
            <div className="return-receipt__book"><BookVolume cover={getCoverUrl(selectedLoan.cover_image)} title={selectedLoan.book_title} className="return-receipt-book" /><div><strong>{selectedLoan.book_title}</strong><span>{selectedLoan.book_author}</span><small>dibawa oleh {selectedLoan.borrower_name}</small></div></div>
            <label>Tanggal diterima<CustomDatePicker value={returnDate} min={String(selectedLoan.loan_date).slice(0, 10)} onChange={setReturnDate} /></label>
            <fieldset><legend>Kondisi saat diterima</legend><div>{['Baik', 'Rusak', 'Hilang'].map((item) => <button type="button" className={condition === item ? 'is-selected' : ''} key={item} onClick={() => setCondition(item)}><i />{item}</button>)}</div></fieldset>
            <label>Catatan petugas<textarea rows="3" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Opsional—misalnya sampul terlipat atau halaman lepas." /></label>
            {lateDays(selectedLoan.due_date, returnDate) > 0 && <div className="return-receipt__late"><FiAlertTriangle /><span>Terlambat <strong>{lateDays(selectedLoan.due_date, returnDate)} hari</strong></span></div>}
            <button className="return-receipt__submit" type="submit" disabled={submitting}><FiCheck /> {submitting ? 'Mencatat...' : 'Selesaikan pengembalian'}</button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
};

export default ManageReturns;
