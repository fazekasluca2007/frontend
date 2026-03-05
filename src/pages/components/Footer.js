import React from 'react';
import './Footer.css';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-custom text-white">
      <div className="container py-4">
        <div className="row">

          <div className="col-md-4 mb-3">
            <h5 className="footer-heading">Kapcsolat</h5>
            <ul className="footer-list">
              <li>Miskolc</li>
              <li>+36 70 285 4560</li>
              <li>ecotripmail@gmail.com</li>
            </ul>
          </div>

          <div className="col-md-4 text-md-center">
            <h5 className="footer-heading">Oldalak</h5>
            <ul className="footer-list">
              <li><NavLink to="/utjaink">Útjaink</NavLink></li>
              <li><NavLink to="/okoutjaink">ÖkoÚtjaink</NavLink></li>
              <li><NavLink to="/rolunk">Rólunk</NavLink></li>
              <li><NavLink to="/gyik">GYIK</NavLink></li>
              <li><NavLink to="/velemenyek">Vélemények</NavLink></li>
              <li><NavLink to="/aszf">ÁSZF</NavLink></li>
            </ul>
          </div>

          <div className="col-md-4 mb-3 text-center">
            <h5 className="footer-heading">Kövess minket!</h5>

            <div className="social-icons mt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="bi bi-twitter-x"></i>
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
