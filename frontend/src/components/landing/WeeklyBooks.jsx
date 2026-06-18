import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { featuredBooks, weeklyShelfStops } from '../../data/landingData';
import { useBookCarousel } from '../../hooks/useBookCarousel';
import BookVolume from '../common/BookVolume';

const WeeklyBooks = () => {
  const {
    position,
    viewportRef,
    moveTo,
    syncPosition,
    startDrag,
    drag,
    stopDrag,
    blockClickAfterDrag,
  } = useBookCarousel(weeklyShelfStops.length);

  return (
    <section className="weekly-books scroll-reveal scroll-reveal--side" aria-labelledby="weekly-books-title">
      <div className="weekly-books__heading">
        <div><h2 id="weekly-books-title">Book of the week!</h2></div>
        <div className="weekly-books__intro">
          <p>Beberapa buku yang sering jadi topik hangat, dipinjam, atau diam-diam ilang.</p>
          <Link to="/books">Lihat semua buku <FiArrowUpRight aria-hidden="true" /></Link>
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
            {featuredBooks.map((book) => (
              <Link to="/books" className="weekly-book" key={book.title}>
                <div className="weekly-book__stage" style={{ '--book-accent': book.accent }}>
                  <span className="weekly-book__highlight">{book.highlight}</span>
                  <BookVolume cover={book.cover} title={book.title} className="weekly-book-volume" />
                </div>
                <div className="weekly-book__details">
                  <span>{book.category}</span><h3>{book.title}</h3><p>{book.author}</p>
                  <div className={`weekly-book__status${book.available ? '' : ' weekly-book__status--borrowed'}`}><i /> {book.available ? 'Ada di rak' : 'Sedang dipinjam'}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <button type="button" className="weekly-books__arrow weekly-books__arrow--right" onClick={() => moveTo(position + 1)} disabled={position === weeklyShelfStops.length - 1} aria-label="Geser buku ke kanan"><FiChevronRight /></button>
      </div>

      <div className="weekly-books__controls" aria-label="Navigasi buku pilihan" style={{ '--weekly-position': position }}>
        {weeklyShelfStops.map((label, index) => (
          <button type="button" className={position === index ? 'active' : ''} onClick={() => moveTo(index)} aria-label={label} aria-pressed={position === index} key={label}><span /></button>
        ))}
      </div>
    </section>
  );
};

export default WeeklyBooks;
