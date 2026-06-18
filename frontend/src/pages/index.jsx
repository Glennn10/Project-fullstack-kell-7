import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiCpu,
  FiFeather,
  FiPenTool,
  FiSmile,
  FiTrendingUp,
} from 'react-icons/fi';
import fallbackCover from '../assets/hero.png'; // Pastiin path fotonya bener

const featuredBooks = [
  {
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    category: 'Fiksi & Sastra',
    cover: 'https://covers.openlibrary.org/b/isbn/9786024246945-L.jpg',
    available: true,
    accent: '#377d83',
    highlight: 'Paling dicari',
  },
  {
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    category: 'Pengembangan Diri',
    cover: 'https://covers.openlibrary.org/b/isbn/9786024125189-L.jpg',
    available: true,
    accent: '#f5c84b',
    highlight: 'Pilihan staf',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Pengembangan Diri',
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    available: false,
    accent: '#e96d4d',
    highlight: 'Sedang ramai',
  },
  {
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    category: 'Fiksi Sejarah',
    cover: 'https://covers.openlibrary.org/b/isbn/9780140256352-L.jpg',
    available: true,
    accent: '#8e78b8',
    highlight: 'Klasik wajib',
  },
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'Seni & Desain',
    cover: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg',
    available: true,
    accent: '#ef9fbc',
    highlight: 'Buat kreatif',
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'Fiksi & Sastra',
    cover: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    available: true,
    accent: '#7eb9c2',
    highlight: 'Tipis tapi ngena',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Sejarah',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    available: false,
    accent: '#d6a56f',
    highlight: 'Banyak dibahas',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Sains & Teknologi',
    cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    available: true,
    accent: '#b8d7b0',
    highlight: 'Anak IT wajib',
  },
  {
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    category: 'Fiksi & Sastra',
    cover: 'https://covers.openlibrary.org/b/isbn/9780375704024-L.jpg',
    available: true,
    accent: '#bf6d63',
    highlight: 'Baca pelan-pelan',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Pengembangan Diri',
    cover: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    available: false,
    accent: '#9a91c7',
    highlight: 'Bikin mikir',
  },
];

const weeklyShelfStops = ['Awal rak', 'Bagian kedua', 'Tengah rak', 'Bagian keempat', 'Akhir rak'];

const popularCategories = [
  {
    title: 'Fiksi & Sastra',
    description: 'Novel, cerpen, dan cerita yang bikin lupa waktu.',
    label: 'Cerita & Imajinasi',
    icon: <FiFeather aria-hidden="true" />,
    color: '#e96d4d',
    ink: '#ffffff',
  },
  {
    title: 'Sains & Teknologi',
    description: 'Dari teori sederhana sampai inovasi terbaru.',
    label: 'Ide & Inovasi',
    icon: <FiCpu aria-hidden="true" />,
    color: '#377d83',
    ink: '#ffffff',
  },
  {
    title: 'Sejarah',
    description: 'Melihat hari ini lewat cerita masa lalu.',
    label: 'Jejak & Peristiwa',
    icon: <FiCompass aria-hidden="true" />,
    color: '#f5c84b',
    ink: '#102f3d',
  },
  {
    title: 'Pengembangan Diri',
    description: 'Bacaan kecil untuk perubahan yang berarti.',
    label: 'Tumbuh & Berproses',
    icon: <FiTrendingUp aria-hidden="true" />,
    color: '#b8d7b0',
    ink: '#102f3d',
  },
  {
    title: 'Anak & Remaja',
    description: 'Penuh warna, rasa penasaran, dan petualangan.',
    label: 'Seru & Penuh Warna',
    icon: <FiSmile aria-hidden="true" />,
    color: '#8e78b8',
    ink: '#ffffff',
  },
  {
    title: 'Seni & Desain',
    description: 'Ide visual, proses kreatif, dan karya pilihan.',
    label: 'Visual & Kreatif',
    icon: <FiPenTool aria-hidden="true" />,
    color: '#ef9fbc',
    ink: '#102f3d',
  },
];

