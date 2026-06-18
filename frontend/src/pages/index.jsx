import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiArrowRight,
  FiBookmark,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiCpu,
  FiFeather,
  FiPenTool,
  FiPlus,
  FiSearch,
  FiSend,
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

const borrowingSteps = [
  {
    label: 'Langkah satu',
    title: 'Cari bukunya',
    description: 'Pakai kolom pencarian atau masuk lewat kategori yang kamu suka.',
    note: 'Cari judul, penulis, atau topik',
    icon: <FiSearch aria-hidden="true" />,
    color: '#f5c84b',
  },
  {
    label: 'Langkah dua',
    title: 'Ajukan pinjam',
    description: 'Pilih buku yang tersedia lalu kirim permintaan peminjamanmu.',
    note: 'Konfirmasi dilakukan petugas',
    icon: <FiSend aria-hidden="true" />,
    color: '#e96d4d',
  },
  {
    label: 'Langkah tiga',
    title: 'Ambil & baca',
    description: 'Datang ke perpustakaan, tunjukkan akunmu, lalu bawa pulang bukunya.',
    note: 'Jangan lupa tanggal kembali',
    icon: <FiBookOpen aria-hidden="true" />,
    color: '#377d83',
  },
];

const librarianPick = {
  title: 'The Midnight Library',
  author: 'Matt Haig',
  category: 'Fiksi Kontemporer',
  cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
  note: 'Buku ini cocok buat kamu yang pernah bertanya, “bagaimana kalau dulu aku memilih jalan yang berbeda?” Hangat, ringan, tapi tinggal cukup lama di kepala.',
};

const librarianAlternatives = [
  {
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    mood: 'Hangat & reflektif',
    color: '#f5c84b',
  },
  {
    title: 'Days at the Morisaki Bookshop',
    author: 'Satoshi Yagisawa',
    mood: 'Tenang & nyaman',
    color: '#377d83',
  },
  {
    title: 'Tuesdays with Morrie',
    author: 'Mitch Albom',
    mood: 'Pelan tapi membekas',
    color: '#e96d4d',
  },
];

