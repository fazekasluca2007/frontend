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
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Nav user={user} onLogout={logout} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bejelentkezes' element={<Login onLogin={login} />} />
        <Route path='/utjaink' element={<Trip />} />
        <Route path='/okoutjaink' element={<Ecotrips />} />
        <Route path='/rolunk' element={<About />} />
        <Route path='/gyik' element={<FAQ />} />
        <Route path='/velemenyek' element={<Reviews />} />
        <Route path='/informaciok' element={<Information />} />
        <Route path='/foglalas' element={<Booking />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
