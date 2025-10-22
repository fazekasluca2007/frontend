import React from 'react'
import Nav from './components/Nav';
import Footer from './components/Footer';
import './FAQ.css'

export default function FAQ() {
  return (
    <div>
        <Nav/>

            <div className="container my-5">
      <div className="gyik-question p-3 mb-2">
        Milyen környezetbarát lehetőségeket kínál az EcoTrip az utazások során?
      </div>

      <div className="gyik-answer p-3 mb-3">
        Az EcoTrip az utazások során számos környezetbarát lehetőséget kínál: elektromos vagy hibrid járművek használata, helyi és fenntartható szálláshelyek, hulladékminimalizálás és szelektív gyűjtés, valamint helyi öko-programok és túrák. Minden utazásunk célja, hogy a természetet és a helyi közösségeket támogassuk.
      </div>

      <div className="gyik-question p-3 mb-2">
        Hogyan lehet jelentkezni egy EcoTrip utazásra?
      </div>
      <div className="gyik-answer p-3 mb-3">
        A jelentkezés egyszerű: látogass el weboldalunkra, válaszd ki az utazást, majd töltsd ki az online jelentkezési űrlapot. A fizetés után visszaigazolást kapsz e-mailben, és minden további információt is megosztunk az utazás előtt.
      </div>

      <div className="gyik-question p-3 mb-2">
        Milyen korosztály számára ajánlottak az EcoTrip programok?
      </div>
      <div className="gyik-answer p-3 mb-3">
        Az EcoTrip programjai minden korosztály számára élvezhetők, de egyes túrák és tevékenységek esetében ajánlott a minimális életkor vagy fizikai állóképesség figyelembevétele. Minden utazás leírásában megtalálható a javasolt korosztály.
      </div>

      <div className="gyik-question p-3 mb-2">
        Mit tartalmaz az utazás ára?
      </div>
      <div className="gyik-answer p-3 mb-3">
        Az utazás ára tartalmazza a szállást, a programok részvételi díját, egyes étkezéseket és a fenntartható közlekedést. A pontos részleteket mindig az adott utazás leírásában találod, így biztosan tudod, mit várhatsz.
      </div>
    </div>

        <Footer/>
    </div>
  )
}
