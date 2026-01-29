import React, { useEffect, useState } from 'react';
import './FAQ.css';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);



  const faqs = [
    {
      question: "Milyen környezetbarát lehetőségeket kínál az EcoTrip az utazások során?",
      answer:
        "Az EcoTrip az utazások során számos környezetbarát lehetőséget kínál: elektromos vagy hibrid járművek használata, helyi és fenntartható szálláshelyek, hulladékminimalizálás és szelektív gyűjtés, valamint helyi öko-programok és túrák."
    },
    {
      question: "Hogyan lehet jelentkezni egy EcoTrip utazásra?",
      answer:
        "A jelentkezés egyszerű: válaszd ki az utazást weboldalunkon, töltsd ki az online jelentkezési űrlapot, majd fizess biztonságosan."
    },
    {
      question: "Milyen korosztály számára ajánlottak az EcoTrip programok?",
      answer:
        "Programjaink minden korosztály számára élvezhetők, de az egyes túráknál javasolt az adott fizikai állapot figyelembevétele."
    },
    {
      question: "Mit tartalmaz az utazás ára?",
      answer:
        "Az ár tartalmazza a szállást, programokat, egyes étkezéseket és a fenntartható közlekedést."
    },
    {
      question: "Milyen szálláslehetőségek vannak?",
      answer:
        "Öko-hotelek, vendégházak és kempingek, amelyek figyelnek a környezetbarát működésre."
    }
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    document.title = "EcoTrip – Gyakori kérdések";
  }, []);

  return (
    <div>

      <div className="container my-5">
        {faqs.map((faq, index) => (
          <div key={index}>
            <div
              className="gyik-question p-3 mb-2"
              onClick={() => toggleAnswer(index)}
            >
              {faq.question}
              <span className={`arrow ${openIndex === index ? 'open' : ''}`}>
                &#9662;
              </span>
            </div>

            {openIndex === index && (
              <div className="gyik-answer p-3 mb-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="container eco-tips-unique mb-5">
        <h3 className="eco-unique-title">
          <i class="bi bi-globe-americas text-success"></i> Utazz környezettudatosan – tippek, amikkel tehetsz a bolygóért

        </h3>

        <p className="eco-unique-intro">
          Az utazás nemcsak élmény, hanem döntések sorozata is. Ezek az apró
          szokások segítenek abban, hogy a világ felfedezése közben vigyázzunk
          arra, amit felfedezünk.
        </p>

        <div className="eco-unique-list">
          <div className="eco-unique-item">
            <span><i class="bi bi-droplet-half text-primary"></i></span>
            <p>
              <strong>Újratölthető kulacs</strong> – Mindig vigyél magaddal egy kulacsot, így elkerülheted az egyszer használatos műanyag palackokat. Útközben a csapvíz vagy a vízszűrő alkalmazása segít, hogy mindig legyen friss ivóvízed, miközben kevesebb hulladékot termelsz.

            </p>
          </div>

          <div className="eco-unique-item">
            <span><i class="bi bi-bag text-warning"></i></span>
            <p>
              <strong>Vászon vagy textil táska</strong> – könnyű és újrahasználható, ideális a boltokhoz, piacokhoz, vagy akár a napi kirándulásokhoz. Egyszerre csökkenti a műanyag hulladékot, és stílusos kiegészítője lehet az utazásnak.
            </p>
          </div>

          <div className="eco-unique-item">
            <span><i class="bi bi-bicycle text-danger"></i></span>
            <p>
              <strong>Tömegközlekedés</strong> – gyalog, biciklivel vagy
              tömegközlekedéssel nemcsak zöldebb, de élménydúsabb is az utazás.
            </p>
          </div>

          <div className="eco-unique-item">
            <span><i class="bi bi-buildings text-success"></i></span>
            <p>
              <strong>Környezettudatos szálláshelyek választása</strong> – Keresd a zöld tanúsítvánnyal rendelkező szállodákat vagy öko-lodge-okat. Ezeknél gyakran helyi, organikus ételeket szolgálnak fel, energiatakarékos megoldásokat alkalmaznak, és aktívan törekednek a hulladékcsökkentésre.

            </p>
          </div>

          <div className="eco-unique-item">
            <span><i class="bi bi-fork-knife"></i></span>
            <p>
              <strong>Helyi termékek vásárlása</strong> – Válassz kézműves ajándékokat és helyi termékeket a turistacikkek helyett. Így támogathatod a helyi gazdaságot, csökkentheted a szállításból származó környezeti terhelést, és autentikus élményeket is hazavihetsz.
            </p>
          </div>

          <div className="eco-unique-item">
            <span><i class="bi bi-leaf-fill text-success"></i></span>
            <p>
              <strong>Kis lépések, nagy hatás</strong> – Már a legapróbb változtatások, mint a kulacs, táska, vagy környezettudatos választások, jelentősen csökkenthetik az utazásod ökológiai lábnyomát. A tudatos döntések révén az utazás nemcsak élménnyé, hanem felelősségteljes élménnyé is válik.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
