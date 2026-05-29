import { Badge, Button, Col, Row } from 'react-bootstrap';
import fallbackCover from '../assets/hero.png'; // Pastiin path fotonya bener

const featuredBooks = [
  {
    title: 'Ensiklopedia Anak Cerdas: Olahraga',
    author: 'BIP Kelompok Gramedia',
    category: 'Edukasi Anak',
    cover: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//100/MTA-14390577/bhuana_ilmu_popular_buku_ensiklopedia_anak_cerdas-_olahraga_by_geraldine_maincent_full01_thbhrev4.jpg',
    synopsis: 'Mengenalkan dunia olahraga lewat ilustrasi ceria, fakta ringan, dan penjelasan yang mudah dipahami anak.',
  },
  {
    title: 'Ensiklopedia Anak Cerdas: Penemuan',
    author: 'BIP Kelompok Gramedia',
    category: 'Sains Populer',
    cover: 'https://bukukita.com/babacms/displaybuku/109935_f.jpg',
    synopsis: 'Berisi kisah penemuan penting yang mengubah kehidupan manusia, disajikan singkat dan penuh warna.',
  },
  {
    title: "Perry's Chemical Engineers' Handbook",
    author: 'Don W. Green',
    category: 'Teknik Kimia',
    cover: 'https://covers.openlibrary.org/b/isbn/9780071834087-L.jpg',
    synopsis: 'Referensi teknik kimia komprehensif untuk perancangan proses, operasi pabrik, dan pemecahan masalah industri.',
  },
];

const libraryFeatures = [
  {
    title: 'Pilihan Konten Lengkap',
    description: 'Koleksi buku dan referensi tersusun rapi untuk memudahkan pencarian kebutuhan belajar.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <path d="M18 24h10v48H18zM34 24h10v48H34zM52 25l15 5-15 42-15-5zM72 24h8v48h-8z" fill="currentColor"/>
        <path d="M15 20h16M31 76H15M68 20h15M83 76H68" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
  {
    title: 'Dashboard Analitik',
    description: 'Pantau ringkasan data buku, anggota, dan peminjaman melalui tampilan yang mudah dibaca.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <rect x="16" y="22" width="64" height="52" rx="8" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M16 36h64M28 29h.1M40 29h.1M52 29h.1M30 62l10-12 10 8 14-18" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path d="M31 66h36M31 54v12M45 58v8M59 47v19" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
  {
    title: 'Fitur Membaca Lengkap',
    description: 'Informasi koleksi dapat diakses dengan nyaman, termasuk detail buku dan status peminjaman.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <rect x="24" y="14" width="48" height="68" rx="7" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M35 27h26M35 35h26M34 47c6-4 12-4 18 0 6-4 12-4 18 0v20c-6-4-12-4-18 0-6-4-12-4-18 0z" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M52 47v20" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
  {
    title: 'Tidak Memerlukan Server Lokal',
    description: 'Aplikasi bisa digunakan sebagai sistem perpustakaan berbasis web yang praktis.',
    icon: (
      <svg viewBox="0 0 96 96" aria-hidden="true" width="40" height="40">
        <rect x="25" y="25" width="46" height="34" rx="3" stroke="currentColor" fill="none" strokeWidth="4"/>
        <rect x="14" y="42" width="18" height="30" rx="3" stroke="currentColor" fill="none" strokeWidth="4"/>
        <rect x="66" y="42" width="18" height="30" rx="3" stroke="currentColor" fill="none" strokeWidth="4"/>
        <path d="M38 74h20M48 59v15" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
  },
];