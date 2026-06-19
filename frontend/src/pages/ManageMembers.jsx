import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiBookOpen, FiClock, FiMail, FiMapPin, FiPhone, FiSearch, FiUsers, FiX } from 'react-icons/fi';
import DashboardShell from '../components/dashboard/DashboardShell';
import DeskStationery from '../components/dashboard/DeskStationery';
import { useAuth } from '../context/useAuth';
import { libraryService } from '../services/libraryService';
import '../styles/pages/dashboard.css';
import '../styles/pages/manage-members.css';

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
  : '—';
const initials = (name = '') => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';

const ManageMembers = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [demoStatuses, setDemoStatuses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadMembers = useCallback(async () => {
    const [memberResponse, loanResponse] = await Promise.all([
      libraryService.getBorrowers(token),
      libraryService.getLoans(token),
    ]);
    setMembers(memberResponse.data?.data || []);
    setLoans(loanResponse.data?.data || []);
  }, [token]);

  useEffect(() => {
    let current = true;
    Promise.all([libraryService.getBorrowers(token), libraryService.getLoans(token)])
      .then(([memberResponse, loanResponse]) => {
        if (!current) return;
        setMembers(memberResponse.data?.data || []);
        setLoans(loanResponse.data?.data || []);
      })
      .catch((requestError) => { if (current) setError(requestError.response?.data?.message || 'Buku induk anggota belum bisa dibuka.'); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [token]);

  const displayMembers = useMemo(() => {
    if (members.length) return members;
    return [
      { id: 'sample-1', is_demo: true, name: 'Erlangga Abidin', user_email: 'erlangga@mail.com', phone: '0812 8401 2231', address: 'Jakarta Selatan', membership_status: demoStatuses['sample-1'] || 'Aktif', total_loans: 7, active_loans: 1, overdue_loans: 0 },
      { id: 'sample-2', is_demo: true, name: 'Alzafran Pratama', user_email: 'alzafran@mail.com', phone: '0857 1198 3022', address: 'Depok', membership_status: demoStatuses['sample-2'] || 'Aktif', total_loans: 4, active_loans: 1, overdue_loans: 1 },
      { id: 'sample-3', is_demo: true, name: 'Naya Putri', user_email: 'naya.putri@mail.com', phone: '0813 7712 9045', address: 'Tangerang', membership_status: demoStatuses['sample-3'] || 'Nonaktif', total_loans: 12, active_loans: 0, overdue_loans: 0 },
      { id: 'sample-4', is_demo: true, name: 'Bagas Pratama', user_email: 'bagas@mail.com', phone: '0821 6630 1188', address: 'Bekasi', membership_status: demoStatuses['sample-4'] || 'Aktif', total_loans: 2, active_loans: 0, overdue_loans: 0 },
    ];
  }, [demoStatuses, members]);

  const filteredMembers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return displayMembers;
    return displayMembers.filter((member) => [member.name, member.user_email, member.phone, member.address]
      .some((value) => value?.toLowerCase().includes(keyword)));
  }, [displayMembers, query]);

  const activeCount = displayMembers.filter((member) => member.membership_status !== 'Nonaktif').length;
  const carryingCount = displayMembers.filter((member) => Number(member.active_loans) > 0).length;
  const overdueCount = displayMembers.filter((member) => Number(member.overdue_loans) > 0).length;

  const selectedHistory = useMemo(() => {
    if (!selectedMember) return [];
    if (selectedMember.is_demo) {
      return [
        { id: 'history-1', book_title: 'Laut Bercerita', loan_date: '2026-06-12', due_date: '2026-06-19', status: selectedMember.overdue_loans ? 'Terlambat' : 'Dipinjam' },
        { id: 'history-2', book_title: 'Filosofi Teras', loan_date: '2026-05-08', return_date: '2026-05-14', status: 'Dikembalikan' },
      ];
    }
    return loans.filter((loan) => String(loan.borrower_id) === String(selectedMember.id));
  }, [loans, selectedMember]);

  const toggleStatus = async () => {
    if (!selectedMember) return;
    const nextStatus = selectedMember.membership_status === 'Nonaktif' ? 'Aktif' : 'Nonaktif';
    setSubmitting(true);
    setError('');
    try {
      if (selectedMember.is_demo) {
        setDemoStatuses((current) => ({ ...current, [selectedMember.id]: nextStatus }));
        setSelectedMember((current) => ({ ...current, membership_status: nextStatus }));
      } else {
        await libraryService.updateBorrowerStatus(selectedMember.id, { membership_status: nextStatus }, token);
        await loadMembers();
        setSelectedMember((current) => ({ ...current, membership_status: nextStatus }));
      }
      setFeedback(`${selectedMember.name} sekarang berstatus ${nextStatus.toLowerCase()}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Status anggota gagal diperbarui.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell note="Anggota nonaktif tidak muncul saat petugas mencatat peminjaman baru.">
      <header className="member-admin-masthead">
        <div><span>Buku induk anggota</span><h1>Kenali siapa<br />yang membaca.</h1><p>Lihat aktivitas pinjam dan jaga data keanggotaan tetap rapi.</p></div>
        <div className="member-admin-card"><i>{initials('Minjem Dong')}</i><span>KARTU ANGGOTA</span><strong>MINJEMDONG!</strong><small>read · return · repeat</small></div>
        <DeskStationery items={['clips', 'highlighter', 'ruler']} className="member-admin-stationery" />
      </header>

      <section className="member-admin-summary">
        <article><span>Anggota aktif</span><strong>{activeCount}</strong><small>dari {displayMembers.length} anggota</small></article>
        <article><span>Sedang membawa</span><strong>{carryingCount}</strong><small>anggota memegang buku</small></article>
        <article><span>Perlu diingatkan</span><strong>{overdueCount}</strong><small>punya keterlambatan</small></article>
      </section>

      <section className="member-admin-toolbar">
        <label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, email, atau nomor telepon..." /></label>
        <div><strong>{filteredMembers.length}</strong><span>{members.length ? 'anggota ditemukan' : 'data contoh'}</span></div>
      </section>

      {feedback && <div className="member-admin-feedback">{feedback}<button type="button" onClick={() => setFeedback('')}><FiX /></button></div>}
      {error && <div className="member-admin-error"><FiAlertTriangle /> {error}</div>}
      {loading && <div className="dashboard-state"><i /> Membuka buku induk...</div>}

      {!loading && (
        <section className="member-grid">
          {filteredMembers.map((member, index) => (
            <article className="member-card" key={member.id} style={{ '--member-accent': ['#f5c84b', '#377d83', '#e96d4d', '#927db8'][index % 4] }}>
              <header><span className="member-card__avatar">{initials(member.name)}</span><div><small>Anggota {String(index + 1).padStart(3, '0')}</small><strong>{member.name}</strong></div><em className={member.membership_status === 'Nonaktif' ? 'is-inactive' : ''}><i />{member.membership_status || 'Aktif'}</em></header>
              <div className="member-card__contact"><span><FiMail />{member.user_email || 'Email belum tercatat'}</span><span><FiPhone />{member.phone || 'Nomor belum tercatat'}</span></div>
              <div className="member-card__numbers"><div><strong>{member.active_loans || 0}</strong><span>dibawa</span></div><div><strong>{member.total_loans || 0}</strong><span>total pinjam</span></div><div className={Number(member.overdue_loans) ? 'is-alert' : ''}><strong>{member.overdue_loans || 0}</strong><span>terlambat</span></div></div>
              <footer><span><FiMapPin />{member.address || 'Alamat belum dicatat'}</span><button type="button" onClick={() => setSelectedMember(member)}>Buka kartu</button></footer>
            </article>
          ))}
          {!filteredMembers.length && <div className="member-empty"><FiUsers /><strong>Nggak ada anggota yang cocok.</strong><small>Coba nama atau kontak lain.</small></div>}
        </section>
      )}

      {selectedMember && (
        <div className="member-detail-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMember(null); }}>
          <aside className="member-detail">
            <header><div><span>Kartu anggota</span><h2>{selectedMember.name}</h2></div><button type="button" onClick={() => setSelectedMember(null)} aria-label="Tutup"><FiX /></button></header>
            <section className="member-detail__profile"><span>{initials(selectedMember.name)}</span><div><strong>{selectedMember.user_email || 'Email belum tercatat'}</strong><small>{selectedMember.phone || 'Nomor belum tercatat'}</small><small>{selectedMember.address || 'Alamat belum tercatat'}</small></div></section>
            <div className="member-detail__status"><div><span>Status keanggotaan</span><strong><i />{selectedMember.membership_status || 'Aktif'}</strong></div><button type="button" disabled={submitting || (selectedMember.membership_status !== 'Nonaktif' && Number(selectedMember.active_loans) > 0)} onClick={toggleStatus}>{submitting ? 'Menyimpan...' : selectedMember.membership_status === 'Nonaktif' ? 'Aktifkan anggota' : 'Nonaktifkan anggota'}</button></div>
            {selectedMember.membership_status !== 'Nonaktif' && Number(selectedMember.active_loans) > 0 && <p className="member-detail__notice"><FiAlertTriangle /> Anggota masih membawa buku dan belum bisa dinonaktifkan.</p>}
            <section className="member-history"><header><span>Riwayat membaca</span><strong>{selectedHistory.length} transaksi</strong></header>{selectedHistory.map((loan) => <article key={loan.id}><FiBookOpen /><div><strong>{loan.book_title}</strong><small>{formatDate(loan.loan_date)} · {loan.status === 'Dikembalikan' ? `kembali ${formatDate(loan.return_date)}` : `batas ${formatDate(loan.due_date)}`}</small></div><em className={`is-${loan.status?.toLowerCase()}`}>{loan.return_condition && loan.return_condition !== 'Baik' ? loan.return_condition : loan.status}</em></article>)}{!selectedHistory.length && <div className="member-history__empty"><FiClock /> Belum ada transaksi.</div>}</section>
          </aside>
        </div>
      )}
    </DashboardShell>
  );
};

export default ManageMembers;
