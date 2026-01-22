import React, { useState, useEffect } from "react";
import "./Reviews.css";

export default function Reviews() {
    const [velemenyek, setVelemenyek] = useState([]);
    const [page, setPage] = useState(1);
    const [text, setText] = useState("");
    const [rating, setRating] = useState("");

    const perPage = 6;


    useEffect(() => {
        fetch("https://localhost:7267/api/Reviews")
            .then((res) => res.json())
            .then((data) => {
                const apiVelemenyek = data.map(
                    (r) => `${r.name};${r.review};${r.stars}`
                );

                const mentett =
                    JSON.parse(localStorage.getItem("userReviews")) || [];

                setVelemenyek([apiVelemenyek, mentett]);
            })
            .catch(() => {
                const mentett =
                    JSON.parse(localStorage.getItem("userReviews")) || [];

                setVelemenyek(mentett);
            });
    }, []);

    useEffect(() => {
        document.title = "EcoTrip – Vélemények";
    }, []);

    const oldalakSzama = Math.ceil(velemenyek.length / perPage);
    const aktualisOldal = velemenyek.slice(
        (page - 1) * perPage,
        page * perPage
    );

    const loggedIn = localStorage.getItem("loggedIn") === "true";

    const csillagok = (db) => "⭐".repeat(db);

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = JSON.parse(localStorage.getItem("user") || "null");
        if (!loggedIn || !userData) {
            alert("Csak bejelentkezett felhasználók írhatnak véleményt!");
            return;
        }

        const userName = userData.fullName || userData.username;
        const uj = `${userName};${text};${rating}`;

        setVelemenyek([uj, ...velemenyek]);

        const mentett =
            JSON.parse(localStorage.getItem("userReviews")) || [];
        mentett.unshift(uj);
        localStorage.setItem("userReviews", JSON.stringify(mentett));

        setText("");
        setRating("");
    };

    return (
        <>
            <section className="reviews-section">
                <div className="container">
                    <h2 className="text-center mb-5">
                        Élmények és vélemények utazóinktól
                    </h2>

                    <div className="reviews-grid">
                        {aktualisOldal.map((v, i) => {
                            const [nev, szoveg, csill] = v.split(";");

                            return (
                                <div key={i} className="review-card">
                                    <div className="review-stars">
                                        {csillagok(Number(csill))}
                                    </div>
                                    <p className="review-text">"{szoveg}"</p>
                                    <h6 className="review-author">{nev}</h6>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pagination-container">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            ◀
                        </button>

                        <span>
                            Oldal {page}/{oldalakSzama}
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === oldalakSzama}
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </section>

            {loggedIn && (
                <section style={{ padding: "50px 0" }}>
                    <div className="container">
                        <h3 className="text-center mb-4">
                            Oszd meg velünk az élményed
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            style={{ maxWidth: "600px", margin: "0 auto" }}
                        >
                            <textarea
                                rows="3"
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="form-control mb-3"
                            />

                            <select
                                required
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="form-control mb-3"
                            >
                                <option value="">Válassz értékelést...</option>
                                <option value="1">1 – Csalódás</option>
                                <option value="2">2 – Lehetne jobb</option>
                                <option value="3">3 – Rendben volt</option>
                                <option value="4">4 – Nagyon tetszett</option>
                                <option value="5">5 – Fantasztikus élmény</option>
                            </select>

                            <button className="btn btn-success w-100">
                                Vélemény beküldése
                            </button>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
}