import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

 
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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
      toast.error("Sikertelen bejelentkezés, próbáld újra!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Sikeres bejelentkezés!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }, 100);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !password2) {
      toast.error("Kérlek, tölts ki minden mezőt!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    if (password !== password2) {
      toast.error("A két jelszó nem egyezik!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.username === username)) {
      toast.error("Ez a felhasználónév már foglalt!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const newUser = { fullName, username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Sikeres regisztráció! Most bejelentkezhetsz.", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        setIsLogin(true);
        setLoading(false);
        setFullName("");
        setEmail("");
        setPassword("");
        setPassword2("");
      }, 1500);
    }, 100);
  };

  useEffect(() => {
    document.title = isLogin
      ? "EcoTrip – Bejelentkezés"
      : "EcoTrip – Regisztráció";
  }, [isLogin]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {loading && (
        <div className="auth-background d-flex justify-content-center align-items-center">
          <DotLoader color="white" size={70} />
        </div>
      )}

      {!loading && (
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

                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label fw-medium">
                    Jelszó
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "38px",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
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

                <div className="mb-3 position-relative">
                  <label htmlFor="regPassword" className="form-label fw-medium">
                    Jelszó
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="regPassword"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "38px",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="mb-3 position-relative">
                  <label htmlFor="regPassword2" className="form-label fw-medium">
                    Jelszó ismét
                  </label>
                  <input
                    type={showPassword2 ? "text" : "password"}
                    id="regPassword2"
                    className="form-control"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword2(!showPassword2)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "38px",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                  </span>
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
      )}
    </>
  );
}
