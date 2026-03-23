import React from 'react';

const Trip_card = ({ hotel, onClick, isEco }) => {
  return (
    <div className="hotel-card">
      {/* Hotel képe */}
      <img
        src={`/${hotel.image_url}`}
        alt={hotel.hotel_name}
        className="szallaskepek"
      />
      <div className="hotel-card-body">
        {/* Hotel neve */}
        <h5>{hotel.hotel_name}</h5>

        {/* Értékelés csillagok */}
        <div className="review-stars">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <i key={i} className="bi bi-star-fill review-star"></i>
          ))}
        </div>

        {/* Város és ország */}
        <p>{hotel.city} {hotel.country}</p>

        {/* Részletek gomb öko vagy normál stílus szerint */}
        <button
          className={isEco ? "btn btn-eco btn-lg mt-auto" : "btn btn-primary btn-lg mt-auto"}
          onClick={onClick}
        >
          További részletek
        </button>
      </div>
    </div>
  );
};

export default Trip_card;
