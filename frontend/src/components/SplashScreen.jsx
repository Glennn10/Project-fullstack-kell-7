import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ fadeOut }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the loading progress bar smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
      {/* Decorative ambient background lights */}
      <div className="ambient-light light-1"></div>
      <div className="ambient-light light-2"></div>
      
      <div className="splash-content">
        <div className="logo-wrapper">
          <img src="/Logo.png" alt="MinjemDong Logo" className="splash-logo" />
          <div className="logo-glow"></div>
        </div>
        
        <h1 className="splash-title">Minjem<span className="accent-text">Dong</span></h1>
        
        <div className="divider-line"></div>
        
        <p className="splash-subtitle">Digital Library</p>
        
        <div className="splash-loader-container">
          <div className="splash-loader-bar" style={{ width: `${progress}%` }}></div>
          <div className="loader-glow" style={{ left: `calc(${progress}% - 8px)` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
