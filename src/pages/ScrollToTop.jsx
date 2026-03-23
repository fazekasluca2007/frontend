import React, { useEffect, useState } from 'react';
import './ScrollToTop.css';

{/* Gombhoz szükséges beállítások */ }
const SHOW_BUTTON_AT = 300;
const SCROLL_DURATION = 1000;
const BUTTON_TEXT = 'Vissza a tetejére';

export default function ScrollToTop() {
  {/* Gomb megjelenítésének állapota */ }
  const [show, setShow] = useState(false);

  {/* Scroll figyelése */ }
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.pageYOffset > SHOW_BUTTON_AT);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  {/* Animáció */ }
  const easeInOutCubic = (t) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  {/* Gombkattintás kezelése */ }
  const handleClick = () => {
    const startPos = window.scrollY;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startPos * (1 - eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  {/* Gomb megjelenítése */ }
  return (
    <>
      {show && (
        <button
          onClick={handleClick}
          className="scroll-to-top-btn"
          aria-label={BUTTON_TEXT}
          title={BUTTON_TEXT}
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </>
  );
}


