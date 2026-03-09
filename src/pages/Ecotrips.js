import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import "react-toastify/dist/ReactToastify.css";
import "./Ecotrips.css";
import Trip_card from "./components/Trip_card";
import CustomSelect from "./components/CustomSelect";

export default function Ecotrips() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sliderPositions, setSliderPositions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    document.title = "EcoTrip – Ökoútjaink";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(backendUrl + "EcoTrip/ecotripcards")
      .then((res) => res.json())
      .then((json) => {
        setTrips(json.result);
        setHasError(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setHasError(true);
        setIsLoading(false);
      });
  }, [backendUrl]);

  useEffect(() => {
    if (!selectedCity) return;
    const matchingCountry = trips.find((c) =>
      c.hotels.some((h) => h.city === selectedCity)
    )?.country;
    if (matchingCountry && matchingCountry !== selectedCountry) {
      setSelectedCountry(matchingCountry);
    }
  }, [selectedCity, trips]);

  useEffect(() => {
    if (selectedCountry) {
      setSliderPositions((prev) => ({ ...prev, [selectedCountry]: 0 }));
    } else {
      const reset = {};
      trips.forEach((c) => (reset[c.country] = 0));
      setSliderPositions(reset);
    }
  }, [selectedCountry, selectedCity, trips]);

  const getCardsPerView = () => {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 4;
  };

  const moveSlide = (country, step, hotelCount) => {
    const cardsPerView = getCardsPerView();
    const maxPos = Math.max(0, hotelCount - cardsPerView);
    setSliderPositions((prev) => {
      const current = prev[country] || 0;
      const next = Math.max(0, Math.min(current + step, maxPos));
      return { ...prev, [country]: next };
    });
  };

  const getAvailableCities = () => {
    if (selectedCountry) {
      const country = trips.find((c) => c.country === selectedCountry);
      return [...new Set(country?.hotels.map((h) => h.city) || [])];
    }
    return [...new Set(trips.flatMap((c) => c.hotels.map((h) => h.city)))];
  };

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

  const cities = getAvailableCities();

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />

      {(isLoading || hasError) && (
        <div className="d-flex justify-content-center my-5">
          <BeatLoader color="#a87c5c" size={15} />
        </div>
      )}

      {hasError && (
        <p className="error text-center my-4">
          Hiba az adatok lekérése során. Kérjük, próbálja újra később.
        </p>
      )}

      {!hasError && !isLoading && (
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
                    options={trips.map((c) => c.country)}
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
                        onClick={() => moveSlide(country.country, -1, filteredHotels.length)}
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
                              onClick={() => handleHotelClick(hotel)}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        className="slider-btn right"
                        onClick={() => moveSlide(country.country, 1, filteredHotels.length)}
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
}