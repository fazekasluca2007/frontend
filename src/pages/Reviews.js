import React, { useState, useEffect } from "react";
import "./Reviews.css";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BeatLoader from "react-spinners/BeatLoader";
import { Link } from "react-router-dom";

export default function Reviews() {
  const URL = process.env.REACT_APP_BACKEND_URL;

  const [velemenyek, setVelemenyek] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [editId, setEditId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  const perPage = 6;

  const loggedIn = localStorage.getItem("user") !== null;
  const userData = JSON.parse(localStorage.getItem("user"));

  const loggedUserName = userData
    ? userData?.user?.fullName ||
      userData?.user?.username ||
      userData?.user?.email ||
      "Felhasználó"
    : "Felhasználó";

  const fetchReviews = () => {
    setLoading(true);
    fetch(URL + "Reviews")
      .then((res) => res.json())
      .then((data) => {
        setVelemenyek(data);
        setLoadError(false);
        setLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
    document.title = "EcoTrip – Vélemények";
    window.scrollTo(0, 0);
  }, [URL]);

  const oldalakSzama = Math.ceil(velemenyek.length / perPage);
  const aktualisOldal = velemenyek.slice((page - 1) * perPage, page * perPage);

  const renderStars = (db) =>
    Array.from({ length: db }).map((_, i) => (
      <i key={i} className="bi bi-star-fill review-star"></i>
    ));

  const handleEdit = (v) => {
    setEditId(v.id);
    setText(v.review);
    setRating(v.stars.toString());
    const formElement = document.getElementById("review-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  const confirmDelete = (id) => {
    const toastId = toast.error(
      <div>
        <p className="mb-2" style={{ fontSize: "14px" }}>Biztosan törölni szeretnéd?</p>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-light btn-sm px-3" 
            style={{ fontSize: "12px", fontWeight: "bold" }}
            onClick={() => { executeDelete(id); toast.dismiss(toastId); }}
          >
            Igen
          </button>
          <button 
            className="btn btn-outline-light btn-sm px-3" 
            style={{ fontSize: "12px" }}
            onClick={() => toast.dismiss(toastId)}
          >
            Mégse
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        theme: "colored",
      }
    );
  };

  const executeDelete = async (id) => {
    try {
      const response = await fetch(URL + `Reviews/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success("A vélemény törölve.", { theme: "colored" });
      fetchReviews();
    } catch {
      toast.error("Hiba történt a törlés során.", { theme: "colored" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedUserName) {
      toast.error("Nem sikerült azonosítani a felhasználót. Jelentkezz be újra!");
      return;
    }

    const velemenyObj = {
      id: editId ?? 0,          
      name: loggedUserName,     
      review: text,
      stars: Number(rating),
    };

    console.log("Beküldött adat:", velemenyObj);

    try {
      const response = await fetch(
        editId ? URL + `Reviews/${editId}` : URL + "Reviews",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(velemenyObj),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Backend válasz:", errorText);
        throw new Error(errorText);
      }

      setText("");
      setRating("");
      setEditId(null);
      fetchReviews();
      toast.success("A vélemény mentve.", { theme: "colored" });
    } catch {
      toast.error("Hiba történt a mentés során.", { theme: "colored" });
    }
  };

  return (
    <>
      <ToastContainer />
      {(loading || loadError) && (
        <div className="d-flex justify-content-center my-5">
          <BeatLoader color="#a87c5c" size={15} />
        </div>
      )}

      {loadError && (
        <p className="error text-center my-4">Hiba az adatok lekérése során.</p>
      )}

      {!loading && !loadError && (
        <>
          <section className="reviews-section">
            <div className="container">
              
              <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ minHeight: "60px" }}>
                
                {!loggedIn && (
                  <div className="login-prompt position-absolute start-0 d-none d-lg-flex align-items-center gap-2">
                    <span>Szeretnél véleményt írni? Jelentkezz be!</span>
                    <Link to="/bejelentkezes" className="login-btn-circle">
                      <FaArrowRight size={12} />
                    </Link>
                  </div>
                )}

                <h2 className="text-center m-0">Élmények és vélemények utazóinktól</h2>
              </div>

              {!loggedIn && (
                <div className="d-lg-none text-center mb-4 login-prompt">
                   <span>Szeretnél véleményt írni? </span>
                   <Link to="/bejelentkezes" className="text-dark fw-bold">Jelentkezz be!</Link>
                </div>
              )}

              <div className="reviews-grid">
                {aktualisOldal.map((v) => (
                  <div key={v.id} className="review-card">
                    <div className="review-stars">{renderStars(v.stars)}</div>
                    <p className="review-text">"{v.review}"</p>
                    
                    <div className="d-flex justify-content-between align-items-end mt-auto">
                      <h6 className="review-author mb-0">{v.name}</h6>
                      {loggedIn && v.name === loggedUserName && (
                        <div className="review-actions">
                          <i 
                            className="bi bi-pencil text-primary me-2 pointer-icon" 
                            onClick={() => handleEdit(v)}
                            title="Szerkesztés"
                          ></i>
                          <i 
                            className="bi bi-trash text-danger pointer-icon" 
                            onClick={() => confirmDelete(v.id)}
                            title="Törlés"
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination-container">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="pagination-btn">
                  <FaChevronLeft />
                </button>
                <span>Oldal {page}/{oldalakSzama || 1}</span>
                <button onClick={() => setPage(page + 1)} disabled={page === oldalakSzama} className="pagination-btn">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </section>

          {loggedIn && (
            <section id="review-form" style={{ padding: "50px 0" }}>
              <div className="container">
                <h3 className="text-center mb-4">{editId ? "Vélemény módosítása" : "Vélemény írása"}</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
                  <textarea
                    rows="3"
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Írd le a tapasztalataidat..."
                  />
                  <select
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="form-control mb-3"
                  >
                    <option value="">Válassz értékelést...</option>
                    <option value="1">★ – Csalódás</option>
                    <option value="2">★★ – Lehetne jobb</option>
                    <option value="3">★★★ – Rendben volt</option>
                    <option value="4">★★★★ – Nagyon tetszett</option>
                    <option value="5">★★★★★ – Fantasztikus élmény</option>
                  </select>
                  
                  <div className="d-flex flex-column align-items-center gap-2">
                    <button className="btn btn-success w-100">
                      {editId ? "Módosítás mentése" : "Vélemény beküldése"}
                    </button>
                    
                  {editId && (
                  <button type="button" className="cancel-btn" onClick={() => {setEditId(null); setText(""); setRating("");}}>
                    Mégse
                  </button>
                  )}
                  </div>
                </form>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
