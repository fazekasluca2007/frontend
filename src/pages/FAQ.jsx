import React, { useEffect, useState } from 'react';
import './FAQ.css';


export default function FAQ() {
  {/* Aktuálisan megnyitott kérdés indexe */}
  const [openIndex, setOpenIndex] = useState(null);

  {/* GYIK tömb */}
  const faqs = [
    {
      question: "Milyen környezetbarát lehetőségeket kínál az EcoTrip az utazások során?",
      answer: "Az EcoTrip számos olyan környezetbarát szállást és egyedi, fenntartható utazástervezési tippet kínál, amelyeket más weboldalakon nem talál meg az utazó."
    },
    {
      question: "Hogyan lehet jelentkezni egy EcoTrip utazásra?",
      answer: "A jelentkezés egyszerű: válaszd ki az utazást weboldalunkon, töltsd ki az online jelentkezési űrlapot, majd fizess biztonságosan."
    },
    {
      question: "Milyen korosztály számára ajánlottak az EcoTrip programok?",
      answer: "Programjaink minden korosztály számára élvezhetők, de az egyes túráknál javasolt az adott fizikai állapot figyelembevétele."
    },
    {
      question: "Mit tartalmaz az utazás ára?",
      answer: "Az utazás ára kizárólag a szállást és az esetleges tranzakciós díjakat tartalmazza."
    },
    {
      question: "Milyen szálláslehetőségek vannak?",
      answer: "Öko-hotelek, vendégházak és kempingek, amelyek figyelnek a környezetbarát működésre."
    }
  ];

 {/* Oldal böngészőcímének beállítása és tetejére ugrás */ }
  useEffect(() => {
    document.title = "EcoTrip – Gyakori kérdések";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="container my-5">
        {/* GYIK lista: minden kérdés kattintható, a válasz megjelenik lenyitáskor */}
        {faqs.map((faq, index) => (
          <div key={index}>
            <div className="gyik-question p-3 mb-2" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              {faq.question}
              <span className={`arrow ${openIndex === index ? 'open' : ''}`}>&#9662;</span>
            </div>
            {openIndex === index && (
              <div className="gyik-answer p-3 mb-3">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>


  <div className="container eco-tips mb-5">
        <h3 className="eco-tips-title">
          <i className="bi bi-globe-americas text-success"></i> Utazzon környezettudatosan – tippek, amikkel tehet a bolygóért
        </h3>

        <p className="eco-tips-intro">
          Az utazás nemcsak élmény, hanem döntések sorozata is. Ezek az apró szokások segítenek abban, hogy a világ felfedezése közben vigyázzunk arra, amit felfedezünk.
        </p>

        <div className="eco-tips-list">
          <div className="eco-tips-item">
            <span><i className="bi bi-droplet-half text-primary"></i></span>
            <p>
              <strong>Újratölthető kulacs</strong> – Mindig vigyen magával egy kulacsot, így elkerülheti az egyszer használatos műanyag palackokat. Útközben a csapvíz vagy a vízszűrő alkalmazása segít, hogy mindig legyen friss ivóvize, miközben kevesebb hulladékot termel.
            </p>
          </div>

          <div className="eco-tips-item">
            <span><i className="bi bi-bag text-warning"></i></span>
            <p>
              <strong>Vászon vagy textil táska</strong> – könnyű és újrahasználható, ideális a boltokhoz, piacokhoz, vagy akár a napi kirándulásokhoz. Egyszerre csökkenti a műanyag hulladékot, és stílusos kiegészítője lehet az utazásnak.
            </p>
          </div>

          <div className="eco-tips-item">
            <span><i className="bi bi-bicycle text-danger"></i></span>
            <p>
              <strong>Tömegközlekedés</strong> – gyalog, biciklivel vagy tömegközlekedéssel nemcsak zöldebb, de élménydúsabb is az utazás.
            </p>
          </div>

          <div className="eco-tips-item">
            <span><i className="bi bi-buildings text-success"></i></span>
            <p>
              <strong>Környezettudatos szálláshelyek választása</strong> – Keresse a zöld tanúsítvánnyal rendelkező szállodákat vagy öko-lodge-okat. Ezeknél gyakran helyi, organikus ételeket szolgálnak fel, energiatakarékos megoldásokat alkalmaznak, és aktívan törekednek a hulladékcsökkentésre.
            </p>
          </div>

          <div className="eco-tips-item">
            <span><i className="bi bi-cart"></i></span>
            <p>
              <strong>Helyi termékek vásárlása</strong> – Válasszon kézműves ajándékokat és helyi termékeket a turistacikkek helyett. Így támogathatja a helyi gazdaságot, csökkentheti a szállításból származó környezeti terhelést, és autentikus élményeket is hazavihet.
            </p>
          </div>

          <div className="eco-tips-item">
            <span><i className="bi bi-leaf-fill text-success"></i></span>
            <p>
              <strong>Kis lépések, nagy hatás</strong> – Már a legapróbb változtatások, mint a kulacs, táska, vagy környezettudatos választások, jelentősen csökkenthetik az utazásod ökológiai lábnyomát. A tudatos döntések révén az utazás nemcsak élménnyé, hanem felelősségteljes élménnyé is válik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
