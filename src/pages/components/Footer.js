import React from 'react';
import './Footer.css';
import { NavLink } from 'react-router-dom';

export default function Footer() {  return (    <footer className="footer-custom text-white">
      <div className="container py-4">
        <div className="row g-3 gy-4">
          
       
          <div className="col-12 col-md-4 footer-section">
            <h5 className="footer-heading">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Kapcsolat
            </h5>
            <ul className="footer-list">
              <li><i className="bi bi-pin-map me-2"></i>Miskolc</li>
              <li><i className="bi bi-telephone me-2"></i>+36 70 285 4560</li>
              <li><i className="bi bi-envelope me-2"></i>ecotripmail@gmail.com</li>
            </ul>
          </div>

          <div className="col-12 col-md-4 footer-section">
            <h5 className="footer-heading">
              <i className="bi bi-map me-2"></i>
              Oldalak
            </h5>
            <ul className="footer-list footer-links">
              <li><NavLink to="/utjaink"><i className="bi bi-chevron-right me-1"></i>Útjaink</NavLink></li>
              <li><NavLink to="/okoutjaink"><i className="bi bi-chevron-right me-1"></i>ÖkoÚtjaink</NavLink></li>
              <li><NavLink to="/rolunk"><i className="bi bi-chevron-right me-1"></i>Rólunk</NavLink></li>
              <li><NavLink to="/gyik"><i className="bi bi-chevron-right me-1"></i>GYIK</NavLink></li>
              <li><NavLink to="/velemenyek"><i className="bi bi-chevron-right me-1"></i>Vélemények</NavLink></li>
              <li><NavLink to="/aszf"><i className="bi bi-chevron-right me-1"></i>ÁSZF</NavLink></li>
            </ul>
          </div>

          <div className="col-12 col-md-4 footer-section">
            <h5 className="footer-heading">
              <i className="bi bi-heart-fill me-2"></i>
              Kövess minket!
            </h5>
            <div className="social-icons-container">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link">
                <i className="bi bi-facebook"></i>
                <span>Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
                <i className="bi bi-instagram"></i>
                <span>Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link">
                <i className="bi bi-twitter-x"></i>
                <span>Twitter</span>
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom text-center mt-4 pt-3">
          <small>&copy; 2026 EcoTrip - Minden jog fenntartva</small>
        </div>

      </div>
    </footer>
  );
}
