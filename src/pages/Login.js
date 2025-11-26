import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <- importálni kell

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate(); // <- navigációhoz

  // Ellenőrzés, hogy be van-e jelentkezve → Home page-re navigál
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (loggedIn && storedUser) {
      navigate("/"); // Home page
    }
  }, [navigate]);

  // Bejelentkezés logika
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
    alert(`Üdv újra, ${user.fullName}!`);
    navigate("/"); // Home page
  };

  // Regisztráció logika
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

    alert("Sikeres regisztráció! Most bejelentkezhetsz.");
    setIsLogin(true);
    setFullName("");
    setEmail("");
    setPassword("");
    setPassword2("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow p-4 rounded-4"
        style={{ width: "380px", backgroundColor: "white" }}
      >
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

            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "darkcyan", color: "white" }}
            >
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
                placeholder="Add meg a teljes neved"
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
                placeholder="Válassz felhasználónevet"
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
                placeholder="Add meg az e-mail címed"
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
                placeholder="Írj be egy jelszót"
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
                placeholder="Írd be újra a jelszót"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "darkcyan", color: "white" }}
            >
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
                className="btn btn-link p-0 text-decoration-underline text-primary"
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
                className="btn btn-link p-0 text-decoration-underline text-primary"
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
