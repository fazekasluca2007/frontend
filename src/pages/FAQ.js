import React, { useState } from 'react';
import './FAQ.css';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Milyen környezetbarát lehetőségeket kínál az EcoTrip az utazások során?",
      answer: "Az EcoTrip az utazások során számos környezetbarát lehetőséget kínál: elektromos vagy hibrid járművek használata, helyi és fenntartható szálláshelyek, hulladékminimalizálás és szelektív gyűjtés, valamint helyi öko-programok és túrák. Minden utazásunk célja, hogy a természetet és a helyi közösségeket támogassuk."
    },
    {
      question: "Hogyan lehet jelentkezni egy EcoTrip utazásra?",
      answer: "A jelentkezés egyszerű: látogass el weboldalunkra, válaszd ki az utazást, majd töltsd ki az online jelentkezési űrlapot. A fizetés után visszaigazolást kapsz e-mailben, és minden további információt is megosztunk az utazás előtt."
    },
    {
      question: "Milyen korosztály számára ajánlottak az EcoTrip programok?",
      answer: "Az EcoTrip programjai minden korosztály számára élvezhetők, de egyes túrák és tevékenységek esetében ajánlott a minimális életkor vagy fizikai állóképesség figyelembevétele. Minden utazás leírásában megtalálható a javasolt korosztály."
    },
    {
      question: "Mit tartalmaz az utazás ára?",
      answer: "Az utazás ára tartalmazza a szállást, a programok részvételi díját, egyes étkezéseket és a fenntartható közlekedést. A pontos részleteket mindig az adott utazás leírásában találod, így biztosan tudod, mit várhatsz."
    },
    
    {
      question: "Milyen típusú szálláslehetőségeket kínál az EcoTrip?",
      answer: "Az EcoTrip különböző fenntartható szálláslehetőségeket kínál, mint például öko-hotelek, vendégházak és kempingek, amelyek figyelnek a környezetbarát működésre és a helyi közösségek támogatására."
    },
    {
      question: "Milyen támogatást kapnak az utazók a helyi közösségekkel való kapcsolatteremtéshez?",
      answer: "Az EcoTrip programjai során helyi idegenvezetők és szakértők segítik az utazókat, hogy megismerjék a helyi kultúrát, részt vegyenek közösségi programokon, és támogassák a helyi gazdaságot."
    }
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="container my-5">
        {faqs.map((faq, index) => (
          <div key={index}>
            <div 
              className="gyik-question p-3 mb-2 d-flex justify-content-between align-items-center"
              onClick={() => toggleAnswer(index)}
            >
              {faq.question}
              <span className={`arrow ${openIndex === index ? 'open' : ''}`}>&#9662;</span>
            </div>
            {openIndex === index && (
              <div className="gyik-answer p-3 mb-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
