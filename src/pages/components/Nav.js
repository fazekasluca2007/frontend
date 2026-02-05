import React, { useState, useEffect } from 'react'; 
import './Nav.css';
import { NavLink } from 'react-router-dom';

export default function Nav({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiName, setApiName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
    if (user && token) {
      fetch('https://localhost:7267/api/Profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Hiba a lekérés során: ' + res.status);
        return res.json();
      })
      .then(data => {
        console.log("API válasz a Profile-tól:", data);

        const extractedName = data.fullName || data.fullname || data.name || data.userName || data.username || data.email;
        if (extractedName) {
          setApiName(extractedName);
        }
      })
      .catch(err => console.error("API hiba a Nav-ban:", err));
    }
  }, [user]);

  if (user) console.log("Nav kapott user objektuma:", user);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const getName = () => {
    if (!user) return "Felhasználó";
    
    return (
      apiName ||          
      user.fullName || 
      user.fullname || 
      user.username || 
      user.userName || 
      user.name || 
      user.email || 
      "Felhasználó"
    );
  };

  const displayName = getName();
  const displayInitial = displayName.charAt(0).toUpperCase();

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
          {!user ? (
            <li className="nav-item">
              <NavLink className="nav-link login-btn ms-2" to="/bejelentkezes">
                Bejelentkezés
              </NavLink>
            </li>
          ) : (
            <li className="nav-item d-flex align-items-center ms-3 user-nav-item">
              <NavLink to="/profile" className="profile-link">
                <div className="profile-pic">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profilkép" />
                  ) : (
                    <span>{displayInitial}</span>
                  )}
                </div>
              </NavLink>

              <span className="username ms-2">
                {displayName}
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

      {menuOpen && (
        <div className="mobile-menu d-lg-none text-center">
          <ul className="navbar-nav">
            <li className="nav-item"><NavLink className="nav-link" to="/utjaink" onClick={toggleMenu}>Útjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/okoutjaink" onClick={toggleMenu}>ÖkoÚtjaink</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/rolunk" onClick={toggleMenu}>Rólunk</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/gyik" onClick={toggleMenu}>GYIK</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/velemenyek" onClick={toggleMenu}>Vélemények</NavLink></li>
            {!user ? (
               <li className="nav-item"><NavLink className="nav-link" to="/bejelentkezes" onClick={toggleMenu}>Bejelentkezés</NavLink></li>
            ) : (
               <li className="nav-item"><button onClick={() => { onLogout(); toggleMenu(); }} className="btn nav-link w-100">Kijelentkezés</button></li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
