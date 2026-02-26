import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Trip.css";

const Trip_card = ({ hotel, onClick }) => {
  return (
    <div className="hotel-card">
      <img
        src={`/${hotel.image_url}`}
        alt={hotel.hotel_name}
        className="szallaskepek"
      />
      <div className="hotel-card-body">
        <h5>{hotel.hotel_name}</h5>

        <div className="review-stars">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <i key={i} className="bi bi-star-fill review-star"></i>
          ))}
        </div>

        <p>{hotel.city} {hotel.country}</p>

        <button
          className="btn btn-primary btn-lg mt-auto"
          onClick={onClick}
        >
         További részletek
        </button>
      </div>
    </div>
  );
};

const Trip = () => {
  const URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [trips, setTrips] = useState([]);
  const [positions, setPositions] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(URL + "Trips/tripcards")
      .then((response) => response.json())
      .then((json) => {
        setTrips(json.result);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [URL]);

  useEffect(() => {
    document.title = "EcoTrip – Útjaink";
    window.scrollTo(0, 0);
  }, []);

  const moveSlide = (country, step) => {
    const countryData = trips.find((c) => c.country === country);
    if (!countryData) return;

    const cards = countryData.hotels.length;
    const visible = 4;
    const maxPos = Math.max(0, cards - visible);

    setPositions((prev) => {
      const current = prev[country] || 0;
      let newPos = current + step;
      newPos = Math.max(0, Math.min(newPos, maxPos));
      return { ...prev, [country]: newPos };
    });
  };

  const cities = selectedCountry
    ? [
        ...new Set(
          trips
            .find((c) => c.country === selectedCountry)
            ?.hotels.map((h) => h.city) || []
        ),
      ]
    : [];

 
  const handleBooking = (hotel) => {
    navigate("/informaciok", {
      state: { trip_id: hotel.id },
    });
  };

  return (
    <>
      <ToastContainer theme="colored" />

      {(loading || error) && (
        <div className="d-flex justify-content-center my-5">
          <BeatLoader color="#a87c5c" size={15} />
        </div>
      )}

      {error && (
        <p className="error text-center my-4">
          Hiba az adatok lekérése során. Kérjük, próbálja újra később.
        </p>
      )}

      {!error && !loading && (
        <>
          <div className="trip-filter container my-4">
            <div className="trip-filter-inner">
              <h2 className="filter-title">Válassza ki az úticélját!</h2>

              <div className="filter-field">
                <label>Ország</label>
                <div className="filter-input-wrapper">
                  <span className="filter-icon">
                    <i className="bi bi-globe-americas text-dark"></i>
                  </span>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedCity("");
                    }}
                  >
                    <option value="">Válassz országot…</option>
                    {trips.map((country) => (
                      <option key={country.country} value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-field">
                <label>Város</label>
                <div className="filter-input-wrapper">
                  <span className="filter-icon">
                    <i className="bi bi-buildings text-dark"></i>
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedCountry}
                  >
                    <option value="">Válassz várost…</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="container my-5">
            {trips
              .filter((country) =>
                selectedCountry ? country.country === selectedCountry : true
              )
              .map((country) => {
                const filteredHotels = selectedCity
                  ? country.hotels.filter((h) => h.city === selectedCity)
                  : country.hotels;

                const pos = positions[country.country] || 0;
                const movePercent = -(pos * 100);

                return (
                  <div key={country.country} className="my-5">
                    <div className="country-banner d-flex align-items-center mb-4">
                      <img
                        src={`/${country.flag}`}
                        alt={country.country}
                        className="zaszlokep me-3"
                      />
                      <div>
                        <h3 className="text-white">{country.country}</h3>
                        <p className="fst-italic">{country.description}</p>
                      </div>
                    </div>

                    <div className="slider-wrapper">
                      <button
                        className="slider-btn left"
                        onClick={() => moveSlide(country.country, -1)}
                      >
                        ❮
                      </button>

                      <div className="slider-container">
                        <div
                          className="slider-track"
                          style={{
                            transform: `translateX(${movePercent}%)`,
                          }}
                        >
                          {filteredHotels.map((hotel) => (
                            <Trip_card
                              key={hotel.id}
                              hotel={hotel}
                              onClick={() => handleBooking(hotel)}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        className="slider-btn right"
                        onClick={() => moveSlide(country.country, 1)}
                      >
                        ❯
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default Trip;