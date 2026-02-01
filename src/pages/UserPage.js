import React, { useState } from "react";
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

const loggedInUser = {
  username: "Luca",
  email: "luca@email.hu",
  avatar: "/avatars/avatar3.png",
  bookings: [
    { id: 1, title: "Wellness hétvége", date: "2026-03-12" },
    { id: 2, title: "Városnéző túra", date: "2026-04-05" },
  ],
};


const takenUsernames = ["admin", "test", "Luca123"];

export default function UserPage() {
  const [editMode, setEditMode] = useState(false);

  const [username, setUsername] = useState(loggedInUser.username);
  const [email, setEmail] = useState(loggedInUser.email);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState(loggedInUser.avatar);
  const [customAvatar, setCustomAvatar] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

  
    if (password !== passwordAgain) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

   
    if (
      username !== loggedInUser.username &&
      takenUsernames.includes(username)
    ) {
      toast.error("Ez a felhasználónév már foglalt!");
      return;
    }

    const updatedUser = {
      username,
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
    
        <ToastContainer
          theme="colored"
          position="top-right"
          autoClose={3000}
        />

      
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
            <label>Felhasználónév</label>
            <input
              type="text"
              value={username}
              disabled={!editMode}
              onChange={(e) => setUsername(e.target.value)}
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

          {loggedInUser.bookings.length === 0 ? (
            <p>Nincs még foglalásod.</p>
          ) : (
            <ul>
              {loggedInUser.bookings.map((booking) => (
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
