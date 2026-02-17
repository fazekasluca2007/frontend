import React, { useState, useEffect } from "react";
import "./UserPage.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultAvatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export default function UserPage() {
  const [editMode, setEditMode] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState(null);

  const [bookings, setBookings] = useState([]);

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
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("Profile response status:", response.status);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("A profil lekéréshez be kell jelentkezni!");
          } else if (response.status === 404) {
            toast.error("A profil nem található!");
          } else {
            toast.error("Hiba a profil lekérésekor!");
          }
          const text = await response.text();
          console.error("Server profile response:", text);
          return;
        }

        const data = await response.json();
        console.log("Fetched profile:", data);

        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setSelectedAvatar(data.profileImage || defaultAvatars[0]);
      } catch (error) {
        console.error("Fetch profile error:", error);
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
        const response = await fetch("https://localhost:7267/api/Booking/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("Bookings response status:", response.status);

        if (!response.ok) {
          console.error("Hiba a foglalások lekérésekor:", response.status);
          return;
        }

        const data = await response.json();
        console.log("Raw bookings response:", data);

        if (Array.isArray(data)) {
          setBookings(data);
        } else if (data && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Fetch bookings error:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCustomAvatar(URL.createObjectURL(file));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

    const updatedUser = {
      fullName,
      email,
      avatar: customAvatar || selectedAvatar,
      password: password ? "MÓDOSÍTVA" : "NEM változott",
    };

    console.log("Mentett adatok:", updatedUser);
    toast.success("Profil sikeresen frissítve!");
    setEditMode(false);
    setPassword("");
    setPasswordAgain("");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />

        <div className="profile-header">
          <h2>Felhasználói adatok</h2>
          {!editMode && (
            <span
              className="edit-icon"
              onClick={() => setEditMode(true)}
              title="Profil módosítása"
            >
              <i className="bi bi-pencil"></i>
            </span>
          )}
        </div>

        <img
          src={customAvatar || selectedAvatar}
          alt="Profilkép"
          className="profile-avatar"
        />

        {editMode && (
          <>
            <div className="avatar-grid">
              {defaultAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`avatar-${index}`}
                  className={`avatar-option ${
                    selectedAvatar === avatar ? "active" : ""
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
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </>
        )}

        <form onSubmit={handleSave}>
          <div className="field">
            <label>Teljes név</label>
            <input
              type="text"
              value={fullName}
              disabled={!editMode}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email / elérhetőség</label>
            <input
              type="email"
              value={email}
              disabled={!editMode}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {editMode && (
            <>
              <div className="field">
                <label>Új jelszó</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Új jelszó újra</label>
                <input
                  type="password"
                  value={passwordAgain}
                  onChange={(e) => setPasswordAgain(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                Mentés
              </button>
            </>
          )}
        </form>

        <div className="bookings">
          <h3>Foglalásaim</h3>

          {bookings.length === 0 ? (
            <p>Nincs még foglalásod.</p>
          ) : (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <strong>{booking.title}</strong>
                  <span>{booking.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}