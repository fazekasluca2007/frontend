import React from 'react';
import { Link } from 'react-router-dom';
import './Cookiek.css';

export default function Cookiek() {
  return (
    <div className="cookiek-page">
      <div className="cookiek-container">
        <div className="cookiek-header">
          <Link to="/" className="cookiek-back-link">
            <i className="bi bi-arrow-left"></i> Vissza
          </Link>
          <h1>Cookie-k használata</h1>
        </div>

        <div className="cookiek-section">
          <h3>Miért használunk cookie-kat?</h3>
          <p>Az EcoTrip weboldal sütiket (cookie-kat) használ a weboldal működésének biztosítására és a felhasználói élmény javítására. A sütik segítenek például:</p>
          <ul>
            <li>Az oldal biztonságos működésében és a bejelentkezési adatok védelmében.</li>
            <li>Statisztikai adatok gyűjtésében az oldal használatáról, így fejleszthetjük a szolgáltatásainkat.</li>
            <li>Marketing és reklám célokra, hogy a felhasználóknak releváns ajánlatokat jeleníthessünk meg.</li>
          </ul>
        </div>

        <div className="cookiek-section">
          <h3>Milyen típusú cookie-kat használunk?</h3>
          <ul>
            <li><strong>Szükséges cookie-k:</strong> Ezek elengedhetetlenek az oldal működéséhez, például a bejelentkezés és a foglalások kezelése.</li>
            <li><strong>Teljesítmény cookie-k:</strong> Segítenek megérteni, hogyan használják a látogatók az oldalt, és javítani az élményt.</li>
            <li><strong>Marketing cookie-k:</strong> Segítenek személyre szabott ajánlatok és hirdetések megjelenítésében.</li>
          </ul>
        </div>

        <div className="cookiek-section">
          <h3>Hogyan kezelheted a cookie-kat?</h3>
          <p>A felhasználó dönthet, hogy csak a szükséges sütiket engedélyezi, vagy mindet elfogadja. A cookie-beállításokat bármikor módosíthatod a böngésződ beállításain keresztül. Fontos tudni, hogy bizonyos funkciók, például a személyre szabott ajánlatok, nem fognak megfelelően működni, ha csak a szükséges cookie-kat engedélyezed.</p>
          <p>Továbbá rendszeresen frissítjük a cookie szabályzatot, hogy megfeleljünk a jogszabályi változásoknak. Érdemes időnként újra átnézni ezt az oldalt, hogy mindig tisztában legyél a használt sütikkel és azok céljával.</p>
        </div>
      </div>
    </div>
  );
}