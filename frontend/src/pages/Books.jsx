import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiBookOpen, FiSearch, FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { categoryPalette } from '../data/catalogData';
import { libraryService } from '../services/libraryService';
import BookVolume from '../components/common/BookVolume';
import '../styles/pages/books.css';

const getCoverUrl = (coverImage) => {
  if (!coverImage) return null;
  if (/^https?:\/\//i.test(coverImage)) return coverImage;
  return `${API_BASE_URL}/uploads/${coverImage.replace(/^\/?uploads\//, '')}`;
};

const getAvailability = (book) => {
  const status = book.inventoryStatus || (book.available ? 'Tersedia' : 'Dipinjam');
  const labels = {
    Tersedia: 'bisa dipinjam',
    Dipinjam: 'sedang dipinjam',
    'Dalam perbaikan': 'sedang diperbaiki',
    Hilang: 'buku hilang',
  };
  return { label: labels[status] || 'tidak tersedia', className: `is-${status.toLowerCase().replaceAll(' ', '-')}` };
};

const buildCatalog = (categories, books) => categories.map((category, categoryIndex) => ({
  id: String(category.id),
  name: category.name,
  description: category.description || `Koleksi ${category.name} yang tersedia di perpustakaan.`,
  color: category.color || categoryPalette[categoryIndex % categoryPalette.length],
  books: books
    .filter((book) => String(book.category_id) === String(category.id))
    .map((book, bookIndex) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      available: book.is_available ?? book.available ?? book.status !== 'borrowed',
      inventoryStatus: book.inventory_status,
      accent: categoryPalette[(categoryIndex + bookIndex) % categoryPalette.length],
      cover: getCoverUrl(book.cover_image),
    })),
}));

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [activeSection, setActiveSection] = useState(searchParams.get('kategori'));
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    let isCurrent = true;

    Promise.all([libraryService.getCategories(), libraryService.getBooks()])
      .then(([categoryResponse, bookResponse]) => {
        const databaseCategories = categoryResponse.data?.data;
        const databaseBooks = bookResponse.data?.data;

        if (
          isCurrent
          && Array.isArray(databaseCategories)
          && Array.isArray(databaseBooks)
        ) {
          setCategories(buildCatalog(databaseCategories, databaseBooks));
        }
      })
      .catch(() => {
        if (isCurrent) setLoadError('Katalog belum bisa dimuat. Coba lagi setelah server aktif.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => { isCurrent = false; };
  }, []);

  const totalBooks = useMemo(
    () => categories.reduce((total, section) => total + section.books.length, 0),
    [categories],
  );

  const filteredSections = useMemo(() => categories
    .filter((section) => normalizedQuery || !activeSection || section.id === activeSection)
    .map((section) => ({
      ...section,
      books: section.name.toLowerCase().includes(normalizedQuery)
        ? section.books
        : section.books.filter((book) => (
          book.title.toLowerCase().includes(normalizedQuery)
          || book.author.toLowerCase().includes(normalizedQuery)
        )),
    }))
    .filter((section) => section.books.length > 0), [activeSection, categories, normalizedQuery]);

  const visibleBookCount = filteredSections.reduce(
    (total, section) => total + section.books.length,
    0,
  );

  const isViewingBooks = Boolean(activeSection || normalizedQuery);
  const activeCategory = categories.find((section) => section.id === activeSection);

  const updateSearch = (value) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) nextParams.set('keyword', value);
    else nextParams.delete('keyword');

    setSearchParams(nextParams, { replace: true });
  };

  const openCategory = (sectionId) => {
    setActiveSection(sectionId);
    setSearchQuery('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('keyword');
    nextParams.set('kategori', sectionId);
    setSearchParams(nextParams, { replace: true });
  };

  const closeCategory = () => {
    setActiveSection(null);
    setSearchQuery('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('keyword');
    nextParams.delete('kategori');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="catalog-page">
      <header className="catalog-hero">
        <div className="catalog-hero__copy">
          <h1>Cari bukunya, lalu<br /><em>bawa ceritanya.</em></h1>
          <p>
            Mulai dari kategori yang bikin penasaran, atau langsung cari judulnya.
          </p>
        </div>

        <div className="catalog-hero__note" aria-label={`${totalBooks} buku dalam katalog`}>
          <span className="catalog-hero__scribble">koleksi hari ini</span>
          <strong>{String(totalBooks).padStart(2, '0')}</strong>
          <span>buku siap dibaca, dipinjam.</span>
          <i aria-hidden="true" />
        </div>
      </header>

      <section className="catalog-tools" aria-label="Pencarian buku">
        <div className="catalog-tools__copy">
          <span>Sudah tahu bukunya?</span>
          <strong>Cari langsung</strong>
        </div>
        <label className="catalog-search">
          <FiSearch aria-hidden="true" />
          <span className="visually-hidden">Cari buku</span>
          <input
            type="search"
            placeholder="Cari judul, penulis, atau topik..."
            value={searchQuery}
            onChange={(event) => updateSearch(event.target.value)}
          />
          {searchQuery && (
            <button type="button" onClick={() => updateSearch('')} aria-label="Hapus pencarian">
              <FiX aria-hidden="true" />
            </button>
          )}
        </label>
      </section>

      {!isViewingBooks && !isLoading && categories.length > 0 && (
        <section className="category-browser">
          <div className="category-browser__divider"><span>atau jelajahi kategori</span></div>
          <div className="category-browser__heading">
            <div>
              <h2>Mau baca kategori yang mana?</h2>
            </div>
            <p>Tiap kategori punya suasana sendiri. Klik kategorinya buat lihat buku yang tersimpan.</p>
          </div>

          <div className="category-rack-grid">
            {categories.map((section, sectionIndex) => (
              <button
                type="button"
                className="category-rack"
                key={section.id}
                onClick={() => openCategory(section.id)}
                style={{ '--rack-color': section.color }}
              >
                <span className="category-rack__label">
                  <strong>{section.name}</strong>
                  <small>{section.books.length} buku</small>
                </span>

                <span className="category-rack__cabinet" aria-hidden="true">
                  <i className="category-rack__rail category-rack__rail--left" />
                  <i className="category-rack__rail category-rack__rail--right" />
                  {[0, 1].map((shelfIndex) => (
                    <span className="category-rack__books" key={`${section.id}-shelf-${shelfIndex}`}>
                      {Array.from(
                        { length: section.books.length === 0 ? 0 : Math.min(6, Math.max(4, section.books.length)) },
                        (_, bookIndex) => section.books[(bookIndex + shelfIndex) % section.books.length],
                      ).map((book, bookIndex) => (
                        <i
                          key={`${section.id}-${shelfIndex}-spine-${bookIndex}`}
                          style={{
                            '--spine-color': categoryPalette[(sectionIndex * 2 + bookIndex + shelfIndex * 3) % categoryPalette.length],
                            '--spine-height': `${65 + (((bookIndex + shelfIndex) * 13) % 31)}%`,
                            '--spine-width': `${24 + (((bookIndex + sectionIndex) * 7) % 17)}px`,
                          }}
                        >
                          <span>{book?.title || section.name}</span>
                        </i>
                      ))}
                      {section.books.length > 0 && <b />}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {isLoading && (
        <div className="catalog-loading" role="status">
          <i aria-hidden="true" />
          <span>Sedang membuka katalog...</span>
        </div>
      )}

      {!isLoading && !isViewingBooks && categories.length === 0 && (
        <div className="catalog-empty">
          <FiBookOpen aria-hidden="true" />
          <div>
            <span>Rak belum terbuka</span>
            <h2>{loadError || 'Belum ada kategori di katalog.'}</h2>
            <p>Kategori dan buku yang ditambahkan admin akan muncul otomatis di halaman ini.</p>
          </div>
        </div>
      )}

      {isViewingBooks && filteredSections.length > 0 && (
        <div className="catalog-results">
          <div className="catalog-results__topline">
            <button type="button" onClick={closeCategory} className="catalog-back">
              <FiArrowLeft aria-hidden="true" /> Semua kategori
            </button>
          </div>

          <div
            className="catalog-results__heading"
            style={{ '--active-category': activeCategory?.color || '#f5c84b' }}
          >
            <div>
              <h2>{normalizedQuery ? `“${searchQuery.trim()}”` : activeCategory?.name}</h2>
              {!normalizedQuery && <p>{activeCategory?.description}</p>}
            </div>
            <strong><b>{String(visibleBookCount).padStart(2, '0')}</b> buku</strong>
          </div>

          {filteredSections.map((section) => (
            <section key={section.id} className="catalog-shelf" id={section.id}>
              {normalizedQuery && (
                <div className="catalog-shelf__heading catalog-shelf__heading--search">
                  <div>
                    <h3>{section.name}</h3>
                    <p>{section.description}</p>
                  </div>
                </div>
              )}

              <div className="catalog-book-grid">
                {section.books.map((book) => {
                  const availability = getAvailability(book);
                  return (
                  <article className="catalog-book" key={book.id} style={{ '--book-accent': book.accent }}>
                    <div className="catalog-book__stage">
                      <span className="catalog-book__category">{section.name}</span>
                      <BookVolume cover={book.cover} title={book.title} className="catalog-book-volume" />
                    </div>

                    <div className="catalog-book__info">
                      <h3>{book.title}</h3>
                      <div className="catalog-book__meta">
                        <p>oleh {book.author}</p>
                        <span className={`catalog-book__availability ${availability.className}`}>{availability.label}</span>
                      </div>
                    </div>
                  </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {isViewingBooks && filteredSections.length === 0 && (
        <div className="catalog-empty">
          <FiBookOpen aria-hidden="true" />
          <div>
            <span>{activeCategory && !normalizedQuery ? 'Rak baru' : 'Belum ketemu, nih.'}</span>
            <h2>
              {activeCategory && !normalizedQuery
                ? 'Rak ini masih menunggu buku pertamanya.'
                : 'Coba cari dengan kata yang lebih spesifik.'}
            </h2>
            <p>
              {activeCategory && !normalizedQuery
                ? 'Kalau admin menambahkan buku ke kategori ini, bukunya otomatis muncul di sini.'
                : 'Judulnya mungkin ada, cuma bersembunyi di ejaan yang berbeda.'}
            </p>
          </div>
          <button type="button" onClick={closeCategory}>Kembali ke semua kategori</button>
        </div>
      )}
    </div>
  );
};

export default Books;
