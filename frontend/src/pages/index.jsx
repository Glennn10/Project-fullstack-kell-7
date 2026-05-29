import { Badge, Button, Col, Row } from 'react-bootstrap';
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
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <path d="M18 24h10v48H18zM34 24h10v48H34zM52 25l15 5-15 42-15-5zM72 24h8v48h-8z" fill="currentColor"/>
        <path d="M15 20h16M31 76H15M68 20h15M83 76H68" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
  {
    title: 'Dashboard Analitik',
    description: 'Pantau ringkasan data buku, anggota, dan peminjaman melalui tampilan yang mudah dibaca.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <rect x="16" y="22" width="64" height="52" rx="8" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M16 36h64M28 29h.1M40 29h.1M52 29h.1M30 62l10-12 10 8 14-18" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path d="M31 66h36M31 54v12M45 58v8M59 47v19" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
  {
    title: 'Fitur Membaca Lengkap',
    description: 'Informasi koleksi dapat diakses dengan nyaman, termasuk detail buku dan status peminjaman.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <rect x="24" y="14" width="48" height="68" rx="7" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M35 27h26M35 35h26M34 47c6-4 12-4 18 0 6-4 12-4 18 0v20c-6-4-12-4-18 0-6-4-12-4-18 0z" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M52 47v20" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
  {
    title: 'Tidak Memerlukan Server Lokal',
    description: 'Aplikasi bisa digunakan sebagai sistem perpustakaan berbasis web yang praktis.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <rect x="25" y="25" width="46" height="34" rx="3" stroke="currentColor" fill="none" strokeWidth="4"/>
        <rect x="14" y="42" width="18" height="30" rx="3" stroke="currentColor" fill="none" strokeWidth="4"/>
        <rect x="66" y="42" width="18" height="30" rx="3" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M38 74h20M48 59v15" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
];

const Home = () => {
  return (
    <>
      <section className="app-hero">
        <Badge bg="primary" className="mb-3">
          Dashboard Perpustakaan
        </Badge>
        <h1 className="display-5 fw-semibold mb-3">
          Kelola data buku, anggota, dan peminjaman dalam satu tempat.
        </h1>
        <div className="d-flex flex-wrap gap-2">
          <Button variant="primary">Tambah Buku</Button>
          <Button variant="outline-secondary">Lihat Peminjaman</Button>
        </div>
      </section>

      <section className="library-feature-section mt-5">
        <div className="section-heading mb-4">
          <h2>Kelola Perpustakaan dengan Praktis</h2>
          <p>Atur kapan pun dan di mana pun dengan mudah</p>
        </div>

        <div className="library-feature-grid d-flex flex-wrap gap-4">
          {libraryFeatures.map((feature) => (
            <article className="library-feature-card flex-fill" key={feature.title} style={{ minWidth: '250px' }}>
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
              <article className="book-card border rounded p-3 h-100 shadow-sm">
                <img
                  src={book.cover}
                  alt={`Sampul ${book.title}`}
                  className="img-fluid rounded mb-3"
                  style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                  onError={(event) => {
                    event.currentTarget.src = fallbackCover;
                  }}
                />
                <div className="book-card__overlay">
                  <Badge bg="light" text="dark" className="book-card__category mb-2">
                    {book.category}
                  </Badge>
                  <div>
                    <h5 className="fw-bold">{book.title}</h5>
                    <p className="book-card__author text-muted small mb-1">{book.author}</p>
                    <p className="book-card__synopsis small">{book.synopsis}</p>
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