import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Information.css";

export default function Information() {
  const location = useLocation();
  const trip_id = location.state?.trip_id;
  const ecotrip_id = location.state?.ecotrip_id;

  const [data, setData] = useState(null);
  const [napok, setNapok] = useState(1);
  const [fo, setFo] = useState(1);

  const [error, setError] = useState(false);



  //Tripek betöltése
  useEffect(() => {
    if (trip_id) {
      fetch(`https://localhost:7267/api/Trips/detailed/${trip_id}`)
        .then(res => res.json())
        .then(setData)
        .catch(() => setError(true));
    }
    else if (ecotrip_id) {
      fetch(`https://localhost:7267/api/EcoTrip/detailed/${ecotrip_id}`)
        .then(res => res.json())
        .then(setData)
        .catch(() => setError(true));
    }
    else {
      console.log("Nincs ID");
    }
  }, [trip_id, ecotrip_id]);



  useEffect(() => {
    document.title = "EcoTrip – Információk";
  }, []);

  const handleNapokChange = (e) => {
    const value = Number(e.target.value);
    if (value > 10) {
      setNapok(10);
    } else if (value < 1) {
      setNapok(1);
    } else {
      setNapok(value);
    }
  };

  const handleFoChange = (e) => {
    const value = Number(e.target.value);
    if (value > 10) {
      setFo(10);
    } else if (value < 1) {
      setFo(1);
    } else {
      setFo(value);
    }
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            {data && (
              <img
                src={data.image_url}
                alt={data.hotel_name}
                className="w-100 rounded shadow"
              />
            )}
          </div>

          <div className="col-lg-6">
            {data && (
              <>
                <h2 className="mb-3 border-bottom pb-2">
                  {data.city} – {data.hotel_name}
                </h2>

                <p>
                  <strong>{"★".repeat(data.stars)}</strong>
                </p>

                {data.long_description && <p>{data.long_description}</p>}

                {data.services && (
                  <>
                    <h5 className="mt-4">Szolgáltatások:</h5>
                    <p>{data.services}</p>
                  </>
                )}
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

              <Link to="/foglalas" state={{ data, napok, fo }}>
                <button className="btn btn-primary btn-lg mt-2">
                  Foglalás
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
