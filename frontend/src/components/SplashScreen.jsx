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
          <div className="splash-book__page splash-book__page--left">
            <span>MINJEM</span>
          </div>
          <div className="splash-book__page splash-book__page--right">
            <img src="/Logo.png" alt="" />
            <span>DONG!</span>
          </div>
          <i className="splash-book__spine" />
        </div>

        <h1 className="splash-title">Minjem<span>Dong!</span></h1>
        <p className="splash-subtitle">Sebentar, lagi nyiapin rak bukunya...</p>

        <div className="splash-loader-container">
          <span className="splash-loader-bar" />
        </div>
      </div>

      <p className="splash-note" aria-hidden="true">baca · pinjam · ulangi</p>
    </div>
  );
};

export default SplashScreen;
