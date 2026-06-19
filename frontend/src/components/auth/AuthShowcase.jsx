import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import BookVolume from '../common/BookVolume';
import { API_BASE_URL } from '../../config/api';
import { libraryService } from '../../services/libraryService';

const content = {
  login: {
    eyebrow: 'Kembali ke rakmu',
    title: <>Cerita berikutnya<br />sudah menunggu.</>,
    copy: 'Masuk untuk melihat buku yang sedang kamu bawa dan lanjut menjelajahi koleksi.',
    note: 'Buku yang baik selalu tahu jalan pulang.',
  },
  register: {
    eyebrow: 'Kartu baru',
    title: <>Satu akun,<br />banyak cerita.</>,
    copy: 'Daftar sebagai anggota, temukan bacaanmu, lalu biarkan kami yang mengingat tanggal kembalinya.',
    note: 'Rak ini masih menyimpan tempat untukmu.',
  },
};

const AuthShowcase = ({ variant }) => {
  const page = content[variant];
  const [bookPicks, setBookPicks] = useState([]);

  useEffect(() => {
    let current = true;
    libraryService.getAuthBookPicks()
      .then((response) => { if (current) setBookPicks(response.data?.data || []); })
      .catch(() => {});
    return () => { current = false; };
  }, []);

  const coverUrl = (book) => {
    if (!book?.cover_image) return null;
    if (/^https?:\/\//i.test(book.cover_image)) return book.cover_image;
    return `${API_BASE_URL}/uploads/${book.cover_image.replace(/^\/?uploads\//, '')}`;
  };

  return (
    <aside className={`auth-showcase auth-showcase--${variant}`}>
      <Link to="/" className="auth-showcase__brand"><span><img src="/Logo.png" alt="" /></span><strong>MinjemDong!</strong></Link>
      <div className="auth-showcase__copy"><span><FiBookOpen /> {page.eyebrow}</span><h1>{page.title}</h1><p>{page.copy}</p></div>
      <div className="auth-book-scene" aria-hidden="true">
        {bookPicks[0] ? <BookVolume cover={coverUrl(bookPicks[0])} title={bookPicks[0].title} className="auth-scene-book auth-scene-book--back" /> : <BookVolume title="Selesaikan yang tertunda" className="auth-scene-book auth-scene-book--back"><span>SELESAIKAN</span><strong>yang tertunda.</strong></BookVolume>}
        {bookPicks[1] ? <BookVolume cover={coverUrl(bookPicks[1])} title={bookPicks[1].title} className="auth-scene-book auth-scene-book--front" /> : <BookVolume title="Mulai dari satu halaman" className="auth-scene-book auth-scene-book--front"><span>MULAI</span><strong>dari satu halaman.</strong></BookVolume>}
        <em className="auth-scene-bookmark" />
        <b>pilihanmu hari ini!</b>
      </div>
      <div className="auth-showcase__note"><span>{page.note}</span><Link to="/buku">Lihat katalog <FiArrowUpRight /></Link></div>
    </aside>
  );
};

export default AuthShowcase;
