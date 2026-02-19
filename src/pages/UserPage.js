import React, { useState, useEffect } from "react";
import "./UserPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const defaultAvatars = [
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg?t=st=1771404526~exp=1771408126~hmac=27629a3082f81d551eeb91de63a33eb72b01fb1bbb86f071f6fd681f4de5dfe6",
  "https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?t=st=1771404569~exp=1771408169~hmac=3f0369daf42a984de481ec1ca27767c38ee620691ec95bc57baf4b44a56fa053",
  "https://img.freepik.com/free-vector/mans-face-flat-style_90220-2877.jpg?t=st=1771404587~exp=1771408187~hmac=b94f72a4a6733159b68d8980b0be305a42dcc054c6d8ccc07e811c7fc14035d0",
  "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2944.jpg?t=st=1771404643~exp=1771408243~hmac=0e851c3eb16218153460e469268e52304b38fd7c0835b3f90ea8f0154e2a57cf",
  "https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg?t=st=1771404726~exp=1771408326~hmac=56f8283ece2869604da0453921fdedf82faf6d0e4cdca938339b90dfc2030548",
  "https://img.freepik.com/free-vector/mans-flat-style-face_90220-2938.jpg?t=st=1771493824~exp=1771497424~hmac=19558146c8757b62cf28c6fd17aabc609fcd49424043ba8c47d182feb7af8e50",
];

export default function UserPage({ user, updateProfileImage, updateUser }) {
  const location = useLocation();
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
    document.title = "EcoTrip – Profil";
  }, []);

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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      body: JSON.stringify({ imageUrl: imageUrl }),
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
        setBookings((prev) => prev.filter((b) => b.id !== id));
        toast.success("Törölve");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    const toastId = toast.error(
      <div>
        <p>Biztosan törölni szeretné?</p>
        <button onClick={() => { executeDelete(id); toast.dismiss(toastId); }}>Igen</button>
        <button onClick={() => toast.dismiss(toastId)}>Mégse</button>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (password && password !== passwordAgain) {
      toast.error("Hiba");
      return;
    }
    try {
      await updateUsername();
      if (password) await updatePassword();
      
      const finalImage = customAvatar || selectedAvatar;
      await saveImageToBackend(finalImage);

      const updatedUserData = {
        ...user,
        user: {
          ...user?.user,
          username: username,
          profileImage: finalImage
        }
      };

      if (typeof updateUser === "function") {
        updateUser(updatedUserData);
      }
      
      updateProfileImage(finalImage);
      setEditMode(false);
      setPassword("");
      setPasswordAgain("");
      setOldPassword("");
      setCustomAvatar(null);
      toast.success("Sikeres mentés");
    } catch (error) {
      console.error(error);
      toast.error("Hiba");
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
          <div className="field mb-3">
            <label>Régi jelszó</label>

            <div className="password-wrapper">
            <input
              type={showOldPassword ? "text" : "password"}
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
             />
            <span className="password-eye" onClick={() => setShowOldPassword(!showOldPassword)} >
          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>

    <div className="field mb-3">
      <label>Új jelszó</label>

      <div className="password-wrapper">
        <input
          type={showNewPassword ? "text" : "password"}
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span className="password-eye" onClick={() => setShowNewPassword(!showNewPassword)}>
        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>

    <div className="field mb-3">
      <label>Új jelszó újra</label>

      <div className="password-wrapper">
        <input
          type={showPasswordAgain ? "text" : "password"}
          className="form-control"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
        />

        <span className="password-eye" onClick={() => setShowPasswordAgain(!showPasswordAgain)} >
        {showPasswordAgain ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>

        <button type="submit" className="btn btn-primary btn-lg w-100">
        Mentés
        </button>
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
