import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { API_BASE_URL } from '../../config/api';
import { categoryPalette } from '../../data/catalogData';
import { useBookCarousel } from '../../hooks/useBookCarousel';
import BookVolume from '../common/BookVolume';

const getCoverUrl = (cover) => {
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  return `${API_BASE_URL}/uploads/${cover.replace(/^\/?uploads\//, '')}`;
};

const WeeklyBooks = ({ books = [] }) => {
  const stopsCount = Math.max(1, Math.ceil(books.length / 2));
  const shelfStops = Array.from({ length: stopsCount }, (_, index) => `Bagian rak ${index + 1}`);
  const {
    position,
    viewportRef,
    moveTo,
    syncPosition,
    startDrag,
    drag,
    stopDrag,
    blockClickAfterDrag,
  } = useBookCarousel(stopsCount);

  return (
    <section className="weekly-books scroll-reveal scroll-reveal--side" aria-labelledby="weekly-books-title">
      <div className="weekly-books__heading">
        <div><h2 id="weekly-books-title">Book of the Week!</h2></div>
        <div className="weekly-books__intro">
          <p>Koleksi yang belakangan ramai dipinjam, baru balik, atau sering dicari pembaca.</p>
        </div>
      </div>

      <div className="weekly-books__carousel">
        <button type="button" className="weekly-books__arrow weekly-books__arrow--left" onClick={() => moveTo(position - 1)} disabled={position === 0} aria-label="Geser buku ke kiri"><FiChevronLeft /></button>
        <div
          className="weekly-books__viewport"
          ref={viewportRef}
          onScroll={syncPosition}
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onClickCapture={blockClickAfterDrag}
        >
          <div className="weekly-books__shelf">
            {books.map((book, index) => (
              <Link to={`/buku?keyword=${encodeURIComponent(book.title)}`} className="weekly-book" key={book.id}>
                <div className="weekly-book__stage" style={{ '--book-accent': categoryPalette[index % categoryPalette.length] }}>
                  <span className="weekly-book__highlight">{Number(book.weekly_loans) > 0 ? `${book.weekly_loans}x dipinjam minggu ini` : Number(book.total_loans) > 0 ? `${book.total_loans} kali dipinjam` : 'Baru masuk katalog'}</span>
                  <BookVolume cover={getCoverUrl(book.cover_image)} title={book.title} className="weekly-book-volume" />
                </div>
                <div className="weekly-book__details">
                  <span>{book.category_name || 'Tanpa kategori'}</span><h3>{book.title}</h3><p>{book.author}</p>
                  <div className={`weekly-book__status${book.is_available ? '' : ' weekly-book__status--borrowed'}`}><i /> {book.is_available ? 'Ada di rak' : book.inventory_status || 'Sedang dipinjam'}</div>
                </div>
              </Link>
            ))}
            {!books.length && <div className="landing-data-empty">Buku pilihan akan muncul setelah koleksi tersedia di katalog.</div>}
          </div>
        </div>
        <button type="button" className="weekly-books__arrow weekly-books__arrow--right" onClick={() => moveTo(position + 1)} disabled={position === stopsCount - 1} aria-label="Geser buku ke kanan"><FiChevronRight /></button>
      </div>

      <div className="weekly-books__controls" aria-label="Navigasi buku pilihan" style={{ '--weekly-position': position }}>
        {shelfStops.map((label, index) => (
          <button type="button" className={position === index ? 'active' : ''} onClick={() => moveTo(index)} aria-label={label} aria-pressed={position === index} key={label}><span /></button>
        ))}
      </div>
    </section>
  );
};

export default WeeklyBooks;
