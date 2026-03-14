import React, { useState, useEffect } from "react";
import "./UserPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

const defaultAvatars = [
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg",
  "https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg",
  "https://img.freepik.com/free-vector/mans-face-flat-style_90220-2877.jpg",
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2944.jpg",
  "https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg",
  "https://img.freepik.com/free-vector/mans-flat-style-face_90220-2938.jpg",
];

export default function UserPage({ user, updateProfileImage, updateUser, onLogout }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(() => user?.user?.username || "");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [pendingBookingDeletionId, setPendingBookingDeletionId] = useState(null);
  const [bookingDeletionPassword, setBookingDeletionPassword] = useState("");
  const [isBookingDeletionPasswordVisible, setIsBookingDeletionPasswordVisible] = useState(false);
  const [isBookingDeletionInProgress, setIsBookingDeletionInProgress] = useState(false);
  const [isBookingDeletionConfirmed, setIsBookingDeletionConfirmed] = useState(false);

  const [originalData, setOriginalData] = useState({
    username: "",
    password: "",
    oldPassword: "",
    passwordAgain: "",
    selectedAvatar: ""
  });

  useEffect(() => {
    document.title = "EcoTrip – Profil";
  }, []);

  function startEditMode() {
    setOriginalData({
      username,
      password: "",
      oldPassword: "",
      confirmPassword: "",
      selectedAvatar: customAvatar || selectedAvatar
    });
    setEditMode(true);
  }

  function handleBackFromEdit() {
    const hasChanges =
      username !== originalData.username ||
      password !== "" ||
      oldPassword !== "" ||
      confirmPassword !== "" ||
      (customAvatar || selectedAvatar) !== originalData.selectedAvatar;

    if (!hasChanges) {
      setEditMode(false);
      return;
    }

    const toastId = toast.error(
      <div>
        <p style={{ fontSize: "12px" }}>Biztosan el akarja vetni a változtatásokat?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-light btn-sm px-3"
            style={{ fontSize: "12px", fontWeight: "bold" }}
            onClick={() => {
              setUsername(originalData.username);
              setPassword("");
              setOldPassword("");
              setConfirmPassword("");
              setCustomAvatar(null);
              setSelectedAvatar(originalData.selectedAvatar);
              setEditMode(false);
              toast.dismiss(toastId);
            }}
          >
            Igen
          </button>
          <button
            className="btn btn-outline-light btn-sm px-3"
            style={{ fontSize: "12px" }}
            onClick={() => toast.dismiss(toastId)}
          >
            Mégse
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await axios.get(`${backendUrl}Profile/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Cache-Control": "no-cache"
          },
        });
        setFullName(data.data.fullName || "");
        setEmail(data.data.email || "");
        
        const customImage = localStorage.getItem('customProfileImage');
        if (customImage) {
          setSelectedAvatar(customImage);
          updateProfileImage(customImage);
          return;
        }
        
        const currentImg = data.data.profileImage || defaultAvatars[0];
        setSelectedAvatar(currentImg);
        updateProfileImage(currentImg);
      } catch (error) {
        console.error(error)
      }
    };
    fetchProfile();
  }, [location.key]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${backendUrl}Bookings/my`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setBookings(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, [location.key]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCustomAvatar(dataUrl);
        setSelectedAvatar(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUsername = async () => {
    const token = localStorage.getItem("token");
    await axios.put(`${backendUrl}Profile/username`, { username }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const updatePassword = async () => {
    if (!password || !oldPassword) return;
    const token = localStorage.getItem("token");
    await axios.put(`${backendUrl}Profile/password`, { oldPassword, newPassword: password }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };  const saveImageToBackend = async (imageUrl) => {
    const token = localStorage.getItem("token");
    
    if (imageUrl.startsWith('data:')) {
      localStorage.setItem('customProfileImage', imageUrl);
      return;
    }
    
    localStorage.removeItem('customProfileImage');
    await axios.put(`${backendUrl}Profile/image`, { imageUrl }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const formatBookingDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("hu-HU");
  };

  const sendBookingDeletionEmail = async (deletedBooking) => {
    if (!email) return;

    const hotelName = deletedBooking?.hotelName || deletedBooking?.HotelName || "EcoTrip foglalás";
    const startDate = formatBookingDate(deletedBooking?.startDate || deletedBooking?.StartDate);
    const endDate = formatBookingDate(deletedBooking?.endDate || deletedBooking?.EndDate);

    await axios.post(`${backendUrl}Mail`, {
      to: email,
      subject: "Foglalás törlése - EcoTrip",
      body: `
      <!DOCTYPE html>
      <html lang="hu">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Foglalás törlése</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f6fb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f6fb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; max-width: 100%;">
                <tr>
                  <td style="background: linear-gradient(135deg, #1a3c57 0%, #2c5f8d 100%); padding: 34px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 30px; font-weight: 700;">EcoTrip</h1>
                    <p style="margin: 10px 0 0 0; color: #e8f5e9; font-size: 16px;">Foglalás törlése</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 36px 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #1a3c57; font-size: 26px; font-weight: 600; text-align: center;">
                      Foglalása sikeresen törölve lett
                    </h2>
                    <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.75; text-align: center;">
                      Kedves <strong style="color: #2e7d32;">${fullName || username}</strong>!<br>
                      A következő foglalását sikeresen töröltük rendszerünkből.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 12px; border-left: 4px solid #2e7d32; margin: 0 0 24px 0;">
                      <tr>
                        <td style="padding: 22px 24px;">
                          <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 18px; font-weight: 600;">Törölt foglalás adatai</p>
                          <p style="margin: 0 0 8px 0; color: #2c3e50; font-size: 14px;"><strong>Szállás:</strong> ${hotelName}</p>
                          <p style="margin: 0 0 8px 0; color: #2c3e50; font-size: 14px;"><strong>Érkezés:</strong> ${startDate}</p>
                          <p style="margin: 0; color: #2c3e50; font-size: 14px;"><strong>Távozás:</strong> ${endDate}</p>
                        </td>
                      </tr>
                    </table>
                     <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #fafafa;">
                        <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.7; text-align: center; font-style: italic;">
                      Ha ez nem szándékos művelet volt, kérjük vegye fel velünk a kapcsolatot.
                    </p>
                        <p style="margin: 0 0 25px 0; color: #6c757d; font-size: 14px;">
                          <a href="mailto:ecotripmail@gmail.com" style="color: #2e7d32; text-decoration: none; font-weight: 500;">ecotripmail@gmail.com</a>
                        </p>
                        <p style="margin: 0 0 25px 0; color: #6c757d; font-size: 14px;">
                          <a href="http://localhost:3000" style="color: #2e7d32; text-decoration: none; font-weight: 500;">Vedezze fel a további ajánlatainkat!</a>
                        </p>

                        <p style="margin: 0; color: #95a5a6; font-size: 13px; line-height: 1.8;">
                          © 2026 EcoTrip. Minden jog fenntartva.<br>
                          Utazzon velünk, válasszon felelősen!
                        </p>
                      </td>
                    </tr>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });
  };

  const closeBookingDeletionModal = () => {
    setPendingBookingDeletionId(null);
    setBookingDeletionPassword("");
    setIsBookingDeletionPasswordVisible(false);
    setIsBookingDeletionInProgress(false);
    setIsBookingDeletionConfirmed(false);
  };

  const deleteBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!pendingBookingDeletionId) return;
    if (!isBookingDeletionConfirmed) {
      toast.error("Kérem, jelölje be, hogy biztosan törölni szeretné a foglalását!");
      return;
    }
    if (!bookingDeletionPassword.trim()) {
      toast.error("Kérem, adja meg a jelenlegi jelszavát!");
      return;
    }

    setIsBookingDeletionInProgress(true);

    const currentUsername = user?.user?.username || username;
    if (!currentUsername) {
      toast.error("Nem sikerült azonosítani a felhasználót.");
      setIsBookingDeletionInProgress(false);
      return;
    }

    const deletedBooking = bookings.find((booking) => booking.id === pendingBookingDeletionId) || null;

    try {
      await axios.post(`${backendUrl}auth/login`, {
        username: currentUsername,
        password: bookingDeletionPassword,
      });

      await axios.delete(`${backendUrl}Bookings/${pendingBookingDeletionId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: bookingDeletionPassword }
      });

      if (deletedBooking) {
        try {
          await sendBookingDeletionEmail(deletedBooking);
        } catch (mailError) {
          console.error("Booking deletion email error:", mailError);
        }
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== pendingBookingDeletionId));
      toast.success("Foglalás törölve");
      closeBookingDeletionModal();
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        toast.error("Hibás jelszó!");
      } else {
        toast.error("Hiba történt a foglalás törlése során.");
      }
      setIsBookingDeletionInProgress(false);
    }
  };

  const openBookingDeletionModal = (bookingId) => {
    setPendingBookingDeletionId(bookingId);
    setBookingDeletionPassword("");
    setIsBookingDeletionPasswordVisible(false);
    setIsBookingDeletionConfirmed(false);
  };



  const executeProfileDelete = async () => {
    if (!confirmChecked) {
      toast.error("Kérem, jelölje be, hogy biztosan törölni szeretné fiókját!");
      return;
    }

    if (!deletePassword) {
      toast.error("Kérem, adja meg a jelenlegi jelszavát!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${backendUrl}Profile/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { password: deletePassword }
      });

      toast.success("Profilja sikeresen törölve");      setTimeout(() => {
        if (typeof updateUser === "function") updateUser(null);
        if (typeof onLogout === "function") onLogout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("customProfileImage");
        navigate("/");
      }, 1500);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Hibás jelszó!");
      } else {
        toast.error("Szerver hiba");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Hiba: a jelszavak nem egyeznek");
      return;
    }
    try {
      await updateUsername();
      if (password) await updatePassword();
      const finalImage = customAvatar || selectedAvatar;
      await saveImageToBackend(finalImage);
      const updatedUserData = { ...user, user: { ...user?.user, username, profileImage: finalImage } };
      if (typeof updateUser === "function") updateUser(updatedUserData);
      updateProfileImage(finalImage);
      setEditMode(false);
      setPassword("");
      setConfirmPassword("");
      setOldPassword("");
      setCustomAvatar(null);
      toast.success("Sikeres mentés");
    } catch (error) {
      toast.error("Hiba a mentés során");
    }
  };

  return (
    <div className="profile-container">
      {pendingBookingDeletionId && (
        <div className="booking-delete-modal-overlay" onClick={closeBookingDeletionModal}>
          <div className="booking-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-delete-modal-header">
              <h4>Foglalás törlése</h4>
              <button
                type="button"
                className="booking-delete-modal-close"
                onClick={closeBookingDeletionModal}
                aria-label="Bezárás"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <p className="booking-delete-modal-text">
              A törléshez adja meg a jelenlegi jelszavát.
            </p>
            <p className="booking-delete-modal-warning">
              Ez a művelet nem vonható vissza. Biztosan törölni akarja foglalását?
            </p>
            <div className="booking-delete-check">
              <label className="form-check-label" htmlFor="confirmBookingDelete">
                Igen, biztos.
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="confirmBookingDelete"
                checked={isBookingDeletionConfirmed}
                onChange={(e) => setIsBookingDeletionConfirmed(e.target.checked)}
              />
            </div>
            <div className="field mt-2 booking-delete-modal-field">
              <label>Jelenlegi jelszó</label>
              <div className="password-wrapper">
                <input
                  className="booking-delete-modal-input"
                  type={isBookingDeletionPasswordVisible ? "text" : "password"}
                  value={bookingDeletionPassword}
                  onChange={(e) => setBookingDeletionPassword(e.target.value)}
                  placeholder="Jelenlegi jelszó"
                />
                <span
                  className="password-eye"
                  onClick={() => setIsBookingDeletionPasswordVisible(!isBookingDeletionPasswordVisible)}
                >
                  {isBookingDeletionPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="booking-delete-modal-actions">
              <button
                type="button"
                className="btn booking-delete-btn booking-delete-btn--secondary"
                onClick={closeBookingDeletionModal}
                disabled={isBookingDeletionInProgress}
              >
                Mégse
              </button>
              <button
                type="button"
                className="btn booking-delete-btn booking-delete-btn--danger"
                onClick={deleteBooking}
                disabled={isBookingDeletionInProgress}
              >
                {isBookingDeletionInProgress ? "Törlés folyamatban..." : "Foglalás törlése"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-card" style={{ position: "relative" }}>
        {editMode && (
          <button
            className="edit-back-top-left"
            onClick={handleBackFromEdit} 
            title="Vissza a profilhoz"
          >
            <i className="bi bi-arrow-left"></i> Vissza
          </button>
        )}

        <ToastContainer theme="colored" position="top-right" autoClose={3000} />

        {!editMode && (
          <div className="profile-header">
            <h2>Profil adatok</h2>
            <span
              className="edit-icon"
              onClick={startEditMode} 
              title="Profil módosítása"
            >
              <i className="bi bi-pencil"></i>
            </span>
          </div>
        )}

        {!editMode && (
          <div className="view-avatar-wrapper">
            <img
              src={customAvatar || selectedAvatar}
              alt="Profilkép"
              className="profile-avatar view-avatar"
            />
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className={editMode ? "edit-layout" : ""}>
            {editMode && (
              <div className="left-column">
                <img
                  src={customAvatar || selectedAvatar}
                  alt="Profilkép"
                  className="profile-avatar"
                />                <div className="avatar-grid">
                  {defaultAvatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`avatar-${index}`}
                      className={`avatar-option ${selectedAvatar === avatar ? "active" : ""
                        }`}
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        setCustomAvatar(null);
                        localStorage.removeItem('customProfileImage');
                      }}
                    />
                  ))}
                </div>
                <label className="upload-label">
                  Saját kép feltöltése
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <div className="delete-profile-box">
                  <h5 className="delete-title mt-3">Profil törlése</h5>
                  <p>
                    Ez a művelet nem vonható vissza, biztosan törölni akarja
                    profilját?
                  </p>

                  <div className="delete-check">
                    <label className="form-check-label" htmlFor="confirmDelete">
                      Igen, biztos.
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="confirmDelete"
                      checked={confirmChecked}
                      onChange={(e) => setConfirmChecked(e.target.checked)}
                    />
                  </div>

                  <div className="field mt-3">
                    <label>Jelenlegi jelszó</label>
                    <div className="password-wrapper">
                      <input
                        type={showDeletePassword ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                      />
                      <span
                        className="password-eye"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                      >
                        {showDeletePassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100 mt-2"
                    onClick={executeProfileDelete}
                  >
                    Profil végleges törlése
                  </button>
                </div>
              </div>
            )}
            <div className="right-column">
              {editMode && (
                <h3 className="edit-right-title">Profil adatok módosítása</h3>
              )}

              <div className="field">
                <label>Teljes név</label>
                <input
                  type="text"
                  value={fullName}
                  disabled
                  className="readonly-input"
                />
              </div>
              <div className="field">
                <label>Felhasználónév</label>
                <input
                  type="text"
                  value={username}
                  disabled={!editMode}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="readonly-input"
                />
              </div>

              {editMode && (
                <>
                  <div className="field">
                    <label>Régi jelszó</label>
                    <div className="password-wrapper">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <span
                        className="password-eye"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label>Új jelszó</label>
                    <div className="password-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className="password-eye"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label>Új jelszó újra</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className="password-eye"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                  >
                    Mentés
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
        {!editMode && (
          <div className="bookings">
            <h3>Foglalásaim</h3>

            {bookings.length === 0 ? (
              <p>Nincs még foglalása.</p>
            ) : (
              <ul>
                {bookings.map((booking) => (
                  <li key={booking.id} className="booking-item">
                    <div className="booking-content">
                      <div>
                        <strong>{booking.hotelName || booking.HotelName}</strong>
                        <br />
                        {(booking.startDate || booking.StartDate) &&
                          (booking.endDate || booking.EndDate)
                          ? `${new Date(
                            booking.startDate || booking.StartDate
                          ).toLocaleDateString()} - ${new Date(
                            booking.endDate || booking.EndDate
                          ).toLocaleDateString()}`
                          : ""}
                      </div>

                      <span
                        className="delete-icon"
                        onClick={() => openBookingDeletionModal(booking.id)}
                        title="Foglalás törlése"
                      >
                        <i className="bi bi-trash"></i>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}