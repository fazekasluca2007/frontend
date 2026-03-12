import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import axios from "axios";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.(hu|com)$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function Login({ onLogin }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [showLoginForm, setShowLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notRobot, setNotRobot] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) navigate("/");
  }, [navigate]);

  useEffect(() => {
    document.title = showLoginForm ? "EcoTrip – Bejelentkezés" : "EcoTrip – Regisztráció";
  }, [showLoginForm]);

  const fetchProfileImage = async (userData, token) => {
    try {
      const res = await axios.get(`${backendUrl}Profile/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        userData.user = { ...userData.user, profileImage: res.data.profileImage };
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Kérem, töltsön ki minden mezőt!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}auth/login`, { username, password });
      const userData = res.data;
      const token = userData.token || userData.tokenDto?.token;

      if (token) localStorage.setItem("token", token);

      await fetchProfileImage(userData, token);

      onLogin(userData);
      toast.success("Sikeres bejelentkezés!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      const statusCode = error.response?.status;
      if (statusCode === 401 || statusCode === 400) {
        toast.error("Hibás felhasználónév vagy jelszó!");
      } else {
        toast.error("Hiba a szerverrel való kapcsolatban!");
      }
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !username || !email || !password || !confirmPassword) {
      toast.error("Kérem, töltsön ki minden mezőt!");
      return;
    }
    if (!notRobot) {
      toast.error("Kérem, jelölje be, hogy nem robot!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Hibás e-mail formátum! (pl: ecotripmail@gmail.com)");
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      toast.error(
        "A jelszónak minimum 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy számot és egy speciális karaktert."
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}auth/register`, { fullName, username, email, password });
      await sendWelcomeEmail(email, fullName);

      const loginRes = await axios.post(`${backendUrl}auth/login`, { username, password });
      const userData = loginRes.data;
      const token = userData.token || userData.tokenDto?.token;

      if (token) localStorage.setItem("token", token);

      await fetchProfileImage(userData, token);

      onLogin(userData);
      toast.success("Sikeres regisztráció!");
      setTimeout(() => navigate("/"), 1500);

      setFullName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNotRobot(false);    } catch (error) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || "";
      const errorData = error.response?.data;

      console.log("Registration error:", { statusCode, errorMessage, errorData });

      const message = typeof errorData === "string" ? errorData : errorMessage;

      if (message.includes("email") || message.includes("Email")) {
        toast.error("Ez az e-mail cím már regisztrálva van!");
      } else if (message.includes("username") || message.includes("Username") || message.includes("felhasználónév")) {
        toast.error("Ez a felhasználónév már foglalt!");
      } else if (statusCode === 409) {
        toast.error("Ez az adat már regisztrálva van!");
      } else if (statusCode === 400) {
        toast.error("Hibás adatok! Kérjük, ellenőrizze az eingefüllt adatokat.");
      } else {
        toast.error("Hiba a regisztráció során!");
      }
      setLoading(false);
    }
  };

  const sendWelcomeEmail = async (recipientEmail, name) => {
    try {
      await axios.post(`${backendUrl}Mail`, {
          to: recipientEmail,
          subject: "✈️ Üdvözlünk az EcoTrip családjában!",
          body: `
          <!DOCTYPE html>
          <html lang="hu">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Üdvözlünk az EcoTrip-en</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f6fb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f6fb; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; max-width: 100%;">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #1a3c57 0%, #2c5f8d 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          ✈️ EcoTrip 
                        </h1>
                        <p style="margin: 10px 0 0 0; color: #e8f5e9; font-size: 16px; font-weight: 400;">
                          Üdvözöljük az EcoTrip közösségében!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1a3c57; font-size: 28px; font-weight: 600; text-align: center;">
                          Sikeres regisztráció! 🎉
                        </h2>
                        
                        <p style="margin: 0 0 30px 0; color: #2c3e50; font-size: 16px; line-height: 1.8; text-align: center;">
                          Kedves <strong style="color: #2e7d32;">${name}</strong>!<br>
                          Köszönjük, hogy csatlakozott az EcoTrip közösségéhez! Nálunk megtalálja a tökéletes szállást.
                        </p>
                        
                        <h3 style="margin: 0 0 20px 0; color: #1a3c57; font-size: 22px; font-weight: 600; text-align: center;">
                          Fedezze fel ajánlatainkat! 🌍
                        </h3>
                    
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                      
                            <td style="width: 48%; vertical-align: top; padding-right: 10px;">
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e3f2fd; border-radius: 12px; padding: 20px; height: 100%;">
                                <tr>
                                  <td>
                                    <h3 style="margin: 0 0 15px 0; color: #1a3c57; font-size: 18px; font-weight: 600; text-align: center;">
                                      ✈️ Útjaink
                                    </h3>
                                    <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #1565c0;">🏨</strong> Minőségi szállodák
                                    </p>
                                    <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #1565c0;">🌍</strong> Világszerte elérhető
                                    </p>
                                    <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #1565c0;">⭐</strong> Kipróbált helyszínek
                                    </p>
                                    <p style="margin: 0 0 20px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #1565c0;">💰</strong> Kedvező árak
                                    </p>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td align="center">
                                          <a href="http://localhost:3000/utjaink" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(21, 101, 192, 0.3);">
                                            Hagyományos utak
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            
                            <td style="width: 48%; vertical-align: top; padding-left: 10px;">
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 12px; padding: 20px; height: 100%;">
                                <tr>
                                  <td>
                                    <h3 style="margin: 0 0 15px 0; color: #1a3c57; font-size: 18px; font-weight: 600; text-align: center;">
                                      🌿 ÖkoÚtjaink
                                    </h3>
                                    <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #2e7d32;">♻️</strong> Fenntartható szállások
                                    </p>
                                    <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #2e7d32;">🌱</strong> Öko-minősített helyek
                                    </p>
                                    <p style="margin: 0 0 12px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #2e7d32;">💚</strong> Környezetbarát
                                    </p>
                                    <p style="margin: 0 0 20px 0; color: #1a3c57; font-size: 14px; line-height: 1.6;">
                                      <strong style="color: #2e7d32;">🌍</strong> Zöld turizmus
                                    </p>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td align="center">
                                          <a href="http://localhost:3000/okoutjaink" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);">
                                            Öko utak
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 25px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.8; text-align: center; font-style: italic;">
                          Kezdje el az utazást velünk, és találja meg az álmai szállását!<br>
                          Jó pihenést és kellemes utazást kívánunk! ✨
                        </p>
                      </td>
                    </tr>
            
                    <tr>
                      <td style="padding: 0 40px;">
                        <hr style="border: none; border-top: 2px solid #e8f5e9; margin: 20px 0;">
                      </td>
                    </tr>
                  
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #fafafa;">
                        <p style="margin: 0 0 15px 0; color: #1a3c57; font-size: 16px; font-weight: 600;">
                          Kérdése van? Írjon nekünk!
                        </p>
                        <p style="margin: 0 0 25px 0; color: #6c757d; font-size: 14px;">
                          📧 <a href="mailto:ecotripmail@gmail.com" style="color: #2e7d32; text-decoration: none; font-weight: 500;">ecotripmail@gmail.com</a>
                        </p>
                        
                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto 25px;">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1a3c57; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: bold;">f</a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1a3c57; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 20px; font-weight: bold;">𝕏</a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1a3c57; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold;">in</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0; color: #95a5a6; font-size: 13px; line-height: 1.8;">
                          © 2026 EcoTrip. Minden jog fenntartva.<br>
                          <span style="color: #1565c0;">✈️</span> Utazzon velünk! <span style="color: #7bc96f;">🌍</span> Válasszon felelősen!
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />

      {loading && (
        <div className="auth-background d-flex justify-content-center align-items-center">
          <DotLoader color="#7dbf7d" size={70} />
        </div>
      )}

      {!loading && (
        <div className="auth-background">
          <div className="card shadow p-4 rounded-4 auth-card">
            <h2 className="text-center fw-semibold mb-4">
              {showLoginForm ? "Bejelentkezés" : "Regisztráció"}
            </h2>

            {showLoginForm ? (
              <form onSubmit={handleLogin}>
                <input
                  className="form-control mb-3"
                  placeholder="Felhasználónév"
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
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control pe-5"
                    placeholder="Jelszó ismét"
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

                <div
                  className={`fake-recaptcha ${notRobot ? "checked" : ""}`}
                  onClick={() => setNotRobot(!notRobot)}
                >
                  <div className="fake-checkbox">
                    {notRobot && <span className="checkmark"><i className="bi bi-check-lg text-primary"></i></span>}
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
              {showLoginForm ? (
                <>
                  Nincs fiókja?{" "}
                  <button
                    type="button"
                    className="btn btn-link auth-link"
                    onClick={() => setShowLoginForm(false)}
                  >
                    Regisztráljon!
                  </button>
                </>
              ) : (
                <>
                  Van már fiókja?{" "}
                  <button
                    type="button"
                    className="btn btn-link auth-link"
                    onClick={() => setShowLoginForm(true)}
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