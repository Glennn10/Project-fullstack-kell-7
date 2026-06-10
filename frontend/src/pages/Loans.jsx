import { Badge, Col, Row } from 'react-bootstrap';

const loanSteps = [
  {
    title: 'Pilih Buku',
    description: 'Cari judul yang tersedia melalui katalog perpustakaan.',
  },
  {
    title: 'Catat Peminjam',
    description: 'Lengkapi data anggota dan tanggal peminjaman buku.',
  },
  {
    title: 'Pantau Status',
    description: 'Lihat status buku yang sedang dipinjam atau dikembalikan.',
  },
];

const Loans = () => {
  return (
    <section className="loan-page">
      <div className="section-heading">
        <Badge bg="warning" text="dark" className="section-badge">
          Peminjaman
        </Badge>
        <h2>Peminjaman Buku</h2>
        <p>
          Alur peminjaman dibuat sederhana supaya pengelolaan koleksi tetap
          rapi dan mudah dipantau.
        </p>
      </div>

      <Row className="g-4">
        {loanSteps.map((step, index) => (
          <Col md={4} key={step.title}>
            <article className="loan-step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Loans;