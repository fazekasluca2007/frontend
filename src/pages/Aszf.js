import React, { useEffect } from "react";
import "./Aszf.css";

export default function Aszf() {

  useEffect(() => {
    document.title = "EcoTrip – Általános Szerződési Feltételek";
     window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aszf-page container my-5 animate-on-scroll show">
      <h1 className="mb-4 text-center">Általános Szerződési Feltételek</h1>

      <section className="aszf-section">
        <h3>1. Az ÁSZF hatálya és elfogadása</h3>
        <p>
          Jelen Általános Szerződési Feltételek (ÁSZF) az EcoTrip utazási iroda
          által üzemeltetett weboldal és szolgáltatások használatára vonatkoznak.
        </p>
        <p>
          A weboldal használatával, regisztrációval vagy foglalással
          a Felhasználó kijelenti, hogy az ÁSZF tartalmát megismerte,
          megértette és azt magára nézve kötelezőnek elfogadja.
        </p>
      </section>

      <section className="aszf-section">
        <h3>2. Felhasználói feltételek</h3>
        <p>A Felhasználó vállalja, hogy:</p>
        <ul>
          <li>valós és pontos adatokat ad meg a regisztráció és foglalás során</li>
          <li>nem használja a weboldalt jogellenes célokra</li>
          <li>nem sérti meg más felhasználók vagy harmadik felek jogait</li>
          <li>nem próbálja meg a rendszer biztonságát kijátszani</li>
          <li>nem tölt fel káros, sértő vagy félrevezető tartalmat</li>
        </ul>
      </section>

      <section className="aszf-section">
        <h3>3. Regisztráció</h3>
        <p>
          Egyes szolgáltatások kizárólag regisztrált felhasználók számára érhetők el.
          A regisztráció során a Felhasználó köteles valós adatokat megadni.
        </p>
        <p>
          A Felhasználó felelős a fiókjához tartozó belépési adatok
          titokban tartásáért.
        </p>
      </section>

      <section className="aszf-section">
        <h3>4. Foglalás feltételei</h3>
        <p>
          A foglalás elektronikusan, a weboldalon keresztül történik.
          A foglalás akkor válik véglegessé, amikor a Felhasználó
          visszaigazoló e-mailt kap.
        </p>
        <p>
          A Felhasználó elfogadja, hogy az egyes utazások eltérő feltételekkel,
          lemondási díjakkal és szabályokkal rendelkezhetnek.
        </p>
      </section>

      <section className="aszf-section">
        <h3>5. Fizetés</h3>
        <p>
          A fizetés a weboldalon feltüntetett módokon történhet.
          A Felhasználó köteles a szolgáltatás ellenértékét határidőben megfizetni.
        </p>
        <p>
          Sikertelen fizetés esetén a foglalás automatikusan törlésre kerülhet.
        </p>
      </section>

      <section className="aszf-section">
        <h3>6. Lemondás és módosítás</h3>
        <p>
          A Felhasználó tudomásul veszi, hogy a lemondási feltételek
          utazásonként eltérhetnek.
        </p>
        <p>
          A lemondásból vagy módosításból eredő költségeket
          a Felhasználó viseli.
        </p>
      </section>

      <section className="aszf-section">
        <h3>7. Felelősségkorlátozás</h3>
        <p>
          Az EcoTrip nem vállal felelősséget:
        </p>
        <ul>
          <li>harmadik fél szolgáltatásaiért</li>
          <li>időjárás miatt</li>
          <li>közlekedési késésekért</li>
          <li>elveszett személyes tárgyakért</li>
        </ul>
      </section>

      <section className="aszf-section">
        <h3>8. Adatkezelés</h3>
        <p>
          A Felhasználó elfogadja, hogy személyes adatainak kezelése
          az Adatkezelési Tájékoztatóban foglaltak szerint történik.
        </p>
      </section>

      <section className="aszf-section">
        <h3>9. Az ÁSZF módosítása</h3>
        <p>
          A Szolgáltató jogosult jelen ÁSZF-et egyoldalúan módosítani.
          A módosítások a weboldalon való közzététellel lépnek hatályba.
        </p>
      </section>

      <section className="aszf-section">
        <h3>10. Záró rendelkezések</h3>
        <p>
          Jelen ÁSZF 2026. január 1. napjától hatályos.
        </p>
        <p>
          A weboldal használata kizárólag a jelen feltételek elfogadásával lehetséges.
        </p>
         <p>
          A Szolgáltató fenntartja a jogot az ÁSZF módosítására.
        </p>
      </section>
    </div>
  );
}
