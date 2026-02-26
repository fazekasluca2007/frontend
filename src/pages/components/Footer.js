import React from 'react';
import './Footer.css';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-custom text-white">
      <div className="container py-4">
        <div className="row">

          {/* Kapcsolat */}
          <div className="col-md-4 mb-3">
            <h5>Kapcsolat</h5>
            <ul className="list-unstyled">
              <li>Miskolc</li>
              <li>+36 70 285 4560</li>
              <li>info@ecotrip.hu</li>
            </ul>
          </div>

          {/* Linkek */}
          <div className="col-md-4 text-md-center">
            <h5 className="footer-title">Oldalak</h5>
            <ul className="footer-list">
              <li><NavLink to="/utjaink">Útjaink</NavLink></li>
              <li><NavLink to="/okoutjaink">ÖkoÚtjaink</NavLink></li>
              <li><NavLink to="/rolunk">Rólunk</NavLink></li>
              <li><NavLink to="/gyik">GYIK</NavLink></li>
              <li><NavLink to="/velemenyek">Vélemények</NavLink></li>
              <li><NavLink to="/aszf">ÁSZF</NavLink></li>
            </ul>
          </div>

          {/* Social media */}
          <div className="col-md-4 mb-3 hover-szin text-center">
            <h5>Kövess minket!</h5>
            <ul className="list-unstyled d-flex flex-column align-items-center gap-2 mt-2 sites">
              <li>
                <a href="https://facebook.com" className="text-white fs-4" target="_blank" rel="noreferrer">
                  <i class="bi bi-facebook"></i>
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-white fs-4" target="_blank" rel="noreferrer">
                  <i class="bi bi-instagram"></i>
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-white fs-4" rel="noreferrer">
                  <i class="bi bi-twitter-x"></i>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="text-center mt-3">
          <small>&copy; 2026 EcoTrip - Minden jog fenntartva</small>
        </div>
      </div>
    </footer>
  );
}
