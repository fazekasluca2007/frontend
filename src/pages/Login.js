import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login({ onLogin }) {
  const URL = process.env.REACT_APP_BACKEND_URL;

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
      toast.error("Kérem, töltsön ki minden mezőt!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(URL + "auth/login", {
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

        try {
          const profileRes = await fetch(URL + "Profile/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          });

          if (profileRes.ok) {
            const profileData = await profileRes.json();
            user.user = {
              ...user.user,
              profileImage: profileData.profileImage
            };
          }
        } catch (profileError) {
          console.error("Profilkép hiba:", profileError);
        }

        onLogin(user);
        toast.success("Sikeres bejelentkezés!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        let errorMessage = "Hibás felhasználónév vagy jelszó!";
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch { }
        toast.error(errorMessage);
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
      toast.error("Kérem, töltsön ki minden mezőt!");
      return;
    }

    if (!notRobot) {
      toast.error("Kérem, jelölje be, hogy nem robot!");
      return;
    }

    if (password !== password2) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Hibás e-mail formátum! (pl: ecotripmail@gmail.com)");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "A jelszónak minimum 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy számot és egy speciális karaktert."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(URL + "auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      if (response.ok) {

        await sendWelcomeEmail(email, fullName);

        try {

          const loginResponse = await fetch(URL + "auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          if (loginResponse.ok) {

            const user = await loginResponse.json();

            const token = user.token || (user.tokenDto && user.tokenDto.token);

            if (token) {
              localStorage.setItem("token", token);
            }

            try {
              const profileRes = await fetch(URL + "Profile/profile", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
              });

              if (profileRes.ok) {
                const profileData = await profileRes.json();
                user.user = {
                  ...user.user,
                  profileImage: profileData.profileImage
                };
              }

            } catch (profileError) {
              console.error("Profilkép hiba:", profileError);
            }

            onLogin(user);
            toast.success("Sikeres regisztráció!");
            setTimeout(() => {
              navigate("/");
            }, 1500);

            setFullName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setPassword2("");
            setNotRobot(false);

          }

        } catch (loginError) {
          console.error("Auto login hiba:", loginError);
        }

      } else {

        let errorMessage = "A regisztráció sikertelen!";

        try {
          const text = await response.text();
          const lower = text.toLowerCase();

          if (lower.includes("email")) {
            errorMessage = "Ez az e-mail cím már regisztrálva van!";
          } else if (lower.includes("felhasználónév") || lower.includes("username")) {
            errorMessage = "Ez a felhasználónév már foglalt!";
          } else {
            errorMessage = text;
          }
        } catch {
          errorMessage = "Szerver hiba történt!";
        }

        toast.error(errorMessage);

      }

    } catch (error) {
      toast.error("Hiba a szerverrel való kapcsolatban!");
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeEmail = async (email, name) => {
    try {
      await fetch(URL + "Mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Sikeres regisztráció - EcoTrip 🌱",
          body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2e7d32;">Üdvözlünk az EcoTrip oldalán!🌿</h2>
            
            <p>Kedves <strong>${name}</strong>!</p>
            
            <p>
              Köszönjük, hogy regisztrált az <strong>EcoTrip</strong> oldalunkra!🎉
            </p>
            
            <p>
              Böngésszen az oldalunkon az alábbi linken:
            </p>
            
            <a href="http://localhost:3000/">
                http://localhost:3000/
            </a>
          
            <p style="font-size:14px; color:gray;">
              Üdvözlettel,<br/>
              Az EcoTrip csapata
            </p>
          </div>
        `,
        }),
      });
    } catch (err) {
      console.error("Email küldési hiba:", err);
    }
  };

  useEffect(() => {
    document.title =
      isLogin ? "EcoTrip – Bejelentkezés" : "EcoTrip – Regisztráció";
  }, [isLogin]);

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
              {isLogin ? "Bejelentkezés" : "Regisztráció"}
            </h2>

            {isLogin ? (
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

                <div
                  className={`fake-recaptcha ${notRobot ? "checked" : ""}`}
                  onClick={() => setNotRobot(!notRobot)}
                >
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
                  Nincs fiókja?{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsLogin(false)}
                  >
                    Regisztráljon!
                  </button>
                </>
              ) : (
                <>
                  Van már fiókja?{" "}
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