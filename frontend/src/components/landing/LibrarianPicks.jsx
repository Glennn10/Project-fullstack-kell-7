import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBookmark } from 'react-icons/fi';
import { API_BASE_URL } from '../../config/api';
import { categoryPalette } from '../../data/catalogData';
import BookVolume from '../common/BookVolume';

const getCoverUrl = (cover) => {
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  return `${API_BASE_URL}/uploads/${cover.replace(/^\/?uploads\//, '')}`;
};

const LibrarianPicks = ({ books = [] }) => {
  const librarianPick = books[0];
  const alternatives = books.slice(1, 4);

  return (
    <section className="librarian-picks scroll-reveal scroll-reveal--soft" aria-labelledby="librarian-picks-title">
      <div className="librarian-picks__heading">
        <span className="librarian-picks__eyebrow">Dipilih langsung oleh pustakawan</span>
        <h2 id="librarian-picks-title">Kalau bingung, <em>mulai dari sini.</em></h2>
      </div>
      {librarianPick ? (
        <div className="librarian-desk">
          <div className="librarian-desk__book-side">
            <span className="librarian-desk__tape" aria-hidden="true" />
            <span className="librarian-desk__pick-label"><FiBookmark /> Pilihan minggu ini</span>
            <BookVolume cover={getCoverUrl(librarianPick.cover_image)} title={librarianPick.title} className="curator-book-volume" />
          </div>
          <article className="librarian-note">
            <span className="librarian-note__category">{librarianPick.category_name || 'Tanpa kategori'}</span>
            <h3>{librarianPick.title}</h3>
            <p className="librarian-note__author">oleh {librarianPick.author}</p>
            <blockquote>“Coba baca tanpa buru-buru. Kalau beberapa halaman pertama belum cocok, nggak apa-apa—rak ini masih punya pilihan lain.”</blockquote>
            <div className="librarian-note__person"><span aria-hidden="true">R</span><div><strong>Bu Rani</strong><small>Pustakawan MinjemDong</small></div></div>
          </article>
          <aside className="librarian-alternatives">
            <div className="librarian-alternatives__title"><span>Kalau buku utamanya sedang keluar...</span><p>Bu Rani menyelipkan judul lain dari rak yang sama-sama layak dicoba.</p></div>
            <div className="librarian-alternatives__list">
              {alternatives.map((book, index) => (
                <Link to={`/buku?keyword=${encodeURIComponent(book.title)}`} className="alternative-book" style={{ '--alternative-color': categoryPalette[(index + 1) % categoryPalette.length] }} key={book.id}>
                  <span className="alternative-book__mark" aria-hidden="true" />
                  <div><small>{book.is_available ? 'Bisa langsung dibawa dari rak' : book.inventory_status || 'Sedang berada di luar rak'}</small><h3>{book.title}</h3><p>{book.author}</p></div>
                  <FiArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      ) : <div className="landing-data-empty">Rekomendasi pustakawan akan muncul setelah koleksi ditambahkan.</div>}
    </section>
  );
};

export default LibrarianPicks;
