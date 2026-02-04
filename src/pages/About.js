import React, { useEffect } from "react";
import "./About.css";

const About = () => {

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>


      <section
        className="rolunk-hero text-center"
        style={{
          background: "url('img/index kepek/folyo.avif') center center/cover no-repeat",
        }}
      >
        <div className="hero-content">
          <h1>Ismerj meg minket közelebbről</h1>
          <p>„A legjobb emlékek gyakran ott kezdődnek, ahol a térkép véget ér.”</p>
        </div>
      </section>


      <section className="container my-5">
        <div className="row align-items-center gy-4 animate-on-scroll">
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
              szenvedélye a fenntartható turizmus.
            </p>
            <p>
              Célunk, hogy minden utazás élmény legyen – nemcsak a résztvevők,
              hanem a bolygó számára is.
            </p>
          </div>
        </div>
      </section>

      <section className="values-section py-5">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-md-6">
              <div className="text-block blue animate-on-scroll">
                🌊 A kék a víz színe, az élet forrása.
              </div>
              <div className="text-block green animate-on-scroll">
                🍃 A zöld a természet élő világát jelképezi.
              </div>
              <div className="text-block brown animate-on-scroll">
                ⛰️ A barna a föld színe és a stabilitásé.
              </div>
            </div>
            <div className="col-md-3 text-center animate-on-scroll">
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
        <h2 className="text-center mb-5 text-gradient animate-on-scroll">
          Ismerd meg a csapatunkat
        </h2>

        <div className="row gy-4 justify-content-center">
          {[
            {
              name: "Fazekas Luca",
              img: "img/rolunk kepek/luca.jpeg",
              text: "Hiszek abban, hogy az utazás akkor értékes, ha tiszteljük a természetet.",
            },
            {
              name: "Poráczki Zsolt",
              img: "img/rolunk kepek/zsolt.jpeg",
              text: "Az utazás tanulás és felelősség is egyben.",
            },
            {
              name: "Szabó Flóra",
              img: "img/rolunk kepek/flora.jpeg",
              text: "Az élmények mellett fontos a természet védelme is.",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="col-md-3 text-center animate-on-scroll"
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
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
