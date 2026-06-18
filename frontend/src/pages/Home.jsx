import Hero from '../components/landing/Hero';
import PopularCategories from '../components/landing/PopularCategories';
import WeeklyBooks from '../components/landing/WeeklyBooks';
import BorrowingGuide from '../components/landing/BorrowingGuide';
import LibrarianPicks from '../components/landing/LibrarianPicks';
import FaqSection from '../components/landing/FaqSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Home = () => {
  useScrollReveal();

  return (
    <>
      <Hero />
      <div className="container py-4">
        <PopularCategories />
        <WeeklyBooks />
        <BorrowingGuide />
        <LibrarianPicks />
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
