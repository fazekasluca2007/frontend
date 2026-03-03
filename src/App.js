import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./pages/components/Nav";
import Footer from "./pages/components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Trip from "./pages/Trip";
import Ecotrips from "./pages/Ecotrips";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/Reviews";
import Information from "./pages/Information";
import Booking from './pages/Booking';
import UserPage from './pages/UserPage';
import Aszf from './pages/Aszf';
import Ecoinfo from './pages/Ecoinfo';
import Cookiek from './pages/Cookiek';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfileImage = (newImage) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = {
        ...prev,
        user: {
          ...prev.user,
          profileImage: newImage,
        },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    if (newUserData) {
      localStorage.setItem("user", JSON.stringify(newUserData));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <BrowserRouter>
      <Nav user={user} onLogout={logout} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bejelentkezes' element={<Login onLogin={login} />} />
        <Route path="/profile" element={
          <UserPage
            user={user}
            updateProfileImage={updateProfileImage}
            updateUser={updateUser}
            onLogout={logout} 
          />
        } />
        <Route path='/utjaink' element={<Trip />} />
        <Route path='/okoutjaink' element={<Ecotrips />} />
        <Route path='/rolunk' element={<About />} />
        <Route path='/gyik' element={<FAQ />} />
        <Route path='/velemenyek' element={<Reviews />} />
        <Route path='/informaciok' element={<Information />} />
        <Route path='/foglalas' element={<Booking user={user}/>} />
        <Route path='/okoleiras' element={<Ecoinfo />} />
        <Route path='/aszf' element={<Aszf />} />
        <Route path='/sutik' element={<Cookiek />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;