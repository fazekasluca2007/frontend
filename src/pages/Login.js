import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import "./Login.css";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (loggedIn && storedUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Hibás felhasználónév vagy jelszó!");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));

    setLoading(true);

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !password2) {
      alert("Kérlek, tölts ki minden mezőt!");
      return;
    }

    if (password !== password2) {
      alert("A két jelszó nem egyezik!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.username === username)) {
      alert("Ez a felhasználónév már foglalt!");
      return;
    }

    const newUser = { fullName, username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setLoading(true);

    setTimeout(() => {
      setIsLogin(true);
      setLoading(false);
      setFullName("");
      setEmail("");
      setPassword("");
      setPassword2("");
    }, 2000);
  };

  useEffect(() => {
    document.title = isLogin
      ? "EcoTrip – Bejelentkezés"
      : "EcoTrip – Regisztráció";
  }, [isLogin]);


  if (loading) {
    return (
      <div className="auth-background d-flex justify-content-center align-items-center">
        <DotLoader color="white" size={70} />
      </div>
    );
  }

  return (
    <div className="auth-background">
      <div className="card shadow p-4 rounded-4 auth-card">
        <h2 className="text-center fw-semibold mb-4" id="formTitle">
          {isLogin ? "Bejelentkezés" : "Regisztráció"}
        </h2>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-medium">
                Felhasználónév
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-medium">
                Jelszó
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn w-100 auth-button">
              Bejelentkezés
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label fw-medium">
                Teljes név
              </label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="regUsername" className="form-label fw-medium">
                Felhasználónév
              </label>
              <input
                type="text"
                id="regUsername"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="regEmail" className="form-label fw-medium">
                E-mail cím
              </label>
              <input
                type="email"
                id="regEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="regPassword" className="form-label fw-medium">
                Jelszó
              </label>
              <input
                type="password"
                id="regPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="regPassword2" className="form-label fw-medium">
                Jelszó ismét
              </label>
              <input
                type="password"
                id="regPassword2"
                className="form-control"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn w-100 auth-button">
              Regisztráció
            </button>
          </form>
        )}

        <p className="text-center mt-3 small">
          {isLogin ? (
            <>
              Nincs fiókod?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="btn btn-link auth-link text-primary"
              >
                Regisztrálj be!
              </button>
            </>
          ) : (
            <>
              Már van fiókod?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="btn btn-link auth-link text-primary"
              >
                Jelentkezz be!
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
