import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

export default function Home() {
  const URL = process.env.REACT_APP_BACKEND_URL;

  const carouselRef = useRef(null);
  const carouselInstance = useRef(null);

  const isUserLoggedIn = () => localStorage.getItem('user') !== null;


  useEffect(() => {
    document.title = 'EcoTrip';
  }, []);


  useEffect(() => {
    if (!window.bootstrap || !carouselRef.current) return;

    if (carouselInstance.current) {
      carouselInstance.current.dispose();
    }

    carouselInstance.current = new window.bootstrap.Carousel(
      carouselRef.current,
      {
        interval: 3000,
        pause: false,
        wrap: true
      }
    );

    carouselInstance.current.cycle();

    return () => {
      carouselInstance.current?.dispose();
      carouselInstance.current = null;
    };
  }, []);


  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    const map = L.map('map').setView([47.5, 19.04], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const defaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    const addMarkersFromApi = async (url, icon) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return;

        const text = await response.text();
        if (!text) return;

        const data = JSON.parse(text);

        data.forEach(szallas => {
          const lat = Number(szallas.latitude);
          const lng = Number(szallas.longitude);
          if (!lat || !lng) return;

          L.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width:220px">
                <h6>${szallas.hotelName}</h6>
                <strong>${szallas.stars} ★</strong><br/>
                ${szallas.city}, ${szallas.country}
                <hr/>
                <p style="font-size:13px">${szallas.description}</p>
              </div>
            `);
        });
      } catch (e) {
        console.error('Marker hiba:', e.message);
      }
    };

    addMarkersFromApi(URL + 'TripsMap/Sima', defaultIcon);
    addMarkersFromApi(URL + 'TripsMap/Eco', greenIcon);

    setTimeout(() => map.invalidateSize(), 200);

    return () => map.remove();
  }, []);

  return (
    <div className="position-relative text-center">

    
      <div id="heroCarousel" className="carousel slide" ref={carouselRef}>
        <div className="carousel-inner">
          {['gorog','spanyol','ausztria','magyar','dubai','egyipt','olasz','francia']
            .map((img, i) => (
              <div key={img} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                <img
                  src={`img/index kepek/${img}.jpg`}
                  className="d-block w-100"
                  alt={img}
                />
              </div>
            ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>

        <div className="position-absolute top-50 start-50 translate-middle hero-overlay">
          <h1>Üdvözlünk az EcoTrip oldalán!</h1>

          <NavLink
            to={isUserLoggedIn() ? '/utjaink' : '/bejelentkezes'}
            className="btn btn-primary btn-lg mt-3"
          >
            Foglalj most
          </NavLink>

          <p>
            Több száz szálláslehetőség, inspiráló úticélok, és öko-tudatos tippek – mindezt egy helyen!
          </p>

          <p>
            Csatlakozz az EcoTrip közösséghez, és fedezd fel a fenntartható utazást!
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

      <section className="container my-5 text-center animate-on-scroll">
        <h3 className="mb-3">Hol járhatsz velünk?</h3>
        <div id="map"></div>
      </section>

    </div>
  );
}
