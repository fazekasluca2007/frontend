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
  };

  const saveImageToBackend = async (imageUrl) => {
    const token = localStorage.getItem("token");
    await axios.put(`${backendUrl}Profile/image`, { imageUrl }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const executeDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`${backendUrl}Bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(prev => prev.filter(b => b.id !== id));
      toast.success("Foglalás törölve");
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
  }



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

      toast.success("Profilja sikeresen törölve");

      setTimeout(() => {
        if (typeof updateUser === "function") updateUser(null);
        if (typeof onLogout === "function") onLogout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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