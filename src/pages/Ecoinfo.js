import React, { useEffect } from "react";
import "./Ecoinfo.css";

const Ecoinfo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'EcoTrip-Miért ökoszállás?';
  }, []);

  return (
    <div className="eco-container">
      <div className="eco-hero">
        <h1>Miért Válasszon ökoszállást?</h1>
        <p>Az ökoszállások olyan szálláshelyek, amelyek a fenntarthatóság és a természetközeli élmény jegyében működnek. Nem csupán pihenésre alkalmasak, hanem lehetőséget nyújtanak a környezettudatos életmód megismerésére. Ha fontos számára a környezet védelme és a nyugodt, természetközeli kikapcsolódás, az ököszállás a tökéletes választás.</p>
      </div>

      <div className="eco-section">
        <h2>Környezettudatosság</h2>
        <p>Az ökoszállások fenntartható forrásokból működnek, csökkentve az energia- és vízfogyasztást. Napkollektorok, újrahasznosított anyagok és energiatakarékos megoldások biztosítják a környezet védelmét. Így nemcsak a pihenése lesz felejthetetlen, hanem a bolygónak is segít.</p>

        <h2>Természetközeli élmény</h2>
        <p>Az ökoszállások legtöbbször természetvédelmi területeken vagy zöld környezetben helyezkednek el, így a madárcsicsergés és a friss levegő garantált. Túrázás, kerékpározás vagy csak a csendes erdei séták – minden pillanat feltöltő élményt nyújt.</p>

        <h2>Helyi közösség támogatása</h2>
        <p>Sok ökoszállás együttműködik helyi termelőkkel és kézművesekkel, biztosítva, hogy a turizmus közvetlenül a közösségeket támogassa. Az autentikus élmények és a helyi kultúra megismerése mellett így közvetlenül támogathatja a helyi gazdaságot.</p>

        <h2>Víz- és energiatakarékosság</h2>
        <p>A korszerű, környezetbarát rendszerek révén minden erőforrást takarékosan használnak. A zuhanyok, világítás és fűtési rendszerek mind energiatakarékosak, csökkentve az ökológiai lábnyomot. Ez a tudatos működés a vendégeknek is példát mutat.</p>

        <h2>Egészséges környezet</h2>
        <p>Az ökoszállásokban természetes anyagokkal, tiszta levegővel és csendes környezettel találkozhat. Ez segít a stressz csökkentésében, és biztosítja a testi-lelki regenerálódást. A pihenés így teljes és valóban feltöltő lesz.</p>

        <h2>Mire figyeljen a választásnál?</h2>
        <p>Válasszon olyan szállást, amely hivatalos ökocímkével rendelkezik, ellenőrizze, hogy valóban fenntartható forrásokból működik-e, és nézze meg, milyen természetközeli programokat kínál. Nézze meg a vendégértékeléseket, és válasszon olyan helyet, ahol a környezet és a helyi közösség egyaránt fontos szempont.</p>
      </div>

      <div className="eco-footer">
        <p>Az ökoszállások nemcsak pihenést nyújtanak, hanem lehetőséget az élmények, a természet és a fenntarthatóság összehangolására. Válasszon tudatosan, és tapasztalja meg a különbséget!</p>
      </div>
    </div>
  );
};

export default Ecoinfo;