const Home = () => {
  const [weeklyPosition, setWeeklyPosition] = useState(0);
  const weeklyShelfRef = useRef(null);
  const weeklyDragRef = useRef(null);
  const blockWeeklyClickRef = useRef(false);

  const moveWeeklyShelf = (position) => {
    const shelf = weeklyShelfRef.current;
    if (!shelf) return;

    const maxScroll = shelf.scrollWidth - shelf.clientWidth;
    shelf.scrollTo({ left: maxScroll * (position / (weeklyShelfStops.length - 1)), behavior: 'smooth' });
    setWeeklyPosition(position);
  };

  const syncWeeklyPosition = () => {
    const shelf = weeklyShelfRef.current;
    if (!shelf) return;

    const maxScroll = shelf.scrollWidth - shelf.clientWidth;
    if (maxScroll <= 0) return;
    setWeeklyPosition(Math.round((shelf.scrollLeft / maxScroll) * (weeklyShelfStops.length - 1)));
  };

  const startWeeklyDrag = (event) => {
    weeklyDragRef.current = {
      pointerX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragWeeklyShelf = (event) => {
    if (!weeklyDragRef.current) return;

    const distance = event.clientX - weeklyDragRef.current.pointerX;
    if (Math.abs(distance) > 4) weeklyDragRef.current.moved = true;
    event.currentTarget.scrollLeft = weeklyDragRef.current.scrollLeft - distance;
  };

  const stopWeeklyDrag = (event) => {
    if (!weeklyDragRef.current) return;
    blockWeeklyClickRef.current = weeklyDragRef.current.moved;
    weeklyDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setTimeout(() => { blockWeeklyClickRef.current = false; }, 0);
  };

  const blockClickAfterDrag = (event) => {
    if (blockWeeklyClickRef.current) event.preventDefault();
  };

  return (
    <>
      <section className="popular-categories" aria-labelledby="popular-categories-title">
        <div className="popular-categories__heading">
          <div>
            <span className="popular-categories__eyebrow">Mulai dari sini</span>
            <h2 id="popular-categories-title">Lagi pengin baca <em>yang mana?</em></h2>
          </div>
          <p>Pilih suasana bacamu. Kami sudah merapikan bukunya per rak biar kamu nggak perlu keliling terlalu lama.</p>
        </div>

        <div className="popular-categories__grid">
          {popularCategories.map((category) => (
            <Link
              to="/books"
              className="category-tile"
              key={category.title}
              style={{ '--category-color': category.color, '--category-ink': category.ink }}
            >
              <span className="category-tile__shelf">{category.label}</span>
              <span className="category-tile__icon">{category.icon}</span>
              <div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
              <FiArrowUpRight className="category-tile__arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <Link to="/books" className="popular-categories__all">
          Lihat semua koleksi <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="weekly-books" aria-labelledby="weekly-books-title">
        <div className="weekly-books__heading">
          <div>
            <span className="weekly-books__eyebrow">Baru di rak</span>
            <h2 id="weekly-books-title">Pilihan minggu ini.</h2>
          </div>
          <div className="weekly-books__intro">
            <p>Sepuluh buku yang lagi sering dibicarakan, dipinjam, atau diam-diam masuk daftar baca kami.</p>
            <Link to="/books">Lihat semua buku <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="weekly-books__carousel">
          <button
            type="button"
            className="weekly-books__arrow weekly-books__arrow--left"
            onClick={() => moveWeeklyShelf(Math.max(0, weeklyPosition - 1))}
            disabled={weeklyPosition === 0}
            aria-label="Geser buku ke kiri"
          ><FiChevronLeft /></button>

          <div
            className="weekly-books__viewport"
            ref={weeklyShelfRef}
            onScroll={syncWeeklyPosition}
            onPointerDown={startWeeklyDrag}
            onPointerMove={dragWeeklyShelf}
            onPointerUp={stopWeeklyDrag}
            onPointerCancel={stopWeeklyDrag}
            onClickCapture={blockClickAfterDrag}
          >
            <div className="weekly-books__shelf">
              {featuredBooks.map((book) => (
                <Link to="/books" className="weekly-book" key={book.title}>
                  <div className="weekly-book__stage" style={{ '--book-accent': book.accent }}>
                    <span className="weekly-book__highlight">{book.highlight}</span>
                    <div className="weekly-book__volume">
                      <img
                        src={book.cover}
                        alt={`Sampul ${book.title}`}
                        className="weekly-book__cover"
                        draggable="false"
                        onError={(event) => {
                          event.currentTarget.src = fallbackCover;
                        }}
                      />
                      <i className="weekly-book__spine" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="weekly-book__details">
                    <span>{book.category}</span>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <div className={`weekly-book__status${book.available ? '' : ' weekly-book__status--borrowed'}`}>
                      <i /> {book.available ? 'Ada di rak' : 'Sedang dipinjam'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="weekly-books__arrow weekly-books__arrow--right"
            onClick={() => moveWeeklyShelf(Math.min(weeklyShelfStops.length - 1, weeklyPosition + 1))}
            disabled={weeklyPosition === weeklyShelfStops.length - 1}
            aria-label="Geser buku ke kanan"
          ><FiChevronRight /></button>
        </div>

        <div
          className="weekly-books__controls"
          aria-label="Navigasi buku pilihan"
          style={{ '--weekly-position': weeklyPosition }}
        >
          {weeklyShelfStops.map((label, index) => (
            <button
              type="button"
              className={weeklyPosition === index ? 'active' : ''}
              onClick={() => moveWeeklyShelf(index)}
              aria-label={label}
              aria-pressed={weeklyPosition === index}
              key={label}
            ><span /></button>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
