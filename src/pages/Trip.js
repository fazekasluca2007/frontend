import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Trip.css";
import Trip_card from "./components/Trip_card";

const Trip = () => {
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [trips, setTrips] = useState([]);
  const [positions, setPositions] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://localhost:7267/api/Trips/tripcards")
      .then((response) => response.json())
      .then((json) => {
        setTrips(json.result);
        setError(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    document.title = "EcoTrip – Útjaink";
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
    ? trips.find((c) => c.country === selectedCountry)?.hotels.map(
        (h) => h.city
      )
    : [];

  const handleBooking = (hotel) => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (!loggedIn) {
      alert("A foglaláshoz kérlek jelentkezz be.");
      return;
    }

    navigate("/informaciok", {
      state: { trip_id: hotel.id },
    });
  };

  return (
    <>
      {error && (
        <p className="error text-center my-4">
          Hiba az adatok lekérése során. Kérjük, próbálja újra később.
        </p>
      )}

      <div className="trip-filter container my-4">
        <div className="trip-filter-inner">
          <h2 className="filter-title">Hová utazna?</h2>

          <div className="filter-field">
            <label>Ország</label>
            <div className="filter-input-wrapper">
              <span className="filter-icon">🌍</span>
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
              <span className="filter-icon">🏙️</span>
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
                    src={country.flag}
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
  );
};

export default Trip;