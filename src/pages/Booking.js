import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, napok, fo } = location.state || {};
  const totalPrice = hotel ? hotel.price * napok * fo : 0;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({});

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiry(value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 15) value = value.slice(0, 15);
    setPhone(value);
  };

  const handleCardChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    setCardNumber(value);
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvc(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Kérlek add meg a keresztneved!";
    if (!lastName.trim()) newErrors.lastName = "Kérlek add meg a vezetékneved!";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Érvényes email címet adj meg!";
    if (!phone.match(/^\d{7,15}$/)) newErrors.phone = "Érvényes telefonszámot adj meg!";
    if (!cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = "16 számjegyű kártyaszám szükséges!";
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiry = "Érvényes formátum: MM/ÉÉ";
    if (!cvc.match(/^\d{3}$/)) newErrors.cvc = "3 számjegyű CVC szükséges!";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Sikeres foglalás! Köszönjük, hogy nálunk foglaltál.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setErrors({});
      navigate("/");
    }
  };

  if (!hotel) return <p>Nincs elérhető foglalási adat.</p>;

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 p-4 rounded shadow booking-card">
            <h2 className="mb-4 text-center border-bottom pb-3">Foglalási adatok</h2>
            <h3 className="text-center mb-4">{hotel.city} – {hotel.name}</h3>
            <div className="mb-3">
              <p><strong>Fő:</strong> {fo}</p>
              <p><strong>Éj:</strong> {napok}</p>
            </div>
            <p><strong>Ár / éj:</strong> {hotel.price} Ft</p>
            <p className="fs-5"><strong>Teljes összeg:</strong> {totalPrice} Ft</p>
            <hr className="my-4" />
            <form onSubmit={handleSubmit}>
              <h4 className="mb-3">Személyes adatok</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Keresztnév</label>
                  <input type="text" className={`form-control ${errors.firstName ? "is-invalid" : ""}`} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <div className="invalid-feedback">{errors.firstName}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Vezetéknév</label>
                  <input type="text" className={`form-control ${errors.lastName ? "is-invalid" : ""}`} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <div className="invalid-feedback">{errors.lastName}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Telefonszám</label>
                  <input type="tel" className={`form-control ${errors.phone ? "is-invalid" : ""}`} value={phone} onChange={handlePhoneChange} maxLength={15} />
                  <div className="invalid-feedback">{errors.phone}</div>
                </div>
              </div>
              <h4 className="mt-4 mb-3">Fizetési adatok</h4>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label">Kártyaszám</label>
                  <input type="text" className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`} value={cardNumber} onChange={handleCardChange} maxLength={16} />
                  <div className="invalid-feedback">{errors.cardNumber}</div>
                </div>
                <div className="col-md-2">
                  <label className="form-label">MM/ÉÉ</label>
                  <input type="text" className={`form-control ${errors.expiry ? "is-invalid" : ""}`} value={expiry} onChange={handleExpiryChange} placeholder="MM/YY" maxLength={5} />
                  <div className="invalid-feedback">{errors.expiry}</div>
                </div>
                <div className="col-md-2">
                  <label className="form-label">CVC</label>
                  <input type="text" className={`form-control ${errors.cvc ? "is-invalid" : ""}`} value={cvc} onChange={handleCvcChange} maxLength={3} />
                  <div className="invalid-feedback">{errors.cvc}</div>
                </div>
              </div>
              <button className="btn btn-success btn-lg w-100 mt-4" type="submit">Foglalás megerősítése</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
