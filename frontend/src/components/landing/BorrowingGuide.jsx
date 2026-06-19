import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { borrowingSteps } from '../../data/landingData';

const BorrowingGuide = () => (
  <section className="borrowing-guide scroll-reveal scroll-reveal--stagger" id="borrowing-guide" aria-labelledby="borrowing-guide-title">
    <div className="borrowing-guide__heading">
      <div><h2 id="borrowing-guide-title">Dari rak sampai <em>ke tanganmu?</em></h2></div>
      <p>Nggak perlu bingung. Cari bukunya, temui petugas, lalu pulang bersama bacaan baru.</p>
    </div>
    <div className="borrowing-guide__steps">
      {borrowingSteps.map(({ icon: Icon, ...step }, index) => (
        <div className="borrowing-guide__step-wrap" key={step.title}>
          <article className="borrow-ticket" style={{ '--ticket-color': step.color }}>
            <div className="borrow-ticket__top"><span>{step.label}</span><span className="borrow-ticket__icon"><Icon aria-hidden="true" /></span></div>
            <div className="borrow-ticket__body"><h3>{step.title}</h3><p>{step.description}</p></div>
            <div className="borrow-ticket__note"><i aria-hidden="true" /> {step.note}</div>
          </article>
          {index < borrowingSteps.length - 1 && <span className="borrowing-guide__arrow" aria-hidden="true"><FiArrowRight /></span>}
        </div>
      ))}
    </div>
    <div className="borrowing-guide__footer">
      <p><strong>Siap mulai?</strong> Buku berikutnya mungkin tinggal satu pencarian lagi.</p>
      <Link to="/buku">Cari buku sekarang <FiArrowUpRight aria-hidden="true" /></Link>
    </div>
  </section>
);

export default BorrowingGuide;
