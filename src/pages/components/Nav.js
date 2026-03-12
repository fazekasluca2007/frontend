import React, { useState } from 'react';
import './Nav.css';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { path: '/utjaink', label: 'Útjaink' },
  { path: '/okoutjaink', label: 'Ökoútjaink' },
  { path: '/rolunk', label: 'Rólunk' },
  { path: '/gyik', label: 'GYIK' },
  { path: '/velemenyek', label: 'Vélemények' },
];

const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
};

export default function Nav({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const getUserName = () => {
    const userObj = user?.user;
    return userObj?.username || '';
  };

  const displayName = getUserName();
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    onLogout();
  };

  const isLoggedIn = !!user && !!localStorage.getItem(STORAGE_KEYS.token);
  return (
    <nav className="navbar navbar-expand-lg position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center">
          <NavLink className="navbar-brand" to="/">
            <img src="./img/ecologo.png" alt="EcoTrip Logo" />
          </NavLink>
        </div>

        <button
          className="navbar-toggler d-lg-none border-0"
          type="button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="d-none d-lg-flex position-absolute start-50 translate-middle-x">
          <ul className="navbar-nav d-flex flex-row">
            {NAV_LINKS.map((link) => (
              <li key={link.path} className="nav-item">
                <NavLink className="nav-link" to={link.path}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <ul className="navbar-nav d-none d-lg-flex align-items-center">
          {!isLoggedIn ? (
            <li className="nav-item">
              <NavLink className="nav-link login-btn ms-2" to="/bejelentkezes">
                Bejelentkezés
              </NavLink>
            </li>
          ) : (
            <li className="nav-item d-flex align-items-center ms-3 user-nav-item">
              <NavLink to="/profile" className="profile-link">
                <div className="profile-pic">
                  {user?.user?.profileImage ? (
                    <img src={user.user.profileImage} alt="Profilkép" />
                  ) : (
                    <span>{displayInitial}</span>
                  )}
                </div>
              </NavLink>
              <span className="username ms-2">{displayName}</span>
              <button
                onClick={handleLogout}
                className="btn btn-sm ms-2 logoutbtn"
              >
                Kijelentkezés
              </button>
            </li>
          )}
        </ul>
      </div>

      {menuOpen && (
        <div className="mobile-menu d-lg-none text-center">
          <ul className="navbar-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.path} className="nav-item">
                <NavLink
                  className="nav-link"
                  to={link.path}
                  onClick={toggleMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {!isLoggedIn ? (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/bejelentkezes"
                  onClick={toggleMenu}
                >
                  Bejelentkezés
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/profile"
                    onClick={toggleMenu}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="profile-pic-mobile">
                        {user?.user?.profileImage ? (
                          <img src={user.user.profileImage} alt="Profilkép" />
                        ) : (
                          <span>{displayInitial}</span>
                        )}
                      </div>
                      <span>{displayName}</span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="btn nav-link w-100"
                  >
                    Kijelentkezés
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}