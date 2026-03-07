import React, { useEffect, useState } from 'react';
import './ScrollToTop.css';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);
  const scrollToTop = () => {
    const scrollDuration = 1000;
    const startPosition = window.scrollY;
    const animationStartTime = performance.now();

    const calculateEasing = (timeProgress) => {
      return timeProgress < 0.5 
        ? 4 * timeProgress * timeProgress * timeProgress 
        : 1 - Math.pow(-2 * timeProgress + 2, 3) / 2;
    };

    const performScrollAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStartTime;
      const scrollProgress = Math.min(elapsedTime / scrollDuration, 1);
      const easedProgress = calculateEasing(scrollProgress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (scrollProgress < 1) {
        requestAnimationFrame(performScrollAnimation);
      }
    };

    requestAnimationFrame(performScrollAnimation);
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Vissza a tetejére"
          title="Vissza a tetejére"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </>
  );
}


