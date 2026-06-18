import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { libraryService } from '../services/libraryService';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: 'grid' },
  { label: 'Kelola Buku', path: '/books', icon: 'book' },
  { label: 'Peminjaman', path: '/loans', icon: 'loan' },
];

const Icon = () => {
  return <img src="/Logo.png" alt="" className="dashboard-icon" aria-hidden="true" />;
};

const Dashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const [booksResponse, loansResponse] = await Promise.all([
          libraryService.getBooks(),
          libraryService.getLoans(token),
        ]);

        setBooks(booksResponse.data.data || []);
        setLoans(loansResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data dashboard. Pastikan backend sedang berjalan.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const stats = useMemo(() => {
    const activeLoans = loans.filter((loan) => loan.status === 'Dipinjam').length;
    const returnedLoans = loans.filter((loan) => loan.status === 'Dikembalikan').length;
    const overdueLoans = loans.filter((loan) => loan.status === 'Terlambat').length;

    return [
      { label: 'Total Buku', value: books.length, detail: 'Koleksi tercatat', tone: 'primary' },
      { label: 'Total Peminjaman', value: loans.length, detail: 'Semua transaksi', tone: 'info' },
      { label: 'Sedang Dipinjam', value: activeLoans, detail: 'Belum kembali', tone: 'warning' },
      { label: 'Terlambat', value: overdueLoans, detail: `${returnedLoans} sudah kembali`, tone: 'danger' },
    ];
  }, [books, loans]);

  const latestLoans = loans.slice(0, 6);
  const latestBooks = books.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/dashboard" className="admin-brand">
          <span>
            <img src="/Logo.png" alt="" aria-hidden="true" />
          </span>
          <strong>MinjemDong</strong>
        </Link>

        <nav className="admin-nav" aria-label="Navigasi admin">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.path} end={item.path === '/dashboard'} className="admin-nav__link">
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user-card">
            <span>{user?.name?.slice(0, 1) || 'A'}</span>
            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <small>{user?.email || '-'}</small>
            </div>
          </div>
          <Button type="button" variant="outline-light" className="admin-logout" onClick={handleLogout}>
            <Icon name="logout" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">Admin Console</span>
            <h1>Dashboard Perpustakaan</h1>
          </div>
          <div className="admin-topbar__actions">
            <Button as={Link} to="/books" variant="outline-secondary">
              Katalog Publik
            </Button>
            <Button as={Link} to="/" variant="primary">
              Lihat Situs
            </Button>
          </div>
        </header>

        {loading && (
          <div className="dashboard-loading">
            <Spinner animation="border" variant="primary" />
            <span>Memuat dashboard...</span>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <>
            <Row className="g-3 mb-4">
              {stats.map((item) => (
                <Col md={6} xl={3} key={item.label}>
                  <Card className="dashboard-stat h-100">
                    <Card.Body>
                      <div className="dashboard-stat__head">
                        <span className={`dashboard-stat__dot bg-${item.tone}`} />
                        <Badge bg="light" text="dark">
                          Live
                        </Badge>
                      </div>
                      <p>{item.label}</p>
                      <strong>{item.value}</strong>
                      <small>{item.detail}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row className="g-4">
              <Col xl={8}>
                <Card className="dashboard-panel h-100">
                  <Card.Body>
                    <div className="dashboard-panel__head">
                      <div>
                        <h2>Peminjaman Terbaru</h2>
                        <p>Transaksi terbaru yang masuk ke sistem.</p>
                      </div>
                      <Button as={Link} to="/loans" variant="outline-secondary" size="sm">
                        Detail
                      </Button>
                    </div>

                    {latestLoans.length > 0 ? (
                      <Table responsive hover className="dashboard-table align-middle">
                        <thead>
                          <tr>
                            <th>Buku</th>
                            <th>Peminjam</th>
                            <th>Staff</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latestLoans.map((loan) => (
                            <tr key={loan.id}>
                              <td>{loan.book_title || '-'}</td>
                              <td>{loan.borrower_name || '-'}</td>
                              <td>{loan.staff_name || '-'}</td>
                              <td>
                                <Badge bg={loan.status === 'Dikembalikan' ? 'success' : 'warning'} text={loan.status === 'Dikembalikan' ? undefined : 'dark'}>
                                  {loan.status}
                                </Badge>
                              </td>
                              <td>{loan.loan_date ? new Date(loan.loan_date).toLocaleDateString('id-ID') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="dashboard-empty">Belum ada data peminjaman.</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={4}>
                <Card className="dashboard-panel h-100">
                  <Card.Body>
                    <div className="dashboard-panel__head">
                      <div>
                        <h2>Koleksi Terbaru</h2>
                        <p>Buku yang terakhir masuk katalog.</p>
                      </div>
                    </div>

                    {latestBooks.length > 0 ? (
                      <div className="dashboard-book-list">
                        {latestBooks.map((book) => (
                          <div className="dashboard-book-item" key={book.id}>
                            <div>
                              <strong>{book.title}</strong>
                              <span>{book.author || '-'}</span>
                            </div>
                            <Badge bg="light" text="dark">
                              {book.year || '-'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="dashboard-empty dashboard-empty--compact">Belum ada buku.</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
