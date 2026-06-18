import { useEffect } from 'react';

export const useScrollReveal = (selector = '.scroll-reveal') => {
  useEffect(() => {
    const sections = document.querySelectorAll(selector);
    let previousScrollY = window.scrollY;
    let scrollDirection = 'down';

    const trackDirection = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - previousScrollY) > 3) {
        scrollDirection = currentScrollY > previousScrollY ? 'down' : 'up';
        previousScrollY = currentScrollY;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('scroll-reveal--from-top', scrollDirection === 'up');
          requestAnimationFrame(() => entry.target.classList.add('scroll-reveal--visible'));
        } else {
          entry.target.classList.remove('scroll-reveal--visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', trackDirection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', trackDirection);
    };
  }, [selector]);
};
