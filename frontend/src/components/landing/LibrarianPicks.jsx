import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBookmark } from 'react-icons/fi';
import { librarianAlternatives, librarianPick } from '../../data/landingData';
import BookVolume from '../common/BookVolume';

const LibrarianPicks = () => (
  <section className="librarian-picks scroll-reveal scroll-reveal--soft" aria-labelledby="librarian-picks-title">
    <div className="librarian-picks__heading">
      <span className="librarian-picks__eyebrow">Dipilih langsung oleh pustakawan</span>
      <h2 id="librarian-picks-title">Kalau bingung, <em>mulai dari sini.</em></h2>
    </div>
    <div className="librarian-desk">
      <div className="librarian-desk__book-side">
        <span className="librarian-desk__tape" aria-hidden="true" />
        <span className="librarian-desk__pick-label"><FiBookmark /> Pilihan minggu ini</span>
        <BookVolume cover={librarianPick.cover} title={librarianPick.title} className="curator-book-volume" />
      </div>
      <article className="librarian-note">
        <span className="librarian-note__category">{librarianPick.category}</span>
        <h3>{librarianPick.title}</h3>
        <p className="librarian-note__author">oleh {librarianPick.author}</p>
        <blockquote>“{librarianPick.note}”</blockquote>
        <div className="librarian-note__person"><span aria-hidden="true">R</span><div><strong>Bu Rani</strong><small>Pustakawan MinjemDong</small></div></div>
      </article>
      <aside className="librarian-alternatives">
        <div className="librarian-alternatives__title"><span>Kalau buku utamanya sedang keluar...</span><p>Bu Rani biasanya menyelipkan tiga judul ini sebagai gantinya.</p></div>
        <div className="librarian-alternatives__list">
          {librarianAlternatives.map((book) => (
            <Link to="/books" className="alternative-book" style={{ '--alternative-color': book.color }} key={book.title}>
              <span className="alternative-book__mark" aria-hidden="true" />
              <div><small>{book.mood}</small><h3>{book.title}</h3><p>{book.author}</p></div>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </aside>
    </div>
  </section>
);

export default LibrarianPicks;
