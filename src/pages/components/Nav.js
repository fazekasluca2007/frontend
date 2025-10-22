import React from 'react';
import './Nav.css';

export default function Nav() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg position-relative">
        <div className="container-fluid d-flex justify-content-between align-items-center">

          <div className="d-flex align-items-center">
            <a className="navbar-brand" href="index.html">
              <img src="./img/logo.svg" alt="Logo" />
            </a>

            <a id="loginLink" className="nav-link ms-2" href="bejelentkezes.html">Bejelentkezés</a>

            <div id="userInfo" className="ms-3 d-none text-white">
              <span id="usernameDisplay" className="fw-bold"></span>
              <button id="logoutBtn" className="btn btn-sm btn-outline-light ms-2">Kijelentkezés</button>
            </div>
          </div>

          <div className="position-absolute start-50 translate-middle-x">
            <ul className="navbar-nav d-flex flex-row">
              <li className="nav-item"><a className="nav-link" href="utjaink.html">Útjaink</a></li>
              <li className="nav-item"><a className="nav-link" href="okoutjaink.html">ÖkoÚtjaink</a></li>
            </ul>
          </div>

          <div className="d-flex">
            <ul className="navbar-nav d-flex flex-row">
              <li className="nav-item"><a className="nav-link" href="rolunk.html">Rólunk</a></li>
              <li className="nav-item"><a className="nav-link" href="gyik.html">GYIK</a></li>
              <li className="nav-item"><a className="nav-link" href="velemenyek.html">Vélemények</a></li>
            </ul>
          </div>

        </div>
      </nav>
    </div>
  );
}
