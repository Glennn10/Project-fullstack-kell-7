import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL, apiUrl } from '../config/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk hit API Backend
  const fetchBooks = async () => {
    try {
      // Pastikan backend lu lagi jalan (npm run dev di folder backend)
      const response = await axios.get(apiUrl('/api/books'));
      setBooks(response.data.data); // Sesuaikan dengan struktur response backend lu
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Gagal mengambil data buku dari server.");
      setLoading(false);
    }
  };

  // useEffect jalan otomatis pas halaman pertama kali dibuka
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Katalog Buku</h2>

      {/* Tampilan saat masih proses tarik data */}
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Memuat data dari server...</p>
        </div>
      )}

      {/* Tampilan kalau API error / server backend mati */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Tampilan kalau data berhasil ditarik */}
      {!loading && !error && (
        <Row xs={1} md={3} lg={4} className="g-4">
          {books.length > 0 ? (
            books.map((book) => (
              <Col key={book.id}>
                <Card className="h-100 shadow-sm border-0">
                  {/* Kalau ada cover_image tampilkan, kalau null pakai gambar dummy */}
                  <Card.Img 
                    variant="top" 
                    src={book.cover_image ? `${API_BASE_URL}/uploads/${book.cover_image}` : "https://via.placeholder.com/150"} 
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">{book.title}</Card.Title>
                    <Card.Text className="text-muted mb-1">Author: {book.author}</Card.Text>
                    <Card.Text className="text-muted">Tahun: {book.year}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="w-100 text-center">
              <p>Belum ada data buku.</p>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Books;
