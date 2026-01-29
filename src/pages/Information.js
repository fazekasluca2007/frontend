import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Information.css";

export default function Information() {
  const URL = process.env.REACT_APP_BACKEND_URL;

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
      fetch(URL + `Trips/detailed/${trip_id}`)
        .then(res => res.json())
        .then(data => setData(Array.isArray(data) ? data[0] : data))
        .catch(() => setError(true));
    } else if (ecotrip_id) {
      fetch(URL + `EcoTrip/detailed/${ecotrip_id}`)
        .then(res => res.json())
        .then(data => setData(Array.isArray(data) ? data[0] : data))
        .catch(() => setError(true));
    }
  }, [trip_id, ecotrip_id]);

  useEffect(() => {
    document.title = "EcoTrip – Információk";
  }, []);

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
              <div className="thumbnail-row">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`/${img}`}
                    alt={`Thumbnail ${idx}`}
                    className={`thumbnail ${currentImage === idx ? "active" : ""}`}
                    onClick={() => setCurrentImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <h2 className="mb-3 custom-border pb-2">
            {data.city} – {data.hotel_name}
          </h2>

          <p className="stars">
            {"★".repeat(data.stars)}
          </p>

          {data.long_description && <p>{data.long_description}</p>}

          <h5 className="mt-4">Foglalás</h5>

          <div className="d-flex gap-3 align-items-end">
            <div className="booking-input">
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

            <div className="booking-input">
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
              className="btn btn-primary btn-lg"
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