import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { frequentlyAskedQuestions } from '../../data/landingData';

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-section__intro">
        <span className="faq-section__eyebrow">Catatan dari meja petugas</span>
        <h2 id="faq-title">Pertanyaan yang <em>sering muncul.</em></h2>
        <p>Beberapa hal yang biasanya ditanyakan sebelum meminjam, mengembalikan, atau mengecek status buku.</p>
        <div className="faq-section__hint"><span aria-hidden="true">?</span><p>Belum ketemu jawabannya? Petugas perpustakaan siap membantu saat jam operasional.</p></div>
      </div>
      <div className="faq-index">
        <div className="faq-index__header"><span>Ringkasan bantuan</span><span>{frequentlyAskedQuestions.length} pertanyaan tersedia</span></div>
        {frequentlyAskedQuestions.map((item, index) => {
          const isOpen = openFaq === index;
          const answerId = `faq-answer-${index}`;
          return (
            <article className={`faq-item${isOpen ? ' faq-item--open' : ''}`} key={item.question}>
              <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={answerId}>
                <span className="faq-item__question">{item.question}</span><span className="faq-item__toggle" aria-hidden="true"><FiPlus /></span>
              </button>
              <div className="faq-item__answer" id={answerId}><div><p>{item.answer}</p></div></div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
