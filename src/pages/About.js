import React, { useEffect } from "react";
import "./About.css";

export default function About() {

  useEffect(() => {
    document.title = "EcoTrip – Rólunk";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      title: "Fenntartható utazás",
      text: "Az EcoTrip küldetése, hogy megmutassa utazni lehet tudatosan és környezettudatosan is.",
      color: "blue"
    },
    {
      title: "Élmények mindenki számára",
      text: "Minden utazás élmény legyen,a résztvevőknek és a bolygónak egyaránt.",
      color: "green"
    },
    {
      title: "Természetközeli programok",
      text: "Törekszünk minél kisebb környezeti terhelésre, miközben csodás élményeket biztosítunk.",
      color: "brown"
    },
  ];

  const team = [
    {
      name: "Fazekas Luca",
      img: "img/rolunk kepek/luca.jpeg",
      text: "Az EcoTripnél hiszek abban, hogy az utazás akkor a legértékesebb, ha tisztelettel fordulunk a természet felé.",
    },
    {
      name: "Poráczki Zsolt",
      img: "img/rolunk kepek/zsolt.jpeg",
      text: "Hiszem, hogy az utazás nemcsak élmény, hanem lehetőség a tanulásra is, felelősséggel a környezet iránt.",
    },
    {
      name: "Szabó Flóra",
      img: "img/rolunk kepek/flora.jpeg",
      text: "Úgy gondolom, hogy az utazás akkor teljes,ha az élmények mellett a természet iránti felelősség is jelen van.",
    },
  ];

  return (
    <div>
      <section className="about-hero text-center">
        <video autoPlay loop muted playsInline className="hero-video-bg">
          <source src="//fzks.hu/video/erdo.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Ismerjen meg minket közelebbről</h1>
          <p>„A legjobb emlékek gyakran ott kezdődnek, ahol a térkép véget ér."</p>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-5 text-gradient animate-on-scroll">Kik vagyunk?</h2>
        <div className="row gy-4 justify-content-center animate-on-scroll">
          {cards.map((card, index) => (
            <div key={index} className="col-md-4 animate-on-scroll" style={{ transitionDelay: `${index * 0.15}s` }}>
              <div className={`info-card ${card.color}`}>
                <h5>{card.title}</h5>
                <p>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="values-section py-5">
        <div className="container">
          <div className="row align-items-center gy-4 justify-content-center">
            <div className="col-md-6 text-center">
              <div className="text-block blue animate-on-scroll">
                🌊 A kék a víz színe, amely az élet forrását és a tisztaság érzetét hordozza.
              </div>
              <div className="text-block green animate-on-scroll">
                🍃 A zöld a környezetet és a természet élő világát jelképezi.
              </div>
              <div className="text-block brown animate-on-scroll">
                ⛰️ A barna a föld színe, amely a szilárd alapokat és a természetességet idézi.
              </div>
            </div>
            <div className="col-md-3 text-center animate-on-scroll">
              <img src="img/foldgomb.png" alt="EcoTrip" id="foldgomb" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-5 text-gradient animate-on-scroll">Ismerje meg a csapatunkat</h2>
        <div className="row gy-4 justify-content-center">
          {team.map((member, index) => (
            <div key={index} className="col-md-3 d-flex text-center animate-on-scroll" style={{ transitionDelay: `${index * 0.15}s` }}>
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
}
