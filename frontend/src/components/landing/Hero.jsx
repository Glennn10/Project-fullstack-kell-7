import { Button, Container, Form } from 'react-bootstrap';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';

const Hero = () => (
  <header className="landing-hero">
    <Container>
      <div className="landing-hero__layout">
        <div className="landing-hero__content">
          <span className="landing-hero__eyebrow"><FiBookOpen /> lagi cari bacaan?</span>
          <h1>Mau baca apa <span>today?</span></h1>
          <p className="landing-hero__description">
            Cari judul, penulis, atau topik yang kamu butuhin. Nanti kami bantu arahkan ke buku yang paling pas.
          </p>
          <Form action="/buku" method="GET" className="landing-search">
            <Form.Control type="search" name="keyword" placeholder="Ketik judul, penulis, atau topik..." aria-label="Pencarian buku" className="landing-search__input" />
            <Button type="submit" className="landing-search__button">Cari <FiArrowRight /></Button>
          </Form>
          <p className="landing-hero__hint">Coba cari: novel, desain, sejarah, teknologi, atau buku kuliah</p>
        </div>

        <div className="hero-books" aria-hidden="true">
          <span className="hero-books__scribble">Book of the Week!</span>
          <div className="hero-book hero-book--one">
            <small>Buku Nonfiksi</small><strong>Atomic<br />Habbit</strong><span>James Clear</span>
          </div>
          <div className="hero-book hero-book--two">
            <i className="hero-book__bookmark" />
            <div className="hero-book__face">
              <small>Novel</small><strong>Absolute<br />Justice</strong><span>Akiyoshi Rikako</span>
            </div>
          </div>
          <div className="hero-book hero-book--three">
            <small>Paling dicari</small><strong>Goobye,<br />Things</strong><span>Fumi Sasaki</span>
          </div>
          <span className="hero-books__tape" />
        </div>
      </div>
    </Container>
  </header>
);

export default Hero;
