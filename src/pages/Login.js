import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [notRobot, setNotRobot] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Kérlek, tölts ki minden mezőt!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://localhost:7267/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();

        const token = user.token || (user.tokenDto && user.tokenDto.token);
        if (token) {
          localStorage.setItem("token", token);
        }

        onLogin(user);
        toast.success("Sikeres bejelentkezés!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Sikertelen bejelentkezés!");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Hiba a szerverrel való kapcsolatban!");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !password2) {
      toast.error("Kérlek, tölts ki minden mezőt!");
      return;
    }

    if (!notRobot) {
      toast.error("Kérlek, jelöld be, hogy nem vagy robot!");
      return;
    }

    if (password !== password2) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://localhost:7267/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      if (response.ok) {
        toast.success("Sikeres regisztráció! Most bejelentkezhetsz.");
        setIsLogin(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setPassword2("");
        setNotRobot(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "A regisztráció sikertelen!");
      }
    } catch (error) {
      toast.error("Hiba a szerverrel való kapcsolatban!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = isLogin
      ? "EcoTrip – Bejelentkezés"
      : "EcoTrip – Regisztráció";
  }, [isLogin]);

  return (
    <>
      <ToastContainer theme="colored" />

      {loading && (
        <div className="auth-background d-flex justify-content-center align-items-center">
          <DotLoader color="white" size={70} />
        </div>
      )}

      {!loading && (
        <div className="auth-background">
          <div className="card shadow p-4 rounded-4 auth-card">
            <h2 className="text-center fw-semibold mb-4">
              {isLogin ? "Bejelentkezés" : "Regisztráció"}
            </h2>

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <input
                  className="form-control mb-3"
                  placeholder="Felhasználónév / E-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control pe-5"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span
                    className="password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <button className="btn w-100 auth-button" type="submit">
                  Bejelentkezés
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <input
                  className="form-control mb-2"
                  placeholder="Teljes név"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Felhasználónév"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="mb-2 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control pe-5"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    className="form-control pe-5"
                    placeholder="Jelszó ismét"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                  <span
                    className="password-eye"
                    onClick={() => setShowPassword2(!showPassword2)}
                  >
                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className={`fake-recaptcha ${notRobot ? "checked" : ""}`} onClick={() => setNotRobot(!notRobot)}>
                  <div className="fake-checkbox">
                    {notRobot && <span className="checkmark">✔</span>}
                  </div>
                  <span className="fake-text">Nem vagyok robot</span>
                  <div className="fake-logo">
                    <div className="recaptcha-icon"></div>
                    <small>reCAPTCHA</small>
                  </div>
                </div>

                <button className="btn w-100 auth-button" type="submit">
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
                    className="btn btn-link"
                    onClick={() => setIsLogin(false)}
                  >
                    Regisztrálj!
                  </button>
                </>
              ) : (
                <>
                  Van már fiókod?{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsLogin(true)}
                  >
                    Bejelentkezés
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
