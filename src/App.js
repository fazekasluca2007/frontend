import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './pages/components/Nav';
import Footer from './pages/components/Footer';
import ScrollToTop from './pages/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Trip from './pages/Trip';
import Ecotrips from './pages/Ecotrips';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Reviews from './pages/Reviews';
import Information from './pages/Information';
import Booking from './pages/Booking';
import UserPage from './pages/UserPage';
import Aszf from './pages/Aszf';
import Ecoinfo from './pages/Ecoinfo';
import Cookiek from './pages/Cookiek';

const STORAGE_KEYS = {
  user: 'user',
  token: 'token',
};

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.user);
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
    setUser(null);
  };

  const handleProfileImageUpdate = (newImage) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        user: {
          ...prev.user,
          profileImage: newImage,
        },
      };

      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
      return updated;
    });
  };

  const handleUserUpdate = (newUserData) => {
    setUser(newUserData);

    if (newUserData) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUserData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.token);
    }
  };
  return (
    <BrowserRouter>
      <Nav user={user} onLogout={handleLogout} />

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bejelentkezes" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/profile"
            element={
              <UserPage
                user={user}
                updateProfileImage={handleProfileImageUpdate}
                updateUser={handleUserUpdate}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/utjaink" element={<Trip />} />
          <Route path="/okoutjaink" element={<Ecotrips />} />
          <Route path="/rolunk" element={<About />} />
          <Route path="/gyik" element={<FAQ />} />
          <Route path="/velemenyek" element={<Reviews />} />
          <Route path="/informaciok" element={<Information />} />
          <Route path="/foglalas" element={<Booking user={user} />} />
          <Route path="/okoleiras" element={<Ecoinfo />} />
          <Route path="/aszf" element={<Aszf />} />
          <Route path="/sutik" element={<Cookiek />} />
        </Routes>
      </div>

      <ScrollToTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;


