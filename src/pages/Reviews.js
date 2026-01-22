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
    const [editId, setEditId] = useState(null);
    const [loadError, setLoadError] = useState(false);

    const perPage = 6;


    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    const loggedUserName = userData
        ? userData.fullName || userData.username
        : null;


    useEffect(() => {
        fetch("https://localhost:7267/api/Reviews")
            .then((res) => res.json())
            .then((data) => {
                const apiVelemenyek = data.map((r) => ({
                    id: r.id,
                    name: r.name,
                    review: r.review,
                    stars: r.stars,
                }));

                const mentett =
                    JSON.parse(localStorage.getItem("userReviews")) || [];

                setVelemenyek([...apiVelemenyek, ...mentett]);
                setLoadError(false);
            })
            .catch(() => {
                const mentett =
                    JSON.parse(localStorage.getItem("userReviews")) || [];

                setVelemenyek(mentett);
                setLoadError(true);
            });

        document.title = "EcoTrip – Vélemények";
    }, []);

    const oldalakSzama = Math.ceil(velemenyek.length / perPage);
    const aktualisOldal = velemenyek.slice(
        (page - 1) * perPage,
        page * perPage
    );

    const csillagok = (db) => "⭐".repeat(db);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            editId &&
            velemenyek.find((v) => v.id === editId)?.name !== loggedUserName
        ) {
            toast.error("Ezt a véleményt nem módosíthatod!", {
                theme: "colored",
            });
            return;
        }

        const velemenyObj = {
            id: editId ?? 0,
            name: loggedUserName,
            review: text,
            stars: Number(rating),
        };

        try {
            const response = await fetch(
                editId
                    ? `https://localhost:7267/api/Reviews/${editId}`
                    : "https://localhost:7267/api/Reviews",
                {
                    method: editId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(velemenyObj),
                }
            );

            if (!response.ok) throw new Error("Mentési hiba");

            setText("");
            setRating("");
            setEditId(null);
            setPage(1);

            toast.success(
                editId
                    ? "A vélemény sikeresen frissítve lett."
                    : "A vélemény sikeresen rögzítve lett.",
                { theme: "colored" }
            );
        } catch (err) {
            console.error(err);
            toast.error("A művelet sikertelen.", { theme: "colored" });
        }
    };


    const startEdit = (v) => {
        if (v.name !== loggedUserName) return;

        setEditId(v.id);
        setText(v.review);
        setRating(v.stars.toString());
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

    return (
        <>
            <section className="reviews-section">
                <div className="container">
                    {loadError && (
                        <p className="text-center my-4">
                            Hiba az adatok lekérése során.
                        </p>
                    )}

                    <h2 className="text-center mb-5">
                        Élmények és vélemények utazóinktól
                    </h2>

                    <div className="reviews-grid">
                        {aktualisOldal.map((v) => (
                            <div key={v.id} className="review-card">
                                <div className="review-stars">
                                    {csillagok(v.stars)}
                                </div>
                                <p className="review-text">"{v.review}"</p>
                                <h6 className="review-author">{v.name}</h6>

                                {loggedIn && v.name === loggedUserName && (
                                    <i
                                        className="bi bi-pencil edit-icon"
                                        title="Szerkesztés"
                                        onClick={() => startEdit(v)}
                                    ></i>
                                )}
                            </div>
                        ))}
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
                            {editId
                                ? "Vélemény szerkesztése"
                                : "Oszd meg velünk az élményed"}
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
                                {editId
                                    ? "Módosítás mentése"
                                    : "Vélemény beküldése"}
                            </button>
                        </form>
                    </div>
                </section>
            )}

            <ToastContainer theme="colored" />
        </>
    );
}
