import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiCompass, FiCpu, FiFeather, FiPenTool, FiTrendingUp } from 'react-icons/fi';
import { categoryPalette } from '../../data/catalogData';

const categoryIcons = [FiFeather, FiCpu, FiCompass, FiTrendingUp, FiPenTool, FiBookOpen];

const PopularCategories = ({ categories = [] }) => {
  const visibleCategories = [...categories]
    .sort((left, right) => Number(right.book_count || 0) - Number(left.book_count || 0))
    .slice(0, 6);

  return (
  <section className="popular-categories scroll-reveal scroll-reveal--fade" aria-labelledby="popular-categories-title">
    <div className="popular-categories__heading">
      <div><h2 id="popular-categories-title">Mulai dari rak <em>yang paling cocok.</em></h2></div>
      <p>Pilih kategori sesuai kebutuhanmu, dari bacaan ringan sampai referensi buat tugas.</p>
    </div>
    <div className="popular-categories__grid">
      {visibleCategories.map((category, index) => {
        const Icon = categoryIcons[index % categoryIcons.length];
        const color = category.color || categoryPalette[index % categoryPalette.length];
        return (
        <Link to={`/buku?kategori=${category.id}`} className="category-tile" key={category.id} style={{ '--category-color': color, '--category-ink': ['#377d83', '#e96d4d', '#927db8'].includes(color) ? '#ffffff' : '#102f3d' }}>
          <span className="category-tile__shelf">{category.book_count || 0} buku tersedia</span>
          <span className="category-tile__icon"><Icon aria-hidden="true" /></span>
          <div><h3>{category.name}</h3><p>{category.description || `Koleksi ${category.name} yang tersimpan di perpustakaan.`}</p></div>
          <FiArrowUpRight className="category-tile__arrow" aria-hidden="true" />
        </Link>
        );
      })}
      {!visibleCategories.length && <div className="landing-data-empty">Kategori akan muncul setelah petugas menambahkan data koleksi.</div>}
    </div>
    <Link to="/buku" className="popular-categories__all">Lihat semua kategori <FiArrowUpRight aria-hidden="true" /></Link>
  </section>
  );
};

export default PopularCategories;
