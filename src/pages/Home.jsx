import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const CAROUSEL_IMAGES = ['gorog', 'spanyol', 'ausztria', 'magyar', 'dubai', 'egyipt', 'olasz', 'francia'];
const CAROUSEL_INTERVAL = 4000;
const MAP_CENTER = [47.5, 19.04];
const MAP_ZOOM = 5;

const MARKER_ICONS = {
  default: L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  eco: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  })
};

const getCookieChoice = () => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('cookieChoice='));
  return cookie ? cookie.split('=')[1] : null;
};

const setCookieChoice = (value) => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `cookieChoice=${value}; expires=${expires.toUTCString()}; path=/`;
};

const createPopupContent = (hotel, type) => `
  <div style="min-width:220px">
    <h6>${hotel.hotelName}</h6>
    <div class="review-stars">
      ${'<i class="bi bi-star-fill review-star"></i>'.repeat(Number(hotel.stars))}
    </div>
    ${hotel.city}, ${hotel.country}
    <hr/>
    <p style="font-size:13px">${hotel.description}</p>
    <button 
      class="eco-popup-btn ${type === 'eco' ? 'eco-popup-btn--eco' : ''}"
      data-id="${hotel.tripId}"
      data-type="${type}"
    >
      Tovább a szállásra
    </button>
  </div>
`;

export default function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [cookieChoice, setCookieState] = useState(getCookieChoice());

  const isLoggedIn = localStorage.getItem('user') !== null;

  useEffect(() => {
    document.title = 'EcoTrip';
  }, []);

  useEffect(() => {
    if (!carouselRef.current) return;

    const items = Array.from(carouselRef.current.querySelectorAll('.carousel-item'));
    if (items.length === 0) return;

    let currentIndex = 0;

    const interval = setInterval(() => {
      items[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add('active');
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const map = L.map('map', { scrollWheelZoom: false }).setView(MAP_CENTER, MAP_ZOOM);
    let shiftPressed = false;

    const handleKeyDown = (e) => {
      if (e.key === 'Shift') shiftPressed = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') shiftPressed = false;
    };

    const handleWheel = () => {
      if (shiftPressed) {
        map.scrollWheelZoom.enable();
        setTimeout(() => map.scrollWheelZoom.disable(), 500);
      }
    };

    const handlePopupOpen = (e) => {
      const button = e.popup._contentNode.querySelector('.eco-popup-btn');
      if (button) {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          const type = button.getAttribute('data-type');
          const state = type === 'eco' ? { ecotrip_id: id } : { trip_id: id };
          navigate('/informaciok', { state });
        });
      }
    };

    const infoControl = L.control({ position: 'bottomleft' });
    infoControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-scroll-info');
      div.innerHTML = 'A térkép görgetéséhez tartsa lenyomva a <b>Shift</b> billentyűt és használja a görgőt.';
      return div;
    };
    infoControl.addTo(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    map.getContainer().addEventListener('wheel', handleWheel);
    map.on('popupopen', handlePopupOpen);

    const fetchMarkers = async (endpoint, icon, type) => {
      try {
        const { data } = await axios.get(`${API_URL}${endpoint}`);
        if (!data || !Array.isArray(data)) return;

        data.forEach((hotel) => {
          const lat = Number(hotel.latitude);
          const lng = Number(hotel.longitude);
          
          if (lat && lng) {
            L.marker([lat, lng], { icon })
              .addTo(map)
              .bindPopup(createPopupContent(hotel, type));
          }
        });
      } catch (error) {
        console.error(`Failed to load ${type} markers:`, error.message);
      }
    };

    fetchMarkers('TripsMap/Sima', MARKER_ICONS.default, 'sima');
    fetchMarkers('TripsMap/Eco', MARKER_ICONS.eco, 'eco');

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      map.getContainer().removeEventListener('wheel', handleWheel);
    };
  }, [navigate]);

  const handleCookieChoice = (value) => {
    setCookieChoice(value);
    setCookieState(value);
  };

  return (
    <>
      <div className="position-relative text-center">
        <div id="heroCarousel" className="carousel slide carousel-fade" ref={carouselRef}>
          <div className="carousel-inner">
            {CAROUSEL_IMAGES.map((img, index) => (
              <div key={img} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                  src={`img/index kepek/${img}.jpg`}
                  className="d-block w-100"
                  alt={img}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hero-overlay">
          <h1>Üdvözlünk az EcoTrip oldalán!</h1>
          <NavLink
            to={isLoggedIn ? '/utjaink' : '/bejelentkezes'}
            className="btn btn-primary btn-lg mt-3"
          >
            Foglalj most
          </NavLink>
          <p>
            Foglaljon most, pár kattintással!
            Kezdje el még ma, és indulhat a következő élménye!
          </p>
        </div>
      </div>

      <section className="values-section py-5 text-center animate-on-scroll">
        <div className="container">
          <h2 className="mb-5">Értékeink</h2>
          <div className="row gy-4 justify-content-center">
            <div className="col-12 col-md-4 d-flex">
              <div className="value-card w-100 animate-on-scroll">
                <i className="fa-solid fa-leaf fa-2x mb-3"></i>
                <h5>Fenntarthatóság</h5>
                <p>
                  Környezettudatos döntéseket hozunk minden utazás
                  tervezésekor – a közlekedéstől a szállásig.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4 d-flex">
              <div className="value-card w-100 animate-on-scroll">
                <i className="fa-solid fa-globe fa-2x mb-3"></i>
                <h5>Felfedezés</h5>
                <p>
                  Utazásaink új kultúrákat, rejtett helyeket és valódi
                  élményeket kínálnak a világ minden tájáról.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4 d-flex">
              <div className="value-card w-100 animate-on-scroll">
                <i className="fa-solid fa-heart fa-2x mb-3"></i>
                <h5>Közösség</h5>
                <p>
                  Hisszük, hogy az utazás összeköt – embereket, kultúrákat,
                  és természetet egyaránt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="login-prompt animate-on-scroll">
        <span>
          Szeretne többet megtudni, hogy miért ajánljuk az ökoszállásokat? 
          Látogasson el erre az oldalra, hogy mindent megtudhasson!
        </span>
        <Link to="/okoleiras" className="login-btn-circle">
          <FaArrowRight size={12} />
        </Link>
      </div>

      <section className="container my-5 text-center animate-on-scroll">
        <h3 className="mb-3">Hol járhat velünk?</h3>
        <div id="map"></div>
      </section>

      {!cookieChoice && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <div className="cookie-left">
              <span className="cookie-emoji">🍪</span>
              <span className="cookie-text">
                Az oldal sütiket használ a biztonságos működés és a jobb felhasználói élmény érdekében.
                <br />
                <Link to="/sutik" style={{ color: '#00b3b3', textDecoration: 'underline' }}>
                  Tudj meg többet
                </Link>
              </span>
            </div>

            <div className="cookie-buttons">
              <button
                onClick={() => handleCookieChoice('all')}
                className="cookie-btn primary"
              >
                Összes elfogadása
              </button>

              <button
                onClick={() => handleCookieChoice('necessary')}
                className="cookie-btn secondary"
              >
                Csak a szükséges
              </button>

              <button
                onClick={() => handleCookieChoice('reject')}
                className="cookie-btn secondary"
              >
                Összes elutasítása
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}