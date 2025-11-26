import React, {useState} from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./pages/components/Nav.js";
import Footer from "./pages/components/Footer.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Trip from "./pages/Trip.js";
import Ecotrips from "./pages/Ecotrips.js";
import About from "./pages/About.js";
import FAQ from "./pages/FAQ.js";
import Reviews from "./pages/Reviews.js";


function App() {
  return (
    <BrowserRouter>
    <div>
      <Nav/>

        <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/bejelentkezes' element={<Login/>} />
        <Route path='/utjaink' element={<Trip/>} />
        <Route path='/okoutjaink' element={<Ecotrips/>} />
        <Route path='/rolunk' element={<About/>} />
        <Route path='/gyik' element={<FAQ/>} />
        <Route path='/velemenyek' element={<Reviews/>} />
      </Routes>

      <Footer/>
    </div>
    </BrowserRouter>
  );
}

export default App