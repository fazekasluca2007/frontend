import React, { useState } from 'react';
import './Nav.css';
import { NavLink } from 'react-router-dom';

export default function Nav({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);


  const getName = () => {
    if (user?.user?.username) return user.user.username;
    if (user?.user?.fullName) return user.user.fullName;
    if (user?.user?.email) return user.user.email;
    return "Felhasználó";
  };

  const displayName = getName();
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    onLogout();
  };

 
  const isLoggedIn = !!user && !!localStorage.getItem("token");

  return (
    <nav className="navbar navbar-expand-lg position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center">
          <NavLink className="navbar-brand" to="/">
            <img src="./img/ecologo.png" alt="Logo" />
          </NavLink>
        </div>

        <button
          className="navbar-toggler d-lg-none border-0"
          type="button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

       
        <div className="d-none d-lg-flex position-absolute start-50 translate-middle-x">
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item"><NavLink className="nav-link" to="/utjaink">Útjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/okoutjaink">ÖkoÚtjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/rolunk">Rólunk</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/gyik">GYIK</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/velemenyek">Vélemények</NavLink></li>
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
            <li className="nav-item"><NavLink className="nav-link" to="/utjaink" onClick={toggleMenu}>Útjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/okoutjaink" onClick={toggleMenu}>ÖkoÚtjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/rolunk" onClick={toggleMenu}>Rólunk</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/gyik" onClick={toggleMenu}>GYIK</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/velemenyek" onClick={toggleMenu}>Vélemények</NavLink></li>            {!isLoggedIn ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/bejelentkezes" onClick={toggleMenu}>
                  Bejelentkezés
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile" onClick={toggleMenu}>
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
                    onClick={() => { handleLogout(); toggleMenu(); }}
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