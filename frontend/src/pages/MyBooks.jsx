import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiClock, FiRotateCcw } from 'react-icons/fi';

const tabs = [
  { id: 'active', label: 'Sedang Dipinjam', icon: FiBookOpen },
  { id: 'history', label: 'Riwayat', icon: FiRotateCcw },
];

const MyBooks = () => {
  const [activeTab, setActiveTab] = useState('active');
  return (
    <section className="my-books-page" aria-labelledby="my-books-title">
      <header className="my-books-header">
        <div>
          <h1 id="my-books-title">Buku Saya</h1>
          <p>Pantau buku yang sedang dibawa, tanggal kembali, dan riwayat peminjamanmu.</p>
        </div>
        <span className="my-books-header__count"><strong>0</strong> buku aktif</span>
      </header>

      <div className="my-books-tabs" role="tablist" aria-label="Daftar buku saya">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={activeTab === id ? 'active' : ''}
            onClick={() => setActiveTab(id)}
            key={id}
          >
            <Icon aria-hidden="true" /> {label} <span>0</span>
          </button>
        ))}
      </div>

      <div className="my-books-empty" role="tabpanel">
        <div className="my-books-empty__illustration" aria-hidden="true">
          <span><FiBookOpen /></span>
          <i />
        </div>
        <span className="my-books-empty__label"><FiClock /> Rak ini masih kosong</span>
        <h2>{activeTab === 'active' ? 'Belum ada buku di tanganmu.' : 'Belum ada riwayat peminjaman.'}</h2>
        <p>
          {activeTab === 'active'
            ? 'Cari buku yang kamu suka. Setelah peminjaman disetujui, detail dan tanggal kembalinya akan muncul di halaman ini.'
            : 'Buku yang sudah kamu kembalikan nantinya akan tersimpan rapi di sini.'}
        </p>
        {activeTab === 'active' && <Link to="/books">Jelajahi katalog <FiArrowRight aria-hidden="true" /></Link>}
      </div>
    </section>
  );
};

export default MyBooks;
