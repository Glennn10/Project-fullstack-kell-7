import { Navbar, Nav, Container, NavDropdown, Button, Form } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const NavigationBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const showHero = location.pathname === '/';
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" className="shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
            MinjemDong
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>

              <Nav.Link as={NavLink} to="/books">
                Katalog Buku
              </Nav.Link>

              <Nav.Link as={NavLink} to="/loans">
                Peminjaman Buku
              </Nav.Link>

              {isAdmin && (
                <Nav.Link as={NavLink} to="/dashboard">
                  Dashboard
                </Nav.Link>
              )}

              <NavDropdown title="Explore" id="explore-dropdown">
                <NavDropdown.Item href="#faq">FAQ</NavDropdown.Item>
                <NavDropdown.Item href="#guidelines">
                  Panduan Peminjaman
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {isAuthenticated ? (
              <Nav className="align-items-lg-center gap-2">
                <span className="navbar-user">{user?.name || 'User'}</span>
                <Button type="button" variant="outline-dark" size="sm" className="px-4" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-dark btn-sm px-4">
                  Login
                </Nav.Link>

                <Nav.Link as={Link} to="/register" className="btn btn-warning btn-sm px-4 ms-lg-2">
                  Register
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showHero && (
        <header
          style={{
            minHeight: 430,
            background: 'linear-gradient(90deg, rgba(15, 45, 71, 0.96), rgba(43, 126, 143, 0.88))',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container>
            <div style={{ maxWidth: 650, padding: '72px 0' }}>
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: 18,
                  color: '#ffc107',
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Digital Library
              </span>

              <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}>
                Perpustakaan MinjemDong
              </h1>

              <p className="lead mb-4" style={{ color: 'rgba(255, 255, 255, 0.88)' }}>
                Temukan koleksi buku, panduan peminjaman, dan layanan perpustakaan dalam satu tempat yang mudah diakses.
              </p>

              <Form action="/books" method="GET" className="d-flex flex-column flex-md-row gap-2" style={{ maxWidth: 560 }}>
                <Form.Control
                  type="search"
                  name="keyword"
                  placeholder="Cari judul buku atau penulis..."
                  aria-label="Pencarian buku"
                  className="py-3 px-4"
                  style={{ borderRadius: 999, border: 0 }}
                />

                <Button type="submit" variant="warning" className="fw-semibold px-4" style={{ borderRadius: 999 }}>
                  Cari
                </Button>
              </Form>
            </div>
          </Container>
        </header>
      )}
    </>
  );
};

export default NavigationBar;
