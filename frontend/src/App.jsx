import { Badge, Button, Col, Row } from 'react-bootstrap'
import Layout from './components/Layout'
import fallbackCover from './assets/hero.png'
import './App.css'

const featuredBooks = [
  {
    title: 'Ensiklopedia Anak Cerdas: Olahraga',
    author: 'BIP Kelompok Gramedia',
    category: 'Edukasi Anak',
    cover:
      'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//100/MTA-14390577/bhuana_ilmu_popular_buku_ensiklopedia_anak_cerdas-_olahraga_by_geraldine_maincent_full01_thbhrev4.jpg',
    synopsis:
      'Mengenalkan dunia olahraga lewat ilustrasi ceria, fakta ringan, dan penjelasan yang mudah dipahami anak.',
  },
  {
    title: 'Ensiklopedia Anak Cerdas: Penemuan',
    author: 'BIP Kelompok Gramedia',
    category: 'Sains Populer',
    cover: 'https://bukukita.com/babacms/displaybuku/109935_f.jpg',
    synopsis:
      'Berisi kisah penemuan penting yang mengubah kehidupan manusia, disajikan singkat dan penuh warna.',
  },
  {
    title: "Perry's Chemical Engineers' Handbook",
    author: 'Don W. Green',
    category: 'Teknik Kimia',
    cover: 'https://covers.openlibrary.org/b/isbn/9780071834087-L.jpg',
    synopsis:
      'Referensi teknik kimia komprehensif untuk perancangan proses, operasi pabrik, dan pemecahan masalah industri.',
  },
]

function App() {
  return (
    <Layout>
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

      <section className="featured-books-section">
        <div className="section-heading">
          <Badge bg="warning" text="dark" className="section-badge">
            Rekomendasi Baru
          </Badge>
          <h2>Buku Terbaru</h2>
          <p>
            Pilihan koleksi terbaru yang bisa langsung dijelajahi sebelum kamu
            masuk ke katalog lengkap.
          </p>
        </div>

        <Row className="g-4">
          {featuredBooks.map((book) => (
            <Col md={6} lg={4} key={book.title}>
              <article className="book-card">
                <img
                  src={book.cover}
                  alt={`Sampul ${book.title}`}
                  onError={(event) => {
                    event.currentTarget.src = fallbackCover
                  }}
                />
                <div className="book-card__overlay">
                  <Badge bg="light" text="dark" className="book-card__category">
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
    </Layout>
  )
}

export default App
