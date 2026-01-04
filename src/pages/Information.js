import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Information.css";

export default function Information() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const trip_id = location.state?.trip_id;
  const ecotrip_id = location.state?.ecotrip_id;

  const [data, setData] = useState(null);
  const [napok, setNapok] = useState(1);
  const [fo, setFo] = useState(1);
  const [error, setError] = useState(false);

  const images = data ? [data.main_image, ...(data.gallery_images || [])] : [];

  useEffect(() => {
    if (trip_id) {
      fetch(`https://localhost:7267/api/Trips/detailed/${trip_id}`)
        .then(res => res.json())
        .then(data => setData(Array.isArray(data) ? data[0] : data))
        .catch(() => setError(true));
    } else if (ecotrip_id) {
      fetch(`https://localhost:7267/api/EcoTrip/detailed/${ecotrip_id}`)
        .then(res => res.json())
        .then(data => setData(Array.isArray(data) ? data[0] : data))
        .catch(() => setError(true));
    }
  }, [trip_id, ecotrip_id]);

  useEffect(() => {
    document.title = "EcoTrip – Információk";
  }, []);

  const formatWord = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const getDestinationFromRoute = (route) => {
    const parts = route.split("_");
    return formatWord(parts[parts.length - 1]);
  };

  const getRouteInfoFromRoute = (route) => {
    const parts = route.split("_");
    return parts
      .slice(0, -1)
      .map(formatWord)
      .join(" ");
  };

  const handleNapokChange = (e) => {
    const value = Number(e.target.value);
    setNapok(value < 1 ? 1 : value > 10 ? 10 : value);
  };

  const handleFoChange = (e) => {
    const value = Number(e.target.value);
    setFo(value < 1 ? 1 : value > 10 ? 10 : value);
  };

  const handleBooking = () => {
    if (!data) return;

    navigate("/foglalas", {
      state: { trip_id, ecotrip_id, napok, fo }
    });
  };

  if (error) return <p>Hiba történt az adatok betöltésekor.</p>;
  if (!data) return <p>Adatok betöltése...</p>;

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="image-gallery">
            <div className="main-image">
              <img
                src={`/${images[currentImage]}`}
                alt={data.hotel_name}
                className="w-100 rounded shadow"
              />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-row mt-2 d-flex gap-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`/${img}`}
                    alt={`Thumbnail ${idx}`}
                    className={`thumbnail rounded ${currentImage === idx ? "active" : ""}`}
                    onClick={() => setCurrentImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <h2 className="mb-3 border-bottom pb-2">
            {data.city} – {data.hotel_name}
          </h2>

          <p><strong>{"★".repeat(data.stars)}</strong></p>
          {data.long_description && <p>{data.long_description}</p>}

          {data.services && (
            <>
              <h5 className="mt-4">Szolgáltatások:</h5>
              <p>{data.services}</p>
            </>
          )}

          {data.routes && (
            <>
              <h5 className="mt-4">Úticélok:</h5>
              <div className="accordion" id="routesAccordion">
                {(Array.isArray(data.routes) ? data.routes : data.routes.split(",")).map((route, index) => (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#route-${index}`}
                      >
                        📍 {getDestinationFromRoute(route.trim())}
                      </button>
                    </h2>

                    <div
                      id={`route-${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#routesAccordion"
                    >
                      <div className="accordion-body">
                        <p><strong>🏨 Hotel:</strong> {data.hotel_name}</p>
                        <p><strong>🛣️ Útvonal:</strong> {getRouteInfoFromRoute(route.trim())}</p>
                        <p><strong>📍 Végállomás:</strong> {getDestinationFromRoute(route.trim())}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h5 className="mt-4">Foglalás</h5>
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="form-label">Hány napra:</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={10}
                value={napok}
                onChange={handleNapokChange}
              />
            </div>

            <div>
              <label className="form-label">Hány főre:</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={10}
                value={fo}
                onChange={handleFoChange}
              />
            </div>

            <button
              className="btn btn-primary btn-lg mt-2"
              onClick={handleBooking}
            >
              Foglalás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
