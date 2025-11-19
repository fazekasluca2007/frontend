import React, { useState } from "react";
import "./Trip.css";
import Trip_card from './components/Trip_card';
import Nav from './components/Nav';
import Footer from './components/Footer';
const data = [
  {
    country: "Magyarország",
    flag: "img/zaszlok/hu.png",
    description:
      "„Magyarország a történelem, a kultúra és a vendégszeretet találkozása – ahol minden város egy új történetet mesél, és minden táj egy új élményt kínál.”",
    hotels: [
      {
        city: "Budapest",
        name: "Aria Hotel",
        stars: 5,
        img: "img/utjaink kepek/hu_ariahotel.jpg",
        modalId: "budapestModal",
        modalText: `
          <img src="img/utjaink kepek/hu_ariahotel.jpg" class="img-fluid rounded mb-3" alt="Aria Hotel Budapest">
          <p><strong>Leírás:</strong> Az Aria Hotel Budapest szívében, a Szent István Bazilika mellett található luxusszálloda, mely zenei tematikájával és tetőteraszáról nyíló kilátásával páratlan élményt kínál.</p>
          <p><strong>Szolgáltatások:</strong> Wellness & spa, tetőterasz, étterem, ingyenes Wi-Fi, fitneszterem.</p>
          <p><strong>Ár:</strong> 65 000 Ft / éjszaka / fő</p>
        `,
      },
      {
        city: "Lillafüred",
        name: "Hunguest Hotel Palota",
        stars: 4,
        img: "img/utjaink kepek/hu_palotaszallo.jpg",
        modalId: "lillafuredModal",
        modalText: `
          <img src="img/utjaink kepek/hu_palotaszallo.jpg" class="img-fluid rounded mb-3" alt="Hunguest Hotel Palota">
          <p><strong>Leírás:</strong> A festői Hámori-tó partján, a Bükk-hegység szívében álló Palotaszálló a természet szerelmeseinek tökéletes választás.</p>
          <p><strong>Szolgáltatások:</strong> Wellness részleg, erdei túraútvonalak, étterem, horgászat, parkoló.</p>
          <p><strong>Ár:</strong> 38 000 Ft / éjszaka / fő</p>
        `,
      },
      {
        city: "Szeged",
        name: "Danubius Hotel Helia",
        stars: 4,
        img: "img/utjaink kepek/hu_danubis.jpg",
        modalId: "szegedModal",
        modalText: `
          <img src="img/utjaink kepek/hu_danubis.jpg" class="img-fluid rounded mb-3" alt="Danubius Hotel Helia">
          <p><strong>Leírás:</strong> A napfény városában található hotel modern felszereltségével és központi elhelyezkedésével ideális pihenésre és városnézésre is.</p>
          <p><strong>Szolgáltatások:</strong> Medence, szauna, étterem, konferenciaterem, Wi-Fi.</p>
          <p><strong>Ár:</strong> 32 000 Ft / éjszaka / fő</p>
        `,
      },
      {
        city: "Pécs",
        name: "Palatinus Grand Hotel",
        stars: 4,
        img: "img/utjaink kepek/hu_platinus.jpg",
        modalId: "pecsModal",
        modalText: `
          <img src="img/utjaink kepek/hu_platinus.jpg" class="img-fluid rounded mb-3" alt="Palatinus Grand Hotel">
          <p><strong>Leírás:</strong> A Palatinus Grand Hotel a pécsi belváros szívében helyezkedik el, gyönyörű szecessziós stílusban. A város kulturális látnivalói mind pár perc sétára találhatók.</p>
          <p><strong>Szolgáltatások:</strong> Étterem, bár, wellness, parkolási lehetőség.</p>
          <p><strong>Ár:</strong> 29 500 Ft / éjszaka / fő</p>
        `,
      },
    ],
  },
  {
    country: "Olaszország",
    flag: "img/zaszlok/it.png",
    description:
      "„Olaszország a művészet, a gasztronómia és a dolce vita hazája – ahol minden utca egy festmény, minden étel egy élmény, és minden pillanat egy emlék.”",
    hotels: [
      {
        city: "Róma",
        name: "Hotel Artemide",
        stars: 4,
        img: "img/utjaink kepek/it_artemide.jpg",
        modalId: "romaModal",
        modalText: `
          <img src="img/utjaink kepek/it_artemide.jpg" class="img-fluid rounded mb-3" alt="Hotel Artemide Róma">
          <p><strong>Leírás:</strong> A történelmi Róma szívében található hotel tökéletes kiindulópont a Colosseum, a Trevi-kút és a Vatikán felfedezéséhez.</p>
          <p><strong>Szolgáltatások:</strong> Tetőterasz, olasz étterem, spa részleg, 24 órás recepció.</p>
          <p><strong>Ár:</strong> 72 000 Ft / éjszaka / fő</p>
        `,
      },
      {
        city: "Toszkána",
        name: "Agriturismo La Poggiolina",
        stars: 3,
        img: "img/utjaink kepek/it_lapoggiolina.jpg",
        modalId: "toszkanaModal",
        modalText: `
          <img src="img/utjaink kepek/it_lapoggiolina.jpg" class="img-fluid rounded mb-3" alt="Agriturismo La Poggiolina">
          <p><strong>Leírás:</strong> Egy autentikus vidéki szállás a toszkán dombok között, helyi borokkal, házi ételekkel és lélegzetelállító kilátással.</p>
          <p><strong>Szolgáltatások:</strong> Borkóstoló, kert, medence, házi készítésű reggeli.</p>
          <p><strong>Ár:</strong> 41 000 Ft / éjszaka / fő</p>
        `,
      },
      {
        city: "Nápoly",
        name: "Grand Hotel Vesuvio",
        stars: 5,
        img: "img/utjaink kepek/it_grandhotel.jpg",
        modalId: "napolyModal",
        modalText: `
          <img src="img/utjaink kepek/it_grandhotel.jpg" class="img-fluid rounded mb-3" alt="Grand Hotel Vesuvio Nápoly">
          <p><strong>Leírás:</strong> A Grand Hotel Vesuvio Nápoly egyik legismertebb tengerparti szállodája, kilátással a Vezúvra és Capri szigetére.</p>
          <p><strong>Szolgáltatások:</strong> Tetőétterem, spa, medence, concierge, tengerpart közeli elhelyezkedés.</p>
          <p><strong>Ár:</strong> 89 000 Ft / éjszaka / fő</p>
        `,
      },
      {
        city: "Firenze",
        name: "Hotel Bernini Palace",
        stars: 5,
        img: "img/utjaink kepek/it_hotelnbernini.jpg",
        modalId: "firenzeModal",
        modalText: `
          <img src="img/utjaink kepek/it_hotelnbernini.jpg" class="img-fluid rounded mb-3" alt="Hotel Bernini Palace Firenze">
          <p><strong>Leírás:</strong> Firenze szívében, a Piazza della Signoria közelében található elegáns hotel, ahol a reneszánsz hangulat és a modern luxus tökéletesen keveredik.</p>
          <p><strong>Szolgáltatások:</strong> Étterem, történelmi berendezés, concierge, luxus szobák, ingyenes Wi-Fi.</p>
          <p><strong>Ár:</strong> 97 000 Ft / éjszaka / fő</p>
        `,
      },
    ],
  },
];

