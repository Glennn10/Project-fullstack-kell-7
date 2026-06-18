import './SplashScreen.css';

const SplashScreen = ({ fadeOut }) => {
  return (
    <div
      className={`splash-container ${fadeOut ? 'fade-out' : ''}`}
      role="status"
      aria-label="Memuat MinjemDong"
      aria-live="polite"
    >
      <span className="splash-shape splash-shape--sun" aria-hidden="true" />
      <span className="splash-shape splash-shape--dots" aria-hidden="true" />

      <div className="splash-content">
        <div className="splash-book" aria-hidden="true">
          <i className="splash-book__cover splash-book__cover--left" />
          <i className="splash-book__cover splash-book__cover--right" />
          <div className="splash-book__page splash-book__page--left">
            <small>MINJEMDONG!</small>
            <strong>Temukan<br />ceritamu.</strong>
            <span className="splash-book__lines"><i /><i /><i /></span>
            <em>01</em>
          </div>
          <div className="splash-book__page splash-book__page--right">
            <span className="splash-book__spark splash-book__spark--one">✦</span>
            <span className="splash-book__spark splash-book__spark--two">✦</span>
            <span className="splash-book__logo"><img src="/Logo.png" alt="" /></span>
            <strong>baca sesukamu</strong>
            <em>02</em>
          </div>
          <i className="splash-book__bookmark" />
          <i className="splash-book__spine" />
        </div>

        <h1 className="splash-title">Minjem<span>Dong!</span></h1>
        <p className="splash-subtitle">Sebentar, lagi nyiapin bukunya...</p>

        <div className="splash-loader-container">
          <span className="splash-loader-bar" />
        </div>
      </div>

      <p className="splash-note" aria-hidden="true">baca · pinjam · repeat</p>
    </div>
  );
};

export default SplashScreen;
