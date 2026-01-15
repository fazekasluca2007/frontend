import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Szállások adatai
const szallasok = `Olaszország;Róma;Hotel Artemide;4;Központi elhelyezkedés, modern szobák, tetőtéri étterem csodás panorámával.;41.90084354818584, 12.49365002410819
Olaszország;Toszkána;Agriturismo La Poggiolina;3;Vidéki hangulat szőlőültetvények között, családias vendéglátással.;43.99701257911789, 11.442121308635462`;

const okoszallasok = `Olaszország;Milánó;E.c.ho. Hotel;4;Fenntartható szálloda energiatakarékos szobákkal, organikus étteremmel.;45.484808508540624, 9.207629347243794
Olaszország;Szicília;Rifugio Lanzagallo;3;Vidéki menedékház organikus reggelivel, bio kozmetikumokkal.;36.77512650495378, 14.86641430199616`;

export default function Home() {
const isUserLoggedIn = () => localStorage.getItem('user') !== null;

useEffect(() => {
document.title = 'EcoTrip';
}, []);


useEffect(() => {
const el = document.getElementById('heroCarousel');
if (el && window.bootstrap) {
new window.bootstrap.Carousel(el, {
interval: 3000,
ride: 'carousel'
});
}
}, []);


useEffect(() => {
const defaultIcon = L.icon({
iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
iconSize: [25, 41],
iconAnchor: [12, 41]
});

const greenIcon = L.icon({
iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
iconSize: [25, 41],
iconAnchor: [12, 41]
});

const map = L.map('map').setView([47.5, 19.04], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; OpenStreetMap'
}).addTo(map);

const addMarkers = (data, icon) => {
data.split('\n').forEach(line => {
if (!line.trim()) return;
const [orszag, varos, hotel, csillagok, leiras, coord] = line.split(';');
const [lat, lng] = coord.split(',').map(Number);
L.marker([lat, lng], { icon }).addTo(map)
.bindPopup(`<b>${hotel} (${csillagok}★)</b><br>${varos}, ${orszag}<br><i>${leiras}</i>`);
});
};

addMarkers(szallasok, defaultIcon);
addMarkers(okoszallasok, greenIcon);

return () => map.remove();
}, []);

return (
<div className="position-relative text-center">

{/* HERO CAROUSEL */}
<div id="heroCarousel" className="carousel slide">
<div className="carousel-inner">
{['gorog','spanyol','ausztria','magyar','dubai','egyipt','olasz','francia']
.map((img, i) => (
<div key={img} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
<img
src={`img/index kepek/${img}.jpg`}
className="d-block w-100"
alt={img}
/>
</div>
))}
</div>

<button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
<span className="carousel-control-prev-icon"></span>
</button>

<button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
<span className="carousel-control-next-icon"></span>
</button>


<div className="position-absolute top-50 start-50 translate-middle hero-overlay">
<h1>Üdvözlünk az EcoTrip oldalán!</h1>

<NavLink
to={isUserLoggedIn() ? '/utjaink' : '/bejelentkezes'}
className="btn btn-primary btn-lg mt-3"
>
Foglalj most
</NavLink>

<p>
Több száz szálláslehetőség, inspiráló úticélok, és öko-tudatos tippek – mindezt egy helyen!
</p>

<p>
Csatlakozz az EcoTrip közösséghez, és fedezd fel a fenntartható utazást!
</p>
</div>
</div>

<div className="container my-5">
<div className="row align-items-center">
<div className="col-md-5">
<h3 className="mb-3">Hol járhatsz velünk?</h3>
<div id="map"></div>
</div>

<div className="col-md-3 text-center">
<img src="img/foldgomb.png" alt="EcoTrip" id="foldgomb" className="img-fluid" />
</div>

<div className="col-md-4">
<div className="text-block blue"><p>🌊 A kék a tiszta vizeket és az utazás szabadságát jelképezi .</p></div>
<div className="text-block green"><p>🍃 A zöld az öko-szemlélet színe, a fenntartható kalandok jelképe.</p></div>
<div className="text-block brown"><p>⛰️ A barna a föld erejét és stabilitását idézi.</p></div>
</div>
</div>
</div>

</div>
);
}
