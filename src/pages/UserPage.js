import React, { useState, useEffect } from "react";
import "./UserPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const defaultAvatars = [
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg?t=st=1771404526~exp=1771408126~hmac=27629a3082f81d551eeb91de63a33eb72b01fb1bbb86f071f6fd681f4de5dfe6",
  "https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?t=st=1771404569~exp=1771408169~hmac=3f0369daf42a984de481ec1ca27767c38ee620691ec95bc57baf4b44a56fa053",
  "https://img.freepik.com/free-vector/mans-face-flat-style_90220-2877.jpg?t=st=1771404587~exp=1771408187~hmac=b94f72a4a6733159b68d8980b0be305a42dcc054c6d8ccc07e811c7fc14035d0",
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2944.jpg?t=st=1771404643~exp=1771408243~hmac=0e851c3eb16218153460e469268e52304b38fd7c0835b3f90ea8f0154e2a57cf",
  "https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg?t=st=1771404726~exp=1771408326~hmac=56f8283ece2869604da0453921fdedf82faf6d0e4cdca938339b90dfc2030548",
  "https://img.freepik.com/free-vector/isolated-young-handsome-man-set-different-poses-white-background-illustration_632498-657.jpg?t=st=1771404852~exp=1771408452~hmac=0552accd341c3c3622f0935a2aedae0247ed8138feb9adfc1e0338a93c8267a4",
];

export default function UserPage({ user, updateProfileImage }) {
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

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Nincs bejelentkezett felhasználó!");
        return;
      }

      try {
        const response = await fetch("https://localhost:7267/api/Profile/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          toast.error("Hiba a profil lekérésekor!");
          return;
        }

        const data = await response.json();
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setSelectedAvatar(data.profileImage || defaultAvatars[0]);
        updateProfileImage(data.profileImage || defaultAvatars[0]);
      } catch (error) {
        console.error(error);
        toast.error("Hiba a szerverrel való kapcsolatban!");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("https://localhost:7267/api/Bookings/my", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newAvatar = URL.createObjectURL(file);
      setCustomAvatar(newAvatar);
      updateProfileImage(newAvatar);
    }
  };

  const uploadProfileImage = async () => {
    if (!customAvatar) return;
    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7267/api/Profile/image", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl: customAvatar }),
    });
    if (!response.ok) throw new Error("Hiba a kép feltöltésekor");
    updateProfileImage(customAvatar);
  };

  const updateUsername = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7267/api/Profile/username", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) throw new Error("Hiba a felhasználónév frissítésekor");
  };

  const updatePassword = async () => {
    if (!password || !oldPassword) return;
    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7267/api/Profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ oldPassword, newPassword: password }),
    });
    if (!response.ok) throw new Error("Hiba a jelszó frissítésekor");
  };

  const confirmDelete = (id) => {
    const toastId = toast.error(
      <div>
        <p className="mb-2" style={{ fontSize: "14px" }}>
          Biztosan törölni szeretné a foglalását?
        </p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-light btn-sm px-3"
            style={{ fontSize: "12px", fontWeight: "bold" }}
            onClick={() => {
              executeDelete(id);
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
      { position: "top-right", autoClose: false, closeOnClick: false, closeButton: false, draggable: false, theme: "colored" }
    );
  };

  const executeDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Nincs bejelentkezve!");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7267/api/Bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        toast.error("Nincs jogosultságod!");
        return;
      }

      if (!response.ok) {
        toast.error("Hiba történt!");
        return;
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Foglalás sikeresen törölve!", { theme: "colored" });
    } catch {
      toast.error("Szerver hiba történt!", { theme: "colored" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

    try {
      await updateUsername();
      await updatePassword();
      await uploadProfileImage();
      toast.success("Profil sikeresen frissítve!");
      setEditMode(false);
      setPassword("");
      setPasswordAgain("");
      setOldPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />

        <div className="profile-header">
          <h2>Felhasználói adatok</h2>
          {!editMode && (
            <span className="edit-icon" onClick={() => setEditMode(true)} title="Profil módosítása">
              <i className="bi bi-pencil"></i>
            </span>
          )}
        </div>

        {(customAvatar || selectedAvatar) && (
          <img src={customAvatar || selectedAvatar} alt="Profilkép" className="profile-avatar" />
        )}

        {editMode && (
          <>
            <div className="avatar-grid">
              {defaultAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`avatar-${index}`}
                  className={`avatar-option ${selectedAvatar === avatar ? "active" : ""}`}
                  onClick={() => { setSelectedAvatar(avatar); setCustomAvatar(null); updateProfileImage(avatar); }}
                />
              ))}
            </div>
            <label className="upload-label">
              Saját kép feltöltése
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </>
        )}

        <form onSubmit={handleSave}>
          <div className="field">
            <label>Teljes név</label>
            <input type="text" value={fullName} disabled className="readonly-input" />
          </div>

          <div className="field">
            <label>Felhasználónév</label>
            <input type="text" value={username} disabled={!editMode ? true : false} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="field">
            <label>Email / elérhetőség</label>
            <input type="email" value={email} disabled className="readonly-input" />
          </div>

          {editMode && (
            <>
              <div className="field mb-3 position-relative">
                <label>Régi jelszó</label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="form-control pe-5"
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

              <div className="field mb-3 position-relative">
                <label>Új jelszó</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control pe-5"
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
              
              <div className="field mb-3 position-relative">
                <label>Új jelszó újra</label>
                <input
                  type={showPasswordAgain ? "text" : "password"}
                  className="form-control pe-5"
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

              <button type="submit" className="btn btn-primary btn-lg">Mentés</button>
            </>
          )}

        </form>

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
                        ? `${new Date(booking.startDate || booking.StartDate).toLocaleDateString()} - ${new Date(booking.endDate || booking.EndDate).toLocaleDateString()}`
                        : ""}
                    </div>
                    <span className="delete-icon" onClick={() => confirmDelete(booking.id)} title="Foglalás törlése">
                      <i className="bi bi-trash"></i>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
