import { Badge, Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiBookOpen, FiClock, FiSearch } from 'react-icons/fi';
import fallbackCover from '../assets/hero.png'; // Pastiin path fotonya bener

const featuredBooks = [
  {
    title: 'Ensiklopedia Anak Cerdas: Olahraga',
    author: 'BIP Kelompok Gramedia',
    category: 'Edukasi Anak',
    cover: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//100/MTA-14390577/bhuana_ilmu_popular_buku_ensiklopedia_anak_cerdas-_olahraga_by_geraldine_maincent_full01_thbhrev4.jpg',
    synopsis: 'Mengenalkan dunia olahraga lewat ilustrasi ceria, fakta ringan, dan penjelasan yang mudah dipahami anak.',
  },
  {
    title: 'Ensiklopedia Anak Cerdas: Penemuan',
    author: 'BIP Kelompok Gramedia',
    category: 'Sains Populer',
    cover: 'https://bukukita.com/babacms/displaybuku/109935_f.jpg',
    synopsis: 'Berisi kisah penemuan penting yang mengubah kehidupan manusia, disajikan singkat dan penuh warna.',
  },
  {
    title: "Perry's Chemical Engineers' Handbook",
    author: 'Don W. Green',
    category: 'Teknik Kimia',
    cover: 'https://covers.openlibrary.org/b/isbn/9780071834087-L.jpg',
    synopsis: 'Referensi teknik kimia komprehensif untuk perancangan proses, operasi pabrik, dan pemecahan masalah industri.',
  },
];

const libraryFeatures = [
  {
    title: 'Pilihan Konten Lengkap',
    description: 'Koleksi buku dan referensi tersusun rapi untuk memudahkan pencarian kebutuhan belajar.',
    icon: <FiSearch aria-hidden="true" />,
  },
  {
    title: 'Peminjaman Terpantau',
    description: 'Lihat status buku dan riwayat peminjaman melalui tampilan yang mudah dibaca.',
    icon: <FiBarChart2 aria-hidden="true" />,
  },
  {
    title: 'Fitur Membaca Lengkap',
    description: 'Informasi koleksi dapat diakses dengan nyaman, termasuk detail buku dan status peminjaman.',
    icon: <FiBookOpen aria-hidden="true" />,
  },
  {
    title: 'Akses Lebih Fleksibel',
    description: 'Cari informasi koleksi kapan pun melalui sistem perpustakaan berbasis web.',
    icon: <FiClock aria-hidden="true" />,
  },
];

const Home = () => {
  return (
    <>
      <section className="app-hero">
        <div>
          <Badge bg="primary" className="mb-3">Mulai Membaca</Badge>
          <h2>Temukan cerita yang ingin kamu bawa pulang.</h2>
          <p>Mulai dari buku pelajaran sampai bacaan santai, semuanya dapat kamu cari dalam satu katalog.</p>
        </div>
        <div className="d-flex flex-wrap gap-2 app-hero__actions">
          <Button as={Link} to="/books" variant="primary">Jelajahi Katalog <FiArrowRight /></Button>
          <Button as={Link} to="/loans" variant="outline-secondary">Lihat Peminjaman</Button>
        </div>
      </section>

      <section className="library-feature-section mt-5">
        <div className="section-heading mb-4">
          <h2>Kelola Perpustakaan dengan Praktis</h2>
          <p>Atur kapan pun dan di mana pun dengan mudah</p>
        </div>

        <div className="library-feature-grid">
          {libraryFeatures.map((feature) => (
            <article className="library-feature-card" key={feature.title}>
              <div className="library-feature-card__icon mb-3">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-books-section mt-5">
        <div className="section-heading mb-4">
          <Badge bg="warning" text="dark" className="section-badge mb-2">
            Rekomendasi Baru
          </Badge>
          <h2>Buku Terbaru</h2>
          <p>Pilihan koleksi terbaru yang bisa langsung dijelajahi sebelum kamu masuk ke katalog lengkap.</p>
        </div>

        <Row className="g-4">
          {featuredBooks.map((book) => (
            <Col md={6} lg={4} key={book.title}>
              <article className="book-card h-100">
                <img
                  src={book.cover}
                  alt={`Sampul ${book.title}`}
                  className="book-card__cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackCover;
                  }}
                />
                <div className="book-card__overlay">
                  <Badge bg="light" text="dark" className="book-card__category mb-2">
                    {book.category}
                  </Badge>
                  <div>
                    <h3>{book.title}</h3>
                    <p className="book-card__author">{book.author}</p>
                    <p className="book-card__synopsis">{book.synopsis}</p>
                  </div>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default Home;
