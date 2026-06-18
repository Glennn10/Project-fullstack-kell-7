import { Navbar, Nav, Container, NavDropdown, Button, Form } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiGrid, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/useAuth';

const NavigationBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const showHero = location.pathname === '/';
  const isAdmin = user?.role === 'admin';
  const displayName = user?.name?.trim() || 'Pengguna';
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" className="shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
            <img src="/Logo.png" alt="" className="brand-logo" aria-hidden="true" />
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

              <NavDropdown title="Sirkulasi Buku" id="sirkulasi-dropdown">
                <NavDropdown.Item as={Link} to="/loans">
                  Catat Peminjaman
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/returns">
                  Pengembalian Buku
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Explore" id="explore-dropdown">
                <NavDropdown.Item href="#faq">FAQ</NavDropdown.Item>
                <NavDropdown.Item href="#guidelines">
                  Panduan Peminjaman
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {isAuthenticated ? (
              <Nav className="align-items-lg-center">
                <NavDropdown
                  align="end"
                  id="profile-dropdown"
                  className="profile-dropdown"
                  title={(
                    <span className="profile-trigger">
                      <span className="profile-avatar" aria-hidden="true">{userInitial}</span>
                      <span className="profile-copy">
                        <strong>{displayName}</strong>
                        <small>{isAdmin ? 'Administrator' : 'Anggota'}</small>
                      </span>
                    </span>
                  )}
                >
                  <div className="profile-dropdown__header">
                    <span className="profile-avatar profile-avatar--large" aria-hidden="true">{userInitial}</span>
                    <div>
                      <strong>{displayName}</strong>
                      <small>{user?.email}</small>
                    </div>
                  </div>
                  <NavDropdown.Divider />
                  {isAdmin && (
                    <NavDropdown.Item as={Link} to="/dashboard">
                      <FiGrid aria-hidden="true" /> Dashboard
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={Link} to="/books">
                    <FiBookOpen aria-hidden="true" /> Katalog Buku
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="button" onClick={handleLogout} className="profile-logout">
                    <FiLogOut aria-hidden="true" /> Keluar
                  </NavDropdown.Item>
                </NavDropdown>
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
        <header className="landing-hero">
          <Container>
            <div className="landing-hero__content">
              <span className="landing-hero__eyebrow"><FiBookOpen /> Perpustakaan Digital</span>

              <h1>
                Buku bagus selalu punya cara untuk <span>menemukanmu.</span>
              </h1>

              <p className="landing-hero__description">
                Jelajahi koleksi pilihan, temukan bacaan berikutnya, lalu pinjam dengan proses yang sederhana di MinjemDong.
              </p>

              <Form action="/books" method="GET" className="d-flex flex-column flex-md-row gap-2" style={{ maxWidth: 560 }}>
                <Form.Control
                  type="search"
                  name="keyword"
                  placeholder="Cari judul buku atau penulis..."
                  aria-label="Pencarian buku"
                  className="landing-search__input"
                />

                <Button type="submit" variant="warning" className="landing-search__button">
                  Cari Buku <FiArrowRight />
                </Button>
              </Form>
              <div className="landing-hero__trust">
                <span><strong>500+</strong> koleksi buku</span>
                <span><strong>Mudah</strong> dicari & dipinjam</span>
              </div>
            </div>
          </Container>
        </header>
      )}
    </>
  );
};

export default NavigationBar;
