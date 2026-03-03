import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInCalendarDays } from "date-fns";
import { ca, hu } from "date-fns/locale";
import "./Booking.css";

export default function Booking({user}) {
  const location = useLocation();
  const navigate = useNavigate();

  const trip_id = location.state?.trip_id;
  const ecotrip_id = location.state?.ecotrip_id;

  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fo, setFo] = useState(location.state?.fo ?? 1);
  const [napok, setNapok] = useState(location.state?.napok ?? 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+36 ");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [errors, setErrors] = useState({});

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sendBookingEmail = async () => {
    try {

      const paymentLabels = {
        "bankkártya": "Bankkártya",
        "szép kártya": "SZÉP kártya",
        "készpénz": "Készpénz"
      };

      await fetch("https://localhost:7267/api/Mail", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          to: email,
          subject: "Foglalás visszaigazolás - EcoTrip 🌱",
          body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2e7d32;">Sikeres foglalás! 🌿</h2>

            <p>Kedves <strong>${fullName}</strong>!</p>

            <p>A foglalása sikeresen rögzítésre került.</p>

            <ul>
              <li><strong>Szállás:</strong> ${hotel.hotel_name}</li>
              <li><strong>Város:</strong> ${hotel.city}</li>
              <li><strong>Érkezés:</strong> ${formatDateLocal(startDate)}</li>
              <li><strong>Távozás:</strong> ${formatDateLocal(endDate)}</li>
              <li><strong>Fő:</strong> ${fo}</li>
              <li><strong>Éjszakák:</strong> ${napok}</li>
              <li><strong>Fizetési mód:</strong> ${paymentLabels[paymentMethod]}</li>
              <li><strong>Teljes összeg:</strong> ${paymentMethod == "készpénz" ? totalWithCashFee : totalPrice} Ft</li>
            </ul>

            <p>Üdvözlettel,<br/>EcoTrip</p>
          </div>
        `,
        }),
      });
    } catch (err) {
      console.error("Email küldési hiba:", err);
    }
  };

  const formatHungarianPhone = (value) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("36")) digits = digits.slice(2);
    digits = digits.slice(0, 9);
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 5);
    const part3 = digits.slice(5, 9);
    let formatted = "+36";
    if (part1) formatted += " " + part1;
    if (part2) formatted += " " + part2;
    if (part3) formatted += " " + part3;
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const raw = formatHungarianPhone(e.target.value);
    setPhone(raw);
  };

  const getRawPhone = () =>
    phone.replace(/\D/g, "").startsWith("36")
      ? "+" + phone.replace(/\D/g, "")
      : "+36" + phone.replace(/\D/g, "");

  const isPhoneValid = () => {
    const raw = getRawPhone().replace("+36", "");
    return raw.length === 9;
  }

  const formatCardNumber = (value) => {
    let digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardChange = (e) => setCardNumber(formatCardNumber(e.target.value));

  const isCardValid = () => {
    return cardNumber.replace(/\s/g,"").length === 16;
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    setExpiry(value);
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvc(value);
  };

  const handlePaymentChange = (e) => setPaymentMethod(e.target.value);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      let diff = differenceInCalendarDays(end, start);
      if (diff > 20) {
        toast.error("Maximum 20 napot választhat!");
        setEndDate(null);
        setNapok(1);
      } else setNapok(diff);
    }
  };

  useEffect(() => {
    document.title = "EcoTrip – Foglalás";
  }, []);

  useEffect(() => {
    if (trip_id) {
      fetch(`https://localhost:7267/api/Trips/detailed/${trip_id}`)
        .then((res) => res.json())
        .then((data) => setHotel(Array.isArray(data) ? data[0] : data))
        .catch(() => setError(true));
    } else if (ecotrip_id) {
      fetch(`https://localhost:7267/api/EcoTrip/detailed/${ecotrip_id}`)
        .then((res) => res.json())
        .then((data) => setHotel(Array.isArray(data) ? data[0] : data))
        .catch(() => setError(true));
    }
  }, [trip_id, ecotrip_id]);

  useEffect(() => {
    if (user && user.user) {
      setFullName(user.user.fullName || "");
      setEmail(user.user.email || "");
    }
  }, [user])

  if (error) return <p>Hiba történt az adatok betöltésekor.</p>;
  if (!hotel) return <p>Adatok betöltése...</p>;

  const totalPrice = hotel.price * napok * fo;

  const depositAmount = Math.round(totalPrice * 0.5)
  const cashFeePercent = 0.88;
  const cashFee = Math.round(totalPrice * cashFeePercent);
  const totalWithCashFee = totalPrice + cashFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Kérjük a teljes nevét adja meg!";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Érvényes email címet adjon meg!";
    if (!getRawPhone().match(/^\+36(20|30|31|50|70)\d{7}$/))
      newErrors.phone = "Érvényes magyar mobil szám szükséges! (+36 70 123 4567)";
    if (!startDate || !endDate) newErrors.date = "Válassza ki a dátumtartományt!";

    if (paymentMethod === "bankkártya" || paymentMethod === "szép kártya") {
      if (!isCardValid()) newErrors.cardNumber = "16 számjegyű kártyaszám szükséges!";
      if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiry = "Érvényes formátum: MM/ÉÉ";
      if (!cvc.match(/^\d{3}$/)) newErrors.cvc = "3 számjegyű CVC szükséges!";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    const finalAmount = paymentMethod === "készpénz" ? totalWithCashFee : depositAmount

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7267/api/Bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tripId: trip_id ?? ecotrip_id,
          seats: fo,
          days: napok,
          startDate: formatDateLocal(startDate),
          endDate: formatDateLocal(endDate),
          paymentType: paymentMethod,
          fullName,
          email,
          phone: getRawPhone(),
          cardNumber: paymentMethod !== "készpénz"
            ? cardNumber.replace(/\s/g, "")
            : null,
          expiry,
          cvc,
        }),
      });

      if (!response.ok) throw new Error();
      await sendBookingEmail();
      toast.success("Sikeres foglalás! Visszaigazoló email elküldve.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        onClose: () => {
          setIsSubmitting(false);
          navigate("/");
        },
      });
    } catch {
      toast.error("Hiba történt a foglalás során!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        onClose: () => setIsSubmitting(false),
      });
    }
  };

  return (
    <div>
      <ToastContainer theme="colored" />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 p-4 rounded shadow booking-card">
            <h2 className="mb-4 text-center border-bottom pb-3">Foglalási adatok</h2>
            <h3 className="text-center mb-4">{hotel.city} – {hotel.hotel_name}</h3>

            <p><strong>Fő / Éj:</strong> {fo} / {napok}</p>
            <p><strong>Fő / éj ár:</strong> {hotel.price} Ft</p>
            <p className="fs-5"><strong>Teljes összeg:</strong> {" "}{paymentMethod == "készpénz" ? totalWithCashFee : totalPrice} Ft</p>
            <p className="text-muted fst-italic mt-2">A feltüntetett árak már tartalmazzák az oldalunk szolgáltatási díjait.</p>

            <hr className="my-4" />
            <form onSubmit={handleSubmit}>
              <label className="form-label">Dátum kiválasztása:</label>
              <div className="mb-4">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  minDate={new Date()}
                  locale={hu}
                />
                <p className="mt-2">{napok} éjszaka</p>
                <div className="text-danger">{errors.date}</div>
              </div>

              <div className="mb-4">
                <label className="form-label">Fő:</label>
                <div className="fo-spinner">
                  <button type="button" className="btn-minus" onClick={() => setFo(prev => (prev > 1 ? prev - 1 : 1))}>−</button>
                  <input type="text" readOnly className="form-control fo-input" value={fo} />
                  <button type="button" className="btn-plus" onClick={() => setFo(prev => (prev < 10 ? prev + 1 : 10))}>+</button>
                </div>
              </div>

              <hr className="my-4" />
              <h4 className="mb-3">Személyes adatok</h4>

              <div className="mb-3">
                <label className="form-label">Teljes név</label>
                <input type="text" className={`form-control ${errors.fullName ? "is-invalid" : ""}`} placeholder="Teljes név" value={fullName} onChange={e => setFullName(e.target.value)} />
                <div className="invalid-feedback">{errors.fullName}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="ecotripmail@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Telefon</label>
                <input type="tel" className={`form-control ${errors.phone ? "is-invalid" : ""}`} placeholder="+36 70 123 4567" value={phone} onChange={handlePhoneChange} maxLength={15} />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>

              <h4 className="mt-4 mb-3">Fizetési mód</h4>

              <div className="mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="bankkártya" checked={paymentMethod === "bankkártya"} onChange={handlePaymentChange} />
                  <label className="form-check-label">Bankkártya</label>
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="szép kártya" checked={paymentMethod === "szép kártya"} onChange={handlePaymentChange} />
                  <label className="form-check-label">SZÉP kártya</label>
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="készpénz" checked={paymentMethod === "készpénz"} onChange={handlePaymentChange} />
                  <label className="form-check-label">Készpénz</label>
                </div>
              </div>

              {(paymentMethod === "bankkártya" || paymentMethod === "szép kártya") && (
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Kártyaszám</label>
                    <input type="text" className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`} value={cardNumber} onChange={handleCardChange} maxLength={19} />
                    <div className="invalid-feedback">{errors.cardNumber}</div>
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">MM/ÉÉ</label>
                    <input type="text" className={`form-control ${errors.expiry ? "is-invalid" : ""}`} value={expiry} onChange={handleExpiryChange} maxLength={5} />
                    <div className="invalid-feedback">{errors.expiry}</div>
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">CVC</label>
                    <input type="text" className={`form-control ${errors.cvc ? "is-invalid" : ""}`} value={cvc} onChange={handleCvcChange} maxLength={3} />
                    <div className="invalid-feedback">{errors.cvc}</div>
                  </div>
                </div>
              )}

              {(paymentMethod === "bankkártya" || paymentMethod === "szép kártya") && (
                <div className="alert alert-info mt-3">
                  A foglalás véglegesítéséhez <strong>50% előleg</strong> fizetése szükséges.
                  <br />
                  Fizetendő előleg összege: <strong>{depositAmount} Ft</strong>
                </div>
              )}

              {paymentMethod === "készpénz" && (
                <div className="alert alert-info mt-3">
                  Készpénzes fizetés esetén <strong>8% kezelési díjat</strong> számítunk fel, ami a helyszínen kerül kifizetésre.
                  <br />
                  Kezelési díj: <strong>{cashFee} Ft</strong>
                  <br />
                  Fizetendő végösszeg: <strong>{totalWithCashFee} Ft</strong>
                </div>
              )}

              {isSubmitting ? (
                <div className="d-flex justify-content-center mt-4">
                  <DotLoader color="#7dbf7d" size={50} />
                </div>
              ) : (
                <button className="btn btn-success btn-lg w-100 mt-4">Foglalás megerősítése</button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}