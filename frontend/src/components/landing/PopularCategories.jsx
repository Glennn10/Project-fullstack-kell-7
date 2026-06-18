import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { popularCategories } from '../../data/landingData';

const PopularCategories = () => (
  <section className="popular-categories scroll-reveal scroll-reveal--fade" aria-labelledby="popular-categories-title">
    <div className="popular-categories__heading">
      <div><h2 id="popular-categories-title">Lagi nyari categori <em>yang mana?</em></h2></div>
      <p>Sesuai in aja ama suasana hati, tinggal pilih categorinya aja.</p>
    </div>
    <div className="popular-categories__grid">
      {popularCategories.map(({ icon: Icon, ...category }) => (
        <Link to="/books" className="category-tile" key={category.title} style={{ '--category-color': category.color, '--category-ink': category.ink }}>
          <span className="category-tile__shelf">{category.label}</span>
          <span className="category-tile__icon"><Icon aria-hidden="true" /></span>
          <div><h3>{category.title}</h3><p>{category.description}</p></div>
          <FiArrowUpRight className="category-tile__arrow" aria-hidden="true" />
        </Link>
      ))}
    </div>
    <Link to="/books" className="popular-categories__all">Lihat semua koleksi <FiArrowUpRight aria-hidden="true" /></Link>
  </section>
);

export default PopularCategories;
