import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Ecotrips.css";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

        <p>
          {hotel.city} {hotel.country}
        </p>

        <button className="btn btn-primary btn-lg mt-auto" onClick={onClick}>
          További részletek
        </button>
      </div>
    </div>
  );
};

const CustomSelect = ({ options, value, onChange, placeholder, type }) => {
  const [open, setOpen] = useState(false);

  const getPlaceholderIcon = () => {
    if (type === "country") return <i className="bi bi-globe-americas text-dark me-2"></i>;
    if (type === "city") return <i className="bi bi-buildings text-dark me-2"></i>;
    return null;
  };

  return (
    <div className="custom-select-wrapper">
      <div
        className="custom-select-display"
        onClick={() => setOpen((prev) => !prev)}
      >
        {!value && getPlaceholderIcon()} 
        {value || placeholder}
        <span className="arrow">
          {open ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
        </span>
      </div>

      {open && (
        <ul className="custom-select-options">
          {options.map((opt) => (
            <li
              key={opt}
              className="custom-select-option"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const EcoTrip = () => {
  const URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [ecotrips, setEcotrips] = useState([]);
  const [positions, setPositions] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(URL + "EcoTrip/ecotripcards")
      .then((response) => response.json())
      .then((json) => {
        setEcotrips(json.result);
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
    document.title = "EcoTrip – Ökoútjaink";
    window.scrollTo(0, 0);
  }, []);

  const moveSlide = (country, step, hotelsLength) => {
    let cardsPerView = 4;
    if (window.innerWidth <= 992 && window.innerWidth > 576) cardsPerView = 2;
    if (window.innerWidth <= 576) cardsPerView = 1;

    const maxPos = Math.max(0, hotelsLength - cardsPerView);

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
          ecotrips
            .find((c) => c.country === selectedCountry)
            ?.hotels.map((h) => h.city) || []
        ),
      ]
    : [];

  const handleBooking = (hotel) => {
    const loggedIn = localStorage.getItem("user") !== null;

    if (!loggedIn) {
      toast.info("A foglaláshoz kérlek jelentkezz be!", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    navigate("/informaciok", {
      state: { ecotrip_id: hotel.id },
    });
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />

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
                  <CustomSelect
                    value={selectedCountry}
                    onChange={(val) => {
                      setSelectedCountry(val);
                      setSelectedCity("");
                    }}
                    placeholder="Válassz országot…"
                    options={ecotrips.map((c) => c.country)}
                    type="country"
                  />
                </div>
              </div>

              <div className="filter-field">
                <label>Város</label>
                <div className="filter-input-wrapper">
                  <CustomSelect
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="Válassz várost…"
                    options={cities}
                    type="city"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container my-5">
            {ecotrips
              .filter((country) =>
                selectedCountry ? country.country === selectedCountry : true
              )
              .map((country) => {
                const filteredHotels = selectedCity
                  ? country.hotels.filter((h) => h.city === selectedCity)
                  : country.hotels;

                const pos = positions[country.country] || 0;

                let cardsPerView = 4;
                if (window.innerWidth <= 992 && window.innerWidth > 576)
                  cardsPerView = 2;
                if (window.innerWidth <= 576) cardsPerView = 1;

                const cardWidthPercent = 100 / cardsPerView;
                const maxPos = Math.max(0, filteredHotels.length - cardsPerView);
                const movePercent = -(pos * cardWidthPercent);

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
                        onClick={() =>
                          moveSlide(country.country, -1, filteredHotels.length)
                        }
                        disabled={pos === 0}
                      >
                        ❮
                      </button>

                      <div className="slider-container">
                        <div
                          className="slider-track"
                          style={{ transform: `translateX(${movePercent}%)` }}
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
                        onClick={() =>
                          moveSlide(country.country, 1, filteredHotels.length)
                        }
                        disabled={pos >= maxPos}
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

export default EcoTrip;