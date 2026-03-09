import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Ecoinfo.css";

const SECTIONS = [
  {
    title: "1. Miért válasszon ökoszállást?",
    content:
      "Az ökoszállások olyan szálláshelyek, amelyek a fenntarthatóság és a természetközeli élmény jegyében működnek. Nem csupán pihenésre alkalmasak, hanem lehetőséget nyújtanak a környezettudatos életmód megismerésére. Ha fontos számára a környezet védelme és a nyugodt, természetközeli kikapcsolódás, az ökoszállás a tökéletes választás.",
  },
  {
    title: "2. Környezettudatosság",
    content:
      "Az ökoszállások fenntartható forrásokból működnek, csökkentve az energia- és vízfogyasztást. Napkollektorok, újrahasznosított anyagok és energiatakarékos megoldások biztosítják a környezet védelmét. Így nemcsak a pihenése lesz felejthetetlen, hanem a bolygónak is segít.",
  },
  {
    title: "3. Természetközeli élmény",
    content:
      "Az ökoszállások legtöbbször természetvédelmi területeken vagy zöld környezetben helyezkednek el, így a madárcsicsergés és a friss levegő garantált. Túrázás, kerékpározás vagy csak a csendes erdei séták – minden pillanat feltöltő élményt nyújt.",
  },
  {
    title: "4. Helyi közösség támogatása",
    content:
      "Sok ökoszállás együttműködik helyi termelőkkel és kézművesekkel, biztosítva, hogy a turizmus közvetlenül a közösségeket támogassa. Az autentikus élmények és a helyi kultúra megismerése mellett így közvetlenül támogathatja a helyi gazdaságot.",
  },
  {
    title: "5. Víz- és energiatakarékosság",
    content:
      "A korszerű, környezetbarát rendszerek révén minden erőforrást takarékosan használnak. A zuhanyok, világítás és fűtési rendszerek mind energiatakarékosak, csökkentve az ökológiai lábnyomot. Ez a tudatos működés a vendégeknek is példát mutat.",
  },
  {
    title: "6. Egészséges környezet",
    content:
      "Az ökoszállásokban természetes anyagokkal, tiszta levegővel és csendes környezettel találkozhat. Ez segít a stressz csökkentésében, és biztosítja a testi-lelki regenerálódást. A pihenés így teljes és valóban feltöltő lesz.",
  },
  {
    title: "7. Mire figyeljen a választásnál?",
    content:
      "Válasszon olyan szállást, amely hivatalos ökocímkével rendelkezik, ellenőrizze, hogy valóban fenntartható forrásokból működik-e, és nézze meg, milyen természetközeli programokat kínál. Nézze meg a vendégértékeléseket, és válasszon olyan helyet, ahol a környezet és a helyi közösség egyaránt fontos szempont.",
  },
];

export default function Ecoinfo() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "EcoTrip – Miért ökoszállás?";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ecoinfo-page container my-5">
      <button className="ecoinfo-back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Vissza
      </button>

      <h1 className="mb-4 text-center">Miért válasszon ökoszállást?</h1>

      {SECTIONS.map((section) => (
        <section key={section.title} className="ecoinfo-section">
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </section>
      ))}
    </div>
  );
}
