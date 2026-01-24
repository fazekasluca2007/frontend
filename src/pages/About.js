import React, { useEffect } from "react";
import "./About.css";

const About = () => {
  useEffect(() => {
    document.title = "EcoTrip – Rólunk";
  }, []);

  return (
    <div>

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
              src="img/rolunk kepek/adventure.jpg"
              alt="kaland"
              className="img-fluid rounded shadow-lg adventure-img-hover"
            />
          </div>

          <div className="col-md-6">
            <h2 className="text-gradient mb-3">Kik vagyunk?</h2>
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
          <div className="row align-items-center gy-4">
            <div className="col-md-6">
              <div className="text-block blue">🌊 A kék a szabadságot jelképezi</div>
              <div className="text-block green">🍃 A zöld a fenntarthatóság színe</div>
              <div className="text-block brown">⛰️ A barna a stabilitást idézi</div>
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


      <section className="container py-5">
        <h2 className="text-center mb-5 text-gradient">
          Ismerd meg a csapatunkat
        </h2>

        <div className="row gy-4 justify-content-center">
          {[
            {
              name: "Fazekas Luca",
              img: "img/rolunk kepek/luca.jpeg",
              text:
                "Az EcoTripnél hiszek abban, hogy az utazás akkor a legértékesebb, ha tisztelettel fordulunk a természet felé.",
            },
            {
              name: "Poráczki Zsolt",
              img: "img/rolunk kepek/zsolt.jpeg",
              text:
                "Hiszem, hogy az utazás nemcsak élmény, hanem lehetőség a tanulásra is, felelősséggel a környezet iránt.",
            },
            {
              name: "Szabó Flóra",
              img: "img/rolunk kepek/flora.jpeg",
              text:
                "Úgy gondolom, hogy az utazás akkor teljes, ha az élmények mellett a természet iránti felelősség is jelen van.",
            },
          ].map((member, index) => (
            <div key={index} className="col-md-3 text-center">
              <div className="team-card">
                <img src={member.img} alt={member.name} />
                <h5>{member.name}</h5>
                <p>{member.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
