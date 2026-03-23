import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Information.css";
import axios from "axios";

export default function Information() {
  {/* Backend URL és navigáció */ }
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();

  {/* Változók */ }
  const tripId = location.state?.trip_id;
  const ecoTripId = location.state?.ecotrip_id;
  const [hotelData, setHotelData] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  {/* Képek listája */ }
  const images = hotelData ? [hotelData.main_image, ...(hotelData.gallery_images || [])] : [];

  {/* Szálloda adatainak lekérése API-ból, bejelentkezési státusz ellenőrzése */ }
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("user") !== null);

    if (tripId) {
      axios
        .get(`${backendUrl}Trips/detailed/${tripId}`)
        .then((response) => setHotelData(Array.isArray(response.data) ? response.data[0] : response.data))
        .catch(() => setHasError(true));
    } else if (ecoTripId) {
      axios
        .get(`${backendUrl}EcoTrip/detailed/${ecoTripId}`)
        .then((response) => setHotelData(Array.isArray(response.data) ? response.data[0] : response.data))
        .catch(() => setHasError(true));
    }
  }, [tripId, ecoTripId, backendUrl]);

  {/* Oldal böngészőcímének beállítása */ }
  useEffect(() => {
    document.title = "EcoTrip – Információk";
  }, []);

  {/* Foglalás kezelése */ }
  const handleBookingClick = () => {
    if (!hotelData) return;

    if (!isLoggedIn) {
      toast.error("A foglaláshoz jelentkezzen be!");
      return;
    } navigate("/foglalas", {
      state: { trip_id: tripId, ecotrip_id: ecoTripId },
    });
  };

  {/* Szöveg feldolgozása  */ }
  const capitalizeFirst = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const getDestination = (route) => {
    const parts = route.split("_");
    return capitalizeFirst(parts[parts.length - 1]);
  };

  const getRouteInfo = (route) => {
    const parts = route.split("_");
    return parts.slice(0, -1).map(capitalizeFirst).join(" ");
  };

  {/* Betöltés és hibaüzenetek */}
  if (hasError) return <p>Hiba történt az adatok betöltésekor.</p>;
  if (!hotelData) return <p>Adatok betöltése...</p>;

  {/* Szálloda információ és képgaléria */ }
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={`/${images[activeImageIndex]}`}
                  alt={hotelData.hotel_name}
                  className="w-100 rounded shadow"
                />
              </div>

              {images.length > 1 && (
                <div className="thumbnail-row">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`/${img}`}
                      alt={`Thumbnail ${idx}`}
                      className={`thumbnail ${activeImageIndex === idx ? "active" : ""}`}
                      onClick={() => setActiveImageIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <h2 className="mb-3 custom-border pb-2">
              {hotelData.city} – {hotelData.hotel_name}
            </h2>

            <div className="review-stars mb-3">
              {Array.from({ length: hotelData.stars }).map((_, i) => (
                <i key={i} className="bi bi-star-fill review-star"></i>
              ))}
            </div>

            {hotelData.long_description && <p>{hotelData.long_description}</p>}

            {hotelData.routes && (
              <>
                <h5 className="mt-4">Úticélok:</h5>

                <div className="accordion" id="routesAccordion">
                  {(Array.isArray(hotelData.routes)
                    ? hotelData.routes
                    : hotelData.routes.split(",")
                  ).map((route, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#route-${index}`}
                        >
                          <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                          {getDestination(route.trim())}
                        </button>
                      </h2>

                      <div
                        id={`route-${index}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#routesAccordion"
                      >
                        <div className="accordion-body">
                          <p>
                            <strong>
                              <i className="bi bi-buildings text-success"></i>{" "}
                              Hotel:
                            </strong>{" "}
                            {hotelData.hotel_name}
                          </p>
                          <p>
                            <strong>
                              <i className="bi bi-signpost-2 text-warning"></i>{" "}
                              Útvonal:
                            </strong>{" "}
                            {getRouteInfo(route.trim())}
                          </p>
                          <p>
                            <strong>
                              <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                              Végállomás:
                            </strong>{" "}
                            {getDestination(route.trim())}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <hr className="my-4" />

            <button
              className="btn btn-primary btn-lg"
              onClick={handleBookingClick}
            >
              Kezdje el a foglalást
            </button>
          </div>
        </div>
      </div>
    </>
  );
}