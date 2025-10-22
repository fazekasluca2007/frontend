import React, { useState, useEffect } from "react";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Ellenőrzés, hogy be van-e jelentkezve
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (loggedIn && storedUser) {
      alert(`Már be vagy jelentkezve, ${storedUser.fullName}!`);
      window.location.href = "velemenyek.html";
    }
  }, []);

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
    window.location.href = "velemenyek.html";
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
    <div className="card shadow p-6 w-[380px] mx-auto rounded-2xl bg-white">
      <h2 className="text-center text-2xl font-semibold mb-6" id="formTitle">
        {isLogin ? "Bejelentkezés" : "Regisztráció"}
      </h2>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 font-medium">
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              className="form-control w-full border rounded-md p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              className="form-control w-full border rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md"
            style={{ backgroundColor: "darkcyan", color: "white", border: "none" }}
          >
            Bejelentkezés
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="fullName" className="block mb-1 font-medium">
              Teljes név
            </label>
            <input
              type="text"
              id="fullName"
              className="form-control w-full border rounded-md p-2"
              placeholder="Add meg a teljes neved"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regUsername" className="block mb-1 font-medium">
              Felhasználónév
            </label>
            <input
              type="text"
              id="regUsername"
              className="form-control w-full border rounded-md p-2"
              placeholder="Válassz felhasználónevet"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regEmail" className="block mb-1 font-medium">
              E-mail cím
            </label>
            <input
              type="email"
              id="regEmail"
              className="form-control w-full border rounded-md p-2"
              placeholder="Add meg az e-mail címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regPassword" className="block mb-1 font-medium">
              Jelszó
            </label>
            <input
              type="password"
              id="regPassword"
              className="form-control w-full border rounded-md p-2"
              placeholder="Írj be egy jelszót"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regPassword2" className="block mb-1 font-medium">
              Jelszó ismét
            </label>
            <input
              type="password"
              id="regPassword2"
              className="form-control w-full border rounded-md p-2"
              placeholder="Írd be újra a jelszót"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md"
            style={{ backgroundColor: "darkcyan", color: "white", border: "none" }}
          >
            Regisztráció
          </button>
        </form>
      )}

      <p className="text-center mt-4 text-sm">
        {isLogin ? (
          <>
            Nincs fiókod?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="text-cyan-700 underline"
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
              className="text-cyan-700 underline"
            >
              Jelentkezz be!
            </button>
          </>
        )}
      </p>
    </div>
  );
}
