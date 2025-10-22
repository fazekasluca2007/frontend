import React from 'react';
import './Footer.css'; 

export default function Footer() {
  return (
    <footer
      className="text-white mt-5"
      style={{ backgroundColor: '#a8cde8' }}
    >
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
          <div className="col-md-4 mb-3 text-center hover-szin">
            <ul className="list-unstyled">
              <li><a href="utjaink.html" className="text-white text-decoration-none">Útjaink</a></li>
              <li><a href="okoutjaink.html" className="text-white text-decoration-none">ÖkoÚtjaink</a></li>
              <li><a href="rolunk.html" className="text-white text-decoration-none">Rólunk</a></li>
              <li><a href="gyik.html" className="text-white text-decoration-none">GYIK</a></li>
              <li><a href="velemenyek.html" className="text-white text-decoration-none">Vélemények</a></li>
            </ul>
          </div>

          {/* Social media */}
          <div className="col-md-4 mb-3 hover-szin text-center">
            <h5>Kövess minket!</h5>
            <ul className="list-unstyled d-flex flex-column align-items-center gap-2 mt-2">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white fs-4"
                >
                  <i className="fab fa-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white fs-4"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center mt-3">
          <small>&copy; 2025 EcoTrip - Minden jog fenntartva</small>
        </div>
      </div>
    </footer>
  );
}
