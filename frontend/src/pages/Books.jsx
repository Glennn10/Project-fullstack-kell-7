import { useMemo, useState } from 'react';
import { Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { FiBookOpen, FiSearch } from 'react-icons/fi';
import { catalogSections } from '../data/catalogData';
import '../styles/pages/books.css';

const Books = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSections = useMemo(() => catalogSections
    .map((section) => ({
      ...section,
      books: section.books.filter((book) => (
        book.title.toLowerCase().includes(normalizedQuery)
        || book.author.toLowerCase().includes(normalizedQuery)
      )),
    }))
    .filter((section) => section.books.length > 0), [normalizedQuery]);

  return (
    <div className="catalog-container">
      <Container>
        <div className="search-section mb-5">
          <InputGroup className="search-bar-wrapper">
            <Form.Control
              type="search"
              placeholder="Cari buku berdasarkan judul atau penulis..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="search-input"
            />
            <InputGroup.Text className="search-icon-btn"><FiSearch aria-hidden="true" /></InputGroup.Text>
          </InputGroup>
        </div>

        {filteredSections.map((section) => (
          <section key={section.id} className="catalog-section" id={section.id}>
            <div className="section-header">
              <h2 className="section-title">{section.title}</h2>
              <a href={`#${section.id}`} className="view-more-link">view more <span className="ms-1">&gt;</span></a>
            </div>
            <Row className="g-4">
              {section.books.map((book) => (
                <Col xs={6} md={3} key={book.id}>
                  <Card className="book-card-custom">
                    <div className="book-cover-wrapper"><img src={book.cover} alt={`Cover of ${book.title}`} className="book-cover-img" loading="lazy" /></div>
                    <div className="book-details-wrapper"><h3 className="book-title-custom">{book.title}</h3><p className="book-author-custom">{book.author}</p></div>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center mt-5 py-5 no-results-box">
            <FiBookOpen size={48} className="mb-3" aria-hidden="true" />
            <h4>Buku tidak ditemukan</h4>
            <p className="text-muted">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Books;
