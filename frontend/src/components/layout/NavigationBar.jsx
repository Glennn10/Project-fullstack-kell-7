import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiGrid, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/useAuth';
import { libraryService } from '../../services/libraryService';

const NavigationBar = () => {
  const { isAuthenticated, logout, token, user } = useAuth();
  const [myBookCount, setMyBookCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const showHero = location.pathname === '/';
  const isAdmin = user?.role === 'admin';
  const displayName = user?.name?.trim() || 'Pengguna';
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    let isCurrent = true;
    if (!token) return undefined;

    libraryService.getMyLoans(token)
      .then((response) => {
        const activeCount = (response.data?.data || [])
          .filter((loan) => loan.status?.toLowerCase() !== 'dikembalikan')
          .length;
        if (isCurrent) setMyBookCount(activeCount);
      })
      .catch(() => {
        if (isCurrent) setMyBookCount(0);
      });

    return () => { isCurrent = false; };
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar id="top" expand="lg" sticky="top" className={`navigation-bar${showHero ? ' navigation-bar--home' : ''}`}>
        <Container className="navigation-bar__inner">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
            <span className="brand-logo-wrap"><img src="/Logo.png" alt="" className="brand-logo" aria-hidden="true" /></span>
            <span className="brand-wordmark">Minjem<span>Dong!</span></span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" className="navigation-toggle">
            <span>Menu</span>
            <span className="navigation-toggle__lines" aria-hidden="true"><i /><i /></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto navigation-links">
              <Nav.Link as={NavLink} to="/">
                Beranda
              </Nav.Link>

              <Nav.Link as={NavLink} to="/books">
                Katalog Buku
              </Nav.Link>

              <Nav.Link as={NavLink} to="/my-books" className="my-books-nav-link">
                <span>
                  Buku Saya
                  <span aria-label={`${myBookCount} buku dipinjam`}>{myBookCount}</span>
                </span>
              </Nav.Link>
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
              <Nav className="navigation-auth">
                <Nav.Link as={Link} to="/login" className="navigation-auth__login">
                  Masuk
                </Nav.Link>

                <Nav.Link as={Link} to="/register" className="navigation-auth__register">
                  Daftar <FiArrowRight aria-hidden="true" />
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  );
};

export default NavigationBar;
