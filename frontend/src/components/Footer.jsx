import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="site-footer mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={5} md={12}>
            <div className="site-footer__brand">MinjemDong</div>
            <p className="site-footer__desc mb-0">
              Sistem perpustakaan modern untuk akses koleksi, data anggota,
              dan peminjaman buku yang lebih praktis.
            </p>
          </Col>

          <Col lg={3} md={6}>
            <h3 className="site-footer__title">Navigasi</h3>
            <ul className="site-footer__list">
              <li><a href="/">Home</a></li>
              <li><a href="/books">Katalog Buku</a></li>
              <li><a href="/books">Peminjaman</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h3 className="site-footer__title">Kontak</h3>
            <ul className="site-footer__list">
              <li>Perpustakaan MinjemDong</li>
              <li>MinjemDong@gmail.com</li>
              <li>Senin - Jumat, 08.00 - 16.00</li>
            </ul>
          </Col>
        </Row>

        <div className="site-footer__bottom">
          © 2026 MinjemDong • Sistem Informasi Perpustakaan MinjemDong
        </div>
      </Container>
    </footer>
  )
}

export default Footer