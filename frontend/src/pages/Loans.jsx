import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { useAuth } from '../context/useAuth';
import './Loans.css';

// Mock data fallbacks for standalone/offline demo mode
const MOCK_BOOKS = [
  { id: 1, title: 'Ensiklopedia Anak Cerdas: Olahraga', author: 'BIP Kelompok Gramedia' },
  { id: 2, title: 'Ensiklopedia Anak Cerdas: Penemuan', author: 'BIP Kelompok Gramedia' },
  { id: 3, title: "Perry's Chemical Engineers' Handbook", author: 'Don W. Green' },
  { id: 4, title: 'To Feel the Music', author: 'Dav Pilkey' },
  { id: 5, title: 'Harry Potter and the Order of the Phoenix', author: 'J.K. Rowling' },
];

const MOCK_BORROWERS = [
  { id: 101, name: 'Budi Santoso', phone: '081234567890', address: 'Jakarta' },
  { id: 102, name: 'Siti Rahma', phone: '085678901234', address: 'Bandung' },
  { id: 103, name: 'Ahmad Faisal', phone: '089012345678', address: 'Surabaya' },
  { id: 104, name: 'Dewi Lestari', phone: '082134567890', address: 'Yogyakarta' },
];

const Loans = () => {
  const { token, user, isAuthenticated } = useAuth();

  // Page States
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form States
  const [selectedBookId, setSelectedBookId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [loanDate, setLoanDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [submitting, setSubmitting] = useState(false);

  // Load Initial Data
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!active) return;
      
      // Start loading
      setLoading(true);
      setErrorMessage('');

      // If user is not logged in, force demo mode immediately
      if (!token) {
        if (active) {
          setIsDemoMode(true);
          setBooks(MOCK_BOOKS);
          setBorrowers(MOCK_BORROWERS);
          setLoading(false);
        }
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch books and borrowers concurrently
        const [booksRes, borrowersRes] = await Promise.all([
          axios.get(apiUrl('/api/books')),
          axios.get(apiUrl('/api/borrowers'), { headers })
        ]);

        if (active) {
          setBooks(booksRes.data.data || []);
          setBorrowers(borrowersRes.data.data || []);
          setIsDemoMode(false);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Backend connection failed. Switching to Demo Mode.', err);
        // Fallback to demo mode if backend is down or API returns error
        if (active) {
          setIsDemoMode(true);
          setBooks(MOCK_BOOKS);
          setBorrowers(MOCK_BORROWERS);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [token]);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);

    if (!selectedBookId || !borrowerName.trim() || !loanDate) {
      setErrorMessage('Harap lengkapi semua kolom form!');
      setSubmitting(false);
      return;
    }

    if (isDemoMode) {
      // In-memory demo mode logic
      setSuccessMessage(`Peminjaman buku berhasil dicatat secara lokal untuk peminjam "${borrowerName.trim()}" (Mode Demo)!`);
      
      // Reset form fields
      setSelectedBookId('');
      setBorrowerName('');
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      // API integration mode
      try {
        const headers = { Authorization: `Bearer ${token}` };
        let borrowerId = null;

        // 1. Check if borrower already exists (defensively check b.name)
        const existing = borrowers.find(
          b => (b?.name || '').toLowerCase() === borrowerName.trim().toLowerCase()
        );

        if (existing) {
          borrowerId = existing.id;
        } else {
          // 2. Register borrower first if they don't exist
          const newBorrowerRes = await axios.post(
            apiUrl('/api/borrowers'),
            { name: borrowerName.trim(), phone: '-', address: '-' },
            { headers }
          );
          if (newBorrowerRes.data.success && newBorrowerRes.data.data) {
            borrowerId = newBorrowerRes.data.data.id;
            
            // Refresh borrowers list in state
            const updatedBorrowersRes = await axios.get(apiUrl('/api/borrowers'), { headers });
            setBorrowers(updatedBorrowersRes.data.data || []);
          } else {
            throw new Error('Gagal mendaftarkan anggota baru.');
          }
        }

        // 3. Create the loan using the resolved borrowerId
        const payload = {
          book_id: Number(selectedBookId),
          borrower_id: Number(borrowerId),
          loan_date: loanDate
        };

        const response = await axios.post(apiUrl('/api/loans'), payload, { headers });
        
        if (response.data.success) {
          setSuccessMessage(`Peminjaman buku untuk "${borrowerName.trim()}" berhasil dicatat ke database!`);
          
          // Reset form fields
          setSelectedBookId('');
          setBorrowerName('');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || err.message || 'Gagal menyimpan peminjaman ke database.');
      } finally {
        setSubmitting(false);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    }
  };

  return (
    <div className="loan-container">
      <Container>
        {/* Section Header */}
        <header className="loan-header-section mb-4">
          <Badge bg="warning" text="dark" className="loan-badge">
            Layanan Sirkulasi
          </Badge>
          <h1 className="loan-title">Form & Pencatatan Peminjaman</h1>
          <p className="loan-subtitle">
            Kelola transaksi peminjaman buku perpustakaan secara digital dengan mengisi form pencatatan sirkulasi di bawah ini.
          </p>
        </header>

        {/* Connection Mode Alert */}
        <div className="connection-badge-wrapper">
          {isDemoMode ? (
            <Alert variant="warning" className="connection-alert">
              <span className="connection-indicator demo"></span>
              <div>
                <strong>Berjalan dalam Demo Mode.</strong> Semua data formulir dikirimkan secara lokal (simulasi). 
                {!isAuthenticated && (
                  <span> Untuk menyimpan secara permanen di database, silakan <Link to="/login" className="alert-link">Login sebagai Admin</Link> terlebih dahulu.</span>
                )}
              </div>
            </Alert>
          ) : (
            <Alert variant="success" className="connection-alert">
              <span className="connection-indicator online"></span>
              <div>
                <strong>Database Connected.</strong> Sinkronisasi server aktif. Logged in sebagai: <strong>{user?.name || 'Administrator'}</strong>. Data peminjaman tersimpan langsung ke PostgreSQL.
              </div>
            </Alert>
          )}
        </div>

        {/* Dynamic Alerts */}
        {successMessage && <Alert variant="success" className="mb-4">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger" className="mb-4">{errorMessage}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted">Memuat data sirkulasi...</p>
          </div>
        ) : (
          <Row className="g-4">
            {/* Form Column */}
            <Col lg={5}>
              <Card className="loan-card border-0">
                <Card.Body className="p-0">
                  <h2 className="loan-card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                      <path d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </svg>
                    Catat Peminjaman
                  </h2>
                  <p className="loan-card-desc">Lengkapi formulir di bawah ini untuk memulai peminjaman baru.</p>

                  <Form className="loan-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="selectBook">
                      <Form.Label>Pilih Buku</Form.Label>
                      <Form.Select 
                        required
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                      >
                        <option value="">-- Cari & Pilih Buku --</option>
                        {books.map((book) => (
                          <option key={book.id} value={book.id}>
                            {book.title} {book.author ? ` - ${book.author}` : ''}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="inputBorrowerName">
                      <Form.Label>Nama Peminjam / Anggota</Form.Label>
                      <Form.Control 
                        type="text"
                        required
                        placeholder="Ketik nama lengkap peminjam..."
                        value={borrowerName}
                        onChange={(e) => setBorrowerName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loanDate">
                      <Form.Label>Tanggal Pinjam</Form.Label>
                      <Form.Control 
                        type="date"
                        required
                        value={loanDate}
                        onChange={(e) => setLoanDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="staffName">
                      <Form.Label>Petugas Pencatat (Staff)</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled 
                        value={user?.name || 'Petugas Demo Perpustakaan'} 
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="btn-submit-loan border-0" 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          <span>Simpan Transaksi</span>
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Visual Guide Column */}
            <Col lg={7}>
              <Card className="loan-card border-0">
                <Card.Body className="p-0">
                  <h2 className="loan-card-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: '#2b7e8f' }}>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                    Tata Cara Pengisian Form Peminjaman
                  </h2>
                  <p className="loan-card-desc">Ikuti panduan visual berikut untuk merekam transaksi sirkulasi buku dengan benar.</p>
                  
                  <div className="guide-steps-wrapper">
                    <div className="guide-step-item">
                      <div className="step-number-col">
                        <span className="step-number-badge step-1">01</span>
                        <div className="step-line"></div>
                      </div>
                      <div className="step-content-col">
                        <h4>Pilih Buku yang Dipinjam</h4>
                        <p>
                          Cari judul buku yang diinginkan melalui dropdown pilihan buku.
                          Pastikan buku yang dipilih memiliki data penulis dan berstatus tersedia untuk sirkulasi.
                        </p>
                      </div>
                    </div>
                    
                    <div className="guide-step-item">
                      <div className="step-number-col">
                        <span className="step-number-badge step-2">02</span>
                        <div className="step-line"></div>
                      </div>
                      <div className="step-content-col">
                        <h4>Ketik Nama Peminjam</h4>
                        <p>
                          Masukkan nama peminjam secara manual ke dalam kolom input.
                          Jika nama anggota belum terdaftar, sistem akan otomatis mendaftarkannya sebagai anggota baru.
                        </p>
                      </div>
                    </div>

                    <div className="guide-step-item">
                      <div className="step-number-col">
                        <span className="step-number-badge step-3">03</span>
                        <div className="step-line"></div>
                      </div>
                      <div className="step-content-col">
                        <h4>Tentukan Tanggal Transaksi</h4>
                        <p>
                          Secara default, kolom tanggal terisi otomatis dengan tanggal hari ini. 
                          Anda dapat mengubah tanggal jika ingin mencatat penundaan transaksi (backdate).
                        </p>
                      </div>
                    </div>

                    <div className="guide-step-item">
                      <div className="step-number-col">
                        <span className="step-number-badge step-4">04</span>
                      </div>
                      <div className="step-content-col">
                        <h4>Simpan & Verifikasi</h4>
                        <p>
                          Klik <strong>Simpan Transaksi</strong>. Logged-in staff (petugas yang login) akan 
                          otomatis dicatat sebagai penanggung jawab. Status peminjaman awal diatur sebagai <strong>Dipinjam</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informational Box */}
                  <Card className="guide-rules-card border-0 bg-light p-3 mt-4">
                    <div className="d-flex align-items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffc107" className="bi bi-exclamation-triangle-fill flex-shrink-0 mt-0.5" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <div>
                        <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Aturan Batas Waktu</h5>
                        <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                          Masa pinjam standar adalah <strong>7 hari</strong>. Pengembalian buku yang melewati batas waktu akan terdeteksi sebagai sirkulasi terlambat pada dashboard analitik utama.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Loans;