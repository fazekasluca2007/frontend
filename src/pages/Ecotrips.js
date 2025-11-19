
import React, { useState, useEffect } from 'react';
import Trip_card from './components/Trip_card';
import "./Ecotrips.css";
import Nav from './components/Nav';
import Footer from './components/Footer';

const data = [
    {
        country: "Magyarország",
        flag: "img/zaszlok/hu.png",
        description: "Utazz zöldebben, fedezd fel Magyarország érintetlen szépségeit és fenntartható szállásait!",
        hotels: [
            {
                city: "Budapest",
                name: "Green Hotel Budapest",
                stars: 5,
                img: "img/okoutjaink kepek/greenhotel.jpg",
                modalId: "greenModal",
                modalText: `
          <img src="img/okoutjaink kepek/greenhotel.jpg" class="img-fluid rounded mb-3" alt="Green Hotel Budapest">
          <p><strong>Leírás:</strong> A Green Hotel Budapest a fenntarthatóság jegyében működik, napelemekkel, esővízgyűjtéssel és helyi termékeket kínáló éttermével. Kiváló választás azoknak, akik városi kényelem mellett is zölden szeretnének utazni.</p>
          <p><strong>Szolgáltatások:</strong> Elektromos autó töltő, organikus reggeli, energiatakarékos berendezések, zöldtető.</p>
          <p><strong>Ár:</strong> 59 000 Ft / éjszaka / fő</p>
        `
            },
            {
                city: "Budapest",
                name: "Bohem Art Hotel",
                stars: 3,
                img: "img/okoutjaink kepek/bohemart.jpg",
                modalId: "bohemModal",
                modalText: `
          <img src="img/okoutjaink kepek/bohemart.jpg" class="img-fluid rounded mb-3" alt="Bohem Art Hotel">
          <p><strong>Leírás:</strong> A Bohem Art Hotel művészi környezetet és környezettudatos megoldásokat kínál Budapest szívében. Tökéletes választás a városi élet szerelmeseinek, akik értékelik az újrahasznosított anyagokat és a helyi dizájnt.</p>
          <p><strong>Szolgáltatások:</strong> Bio reggeli, újrahasznosított bútorok, LED világítás, helyi művészeti kiállítások.</p>
          <p><strong>Ár:</strong> 38 000 Ft / éjszaka / fő</p>
        `
            },
            {
                city: "Budapest",
                name: "Continental Hotel",
                stars: 4,
                img: "img/okoutjaink kepek/continental.jpg",
                modalId: "continentalModal",
                modalText: `
          <img src="img/okoutjaink kepek/continental.jpg" class="img-fluid rounded mb-3" alt="Continental Hotel Budapest">
          <p><strong>Leírás:</strong> A Continental Hotel modern dizájnt ötvöz a fenntarthatósággal. Energiahatékony rendszerei és helyi beszállítói révén csökkentett ökológiai lábnyommal működik.</p>
          <p><strong>Szolgáltatások:</strong> Tetőmedence, wellness, elektromos autó töltő, helyi ételek.</p>
          <p><strong>Ár:</strong> 46 000 Ft / éjszaka / fő</p>
        `
            },
            {
                city: "Budapest",
                name: "Intercontinental Hotel",
                stars: 5,
                img: "img/okoutjaink kepek/intercontinental.jpg",
                modalId: "intercontinentalModal",
                modalText: `
          <img src="img/okoutjaink kepek/intercontinental.jpg" class="img-fluid rounded mb-3" alt="Intercontinental Hotel Budapest">
          <p><strong>Leírás:</strong> Az Intercontinental Hotel a Duna-part egyik ikonikus épülete, ahol a luxus és a fenntarthatóság találkozik. A szálloda környezeti tanúsítvánnyal rendelkezik és aktívan támogatja a helyi ökoturizmust.</p>
          <p><strong>Szolgáltatások:</strong> Spa, gourmet étterem, víztakarékos rendszerek, zöldtanúsítvány.</p>
          <p><strong>Ár:</strong> 82 000 Ft / éjszaka / fő</p>
        `
            }
        ]
    },
    {
        country: "Olaszország",
        flag: "img/zaszlok/it.png",
        description: "„Olaszország a szépség és a fenntarthatóság harmóniáját kínálja minden utazó számára.”",
        hotels: [
            {
                city: "Milánó",
                name: "E.c.ho Hotel",
                stars: 4,
                img: "img/okoutjaink kepek/echo.jpg",
                modalId: "milanoModal",
                modalText: `
          <img src="img/okoutjaink kepek/echo.jpg" class="img-fluid rounded mb-3" alt="E.c.ho Hotel Milánó">
          <p><strong>Leírás:</strong> Az E.c.ho Hotel Milánó egyik legzöldebb szállodája, amelyet a fenntartható turizmus mintapéldájaként tartanak számon. Napelemes energiaellátás és zero-waste étterem jellemzi.</p>
          <p><strong>Szolgáltatások:</strong> Elektromos autó töltő, bio étterem, esővízgyűjtés, újrahasznosított anyagok.</p>
          <p><strong>Ár:</strong> 74 000 Ft / éjszaka / fő</p>
        `
            },
            {
                city: "Pinzolo",
                name: "Lefay Resort & SPA Dolomiti",
                stars: 5,
                img: "img/okoutjaink kepek/lefay.jpg",
                modalId: "pinzoloModal",
                modalText: `
          <img src="img/okoutjaink kepek/lefay.jpg" class="img-fluid rounded mb-3" alt="Lefay Resort & SPA Dolomiti">
          <p><strong>Leírás:</strong> A Dolomitokban található Lefay Resort a természet közelségét és a luxust ötvözi. A szálloda geotermikus energiával és saját víztisztító rendszerrel működik.</p>
          <p><strong>Szolgáltatások:</strong> Hegyi kilátás, spa, organikus étterem, síelés, elektromos bicikli bérlés.</p>
          <p><strong>Ár:</strong> 120 000 Ft / éjszaka / fő</p>
        `
            },
            {
                city: "Tirol",
                name: "Felder Alpin Lodge",
                stars: 4,
                img: "img/okoutjaink kepek/felder.jpg",
                modalId: "tirolModal",
                modalText: `
          <img src="img/okoutjaink kepek/felder.jpg" class="img-fluid rounded mb-3" alt="Felder Alpin Lodge">
          <p><strong>Leírás:</strong> Egy modern alpesi lodge, amely újrahasznosított anyagokból épült, és megújuló energiaforrásokkal működik. Tökéletes választás a természetközeli pihenéshez.</p>
          <p><strong>Szolgáltatások:</strong> Szauna, túraútvonalak, bio reggeli, elektromos fűtés, hegyi panoráma.</p>
          <p><strong>Ár:</strong> 65 000 Ft / éjszaka / fő</p>
        `
            },
            {
                city: "Etna",
                name: "Monaci delle Terre Nere",
                stars: 5,
                img: "img/okoutjaink kepek/monaci.jpg",
                modalId: "etnaModal",
                modalText: `
          <img src="img/okoutjaink kepek/monaci.jpg" class="img-fluid rounded mb-3" alt="Monaci delle Terre Nere Etna">
          <p><strong>Leírás:</strong> Az Etna vulkán lábánál található Monaci delle Terre Nere egy ökogazdaságban működő luxusszállás, ahol minden szoba egyedi, természetes anyagokkal berendezve.</p>
          <p><strong>Szolgáltatások:</strong> Saját biofarm, borászat, medence, helyi ételek, napenergia.</p>
          <p><strong>Ár:</strong> 98 000 Ft / éjszaka / fő</p>
        `
            }
        ]
    }
];

const Ecotrips = () => {

    const [positions, setPositions] = useState({});

    const moveSlide = (country, step) => {
        const countryData = data.find(c => c.country === country);
        const cards = countryData.hotels.length;
        const visible = 4;
        const maxPos = Math.max(0, cards - visible);

        setPositions(prev => {
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

export default Ecotrips;