const frequentlyAskedQuestions = [
  {
    label: 'Mulai',
    question: 'Bagaimana cara meminjam buku?',
    answer: 'Cari buku yang kamu mau, pastikan statusnya tersedia, lalu kirim permintaan peminjaman. Setelah dikonfirmasi petugas, buku bisa langsung kamu ambil di perpustakaan.',
  },
  {
    label: 'Durasi',
    question: 'Berapa lama masa peminjamannya?',
    answer: 'Tanggal kembali akan tercantum pada detail peminjamanmu. Cek halaman Peminjaman setelah permintaan disetujui supaya bukunya tidak terlambat dikembalikan.',
  },
  {
    label: 'Perpanjang',
    question: 'Apakah masa pinjam bisa diperpanjang?',
    answer: 'Bisa selama buku tersebut tidak sedang ditunggu anggota lain. Hubungi petugas sebelum tanggal pengembalian agar perpanjangan dapat diperiksa lebih dulu.',
  },
  {
    label: 'Terlambat',
    question: 'Bagaimana kalau bukunya terlambat dikembalikan?',
    answer: 'Segera kembalikan buku dan konfirmasi kepada petugas. Ketentuan keterlambatan akan mengikuti kebijakan perpustakaan yang berlaku.',
  },
  {
    label: 'Stok',
    question: 'Bagaimana mengecek buku masih tersedia?',
    answer: 'Status buku dapat dilihat langsung dari katalog. Label “Ada di rak” berarti buku bisa diajukan, sedangkan “Sedang dipinjam” berarti kamu perlu menunggu.',
  },
  {
    label: 'Kondisi',
    question: 'Apa yang harus dilakukan jika buku rusak atau hilang?',
    answer: 'Jangan panik dan jangan memperbaikinya sendiri. Laporkan kondisinya kepada petugas agar solusi penggantian atau perbaikan dapat ditentukan bersama.',
  },
];

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
  const [openFaq, setOpenFaq] = useState(0);
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
            <h2 id="popular-categories-title">Lagi nyari categori <em>yang mana?</em></h2>
          </div>
          <p>Sesuai in aja ama suasana hati, tinggal pilih aja.</p>
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
            <h2 id="weekly-books-title">Book of the week!</h2>
          </div>
          <div className="weekly-books__intro">
            <p>Beberapa buku yang sering jadi topik hangat, dipinjam, atau diam-diam ilang.</p>
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

      <section className="borrowing-guide" aria-labelledby="borrowing-guide-title">
        <div className="borrowing-guide__heading">
          <div>
            <h2 id="borrowing-guide-title">Dari rak sampai <em>ke tanganmu?</em></h2>
          </div>
          <p>Cuma tiga langkah. Make formulir panjang? idih kuno.</p>
        </div>

        <div className="borrowing-guide__steps">
          {borrowingSteps.map((step, index) => (
            <div className="borrowing-guide__step-wrap" key={step.title}>
              <article className="borrow-ticket" style={{ '--ticket-color': step.color }}>
                <div className="borrow-ticket__top">
                  <span>{step.label}</span>
                  <span className="borrow-ticket__icon">{step.icon}</span>
                </div>
                <div className="borrow-ticket__body">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <div className="borrow-ticket__note">
                  <i aria-hidden="true" /> {step.note}
                </div>
              </article>
              {index < borrowingSteps.length - 1 && (
                <span className="borrowing-guide__arrow" aria-hidden="true"><FiArrowRight /></span>
              )}
            </div>
          ))}
        </div>

        <div className="borrowing-guide__footer">
          <p><strong>Siap mulai?</strong> Buku berikutnya mungkin tinggal satu pencarian lagi.</p>
          <Link to="/books">Cari buku sekarang <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="librarian-picks" aria-labelledby="librarian-picks-title">
        <div className="librarian-picks__heading">
          <span className="librarian-picks__eyebrow">Dipilih langsung oleh pustakawan</span>
          <h2 id="librarian-picks-title">Kalau bingung, <em>mulai dari sini.</em></h2>
        </div>

        <div className="librarian-desk">
          <div className="librarian-desk__book-side">
            <span className="librarian-desk__tape" aria-hidden="true" />
            <span className="librarian-desk__pick-label"><FiBookmark /> Pilihan minggu ini</span>
            <div className="curator-book">
              <img
                src={librarianPick.cover}
                alt={`Sampul ${librarianPick.title}`}
                draggable="false"
                onError={(event) => {
                  event.currentTarget.src = fallbackCover;
                }}
              />
              <i className="curator-book__spine" aria-hidden="true" />
            </div>
          </div>

          <article className="librarian-note">
            <span className="librarian-note__category">{librarianPick.category}</span>
            <h3>{librarianPick.title}</h3>
            <p className="librarian-note__author">oleh {librarianPick.author}</p>
            <blockquote>“{librarianPick.note}”</blockquote>
            <div className="librarian-note__person">
              <span aria-hidden="true">R</span>
              <div>
                <strong>Bu Rani</strong>
                <small>Pustakawan MinjemDong</small>
              </div>
            </div>
          </article>

          <aside className="librarian-alternatives">
            <div className="librarian-alternatives__title">
              <span>Kalau yang ini sedang dipinjam...</span>
              <p>Coba tiga bacaan dengan suasana serupa.</p>
            </div>
            <div className="librarian-alternatives__list">
              {librarianAlternatives.map((book) => (
                <Link to="/books" className="alternative-book" style={{ '--alternative-color': book.color }} key={book.title}>
                  <span className="alternative-book__mark" aria-hidden="true" />
                  <div>
                    <small>{book.mood}</small>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>
                  <FiArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="faq-section__intro">
          <span className="faq-section__eyebrow">Sebelum kamu tanya petugas</span>
          <h2 id="faq-title">Yang sering <em>ditanyain.</em></h2>
          <p>Jawaban singkat buat hal-hal yang paling sering bikin bingung saat mau pinjam buku.</p>
          <div className="faq-section__hint">
            <span aria-hidden="true">?</span>
            <p>Belum ketemu jawabannya? Petugas perpustakaan siap membantu saat jam operasional.</p>
          </div>
        </div>

        <div className="faq-index">
          <div className="faq-index__header">
            <span>Indeks Bantuan</span>
            <span>MinjemDong / FAQ</span>
          </div>

          {frequentlyAskedQuestions.map((item, index) => {
            const isOpen = openFaq === index;
            const answerId = `faq-answer-${index}`;

            return (
              <article className={`faq-item${isOpen ? ' faq-item--open' : ''}`} key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="faq-item__label">{item.label}</span>
                  <span className="faq-item__question">{item.question}</span>
                  <span className="faq-item__toggle" aria-hidden="true"><FiPlus /></span>
                </button>
                <div className="faq-item__answer" id={answerId}>
                  <div><p>{item.answer}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Home;
