import React, { useEffect } from "react";
import "./About.css";

const About = () => {
  useEffect(() => {
      document.title = "EcoTrip – Rólunk";
    }, []);
  return (
    <div>
      {/* Hero szekció */}
      <section
  className="rolunk-hero text-center"
  style={{
    position: "relative",
    background: "url('img/index kepek/folyo.avif') center center/cover no-repeat",
    minHeight: "350px",
  }}
>
  <div
    className="hero-content d-flex flex-column justify-content-center align-items-center text-center"
    style={{
      position: "relative",
      zIndex: 2,
      width: "400px",            
      aspectRatio: "1 / 1",       
      borderRadius: "50%",        
      backgroundColor: "rgba(255,255,255,0.7)", 
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      margin: "0 auto",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)", // opcionális árnyék
    }}
  >
    <h1 style={{ fontSize: "2rem", color: "#1a3c57", wordBreak: "break-word" }}>
      Ismerj meg minket közelebbről
    </h1>

    <p style={{ fontSize: "1.3rem", color: "#1a3c57", wordBreak: "break-word", fontStyle:'italic'}}>
      „A legjobb emlékek gyakran ott kezdődnek, ahol a térkép véget ér.”
    </p>
  </div>
</section>

      {/* Kik vagyunk szekció */}
      <section className="container my-5">
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <img
              src="img/index kepek/earth.avif"
              alt="földgömb"
              className="img-fluid rounded shadow-lg earth-img-hover"
            />
          </div>
          <div className="col-md-6">
            <h2 className="mb-3 text-gradient">Kik vagyunk?</h2>
            <p className="lead">
              Az <strong>EcoTrip</strong> egy magyar utazási iroda, amelynek
              szenvedélye a fenntartható turizmus. Küldetésünk, hogy
              megmutassuk: utazni lehet tudatosan is.
            </p>
            <p>
              Célunk, hogy minden utazás élmény legyen – nemcsak a résztvevők,
              hanem a bolygó számára is. Törekszünk arra, hogy programjaink
              során minél kevesebb környezeti terhelést okozzunk. Az EcoTripnél
              minden út arról szól, hogy jól érezzük magunkat, miközben
              vigyázunk arra a világra, amit felfedezünk.
            </p>
          </div>
        </div>
      </section>

      {/* Értékeink szekció */}
      <section className="values-section py-5 text-center">
        <div className="container">
          <h2 className="mb-5 text-gradient">Értékeink</h2>
          <div className="row gy-4">
            <div className="col-md-4">
              <div className="value-card">
                <i className="fa-solid fa-leaf fa-2x mb-3"></i>
                <h5>Fenntarthatóság</h5>
                <p>
                  Környezettudatos döntéseket hozunk minden utazás
                  tervezésekor – a közlekedéstől a szállásig.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <i className="fa-solid fa-globe fa-2x mb-3"></i>
                <h5>Felfedezés</h5>
                <p>
                  Utazásaink új kultúrákat, rejtett helyeket és valódi
                  élményeket kínálnak a világ minden tájáról.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <i className="fa-solid fa-heart fa-2x mb-3"></i>
                <h5>Közösség</h5>
                <p>
                  Hisszük, hogy az utazás összeköt – embereket, kultúrákat, és
                  természetet egyaránt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Csapat szekció */}
      <section className="container py-5">
        <h2 className="text-center mb-5 text-gradient">
          Ismerd meg a csapatunkat
        </h2>
        <div className="row gy-4 justify-content-center">
          <div className="col-md-3 text-center">
            <div className="team-card">
              <img
                src="img/rolunk kepek/luca.jpeg"
                alt="Luca"
                className="img-fluid rounded mb-3"
              />
              <h5>Fazekas Luca</h5>
              <p>
                Az EcoTrip csapat egyik lelkes tagja vagyok. Bárhová is utazom,
                mindig figyelem, hogyan gondoskodnak az adott országban a
                környezetről, és igyekszem ezt a szemléletet beépíteni az
                utazási ajánlatainkba is. Célom, hogy minden utazás élmény
                legyen, miközben a környezetre is figyelünk.
              </p>
            </div>
          </div>

          <div className="col-md-3 text-center">
            <div className="team-card">
              <img
                src="img/rolunk kepek/zsolt.jpeg"
                alt="Zsolt"
                className="img-fluid rounded mb-3"
              />
              <h5>Poráczki Zsolt</h5>
              <p>
                Az utazás nem csupán kikapcsolódás, hanem egy tanulási folyamat
                is számomra. Az EcoTripnél azon dolgozom, hogy az élmények
                mellett a fenntarthatóság és a természet tisztelete is része
                legyen minden útnak.
              </p>
            </div>
          </div>

          <div className="col-md-3 text-center">
            <div className="team-card">
              <img
                src="img/rolunk kepek/flora.jpeg"
                alt="Flóra"
                className="img-fluid rounded mb-3"
              />
              <h5>Szabó Flóra</h5>
              <p>
                Az utazás számomra nemcsak kaland, hanem lehetőség is arra, hogy
                tanuljak a világtól. Az EcoTripnél azon dolgozom, hogy minden
                úti célunkban felfedezzük, hogyan lehet harmóniában élni a
                természettel. Fontos számomra, hogy az élmények mellett a
                környezet iránti tisztelet is helyet kapjon minden utazásban.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;