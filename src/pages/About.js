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
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          <h1 style={{ fontSize: "2rem", color: "#1a3c57", wordBreak: "break-word" }}>
            Ismerj meg minket közelebbről
          </h1>

          <p
            style={{
              fontSize: "1.3rem",
              color: "#1a3c57",
              wordBreak: "break-word",
              fontStyle: "italic",
            }}
          >
            „A legjobb emlékek gyakran ott kezdődnek, ahol a térkép véget ér.”
          </p>
        </div>
      </section>

    
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


      <section className="values-section py-5">
        <div className="container">
          <div className="row justify-content-center align-items-center gy-4">

            <div className="col-md-6">
              <div className="text-block blue">
                <p>🌊 A kék a tiszta vizeket és az utazás szabadságát jelképezi.</p>
              </div>

              <div className="text-block green">
                <p>🍃 A zöld az öko-szemlélet színe, a fenntartható kalandok jelképe.</p>
              </div>

              <div className="text-block brown">
                <p>⛰️ A barna a föld erejét és stabilitását idézi.</p>
              </div>
            </div>


            <div className="col-md-3 text-center">
              <img
                src="img/foldgomb.png"
                alt="EcoTrip"
                id="foldgomb"
                className="img-fluid"
              />
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
