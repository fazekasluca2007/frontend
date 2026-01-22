import React, { useState, useEffect } from "react";
import "./Reviews.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reviews() {
    const [velemenyek, setVelemenyek] = useState([]);
    const [page, setPage] = useState(1);
    const [text, setText] = useState("");
    const [rating, setRating] = useState("");
    const [loadError, setLoadError] = useState(false);

    const perPage = 6;
    const API_URL = "https://localhost:7267/api/Reviews";

    const fetchReviews = async () => {
        try {
            setLoadError(false);
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Hiba a vélemények lekérésekor");
            const data = await res.json();

            const apiVelemenyek = data.map(
                (r) => `${r.name};${r.review};${r.stars}`
            );

            setVelemenyek(apiVelemenyek);
        } catch (err) {
            console.error(err);
            setLoadError(true);
        }
    };

    useEffect(() => {
        fetchReviews();
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = JSON.parse(localStorage.getItem("user"));
        const userName = userData.fullName || userData.username;

        const ujVelemeny = {
            id: 0,
            name: userName,
            review: text,
            stars: Number(rating),
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ujVelemeny),
            });

            if (!response.ok) throw new Error("Mentési hiba");

            await fetchReviews();

            setText("");
            setRating("");
            setPage(1);

            toast.success("A véleménye sikeresen rögzítve lett.", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        } catch (err) {
            console.error(err);
            toast.error(
                "A vélemény elküldése sikertelen. Kérjük, próbálja újra később.",
                {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                }
            );
        }
    };

    return (
        <>
            <section className="reviews-section">
                <div className="container">
                    {loadError && (
                        <p className="text-center my-4">
                            Hiba az adatok lekérése során. Kérlek, próbáld újra később.
                        </p>
                    )}

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
                            className="pagination-btn"
                        >
                            <FaChevronLeft />
                        </button>

                        <span>
                            Oldal {page}/{oldalakSzama || 1}
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={
                                page === oldalakSzama || oldalakSzama === 0
                            }
                            className="pagination-btn"
                        >
                            <FaChevronRight />
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
        </>
    );
}
