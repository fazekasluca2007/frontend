import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Information.css";

export default function Information() {
  const location = useLocation();
  const hotel = location.state?.hotel;

  const [napok, setNapok] = useState(1);
  const [fo, setFo] = useState(1);

  useEffect(() => {
    document.title = "EcoTrip – Információk";
  }, []);

  return (
    <div>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            {hotel && (
              <img src={hotel.img} alt={hotel.name} className="w-100 rounded shadow" />
            )}
          </div>

          <div className="col-lg-6">

            {hotel && (
              <>
                <h2 className="mb-3 border-bottom pb-2">
                  {hotel.city} – {hotel.name}
                </h2>

                <p><strong>{"★".repeat(hotel.stars)}</strong></p>

                {hotel.description && <p>{hotel.description}</p>}

                {hotel.services && (
                  <>
                    <h5 className="mt-4">Szolgáltatások:</h5>
                    <ul>
                      {hotel.services.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
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
                  value={napok}
                  onChange={(e) => setNapok(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="form-label">Hány főre:</label>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  value={fo}
                  onChange={(e) => setFo(Number(e.target.value))}
                />
              </div>

              <Link 
                to="/foglalas"
                state={{ hotel, napok, fo }}
              >
                <button className="btn btn-primary btn-lg mt-2">Foglalás</button>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
