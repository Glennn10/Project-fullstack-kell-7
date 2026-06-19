import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiClock, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <span className="site-footer__bookmark" aria-hidden="true" />

      <Container>
        <div className="site-footer__cta">
          <div>
            <span>Masih ada ruang di tasmu?</span>
            <h2>Bawa pulang satu cerita lagi.</h2>
          </div>
          <Link to="/buku">Cari buku <FiArrowUpRight aria-hidden="true" /></Link>
        </div>

        <div className="site-footer__main">
          <div className="site-footer__identity">
            <Link to="/" className="site-footer__logo">
              <span><img src="/Logo.png" alt="" aria-hidden="true" /></span>
              <strong>Minjem<em>Dong!</em></strong>
            </Link>
            <p>Tempat buku menemukan pembacanya, dan pembaca menemukan cerita berikutnya.</p>
            <div className="site-footer__stamp" aria-hidden="true">
              <strong>MINJEM</strong>
              <span>READ · RETURN · REPEAT</span>
              <strong>DONG!</strong>
            </div>
          </div>

          <nav className="site-footer__column" aria-label="Navigasi footer">
            <h3>Jelajahi</h3>
            <Link to="/">Beranda</Link>
            <Link to="/buku">Katalog Buku</Link>
            <Link to="/peminjaman">Peminjaman</Link>
            <Link to="/pengembalian">Pengembalian</Link>
          </nav>

          <div className="site-footer__column">
            <h3>Bantuan</h3>
            <a href="#faq">Pertanyaan Umum</a>
            <a href="#borrowing-guide">Cara Meminjam</a>
            <Link to="/login">Masuk Akun</Link>
            <Link to="/register">Daftar Anggota</Link>
          </div>

          <address className="site-footer__contact">
            <h3>Temui Kami</h3>
            <p><FiMapPin aria-hidden="true" /><span>Perpustakaan MinjemDong<br />Indonesia</span></p>
            <p><FiClock aria-hidden="true" /><span>Senin–Jumat<br />08.00–16.00</span></p>
            <a href="mailto:MinjemDong@gmail.com"><FiMail aria-hidden="true" />MinjemDong@gmail.com</a>
          </address>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 MinjemDong</span>
          <span>Dibuat untuk untuk Ujian Akhir Semester.</span>
          <a href="#top">Kembali ke atas ↑</a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