const TripCard = ({ hotel }) => (
  <div
    className="card shadow-sm hotel-card"
    data-bs-toggle="modal"
    data-bs-target={`#${hotel.modalId}`}
  >
    <img src={hotel.img} alt={hotel.name} className="szallaskepek" />
    <div className="card-body text-center">
      <h6>{hotel.city}</h6>
      <p>
        {hotel.name} {"★".repeat(hotel.stars)}
      </p>
    </div>
  </div>
);

const Trip = () => {
  const [positions, setPositions] = useState({});

  const moveSlide = (country, step) => {
    const countryData = data.find((c) => c.country === country);
    const cards = countryData.hotels.length;
    const visible = 4;
    const maxPos = Math.max(0, cards - visible);

    setPositions((prev) => {
      const current = prev[country] || 0;
      let newPos = current + step;
      newPos = Math.max(0, Math.min(newPos, maxPos));
      return { ...prev, [country]: newPos };
    });
  };
return (
        <>
            <Nav />
            <div className="container my-5" id="countries-container">
                {data.map(country => {
                    const pos = positions[country.country] || 0;
                    const movePercent = -(pos * 100);

                    return (
                        <div key={country.country} className="my-5">
                            {/* Ország banner – pontosan a te CSS-ed */}
                            <div className="country-banner d-flex align-items-center mb-4">
                                <div className="flag-box me-3">
                                    <img src={country.flag} alt={country.country} className="zaszlokep" />
                                </div>
                                <div>
                                    <h3 className="mb-1">{country.country}</h3>
                                    <p className="fst-italic mb-0">{country.description}</p>
                                </div>
                            </div>

                            {/* Slider – pontosan a te stílusoddal */}
                            <div className="slider-wrapper">
                                <button
                                    className="slider-btn left"
                                    onClick={() => moveSlide(country.country, -1)}
                                    disabled={pos === 0}
                                >
                                    &#10094;
                                </button>

                                <div className="slider-container">
                                    <div
                                        className="slider-track"
                                        style={{ transform: `translateX(${movePercent}%)` }}
                                    >
                                        {country.hotels.map(hotel => (
                                            <Trip_card key={hotel.modalId} hotel={hotel} />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="slider-btn right"
                                    onClick={() => moveSlide(country.country, 1)}
                                    disabled={pos >= country.hotels.length - 4}
                                >
                                    &#10095;
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modálok – Bootstrap, de a te stílusoddal */}
            {data.flatMap(country =>
                country.hotels.map(hotel => (
                    <div key={hotel.modalId} className="modal fade" id={hotel.modalId} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{hotel.city} – {hotel.name}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div
                                    className="modal-body"
                                    dangerouslySetInnerHTML={{ __html: hotel.modalText }}
                                />
                                <div className="modal-footer">
                                    <button className="btn btn-primary" data-bs-dismiss="modal">
                                        Foglalás
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <Footer />
        </>
    );
};

export default Trip;
 
  