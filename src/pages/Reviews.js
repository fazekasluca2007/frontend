import React, { useState, useEffect } from "react";



export default function Reviews() {
    const velemenyekAlap = [
        "Anna;Csodás élmény volt! A szervezés profi, a programok változatosak.;5",
        "Balázs;Nagyon tetszett az ÖkoÚt koncepció! Jó érzés volt felelősen utazni.;4",
        "Kata;Kiváló szervezés, kedves idegenvezetők és csodás helyszínek.;5",
        "Dani;Minden flottul ment, de az időjárás közbeszólt. Ettől függetlenül szuper volt.;4",
        "Réka;Első utam az EcoTrippel, és biztosan nem az utolsó!;5",
    ];

    const [velemenyek, setVelemenyek] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [text, setText] = React.useState("");
    const [rating, setRating] = React.useState("");

    const perPage = 6;

    // Betöltés localStorage-ből
    React.useEffect(() => {
        const mentett = JSON.parse(localStorage.getItem("userReviews")) || [];
        setVelemenyek([...velemenyekAlap, ...mentett]);
    }, []);

    const oldalakSzama = Math.ceil(velemenyek.length / perPage);
    const aktualisOldal = velemenyek.slice((page - 1) * perPage, page * perPage);

    const elozoOldal = () => setPage((p) => Math.max(1, p - 1));
    const kovetkezoOldal = () => setPage((p) => Math.min(oldalakSzama, p + 1));

    // Vélemény küldése
    const handleSubmit = (e) => {
        e.preventDefault();

        const loggedIn = localStorage.getItem("loggedIn") === "true";
        const userData = JSON.parse(localStorage.getItem("user") || "null");

        if (!loggedIn || !userData) {
            alert("Csak bejelentkezett felhasználók írhatnak véleményt!");
            return;
        }

        const userName = userData.fullName || userData.username;
        const uj = `${userName};${text};${rating}`;

        const ujLista = [uj, ...velemenyek];
        setVelemenyek(ujLista);

        const mentett = JSON.parse(localStorage.getItem("userReviews")) || [];
        mentett.unshift(uj);
        localStorage.setItem("userReviews", JSON.stringify(mentett));

        setText("");
        setRating("");
        alert("Köszönjük a véleményed!");
    };

    const loggedIn = localStorage.getItem("loggedIn") === "true";

    const csillagok = (db) => "⭐".repeat(db) + "".repeat(5 - db);

    return (
        <>
            {/* Vélemények listája */}
            <section className="reviews-section" style={{ padding: "50px 0" }}>
                <div className="container">
                    <h2 className="text-center mb-5">Utazóink véleményei</h2>

                    <div
                        className="row g-4"
                        style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
                    >
                        {aktualisOldal.map((v, i) => {
                            const [nev, szoveg, csill] = v.split(";");
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: "1 1 calc(33% - 20px)",
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        boxShadow: "0 0 10px #1a3c57",
                                    }}
                                >
                                    <div style={{ color: "gold", fontSize: "20px" }}>
                                        {csillagok(Number(csill))}
                                    </div>
                                    <p style={{ fontStyle: "italic" }}>"{szoveg}"</p>
                                    <h6 style={{ fontWeight: "bold" }}>{nev}</h6>
                                </div>
                            );
                        })}
                    </div>

                    {/* Lapozás */}
                    <div className="pagination-container" style={{ textAlign: "center", marginTop: "30px" }}>
                        <button
                            onClick={elozoOldal}
                            disabled={page === 1}
                            style={{
                                border: "1px solid #1a3c57",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                marginRight: "10px",
                                cursor: "pointer",
                            }}
                        >
                            ◀
                        </button>
                        <span>Oldal {page}/{oldalakSzama}</span>
                        <button
                            onClick={kovetkezoOldal}
                            disabled={page === oldalakSzama}
                            style={{
                                border: "1px solid #1a3c57",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                marginLeft: "10px",
                                cursor: "pointer",
                            }}
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </section>

            {/* Vélemény beküldése */}
            {loggedIn && (
                <section style={{ padding: "50px 0" }}>
                    <div className="container">
                        <h3 className="text-center mb-4">Írd meg a véleményed</h3>
                        <form
                            onSubmit={handleSubmit}
                            style={{ maxWidth: "600px", margin: "0 auto" }}
                        >
                            <div className="mb-3">
                                <label htmlFor="reviewText" className="form-label">
                                    Véleményed
                                </label>
                                <textarea
                                    id="reviewText"
                                    rows="3"
                                    required
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        border: "1px solid gray",
                                    }}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reviewRating" className="form-label">
                                    Értékelés (1–5)
                                </label>
                                <select
                                    id="reviewRating"
                                    required
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        border: "1px solid gray",
                                    }}
                                >
                                    <option value="">Válassz...</option>
                                    <option value="1">1 – Gyenge</option>
                                    <option value="2">2 – Elmegy</option>
                                    <option value="3">3 – Jó</option>
                                    <option value="4">4 – Nagyon jó</option>
                                    <option value="5">5 – Kiváló</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: "darkcyan",
                                    border: "none",
                                    color: "white",
                                    padding: "10px",
                                    width: "100%",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Vélemény beküldése
                            </button>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
}
