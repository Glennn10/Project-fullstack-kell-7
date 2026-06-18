import {
  FiBookOpen,
  FiCompass,
  FiCpu,
  FiFeather,
  FiPenTool,
  FiSearch,
  FiSend,
  FiSmile,
  FiTrendingUp,
} from 'react-icons/fi';

export const featuredBooks = [
  { title: 'Laut Bercerita', author: 'Leila S. Chudori', category: 'Fiksi & Sastra', cover: 'https://covers.openlibrary.org/b/isbn/9786024246945-L.jpg', available: true, accent: '#377d83', highlight: '3x dipinjam minggu ini' },
  { title: 'Filosofi Teras', author: 'Henry Manampiring', category: 'Pengembangan Diri', cover: 'https://covers.openlibrary.org/b/isbn/9786024125189-L.jpg', available: true, accent: '#f5c84b', highlight: 'Catatan dari Bu Rani' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Pengembangan Diri', cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', available: false, accent: '#e96d4d', highlight: 'Sedang ditunggu 2 orang' },
  { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', category: 'Fiksi Sejarah', cover: 'https://covers.openlibrary.org/b/isbn/9780140256352-L.jpg', available: true, accent: '#8e78b8', highlight: 'Koleksi sejak 2018' },
  { title: 'The Design of Everyday Things', author: 'Don Norman', category: 'Seni & Desain', cover: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg', available: true, accent: '#ef9fbc', highlight: 'Baru kembali kemarin' },
  { title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', category: 'Fiksi & Sastra', cover: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg', available: true, accent: '#7eb9c2', highlight: 'Selesai dalam sekali duduk' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Sejarah', cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg', available: false, accent: '#d6a56f', highlight: 'Sering ditanya anggota' },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Sains & Teknologi', cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', available: true, accent: '#b8d7b0', highlight: 'Favorit anak informatika' },
  { title: 'Norwegian Wood', author: 'Haruki Murakami', category: 'Fiksi & Sastra', cover: 'https://covers.openlibrary.org/b/isbn/9780375704024-L.jpg', available: true, accent: '#bf6d63', highlight: 'Ada di meja baca' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Pengembangan Diri', cover: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', available: false, accent: '#9a91c7', highlight: 'Baru masuk bulan ini' },
];

export const weeklyShelfStops = ['Awal rak', 'Bagian kedua', 'Tengah rak', 'Bagian keempat', 'Akhir rak'];

export const borrowingSteps = [
  { label: 'Langkah satu', title: 'Cari bukunya', description: 'Kalau sudah tahu judulnya, langsung ketik. Kalau belum, masuk saja dari kategori.', note: 'Judul, penulis, atau topik juga bisa', icon: FiSearch, color: '#f5c84b' },
  { label: 'Langkah dua', title: 'Ajukan pinjam', description: 'Klik pinjam. Petugas akan cek bukunya dulu sebelum kamu datang mengambil.', note: 'Tunggu kabar dari petugas', icon: FiSend, color: '#e96d4d' },
  { label: 'Langkah tiga', title: 'Ambil & baca', description: 'Setelah disetujui, datang dan tunjukkan akunmu. Selesai—bukunya boleh dibawa.', note: 'Tanggal kembali ada di akunmu', icon: FiBookOpen, color: '#377d83' },
];

export const librarianPick = {
  title: 'The Midnight Library',
  author: 'Matt Haig',
  category: 'Fiksi Kontemporer',
  cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
  note: 'Awalnya saya kira buku ini bakal terlalu manis. Ternyata bagian tentang menyesali pilihan hidup cukup kena. Kalau akhir-akhir ini kamu sering memikirkan keputusan yang sudah lewat, coba baca pelan-pelan.',
};

export const librarianAlternatives = [
  { title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi', mood: 'Lebih tipis, sedikit lebih ajaib', color: '#f5c84b' },
  { title: 'Days at the Morisaki Bookshop', author: 'Satoshi Yagisawa', mood: 'Kalau sedang ingin bacaan yang tenang', color: '#377d83' },
  { title: 'Tuesdays with Morrie', author: 'Mitch Albom', mood: 'Buat dibaca pelan pada akhir pekan', color: '#e96d4d' },
];

export const frequentlyAskedQuestions = [
  { question: 'Bisa booking buku dulu sebelum datang?', answer: 'Bisa. Ajukan lewat katalog dan tunggu konfirmasi petugas. Kalau sudah disetujui, bukunya akan disiapkan untuk kamu ambil.' },
  { question: 'Bukunya belum selesai, boleh tambah waktu?', answer: 'Kabari petugas sebelum tanggal kembali. Biasanya bisa diperpanjang selama bukunya tidak sedang ditunggu anggota lain.' },
  { question: 'Di web tertulis tersedia, tapi kok bukunya nggak ada?', answer: 'Mungkin bukunya sedang disiapkan, baru dikembalikan, atau masih ada di meja baca. Tanya petugas supaya bisa langsung dicek.' },
  { question: 'Buku yang kupinjam kena air. Harus bagaimana?', answer: 'Jangan dilem atau diperbaiki sendiri. Bawa bukunya dan ceritakan kondisinya ke petugas—nanti kita cari jalan keluarnya bersama.' },
];

export const popularCategories = [
  { title: 'Fiksi & Sastra', description: 'Novel, cerpen, dan cerita yang bikin lupa waktu.', label: 'Cerita & Imajinasi', icon: FiFeather, color: '#e96d4d', ink: '#ffffff' },
  { title: 'Sains & Teknologi', description: 'Dari teori sederhana sampai inovasi terbaru.', label: 'Ide & Inovasi', icon: FiCpu, color: '#377d83', ink: '#ffffff' },
  { title: 'Sejarah', description: 'Melihat hari ini lewat cerita masa lalu.', label: 'Jejak & Peristiwa', icon: FiCompass, color: '#f5c84b', ink: '#102f3d' },
  { title: 'Pengembangan Diri', description: 'Bacaan kecil untuk perubahan yang berarti.', label: 'Tumbuh & Berproses', icon: FiTrendingUp, color: '#b8d7b0', ink: '#102f3d' },
  { title: 'Anak & Remaja', description: 'Penuh warna, rasa penasaran, dan petualangan.', label: 'Seru & Penuh Warna', icon: FiSmile, color: '#8e78b8', ink: '#ffffff' },
  { title: 'Seni & Desain', description: 'Ide visual, proses kreatif, dan karya pilihan.', label: 'Visual & Kreatif', icon: FiPenTool, color: '#ef9fbc', ink: '#102f3d' },
];
