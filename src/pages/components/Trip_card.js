import React from 'react';

const Trip_card = ({ hotel, onClick }) => {
    return (
        <div
            className="hotel-card border-custom"
            style={{ cursor: 'pointer' }}
            onClick={onClick}
        >
            <img
                src={hotel.image_url}
                alt={hotel.name}
                className="szallaskepek"
            />
            <div className="text-center p-3 bg-white">
                <h6 className="mb-1 text-muted">{hotel.city}</h6>
                <p className="mb-0 fw-bold">
                    {hotel.hotel_name}<br></br> <span style={{ color: '#f8b400' }}>{'★'.repeat(hotel.stars)}</span>
                </p>
            </div>
        </div>
    );
};

export default Trip_card;
