import React, { useState, useEffect } from "react";
import "./UserPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';

const defaultAvatars = [
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg",
  "https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg",
  "https://img.freepik.com/free-vector/mans-face-flat-style_90220-2877.jpg",
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2944.jpg",
  "https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg",
  "https://img.freepik.com/free-vector/mans-flat-style-face_90220-2938.jpg",
];

export default function UserPage({ user, updateProfileImage, updateUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(() => user?.user?.username || "");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  useEffect(() => {
    document.title = "EcoTrip – Profil";
  }, []);

  const handleBackFromEdit = () => {
    setEditMode(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("https://localhost:7267/api/Profile/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Cache-Control": "no-cache"
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          const currentImg = data.profileImage || defaultAvatars[0];
          setSelectedAvatar(currentImg);
          updateProfileImage(currentImg);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [location.key]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("https://localhost:7267/api/Bookings/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, [location.key]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newAvatar = URL.createObjectURL(file);
      setCustomAvatar(newAvatar);
      setSelectedAvatar(newAvatar);
    }
  };

  const updateUsername = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7267/api/Profile/username", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) throw new Error("Hiba");
  };

  const updatePassword = async () => {
    if (!password || !oldPassword) return;
    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7267/api/Profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ oldPassword, newPassword: password }),
    });
    if (!response.ok) throw new Error("Hiba");
  };

  const saveImageToBackend = async (imageUrl) => {
    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7267/api/Profile/image", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl }),
    });
    if (!response.ok) throw new Error("Hiba");
  };
  const executeDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`https://localhost:7267/api/Bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
        toast.success("Foglalás törölve");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const confirmDelete = (id) => {
    const toastId = toast.error(
      <div>
        <p className="mb-2" style={{ fontSize: "14px" }}>Biztosan törölni szeretné a foglalását?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-light btn-sm px-3"
            style={{ fontSize: "12px", fontWeight: "bold" }}
            onClick={() => { executeDelete(id); toast.dismiss(toastId); }}
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
      const response = await fetch("https://localhost:7267/api/Profile/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      if (response.ok) {

        toast.success("Profilja sikeresen törölve");

        setTimeout(() => {
          if (typeof updateUser === "function") updateUser(null);
          if (typeof onLogout === "function") onLogout();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }, 1500);

      } else {
        toast.error("Hibás jelszó!");
      }

    } catch (error) {
      console.error(error);
      toast.error("Szerver hiba");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (password && password !== passwordAgain) {
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
      setPasswordAgain("");
      setOldPassword("");
      setCustomAvatar(null);
      toast.success("Sikeres mentés");
    } catch (error) {
      console.error(error);
      toast.error("Hiba a mentés során");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card" style={{ position: "relative" }}>
        {editMode && (
          <button
            className="edit-back-top-left"
            onClick={() => setEditMode(false)}
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
              onClick={() => setEditMode(true)}
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
                />
                <div className="avatar-grid">
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
                        updateProfileImage(avatar);
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

                  <div className="form-check delete-check">
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
                    className="btn btn-primary btn-lg w-100"
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
                        type={showPasswordAgain ? "text" : "password"}
                        value={passwordAgain}
                        onChange={(e) => setPasswordAgain(e.target.value)}
                      />
                      <span
                        className="password-eye"
                        onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                      >
                        {showPasswordAgain ? <FaEyeSlash /> : <FaEye />}
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
                        onClick={() => confirmDelete(booking.id)}
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