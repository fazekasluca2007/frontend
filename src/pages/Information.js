import React, { useEffect, useState } from "react";
import "./Information.css";
import Nav from './components/Nav';
import Footer from './components/Footer';

const firstHotel = {
  city: "Budapest",
  name: "Aria Hotel",
  stars: 5,
  img: "img/utjaink kepek/hu_ariahotel.jpg",
  description:
    "Az Aria Hotel Budapest szívében, a Szent István Bazilika mellett található luxusszálloda, mely zenei tematikájával és tetőteraszáról nyíló kilátásával páratlan élményt kínál.",
  services: [
    "Wellness & spa",
    "Tetőterasz",
    "Éttermek",
    "Ingyenes Wi-Fi",
    "Fitneszterem",
  ],
  price: 65000,
};

export default function SzallasOldal() {
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
          <img src={firstHotel.img} alt={firstHotel.name} className="w-100 rounded shadow" />
        </div>

        <div className="col-lg-6">
          <h2 className="mb-3 border-bottom pb-2">{firstHotel.city} – {firstHotel.name}</h2>
          <p><strong>{"★".repeat(firstHotel.stars)}</strong></p>
          <p>{firstHotel.description}</p>

          <h5 className="mt-4">Szolgáltatások:</h5>
          <ul>
            {firstHotel.services.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>

          <h5 className="mt-4">Foglalás</h5>
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="form-label">Hány napra:</label>
              <input
                type="number"
                className="form-control"
                value={napok}
                min={1}
                onChange={(e) => setNapok(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Hány főre:</label>
              <input
                type="number"
                className="form-control"
                value={fo}
                min={1}
                onChange={(e) => setFo(e.target.value)}
              />
            </div>

            <button className="btn btn-primary btn-lg mt-2">Foglalás</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
