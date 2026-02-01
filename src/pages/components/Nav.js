import React, { useState } from 'react';
import './Nav.css';
import { NavLink } from 'react-router-dom';

export default function Nav({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar navbar-expand-lg position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* LOGO – érintetlen */}
        <div className="d-flex align-items-center">
          <NavLink className="navbar-brand" to="/">
            <img src="./img/ecologo.png" alt="Logo" />
          </NavLink>
        </div>

        {/* HAMBURGER */}
        <button
          className="navbar-toggler d-lg-none border-0"
          type="button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* DESKTOP CENTER */}
        <div className="d-none d-lg-flex position-absolute start-50 translate-middle-x">
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item"><NavLink className="nav-link" to="/utjaink">Útjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/okoutjaink">ÖkoÚtjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/rolunk">Rólunk</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/gyik">GYIK</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/velemenyek">Vélemények</NavLink></li>
          </ul>
        </div>

        {/* DESKTOP RIGHT */}
        <ul className="navbar-nav d-none d-lg-flex align-items-center">

          {!user && (
            <li className="nav-item">
              <NavLink className="nav-link login-btn ms-2" to="/bejelentkezes">
                Bejelentkezés
              </NavLink>
            </li>
          )}

          {user && (
            <li className="nav-item d-flex align-items-center ms-3 user-nav-item">

            
              <NavLink to="/profile" className="profile-link">
                <div className="profile-pic">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profilkép" />
                  ) : (
                    <span>{user.fullName.charAt(0)}</span>
                  )}
                </div>
              </NavLink>

              <span className="username ms-2">
                {user.fullName}
              </span>

              <button
                onClick={onLogout}
                className="btn btn-sm ms-2 logoutbtn"
              >
                Kijelentkezés
              </button>

            </li>
          )}

        </ul>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu d-lg-none text-center">
          <ul className="navbar-nav">
            <li className="nav-item"><NavLink className="nav-link" to="/utjaink" onClick={toggleMenu}>Útjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/okoutjaink" onClick={toggleMenu}>ÖkoÚtjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/rolunk" onClick={toggleMenu}>Rólunk</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/gyik" onClick={toggleMenu}>GYIK</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/velemenyek" onClick={toggleMenu}>Vélemények</NavLink></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
