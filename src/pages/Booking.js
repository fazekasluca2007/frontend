import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInCalendarDays } from "date-fns";
import { hu } from "date-fns/locale";
import "./Booking.css";

const COUNTRY_CODES = [
  { name: "Magyarország", code: "+36", format: [2, 3, 4], example: "70 123 4567" },
  { name: "Ausztria", code: "+43", format: [3, 3, 3], example: "664 123 456" },
  { name: "Belgium", code: "+32", format: [3, 2, 2, 2], example: "470 12 34 56" },
  { name: "Bulgária", code: "+359", format: [2, 3, 4], example: "87 123 4567" },
  { name: "Horvátország", code: "+385", format: [2, 3, 4], example: "91 234 5678" },
  { name: "Ciprus", code: "+357", format: [2, 3, 3], example: "96 123 456" },
  { name: "Csehország", code: "+420", format: [3, 3, 3], example: "601 123 456" },
  { name: "Dánia", code: "+45", format: [2, 2, 2, 2], example: "20 12 34 56" },
  { name: "Észtország", code: "+372", format: [4, 4], example: "5123 4567" },
  { name: "Finnország", code: "+358", format: [2, 3, 4], example: "40 123 4567" },
  { name: "Franciaország", code: "+33", format: [1, 2, 2, 2, 2], example: "6 12 34 56 78" },
  { name: "Németország", code: "+49", format: [3, 4, 4], example: "151 2345 6789" },
  { name: "Görögország", code: "+30", format: [3, 3, 4], example: "691 234 5678" },
  { name: "Írország", code: "+353", format: [2, 3, 4], example: "85 123 4567" },
  { name: "Olaszország", code: "+39", format: [3, 3, 4], example: "312 345 6789" },
  { name: "Lettország", code: "+371", format: [2, 3, 3], example: "21 234 567" },
  { name: "Litvánia", code: "+370", format: [3, 5], example: "612 34567" },
  { name: "Luxemburg", code: "+352", format: [3, 3, 3], example: "621 123 456" },
  { name: "Málta", code: "+356", format: [4, 4], example: "9912 3456" },
  { name: "Hollandia", code: "+31", format: [1, 4, 4], example: "6 1234 5678" },
  { name: "Lengyelország", code: "+48", format: [3, 3, 3], example: "512 345 678" },
  { name: "Portugália", code: "+351", format: [3, 3, 3], example: "912 345 678" },
  { name: "Románia", code: "+40", format: [3, 3, 3], example: "712 345 678" },
  { name: "Szlovákia", code: "+421", format: [3, 3, 3], example: "912 345 678" },
  { name: "Szlovénia", code: "+386", format: [2, 3, 3], example: "31 234 567" },
  { name: "Spanyolország", code: "+34", format: [3, 3, 3], example: "612 345 678" },
  { name: "Svédország", code: "+46", format: [2, 3, 2, 2], example: "70 123 45 67" },
  { name: "Egyesült Királyság", code: "+44", format: [4, 3, 3], example: "7911 123 456" },
];

const PAYMENT_LABELS = {
  "bankkártya": "Bankkártya",
  "szép kártya": "SZÉP kártya",
  "készpénz": "Készpénz",
};

const CASH_FEE_PERCENT = 0.08;

const PAYMENT_OPTIONS = [
  { value: "bankkártya", label: "Bankkártya" },
  { value: "szép kártya", label: "SZÉP kártya" },
  { value: "készpénz", label: "Készpénz" },
];

function PhoneCodeSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((c) => c.code === value) || options[0];

  return (
    <div className="bk-phone-select-wrapper" ref={wrapperRef}>
      <div className="bk-phone-select-display" onClick={() => setOpen((p) => !p)}>
        <span>{selected.name} {selected.code}</span>
        <i className={`bi bi-chevron-${open ? "up" : "down"} bk-phone-select-arrow`}></i>
      </div>
      {open && (
        <ul className="bk-phone-select-options">
          {options.map((c) => (
            <li
              key={c.code}
              className={`bk-phone-select-option${c.code === value ? " bk-phone-select-option--active" : ""}`}
              onClick={() => { onChange(c.code); setOpen(false); }}
            >
              {c.name} {c.code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Booking({ user }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const tripId = location.state?.trip_id;
  const ecoTripId = location.state?.ecotrip_id;
  const isEcoTrip = !!ecoTripId;

  const [hotel, setHotel] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [guests, setGuests] = useState(location.state?.fo ?? 1);
  const [nights, setNights] = useState(location.state?.napok ?? 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+36");
  const [localPhone, setLocalPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bankkártya");

  const [errors, setErrors] = useState({});

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sendBookingEmail = async () => {
    try {
      await fetch(backendUrl + "Mail", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          to: email,
          subject: "Foglalás visszaigazolás - EcoTrip",
          body: `
          <!DOCTYPE html>
          <html lang="hu">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Foglalás visszaigazolás</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f6fb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f6fb; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; max-width: 100%;">
                    <tr>
                      <td style="background: linear-gradient(135deg, ${isEcoTrip ? '#2e7d32 0%, #43a047 100%' : '#1a3c57 0%, #2c5f8d 100%'}); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          ${isEcoTrip ? '🌿' : '✈️'} EcoTrip
                        </h1>
                        <p style="margin: 10px 0 0 0; color: #e8f5e9; font-size: 16px; font-weight: 400;">
                          Foglalás visszaigazolás
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px 20px; text-align: center;">
                        <table width="80" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); border-radius: 50%; box-shadow: 0 4px 15px rgba(102, 187, 106, 0.3);">
                          <tr>
                            <td style="padding: 20px; text-align: center; font-size: 40px; line-height: 40px;">
                              ✓
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  
                    <tr>
                      <td style="padding: 0 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1a3c57; font-size: 28px; font-weight: 600; text-align: center;">
                          Sikeres foglalás! 🎉
                        </h2>
                        
                        <p style="margin: 0 0 30px 0; color: #2c3e50; font-size: 16px; line-height: 1.8; text-align: center;">
                          Kedves <strong style="color: #2e7d32;">${fullName}</strong>!<br>
                          Foglalása sikeresen rögzítésre került. Várjuk szeretettel!
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #f8f9fa; border-radius: 12px; border-left: 4px solid ${isEcoTrip ? '#2e7d32' : '#1565c0'};">
                          <tr>
                            <td style="padding: 25px;">
                              <h3 style="margin: 0 0 20px 0; color: #1a3c57; font-size: 20px; font-weight: 600;">
                                📋 Foglalás részletei
                              </h3>
                              
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px; width: 40%;">
                                    <strong>Szállás:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    ${hotel.hotel_name}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Helyszín:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    ${hotel.city}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding: 15px 0 8px 0;">
                                    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 0;">
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Érkezés:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    📅 ${formatDateLocal(startDate)}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Távozás:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    📅 ${formatDateLocal(endDate)}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Éjszakák száma:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    🌙 ${nights} éjszaka
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Vendégek száma:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    👥 ${guests} fő
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding: 15px 0 8px 0;">
                                    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 0;">
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Fizetési mód:</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #1a3c57; font-size: 14px; font-weight: 600;">
                                    💳 ${PAYMENT_LABELS[paymentMethod]}
                                  </td>
                                </tr>
                                ${depositPaid > 0 ? `
                                <tr>
                                  <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">
                                    <strong>Előleg (50%):</strong>
                                  </td>
                                  <td style="padding: 8px 0; color: #2e7d32; font-size: 14px; font-weight: 700;">
                                    ${depositPaid.toLocaleString('hu-HU')} Ft
                                  </td>
                                </tr>
                                ` : ''}
                                <tr>
                                  <td style="padding: 12px 0 0 0; color: #6c757d; font-size: 16px;">
                                    <strong>Teljes összeg:</strong>
                                  </td>
                                  <td style="padding: 12px 0 0 0; color: #2e7d32; font-size: 18px; font-weight: 700;">
                                    ${finalAmount.toLocaleString('hu-HU')} Ft
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        ${isEcoTrip ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 12px; padding: 20px; text-align: center;">
                          <tr>
                            <td>
                              <p style="margin: 0; color: #2e7d32; font-size: 15px; font-weight: 600; line-height: 1.6;">
                                🌿 Köszönjük, hogy öko-tudatos szállást választott!<br>
                                <span style="font-size: 13px; font-weight: 400;">Ezzel Ön is hozzájárul a fenntartható turizmushoz.</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${paymentMethod === "készpénz" ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #fff3cd; border-radius: 12px; padding: 20px; border-left: 4px solid #ffc107;">
                          <tr>
                            <td>
                              <p style="margin: 0 0 10px 0; color: #856404; font-size: 15px; font-weight: 600;">
                                💰 Készpénzes fizetés
                              </p>
                              <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                A teljes összeget (${totalWithCashFee.toLocaleString('hu-HU')} Ft) a helyszínen kell kifizetni. A kezelési díj (${cashFee.toLocaleString('hu-HU')} Ft) már benne foglaltatik.
                              </p>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${depositPaid > 0 ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #d1ecf1; border-radius: 12px; padding: 20px; border-left: 4px solid #0dcaf0;">
                          <tr>
                            <td>
                              <p style="margin: 0 0 10px 0; color: #055160; font-size: 15px; font-weight: 600;">
                                ℹ️ Fizetési információ
                              </p>
                              <p style="margin: 0; color: #055160; font-size: 14px; line-height: 1.6;">
                                Az előleg (${depositPaid.toLocaleString('hu-HU')} Ft) bankkártyával kifizetve. A fennmaradó ${(totalPrice - depositPaid).toLocaleString('hu-HU')} Ft-ot a helyszínen kell rendezni.
                              </p>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        <p style="margin: 25px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.8; text-align: center; font-style: italic;">
                          Kérdés esetén keresse ügyfélszolgálatunkat!<br>
                          Jó pihenést és kellemes utazást kívánunk! ✨
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 0 40px;">
                        <hr style="border: none; border-top: 2px solid #e8f5e9; margin: 20px 0;">
                      </td>
                    </tr>
                    
             
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #fafafa;">
                        <p style="margin: 0 0 15px 0; color: #1a3c57; font-size: 16px; font-weight: 600;">
                          Kérdése van? Írjon nekünk!
                        </p>
                        <p style="margin: 0 0 25px 0; color: #6c757d; font-size: 14px;">
                          📧 <a href="mailto:ecotripmail@gmail.com" style="color: #2e7d32; text-decoration: none; font-weight: 500;">ecotripmail@gmail.com</a>
                        </p>
                        
                  
                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto 25px;">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1a3c57; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: bold;">f</a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1a3c57; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: bold;">𝕏</a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1a3c57; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold;">in</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0; color: #95a5a6; font-size: 13px; line-height: 1.8;">
                          © 2026 EcoTrip. Minden jog fenntartva.<br>
                          <span style="color: #1565c0;">✈️</span> Utazzon velünk! <span style="color: #7bc96f;">🌍</span> Válasszon felelősen!
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        }),
      });
    } catch (err) {
      console.error("Email küldési hiba:", err);
    }
  };

  const getCountry = () =>
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const formatPhone = (digits, formatGroups) => {
    let result = "";
    let pos = 0;
    for (let i = 0; i < formatGroups.length; i++) {
      const chunk = digits.slice(pos, pos + formatGroups[i]);
      if (!chunk) break;
      if (i > 0) result += " ";
      result += chunk;
      pos += formatGroups[i];
    }
    return result;
  };

  const handleLocalPhoneChange = (e) => {
    const country = getCountry();
    const maxDigits = country.format.reduce((a, b) => a + b, 0);
    const digits = e.target.value.replace(/\D/g, "").slice(0, maxDigits);
    setLocalPhone(formatPhone(digits, country.format));
  };

  const isPhoneValid = () => {
    const country = getCountry();
    const required = country.format.reduce((a, b) => a + b, 0);
    const digits = localPhone.replace(/\D/g, "");
    return digits.length === required;
  };

  const validateAge = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 16;
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardChange = (e) => setCardNumber(formatCardNumber(e.target.value));

  const isCardValid = () => cardNumber.replace(/\s/g, "").length === 16;

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

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const diff = differenceInCalendarDays(end, start);
      if (diff > 20) {
        toast.error("Maximum 20 napot választhat!");
        setEndDate(null);
        setNights(1);
      } else {
        setNights(diff);
      }
    }
  };

  useEffect(() => {
    document.title = "EcoTrip – Foglalás";
  }, []);

  useEffect(() => {
    const endpoint = tripId
      ? `Trips/detailed/${tripId}`
      : `EcoTrip/detailed/${ecoTripId}`;

    if (!tripId && !ecoTripId) return;

    fetch(backendUrl + endpoint)
      .then((res) => res.json())
      .then((data) => setHotel(Array.isArray(data) ? data[0] : data))
      .catch(() => setHasError(true));
  }, [tripId, ecoTripId]);

  useEffect(() => {
    if (user && user.user) {
      setFullName(user.user.fullName || "");
      setEmail(user.user.email || "");
    }
  }, [user]);

  if (hasError) return <p>Hiba történt az adatok betöltésekor.</p>;
  if (!hotel) return <p>Adatok betöltése...</p>;

  const isCardPayment = paymentMethod === "bankkártya" || paymentMethod === "szép kártya";

  const totalPrice = hotel.price * nights * guests;
  const deposit = Math.round(totalPrice * 0.5);
  const cashFee = Math.round(totalPrice * CASH_FEE_PERCENT);
  const totalWithCashFee = totalPrice + cashFee;
  const depositPaid = isCardPayment ? deposit : 0;
  const finalAmount = paymentMethod === "készpénz" ? totalWithCashFee : totalPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Kérjük a teljes nevét adja meg!";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Érvényes email címet adjon meg!";
    if (!isPhoneValid())
      newErrors.phone = `Érvényes telefonszámot adjon meg! (pl. ${getCountry().example})`;
    if (!birthDate) newErrors.birthDate = "Kérjük, adja meg születési dátumát!";
    else if (!validateAge(birthDate)) newErrors.birthDate = "Legalább 16 évesnek kell lennie a foglaláshoz!";
    if (!startDate || !endDate) newErrors.date = "Válassza ki a dátumtartományt!";

    if (isCardPayment) {
      if (!isCardValid()) newErrors.cardNumber = "16 számjegyű kártyaszám szükséges!";
      if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiry = "Érvényes formátum: MM/ÉÉ";
      if (!cvc.match(/^\d{3}$/)) newErrors.cvc = "3 számjegyű CVC szükséges!";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      Object.values(newErrors).forEach((msg) =>
        toast.error(msg, { position: "top-right", autoClose: 4000, theme: "colored" })
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(backendUrl + "Bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tripId: tripId ?? ecoTripId,
          seats: guests,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          paymentType: paymentMethod,
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
    <div className="bk-page">
      <ToastContainer theme="colored" />

      <div className="bk-book">

        <div className={`bk-left ${isEcoTrip ? "bk-left--eco" : "bk-left--trip"}`}>
          <div className="bk-left-inner">
            <div className="bk-badge">{isEcoTrip ? <><i className="bi bi-leaf-fill text-light"></i> Öko-utazás</> : <><i className="bi bi-airplane-fill text-light"></i> Utazás</>}</div>
            <h1 className="bk-city">{hotel.city}</h1>
            <p className="bk-hotel">{hotel.hotel_name}</p>

            <div className="bk-divider" />

            <div className="bk-section-label"><i className="bi bi-calendar3 text-light"></i> Utazás dátuma</div>
            <div className="bk-datepicker-wrap">
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                minDate={new Date()}
                locale={hu}
                className="date-picker-darkcyan"
                dayClassName={() => "date-picker-day"}
              />
            </div>
            {errors.date && <div className="bk-field-error">{errors.date}</div>}

            <div className="bk-nights-row">
              <span className="bk-nights-icon"><i className="bi bi-moon-fill text-warning"></i></span>
              <span className="bk-nights-num">{nights}</span>
              <span className="bk-nights-label">éjszaka</span>
            </div>

            <div className="bk-section-label"><i className="bi bi-people-fill text-light"></i> Vendégek száma</div>
            <div className="bk-fo-row">
              <button type="button" className="bk-fo-btn" onClick={() => setGuests(prev => (prev > 1 ? prev - 1 : 1))}>−</button>
              <span className="bk-fo-val">{guests} fő</span>
              <button type="button" className="bk-fo-btn" onClick={() => setGuests(prev => (prev < 10 ? prev + 1 : 10))}>+</button>
            </div>

            <div className="bk-divider" />

            <div className="bk-price-row">
              <span>Ár / fő / éj</span>
              <span className="bk-price-val">{hotel.price.toLocaleString("hu-HU")} Ft</span>
            </div>
            <div className="bk-price-row">
              <span>Vendégek × Éjszakák</span>
              <span className="bk-price-val">{guests} × {nights}</span>
            </div>
            <div className="bk-total-box">
              <span className="bk-total-label">Végösszeg</span>
              <span className="bk-total-amount">
                {totalPrice.toLocaleString("hu-HU")} Ft
              </span>
            </div>

            <p className="bk-disclaimer">Az árak tartalmazzák az oldalunk szolgáltatási díjait.</p>
          </div>
        </div>

        <div className="bk-right">
          <div className="bk-right-inner">
            <h2 className="bk-form-title">Foglalási adatok</h2>

            <form onSubmit={handleSubmit}>

              <div className="bk-section-title">
                <span className="bk-section-icon"><i className="bi bi-person-fill text-dark"></i></span> Személyes adatok
              </div>

              <div className="bk-field">
                <label className="bk-label">Teljes név</label>
                <input
                  type="text"
                  className={`bk-input ${errors.fullName ? "bk-input--error" : ""}`}
                  placeholder="Kovács János"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
                {errors.fullName && <div className="bk-field-error">{errors.fullName}</div>}
              </div>

              <div className="bk-field">
                <label className="bk-label">Email-cím</label>
                <input
                  type="email"
                  className={`bk-input ${errors.email ? "bk-input--error" : ""}`}
                  placeholder="pelda@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {errors.email && <div className="bk-field-error">{errors.email}</div>}
              </div>

              <div className="bk-field">
                <label className="bk-label">Telefon</label>
                <div className="bk-phone-row">
                  <PhoneCodeSelect
                    options={COUNTRY_CODES}
                    value={countryCode}
                    onChange={(code) => { setCountryCode(code); setLocalPhone(""); }}
                  />
                  <input
                    type="tel"
                    className={`bk-input ${errors.phone ? "bk-input--error" : ""}`}
                    placeholder={getCountry().example}
                    value={localPhone}
                    onChange={handleLocalPhoneChange}
                    maxLength={
                      getCountry().format.reduce((a, b) => a + b, 0) +
                      getCountry().format.length - 1
                    }
                  />
                </div>
                {errors.phone && <div className="bk-field-error">{errors.phone}</div>}
              </div>

              <div className="bk-field">
                <label className="bk-label">Születési dátum</label>
                <div className="bk-birth-datepicker-wrap">
                  <DatePicker
                    selected={birthDate ? new Date(birthDate) : null}
                    onChange={(date) => setBirthDate(date ? formatDateLocal(date) : "")}
                    dateFormat="yyyy.MM.dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                    scrollableYearDropdown
                    yearDropdownItemNumber={80}
                    maxDate={new Date()}
                    placeholderText="Válasszon dátumot"
                    className={`bk-input bk-input--date ${errors.birthDate ? "bk-input--error" : ""}`}
                    popperPlacement="bottom-start"
                    locale={hu}
                    dayClassName={() => "date-picker-day"}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                {errors.birthDate && <div className="bk-field-error">{errors.birthDate}</div>}
              </div>

              <div className="bk-section-title bk-section-title--payment">
                Fizetési mód
              </div>

              <div className="bk-payment-options">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`bk-payment-card ${paymentMethod === opt.value ? "bk-payment-card--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="bk-pay-label">{opt.label}</span>
                  </label>
                ))}
              </div>

              {isCardPayment && (
                <div className="bk-card-fields">
                  <div className="bk-field bk-field--full">
                    <label className="bk-label">Kártyaszám</label>
                    <input
                      type="text"
                      className={`bk-input ${errors.cardNumber ? "bk-input--error" : ""}`}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardChange}
                      maxLength={19}
                    />
                    {errors.cardNumber && <div className="bk-field-error">{errors.cardNumber}</div>}
                  </div>
                  <div className="bk-field bk-field--half">
                    <label className="bk-label">Lejárat (MM/ÉÉ)</label>
                    <input
                      type="text"
                      className={`bk-input ${errors.expiry ? "bk-input--error" : ""}`}
                      placeholder="09/27"
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                    {errors.expiry && <div className="bk-field-error">{errors.expiry}</div>}
                  </div>
                  <div className="bk-field bk-field--half">
                    <label className="bk-label">CVC</label>
                    <input
                      type="text"
                      className={`bk-input ${errors.cvc ? "bk-input--error" : ""}`}
                      placeholder="123"
                      value={cvc}
                      onChange={handleCvcChange}
                      maxLength={3}
                    />
                    {errors.cvc && <div className="bk-field-error">{errors.cvc}</div>}
                  </div>
                </div>
              )}

              {isCardPayment && (
                <div className="bk-alert bk-alert--info">
                  A foglalás véglegesítéséhez <strong>50% előleg</strong> szükséges.<br />
                  Most fizetendő: <strong>{deposit.toLocaleString("hu-HU")} Ft</strong>
                </div>
              )}
              {paymentMethod === "készpénz" && (
                <div className="bk-alert bk-alert--info">
                  Készpénz esetén <strong>8% kezelési díj</strong> kerül felszámításra a helyszínen.<br />
                  Kezelési díj: <strong>{cashFee.toLocaleString("hu-HU")} Ft</strong> –
                  Végösszeg: <strong>{totalWithCashFee.toLocaleString("hu-HU")} Ft</strong>
                </div>
              )}

              {isSubmitting ? (
                <div className="bk-loader">
                  <DotLoader color="#7dbf7d" size={52} />
                </div>
              ) : (
                <button type="submit" className="bk-submit-btn">
                  Foglalás megerősítése →
                </button>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}