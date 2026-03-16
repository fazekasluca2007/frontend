import React, { useEffect, useRef } from 'react';
import './Footer.css';
import { NavLink } from 'react-router-dom';

const SCROLL_ANIMATION_CONFIG = {
  threshold: 0.15,
  staggerDelay: 0.08,
  showClass: 'show',
  observableClass: 'animate-on-scroll',
};

const FOOTER_LINKS = [
  { path: '/utjaink', label: 'Útjaink' },
  { path: '/okoutjaink', label: 'ÖkoÚtjaink' },
  { path: '/rolunk', label: 'Rólunk' },
  { path: '/gyik', label: 'GYIK' },
  { path: '/velemenyek', label: 'Vélemények' },
  { path: '/aszf', label: 'ÁSZF' },
];

const SOCIAL_LINKS = [
  { url: 'https://facebook.com', icon: 'bi-facebook', label: 'Facebook' },
  { url: 'https://instagram.com', icon: 'bi-instagram', label: 'Instagram' },
  { url: 'https://twitter.com', icon: 'bi-twitter-x', label: 'Twitter' },
];

const CONTACT_INFO = [
  { icon: 'bi-pin-map', label: 'Miskolc' },
  { icon: 'bi-telephone', label: '+36 70 285 4560' },
  { icon: 'bi-envelope', label: 'ecotripmail@gmail.com' },
];

const FOOTER_COPYRIGHT = '© 2026 EcoTrip - Minden jog fenntartva';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const observableElements = footerRef.current.querySelectorAll(
      `.${SCROLL_ANIMATION_CONFIG.observableClass}`
    );

    const handleIntersectionChange = (entries) => {
      entries.forEach((entry) => {
        const action = entry.isIntersecting ? 'add' : 'remove';
        entry.target.classList[action](SCROLL_ANIMATION_CONFIG.showClass);
      });
    };

    const observer = new IntersectionObserver(handleIntersectionChange, {
      threshold: SCROLL_ANIMATION_CONFIG.threshold,
    });

    observableElements.forEach((element, index) => {
      element.style.transitionDelay = `${index * SCROLL_ANIMATION_CONFIG.staggerDelay}s`;
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <footer ref={footerRef} className="footer-custom text-white">
      <div className="container py-4">
        <div className="row g-3 gy-4">
          
          <div className="col-12 col-md-4 footer-section animate-on-scroll">
            <h5 className="footer-heading">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Kapcsolat
            </h5>
            <ul className="footer-list">
              {CONTACT_INFO.map((info, index) => (
                <li key={index}>
                  <i className={`bi ${info.icon} me-2`}></i>
                  {info.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-12 col-md-4 footer-section animate-on-scroll">
            <h5 className="footer-heading">
              <i className="bi bi-map me-2"></i>
              Oldalak
            </h5>
            <ul className="footer-list footer-links">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path}>
                    <i className="bi bi-chevron-right me-1"></i>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-12 col-md-4 footer-section animate-on-scroll">
            <h5 className="footer-heading">
              <i className="bi bi-heart-fill me-2"></i>
              Kövess minket!
            </h5>
            <div className="social-icons-container">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <i className={`bi ${social.icon}`}></i>
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="footer-bottom text-center mt-4 pt-3 animate-on-scroll">
          <small>{FOOTER_COPYRIGHT}</small>
        </div>

      </div>
    </footer>
  );
}
