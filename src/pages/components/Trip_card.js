// import React from 'react';

// export default function Trip_card({country_flag, country_name, description, OnClick}) {
//     return (
//         <>
//             {/* Kész */}
//             <div className="trip-card">
//                 <div className="country-banner d-flex align-items-center mb-4">
//                     <div className="flag-box me-3">
//                         <img src={country.flag} alt={`${country_name} zászló`} className="zaszlokep" />
//                     </div>
//                     <div>
//                         <h3 className="mb-1">{country_name}</h3>
//                         <p className="fst-italic">{description}</p>
//                     </div>
//                 </div>

//                 {/* Nincs kész */}
//                 <div className="slider-wrapper">
//                     <button className="slider-btn left" onclick="moveSlide('${country.country}', -1)">&#10094;</button>
//                     <div className="slider-container">
//                         <div className="slider-track" id="slider-${country.country}">
//                             ${country.hotels.map(hotel => `
//             <div className="card shadow-sm hotel-card" data-bs-toggle="modal" data-bs-target="#${hotel.modalId}">
//               <img src="${hotel.img}" alt="${hotel.name}" className="szallaskepek">
//               <div className="card-body text-center">
//                 <h6>${hotel.city}</h6>
//                 <p>${hotel.name} ${'★'.repeat(hotel.stars)}</p>
//               </div>
//             </div>
//           `).join('')}
//                         </div>
//                     </div>
//                     <button className="slider-btn right" onclick="moveSlide('${country.country}', 1)">&#10095;</button>
//                 </div>



//                 {/* 
//                 <div className="slider-wrapper">
//                     <button className="slider-btn left" onClick={() => { }}>{"\u276E"}</button>
//                     <div className="slider-container">
//                         <div className="slider-track" id={`slider-${country.country}`}>
//                             {/* Ide írd majd a szállás kártyák HTML-jét */}
//                 { }
//             </div>
//         </div >
//             <button className="slider-btn right" onClick={() => { }}>{"\u276F"}</button>
//                 </div >
//             </div > */
// }


//         </>
//     )
// }

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
                    {hotel.hotel_name} <span style={{ color: '#f8b400' }}>{'★'.repeat(hotel.stars)}</span>
                </p>
            </div>
        </div>
    );
};

export default Trip_card;
