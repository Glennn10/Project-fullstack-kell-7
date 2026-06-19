import Hero from '../components/landing/Hero';
import PopularCategories from '../components/landing/PopularCategories';
import WeeklyBooks from '../components/landing/WeeklyBooks';
import BorrowingGuide from '../components/landing/BorrowingGuide';
import LibrarianPicks from '../components/landing/LibrarianPicks';
import FaqSection from '../components/landing/FaqSection';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { libraryService } from '../services/libraryService';

const Home = () => {
  useScrollReveal();
  const [landingData, setLandingData] = useState({ categories: [], weekly: [], curated: [] });

  useEffect(() => {
    let current = true;
    Promise.all([libraryService.getCategories(), libraryService.getLandingPicks()])
      .then(([categoryResponse, pickResponse]) => {
        if (!current) return;
        setLandingData({
          categories: categoryResponse.data?.data || [],
          weekly: pickResponse.data?.data?.weekly || [],
          curated: pickResponse.data?.data?.curated || [],
        });
      })
      .catch(() => {});
    return () => { current = false; };
  }, []);

  return (
    <>
      <Hero />
      <div className="container py-4">
        <PopularCategories categories={landingData.categories} />
        <WeeklyBooks books={landingData.weekly} />
        <BorrowingGuide />
        <LibrarianPicks books={landingData.curated} />
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
import { useEffect, useState } from 'react';
