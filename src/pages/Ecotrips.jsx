import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import "react-toastify/dist/ReactToastify.css";
import "./Ecotrips.css";
import Trip_card from "./components/Trip_card.jsx";
import CustomSelect from "./components/CustomSelect.jsx";

export default function Ecotrips() {
  {/* Backend és navigáció */}
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  {/* Állapotok: utak, kiválasztott ország/város, slider , betöltés/hiba */}
  const [trips, setTrips] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sliderPositions, setSliderPositions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  {/* Oldal böngészőcímének beállítása és tetejére ugrás */ }
  useEffect(() => {
    document.title = "EcoTrip – Ökoútjaink";
    window.scrollTo(0, 0);
  }, []);

  {/* Ecotrips adatok lekérése a backendről */}
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${backendUrl}EcoTrip/ecotripcards`)
      .then((response) => {
        setTrips(response.data.result);
        setHasError(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load ecotrips:", err.message);
        setHasError(true);
        setIsLoading(false);
      });
  }, [backendUrl]);

  {/* Ha város változik, automatikusan beállítja a hozzá tartozó országot */}
  useEffect(() => {
    if (!selectedCity) return;
    const matchingCountry = trips.find((c) =>
      c.hotels.some((h) => h.city === selectedCity)
    )?.country;
    if (matchingCountry && matchingCountry !== selectedCountry) {
      setSelectedCountry(matchingCountry);
    }
  }, [selectedCity, trips]);

  {/* Slider pozíciók beállítása a kiválasztott ország/város szerint */}
  useEffect(() => {
    if (selectedCountry) {
      setSliderPositions((prev) => ({ ...prev, [selectedCountry]: 0 }));
    } else {
      const reset = {};
      trips.forEach((c) => (reset[c.country] = 0));
      setSliderPositions(reset);
    }
  }, [selectedCountry, selectedCity, trips]);

 
  const getCardsPerView = useCallback(() => {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 4;
  }, []);

  {/* Lépteti a megjelenített kártyák pozícióját */}
  const moveSlide = useCallback((country, step, hotelCount) => {
    const cardsPerView = getCardsPerView();
    const maxPos = Math.max(0, hotelCount - cardsPerView);
    setSliderPositions((prev) => {
      const current = prev[country] || 0;
      const next = Math.max(0, Math.min(current + step, maxPos));
      return { ...prev, [country]: next };
    });
  }, [getCardsPerView]);

  {/* Elérhető városok megjelenítése a kiválasztott országtól függően */}
  const availableCities = selectedCountry
    ? [...new Set(trips.find((c) => c.country === selectedCountry)?.hotels.map((h) => h.city) || [])]
    : [...new Set(trips.flatMap((c) => c.hotels.map((h) => h.city)))];

  {/* Foglalás indítása: ellenőrzi a bejelentkezést, majd navigál */}
  const handleHotelClick = (hotel) => {
    if (!localStorage.getItem("user")) {
      toast.info("A foglaláshoz kérem jelentkezzen be!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    navigate("/informaciok", { state: { ecotrip_id: hotel.id } });
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />

      {/* Betöltés jelzése */}
      {isLoading && (
        <div className="d-flex justify-content-center my-5">
          <BeatLoader color="#a87c5c" size={15} />
        </div>
      )}

      {/* Hibaüzenet megjelenítése, ha a lekérés meghiúsul */}
      {hasError && (
        <p className="error text-center my-4">
          Hiba az adatok lekérése során. Kérjük, próbálja újra később.
        </p>
      )}

      {!hasError && !isLoading && (
        <>
          {/* Szűrő: ország és város választó */}
          <div className="eco-filter container my-4">
            <div className="eco-filter-inner">
              <h2 className="eco-filter-title">Válassza ki az úticélját!</h2>

              <div className="eco-filter-field">
                <label>Ország</label>
                <div className="eco-filter-input-wrapper">
                  <CustomSelect
                    value={selectedCountry}
                    onChange={(val) => {
                      setSelectedCountry(val);
                      setSelectedCity("");
                    }}
                    placeholder="Válassz országot…"
                    options={trips.map((c) => c.country)}
                    type="country"
                  />
                </div>
              </div>

              <div className="eco-filter-field">
                <label>Város</label>
                <div className="eco-filter-input-wrapper">
                  <CustomSelect
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="Válassz várost…"
                    options={availableCities}
                    type="city"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Országok és szállások listázása */}
          <div className="eco-container container my-5">
            {trips
              .filter((c) => (selectedCountry ? c.country === selectedCountry : true))
              .map((country) => {
                const filteredHotels = selectedCity
                  ? country.hotels.filter((h) => h.city === selectedCity)
                  : country.hotels;

                const pos = sliderPositions[country.country] || 0;
                const cardsPerView = getCardsPerView();
                const cardWidthPercent = 100 / cardsPerView;
                const maxPos = Math.max(0, filteredHotels.length - cardsPerView);
                const movePercent = -(pos * cardWidthPercent);

                return (
                  <div key={country.country} className="my-5">
                    <div className="eco-country-banner d-flex align-items-center mb-4">
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
                        onClick={() => moveSlide(country.country, -1, filteredHotels.length)}
                        disabled={pos === 0}
                      >
                        <i className="bi bi-chevron-left"></i>
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
                              onClick={() => handleHotelClick(hotel)}
                              isEco={true}
                            />
                          ))}
                        </div>
                      </div>                      <button
                        className="slider-btn right"
                        onClick={() => moveSlide(country.country, 1, filteredHotels.length)}
                        disabled={pos >= maxPos}
                      >
                        <i className="bi bi-chevron-right"></i>
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
}