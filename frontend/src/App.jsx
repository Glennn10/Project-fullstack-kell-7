import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap'
import Layout from './components/Layout'
import './App.css'

const libraryStats = [
  { label: 'Total Buku', value: '1.248' },
  { label: 'Dipinjam', value: '86' },
  { label: 'Anggota Aktif', value: '342' },
]

const latestBooks = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Pemrograman',
    status: 'Tersedia',
  },
  {
    title: 'Basis Data Lanjut',
    author: 'Abdul Kadir',
    category: 'Database',
    status: 'Dipinjam',
  },
  {
    title: 'Jaringan Komputer',
    author: 'Andrew S. Tanenbaum',
    category: 'Networking',
    status: 'Tersedia',
  },
]

const upcomingReturns = [
  { borrower: 'Nadia Putri', book: 'React Dasar', dueDate: '24 Mei 2026' },
  { borrower: 'Raka Aditya', book: 'Algoritma Praktis', dueDate: '26 Mei 2026' },
  { borrower: 'Sinta Lestari', book: 'UI/UX Fundamentals', dueDate: '28 Mei 2026' },
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

      <Row className="g-3 mb-4">
        {libraryStats.map((stat) => (
          <Col md={4} key={stat.label}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <p className="text-secondary mb-1">{stat.label}</p>
                <h2 className="fw-bold mb-0">{stat.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-semibold">
              Katalog Terbaru
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestBooks.map((book) => (
                    <tr key={book.title}>
                      <td>
                        <div className="fw-semibold">{book.title}</div>
                        <small className="text-secondary">{book.author}</small>
                      </td>
                      <td>{book.category}</td>
                      <td>
                        <Badge
                          bg={book.status === 'Tersedia' ? 'success' : 'warning'}
                          text={book.status === 'Tersedia' ? undefined : 'dark'}
                        >
                          {book.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-semibold">
              Jadwal Pengembalian
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                {upcomingReturns.map((item) => (
                  <div className="return-item" key={`${item.borrower}-${item.book}`}>
                    <div>
                      <div className="fw-semibold">{item.borrower}</div>
                      <small className="text-secondary">{item.book}</small>
                    </div>
                    <Badge bg="light" text="dark">
                      {item.dueDate}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

export default App
