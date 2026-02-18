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
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          "https://localhost:7267/api/Profile/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) return;

        const data = await response.json();
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setSelectedAvatar(data.profileImage || defaultAvatars[0]);
      } catch {}
    };

    fetchProfile();
  }, []);


  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          "https://localhost:7267/api/Bookings/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) return;

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch {}
    };

    fetchBookings();
  }, []);


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
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        theme: "colored",
      }
    );
  };

  const executeDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Nincs bejelentkezve!");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7267/api/Bookings/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

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

  const handleSave = (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

    toast.success("Profil frissítve!", { theme: "colored" });
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

        {(customAvatar || selectedAvatar) && (
          <img
            src={customAvatar || selectedAvatar}
            alt="Profilkép"
            className="profile-avatar"
          />
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
            <label>Email</label>
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
      </div>
    </div>
  );
}
