import { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import './Books.css';

const catalogSections = [
  {
    id: 'buku-tersedia',
    title: 'Buku Tersedia',
    books: [
      {
        id: 1,
        title: 'To Feel the Music',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/818Z47vK6KL.jpg'
      },
      {
        id: 2,
        title: 'Time Travelling',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/718u%2B99QkTL.jpg'
      },
      {
        id: 3,
        title: 'Book of Colours',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/813aV783wGL.jpg'
      },
      {
        id: 4,
        title: 'Book of Colours',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/813aV783wGL.jpg'
      }
    ]
  },
  {
    id: 'new-releases',
    title: 'New Releases',
    books: [
      {
        id: 4,
        title: 'Harry Potter and the Order of the Phoenix',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg'
      },
      {
        id: 5,
        title: 'End of the Point',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/81k2mU4F2%2BL.jpg'
      },
      {
        id: 6,
        title: 'Korean Cooking',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/81sL74lWjOL.jpg'
      }
    ]
  },
  {
    id: 'award-winners',
    title: 'Award Winners',
    books: [
      {
        id: 7,
        title: 'Dog Man: A Tale of Two Kitties',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/81k7bE9L5AL.jpg'
      },
      {
        id: 8,
        title: 'The Rooster Bar',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/91t75184vDL.jpg'
      },
      {
        id: 9,
        title: 'The Overstory',
        author: 'Dav Pilkey',
        cover: 'https://images-na.ssl-images-amazon.com/images/I/816eEP7J%2BVL.jpg'
      }
    ]
  }
];

const Books = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to check if any section matches search query
  const getFilteredBooks = (books) => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="catalog-container">
      <Container>
        {/* Search Bar Section */}
        <div className="search-section mb-5">
          <InputGroup className="search-bar-wrapper">
            <Form.Control
              type="text"
              placeholder="Cari buku berdasarkan judul atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <InputGroup.Text className="search-icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </InputGroup.Text>
          </InputGroup>
        </div>

        {/* Catalog Sections */}
        {catalogSections.map((section) => {
          const filteredBooks = getFilteredBooks(section.books);
          
          // Hide section if no books match search query
          if (filteredBooks.length === 0) return null;

          return (
            <section key={section.id} className="catalog-section">
              <div className="section-header">
                <h2 className="section-title">{section.title}</h2>
                <a href={`#${section.id}`} className="view-more-link">
                  view more <span className="ms-1">&gt;</span>
                </a>
              </div>

              <Row className="g-4">
                {filteredBooks.map((book) => (
                  <Col xs={6} md={3} key={book.id}>
                    <Card className="book-card-custom">
                      <div className="book-cover-wrapper">
                        <img 
                          src={book.cover} 
                          alt={`Cover of ${book.title}`} 
                          className="book-cover-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="book-details-wrapper">
                        <h3 className="book-title-custom">{book.title}</h3>
                        <p className="book-author-custom">{book.author}</p>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>
          );
        })}

        {/* Fallback when no books are found */}
        {catalogSections.every(s => getFilteredBooks(s.books).length === 0) && (
          <div className="text-center mt-5 py-5 no-results-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="rgba(26, 54, 93, 0.3)" className="bi bi-journal-x mb-3" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6.1 1.1a.5.5 0 0 1 .7 0l2 2a.5.5 0 0 1 0 .7l-2 2a.5.5 0 1 1-.7-.7L7.793 4 5.4 1.607a.5.5 0 0 1 0-.7zM14 14V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path fillRule="evenodd" d="M11 5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 11 5zm-9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 2 5zm0 3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm0 3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <h4>Buku tidak ditemukan</h4>
            <p className="text-muted">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Books;
