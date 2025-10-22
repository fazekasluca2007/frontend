import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';
import Nav from './components/Nav';
import Footer from './components/Footer';

// A szállások adatai
const szallasok = `Olaszország;Róma;Hotel Artemide;4;Központi elhelyezkedés, modern szobák, tetőtéri étterem csodás panorámával.;41.90084354818584, 12.49365002410819
Olaszország;Toszkána;Agriturismo La Poggiolina;3;Vidéki hangulat szőlőültetvények között, családias vendéglátással.;43.99701257911789, 11.442121308635462
Olaszország;Nápoly;Grand Hotel Vesuvio;5;Tengerparti elegancia, Vezúvra néző kilátással és wellness szolgáltatásokkal.;40.83016845123533, 14.24816420055959
Olaszország;Firenze;Hotel Bernini Palace;5;Történelmi palotából kialakított luxushotel a város szívében.;43.77008911410996, 11.26057110912298

Spanyolország;Granada;Parador de Granada;4;Különleges szálloda az Alhambra területén, történelmi környezetben.;37.17587581775046, -3.5872863685923417
Spanyolország;Barcelona;Casa Camper;3;Modern butikhotel a Rambla közelében, tetőtéri pihenővel.;41.383507017246664, 2.169098425059236
Spanyolország;Madrid;Hotel Ritz;5;Ikonikus luxushotel, klasszikus stílusban, a Prado Múzeum mellett.;40.415853020915065, -3.6923976929626856
Spanyolország;Málaga;Barceló Malaga;4;Modern szálloda központi fekvéssel és tetőtéri medencével.;36.71140199105985, -4.4317510383159435

Ausztria;Bécs;Hotel Sacher Wien;5;Világhírű luxus, a Staatsoper mellett, elegáns környezettel.;48.20429654869881, 16.371269322641897
Ausztria;Tirol;Alpbach Lodge Chalet Resort;4;Alpesi faházak hegyi panorámával, wellness és síelési lehetőség.;47.40313544948491, 11.94108130997094
Ausztria;Salzburg;Austria Trend Hotel Europa;4;Központi fekvés, kényelmes szobák és könnyű elérhetőség.;48.206268523047996, 16.37148155492815
Ausztria;Salzburg;Hotel Goldener Hirsch;5;Történelmi hangulat a híres Getreidegassén.;47.79993181196631, 13.04194272105341

Magyarország;Budapest;Aria Hotel;5;Zenére hangolt luxushotel tetőtéri bárral, Bazilika mellett.;47.49995719246854, 19.05421908851695
Magyarország;Lillafüred;Hunguest Hotel Palota;4;Kastélyszálló a Hámori-tó partján, természetközeli élmény.;48.10489733201949, 20.623775196506724
Magyarország;Budapest;Danubius Hotel Helia;4;Duna-parti wellness hotel, kényelmes szobákkal.;47.52537639837682, 19.056295288517983
Magyarország;Pécs;Hotel Palatinus;3;Történelmi belvárosi szálloda, barátságos hangulattal.;46.07631651849163, 18.22936148654702

Franciaország;Párizs;Hotel Le Meurice;5;Ikonikus luxus a Louvre közelében, elegáns szobákkal.;48.86530875348542, 2.3284907928527407
Franciaország;Nizza;Hotel Mercure Centre;4;Tengerpart közeli, modern hotel kényelmes elhelyezkedéssel.;43.703736245216845, 7.26670344943687
Franciaország;Lyon;Ibis Styles;3;Fiatalos, modern szállás, családbarát árakkal.;45.75933459403753, 4.861386169465022
Franciaország;Marseille;InterContinental Marseille – Hotel Dieu;5;Történelmi épületből kialakított luxushotel panorámás kilátással.;43.29872191268618, 5.36990759360873

Görögország;Athén;Electra Palace;5;Luxus szálloda a Plaka negyedben, Akropolisz kilátással.;37.97377353697451, 23.73167986771784
Görögország;Kréta;Blue Palace Resort;5;Tengerparti resort privát stranddal és medencékkel.;35.29276684072537, 25.72668404998431
Görögország;Santorini;Hotel Aegeon;3;Barátságos családi hotel fehérre meszelt falakkal, kék kupolákkal.;36.42308602521316, 25.434792788170835
Görögország;Thesszaloniki;Makedonia Palace;4;Elegáns városi szállás tengerparti sétány mellett.;40.61861132895642, 22.953541040369142

Horvátország;Dubrovnik;Hotel Dubrovnik Palace;5;Közvetlen tengerparti szálloda, wellness részleggel és panorámás kilátással.;42.65133606610189, 18.061568835369545
Horvátország;Poreč;Valamar Club;3;Családbarát üdülő, animációs programokkal és strandközelséggel.;45.29850657079326, 13.578331161023218
Horvátország;Zágráb;Esplanade Zagreb Hotel;5;Történelmi elegancia, modern kényelemmel, a főváros szívében.;45.80542337473192, 15.976167631368424
Horvátország;Šibenik;Amadria Park Hotel;4;Vízi élménypark és tengerparti szórakozás egy helyen.;43.695798334309025, 15.884529786745723

Törökország;Isztambul;Swissôtel The Bosphorus;5;Luxus panorámával a Boszporuszra, modern szobákkal.;41.0413744655136, 28.99845117290854
Törökország;Isztambul;Hotel Uyan;3;Hangulatos, családias hotel a Hagia Sophia közelében.;41.00620880240478, 28.979695002087524
Törökország;Antalya;Liberty Hotels Lara;5;Tengerparti resort minden igényt kielégítő szolgáltatásokkal.;36.85753596157562, 30.88992589421241
Törökország;Antalya;Akra Hotel;4;Városi szálloda tengerparti fekvéssel, wellness és medence.;36.864381307027664, 30.726327914542594

Egyiptom;Luxor;Steigenberger Nile Palace;5;Luxus a Nílus partján, panorámás szobákkal.;25.687665096274863, 32.63115768500669
Egyiptom;Alexandria;Hilton Alexandria Corniche;5;Modern szálloda saját stranddal és tetőtéri bárral.;31.26188574165707, 29.984167291729857
Egyiptom;Sharm El Sheikh;Jolie Ville Resort;4;Tengerparti üdülőhely saját korallzátonnyal.;27.91203472379722, 34.32562046603256
Egyiptom;Hurghada;Mercure Hotel;3;Kedvező árú szállás közvetlenül a tengerparton.;27.16406204578281, 34.001983408941854

Egyesült Arab Emírségek;Dubaj;Burj Al Arab Jumeirah;5;Ikonikus vitorla alakú luxushotel privát stranddal.;25.14134602775069, 55.185546927362516
Egyesült Arab Emírségek;Dubaj;Atlantis The Palm;4;Élményparkkal és akváriummal rendelkező családbarát resort.;25.13067569624567, 55.11791154357568
Egyesült Arab Emírségek;Dubaj;Rove Downtown;3;Modern, megfizethető hotel a Burj Khalifa közelében.;25.20320341199392, 55.27947382344146
Egyesült Arab Emírségek;Dubaj;Jumeirah Beach Hotel;5;Tengerparti resort luxus szolgáltatásokkal és vízi élményekkel.;25.14169135806846, 55.19147534063744

Thaiföld;Bangkok;Mandarin Oriental;5;Ázsiai luxus a Chao Phraya partján.;25.216938435928697, 55.25116867181581
Thaiföld;Phuket;Amari Phuket;4;Tengerparti szálloda saját öbölben, wellness szolgáltatásokkal.;7.8867946365175, 98.28598482307956
Thaiföld;Phuket;Lub d Phuket Patong;3;Fiatalos, modern szállás központi elhelyezkedéssel.;7.8977280173597, 98.29868973363881
Thaiföld;Koh Samui;SALA Samui Choengmon Beach Resort;5;Privát villák és medencék a tengerparton.;9.573282491085534, 100.08104274334208

Marokkó;Marrakech;La Mamounia;5;Legendás luxushotel pazar kerttel és marokkói hangulattal.;31.62166548091782, -7.9973592575088475
Marokkó;Marrakech;Riad Les Trois Palmiers;4;Tradicionális riad modern kényelemmel.;31.632508270256626, -7.990860472212251
Marokkó;Casablanca;Kenzi Tower Hotel;5;Felhőkarcoló hotel lenyűgöző városi kilátással.;33.58686288859938, -7.631303369685583
Marokkó;Casablanca;Hotel Central;3;Egyszerűbb, de hangulatos városi szállás központi fekvéssel.;33.600051472742095, -7.617211672689582

Málta;Attard;Corinthia Palace Hotel;5;Klasszikus luxus, központi fekvéssel és wellness szolgáltatásokkal.;35.89427249278105, 14.449348927668341
Málta;Qawra;db San Antonio Hotel;4;Családbarát resort medencékkel és programokkal.;35.95321005919847, 14.419043322000324
Málta;St. Julian’s;Hotel Juliani;4;Stílusos butikhotel tengerparti kilátással.;35.91944433737911, 14.489868052374618
Málta;Sliema;Bayview Hotel;3;Kedvező árú szálloda közvetlen tengerparti sétány mellett.;35.906390915495756, 14.497601303914484

Portugália;Lisszabon;Pestana Palace;5;Történelmi palota luxus szállásként, gyönyörű kerttel.;38.70360355076801, -9.18629806854725
Portugália;Lisszabon;Hotel da Baixa;4;Modern városi hotel, központi elhelyezkedéssel.;38.712257458208036, -9.137116195853725
Portugália;Algarve;Tivoli Carvoeiro;5;Szálloda a sziklás tengerparton, lélegzetelállító kilátással.;37.09400305335417, -8.460092473506206
Portugália;Algarve;Hotel Maritur;3;Megfizethető árú, barátságos szállás medencével.;37.080734574589734, -8.278542349114286

Csehország;Prága;Four Seasons Hotel;5;Luxus a Moldva partján, történelmi környezetben.;50.08760121756736, 14.415261760213765
Csehország;Prága;Hotel Paris;5;Art Nouveau stílusú elegáns szálloda a belvárosban.;50.088137570477066, 14.42759760915308
Csehország;Prága;NH Collection;4;Kényelmes szobák, jó elhelyezkedéssel.;50.071328136659474, 14.397024188127869
Csehország;Prága;Hotel Lunik;3;Családias hangulatú, megfizethető szállás.;50.075145108437226, 14.433988772930153

Németország;Berlin;Hotel Adlon Kempinski;5;Ikonikus luxus közvetlenül a Brandenburgi kapu mellett.;52.516117372365095, 13.38012372326757
Németország;München;Bayerischer Hof;5;Történelmi luxus, a város szívében.;48.140447209509816, 11.574182299191534
Németország;Frankfurt;NH Collection;4;Modern üzleti hotel központi fekvéssel.;50.10778787318967, 8.655486493867109
Németország;Hamburg;Holiday Inn Express;3;Megfizethető városi szállás reggelivel.;53.56262337521303, 10.03251091914077
`
const okoszallasok = `Olaszország;Milánó;E.c.ho. Hotel;4;Fenntartható szálloda energiatakarékos szobákkal, organikus étteremmel.;45.484808508540624, 9.207629347243794
Olaszország;Szicília;Rifugio Lanzagallo;3;Vidéki menedékház organikus reggelivel, bio kozmetikumokkal.;36.77512650495378, 14.86641430199616
Olaszország;Tirol;Felder Alpin Lodge;4;Hegyi lodge, fenntartható felújítás, helyi kultúra tisztelete.;46.63655103128795, 11.53106622726552
Olaszország;Etna;Monaci delle Terre Nere;5;Luxus öko-szállás, organikus gazdaság és helyi termények.;37.67413792753035, 15.109096948403863

Spanyolország;Lagos;Quinta da Paz Algarve;4;Öko-szállás organikus kerttel és helyi termékekkel.;37.13288050752108, -8.539860213485351
Spanyolország;Barcelona;Hotel 1898;5;Biosphere tanúsítvány, fenntartható életmód, környezetbarát kozmetikumok.;41.38352679464756, 2.1711079750007807
Spanyolország;Sevilla;Only YOU Hotel Sevilla;3;Modern dizájn, fenntartható megoldások.;37.389475383286864, -5.974631180548379
Spanyolország;Barcelona;Hotel Duquesa de Cardona;4;Környezetbarát kozmetikumok, Barcelona+Sustainable hálózat.;41.37986057746069, 2.1806556183750416

Ausztria;Bécs;Boutique Hotel Donauwalzer;4;Zöld kezdeményezések, helyi termékek.;48.215031161374604, 16.34039042753041
Ausztria;Bécs;Hotel Kaiserhof;3;Modern fenntarthatósági megoldások.;48.197573460842705, 16.36881915052817
Ausztria;Bécs;The Harmonie Vienna;4;Környezetvédelem és helyi kultúra hangsúly.;48.219950611961906, 16.35997188193148
Ausztria;Fontanella;Cabinski;5;Fenntartható faházak, helyi ökoszisztéma tisztelete.;47.248194538719986, 9.918738026003302

Magyarország;Budapest;Green Hotel Budapest;4;Zöld környezet, helyi termékek.;47.500808108720456, 19.111207377182474
Magyarország;Budapest;Bohem Art Hotel;3;Művészeti szálloda, ökológiai kezdeményezések.;47.488674786511254, 19.055785741044797
Magyarország;Budapest;Continental Hotel Budapest;4;Modern fenntarthatósági megoldások.;47.49706341998101, 19.06738109585521
Magyarország;Budapest;Intercontinental Budapest;5;Luxus szállás, fenntarthatóság.;47.49750753186114, 19.04823809843134

Franciaország;Montpellier;Domaine de Biar;4;Luxus öko-szállás bambuszerdővel.;43.59568753548249, 3.815221526322881
Franciaország;Arles;Hôtel Mas de la Grenouillère;4;Fenntartható szállás Provence-ban.;43.47142316267504, 4.4020367822750455
Franciaország;Villers-la-Ville;Cabanes Champêtres;3;Öko-kabinszállások természetközeli élménnyel.;43.140700490489024, 2.2037428974230124
Franciaország;Bretagne;Natura Lodge;4;Helyi kultúra és környezetvédelem.;44.31536568711173, 4.3521982412805205

Görögország;Volimes;eco Boutique apart Hotel Galini;4;Fenntartható apartman, faültetés minden tartózkodás után.;37.888745806099024, 20.691559752441027
Görögország;Laconia;Eumelia Organic Farm;3;Organikus farm, helyi termékek.;36.921729094508386, 22.73263471263398
Görögország;Santorini;Native Eco Villas;5;Fenntartható villák, helyi kultúra tisztelete.;36.43153980361175, 25.4251639987791
Görögország;Kréta;Metohi Kindelis;4;Fenntartható szállás, helyi kultúra és környezetvédelem.;35.49396657619925, 24.004657938339857

Horvátország;Trnulja;Bio apartments Trnulja;4;Fenntartható apartmanok, helyi termékek.;46.00059109176842, 14.477856135228146
Horvátország;Sirolo;Acanto Country House Relais;3;Öko-luxus szállás, helyi ökoszisztéma tisztelete.;43.517750852649634, 13.594525073007489
Horvátország;Split;Green & Boutique Hotel Split;4;Fenntartható szállás, helyi kultúra és környezetvédelem.;43.50294173718066, 16.446623620661477
Horvátország;Omiš;Boutique Hotel Villa Dvor;5;Fenntartható szállás, családias hangulat.;43.44708103497797, 16.692913707183806

Törökország;Bolu;Yaban Off-Grid Permaculture Farm;4;Off-grid permakultúrás farm, helyi ökoszisztéma tisztelete.;40.76334712198724, 31.634462033995305
Törökország;Datça;Goknar Knidos Oasis Retreat;3;Fenntartható visszavonulás organikus kerttel.;36.672181936692645, 27.41052440049138
Törökország;Bodrum;Tree of Life Eco Camp;4;Fenntartható kemping, környezetvédelem és közösségi élmény.;40.67924041801314, 30.018037399885362
Törökország;Kappadókia;Ariana Sustainable Luxury Lodge;5;Luxus fenntartható szállás, helyi kultúra tisztelete.;38.634341602962586, 34.80701677281786

Egyiptom;Siwa;Desert Rose Eco Lodge;3;Fenntartható sivatagi szállás, helyi kultúra tisztelete.;28.385159759799407, 28.909286945501393
Egyiptom;Aswan;Nubian Eco Village;4;Fenntartható falusi szállás, helyi közösség bevonásával.;24.109007665876966, 32.88527896316662
Egyiptom;Sinai;Eco Lodge Sinai;5;Luxus öko-szállás, teljes energiafüggetlenséggel.;24.238299005923082, 33.574441509628386
Egyiptom;Kairó;Cairo Green Suites;3;Városi öko-szállás, környezetbarát megoldásokkal.;30.050160450684505, 31.24402255334477

Egyesült Arab Emírségek;Dubai;The Sustainable City Hotel;5;Teljesen fenntartható luxus hotel, zöld energiával.;25.018860229665044, 55.24631025855473
Egyesült Arab Emírségek;Abu Dhabi;Green Palm Resort;4;Környezetbarát szállás, helyi termékekkel.;24.458437936219052, 54.320680731926075
Egyesült Arab Emírségek;Sharjah;Eco Stay Sharjah;3;Öko-apartmanok, fenntartható szolgáltatásokkal.;25.361268468518837, 55.55565913831301
Egyesült Arab Emírségek;Ras Al Khaimah;Desert Bloom Eco Lodge;4;Fenntartható sivatagi lodge, zöld kezdeményezésekkel.;25.56500394725081, 55.82187540061396

Thaiföld;Chiang Mai;Baan Eco Lodge;4;Öko-lodge organikus kerttel és helyi programokkal.;9.121279184346653, 98.2514206190777
Thaiföld;Koh Lanta;Koh Lanta Eco Villas;5;Luxus öko-villák, tengeri élővilág tisztelete.;7.5771496589144816, 99.03269681581618
Thaiföld;Phuket;Green Bamboo Resort;3;Fenntartható resort, bambusz építészet.;11.421453567122196, 107.43046579934142
Thaiföld;Chiang Rai;Treehouse Chiang Rai;4;Faépítésű öko-lodge, helyi közösséggel együttműködve.;19.957890234731202, 99.86091277639694

Marokkó;Marrakech;Eco Riad Marrakech;4;Fenntartható városi szállás, helyi kézműves termékekkel.;31.468169909587328, -7.832047126936578
Marokkó;Atlas-hegység;Atlas Green Lodge;3;Öko-lodge, természetközeli élménnyel.;31.21380069863828, -8.242203007814123
Marokkó;Merzouga;Sahara Eco Camp;5;Luxus sivatagi tábor fenntartható módon.;31.142397550219506, -4.02993185592737
Marokkó;Ouarzazate;Kasbah Eco Retreat;4;Öko-kasbah, helyi kultúra tisztelete.;31.549230750328018, -4.058184102946901

Málta;Valletta;Eco Guesthouse;3;Fenntartható városi vendégház, zöld kezdeményezésekkel.;35.88015519248219, 14.521119079501247
Málta;St. Paul’s Bay;Green Bay Hotel;4;Öko-hotel tengerparti elhelyezkedéssel.;35.87267630803563, 14.43955087152999
Málta;Gozo;Eco Resort Malta;5;Luxus fenntartható üdülőhely.;36.04908472041242, 14.274033461560368
Málta;Mdina;Sustainable Stay;4;Öko-szállás történelmi környezetben.;35.886302428005756, 14.402587765519572

Portugália;Porto;Quinta da Azenha;4;Öko-lodge organikus farmmal.;41.15217749597055, -8.55363598354089
Portugália;Lagos;Eco Retreat Algarve;5;Luxus fenntartható üdülőhely tengerparton.;40.271769938560176, -7.631704384957901
Portugália;Lisszabon;Green Stay Lisbon;3;Városi öko-szállás helyi termékekkel.;38.727556044838764, -9.134913134483446
Portugália;Madeira;Solar Eco Lodge;4;Öko-lodge hegyvidéki környezetben.;32.66650799068513, -16.914353895284588

Csehország;Prága;Eco Penzion Prague;3;Fenntartható vendégház a város szívében.;50.075396519499776, 14.426783978817019
Csehország;Brno;Green Hotel Brno;4;Öko-hotel helyi termékekkel.;49.19568657671393, 16.607432834156267
Csehország;Český Krumlov;Bohemian Eco Lodge;5;Luxus öko-lodge történelmi környezetben.;48.811072486293924, 14.315610783948996
Csehország;Karlovy Vary;Eco Stay Karlovy Vary;4;Öko-vendégház, fenntartható szolgáltatásokkal.;50.22340624179481, 12.88267768064322

Németország;Berlin;Biohotel Gutshof;4;Fenntartható hotel városi környezetben.;52.520013412207994, 13.389278023918779
Németország;Bajorország;Eco Lodge Bavaria;5;Luxus öko-lodge a természetben.;48.14006710090077, 11.5614607654858
Németország;Hamburg;Green Stay Hamburg;3;Városi öko-szállás, helyi termékekkel.;53.54666993489612, 9.981686243265807
Németország;München;Nachhaltig Hotel München;4;Öko-hotel, fenntartható energiamegoldásokkal.;48.13802245232824, 11.561392963456381
`;

export default function Home() {

    useEffect(() => {
        const defaultIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });

        const greenIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });

        const map = L.map('map').setView([47.507184692465, 19.045799968751098], 5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const addMarkers = (data, icon) => {
            data.split("\n").forEach(line => {
                if (!line.trim()) return;
                const parts = line.split(";");
                if (parts.length < 6) return;
                const [orszag, varos, hotel, csillagok, leiras, koordinata] = parts;
                const [lat, lng] = koordinata.split(",").map(Number);
                L.marker([lat, lng], { icon }).addTo(map)
                    .bindPopup(`<b>${hotel} (${csillagok}★)</b><br>${varos}, ${orszag}<br><i>${leiras}</i>`);
            });
        };

        addMarkers(szallasok, defaultIcon);
        addMarkers(okoszallasok, greenIcon);

        return () => map.remove();
    }, []);

    return (
        <div>
            <Nav />
            <div className="position-relative text-center">

                {/* Carousel */}
                <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="img/index kepek/gorog.avif" className="d-block w-100" alt="Görög" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/spanyol.avif" className="d-block w-100" alt="Spanyol" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/Ausztria.avif" className="d-block w-100" alt="Ausztria" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/magyar.avif" className="d-block w-100" alt="Magyar" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/dubai.avif" className="d-block w-100" alt="Dubai" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/egypt.avif" className="d-block w-100" alt="Egyiptom" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/olasz.avif" className="d-block w-100" alt="Olasz" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="img/index kepek/francia.avif" className="d-block w-100" alt="Francia" style={{ height: '500px', objectFit: 'cover' }} />
                        </div>

                        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                            <span className="visually-hidden">Előző</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                            <span className="visually-hidden">Következő</span>
                        </button>
                    </div>

                    {/* Hero text */}
                    <div className="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 p-4 rounded" style={{ maxWidth: '600px' }}>
                        <h1>Üdvözlünk az EcoTrip oldalán!</h1>
                        <button id="foglalasBtn" className="btn btn-primary btn-lg mt-3">Foglalj most</button>
                        <p className="mt-3 text-start">
                            Több száz szálláslehetőség, inspiráló úticélok, és öko-tudatos tippek – mindezt egy helyen!
                        </p>
                        <p className="mt-3 text-start">
                            Csatlakozz az EcoTrip közösséghez, és fedezd fel, hogyan teheted utazásaidat környezetbaráttá!
                        </p>
                    </div>
                </div>

                {/* Info + Map */}
                <div className="container my-5">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <div id="map" style={{ height: '400px', width: '100%', borderRadius: '10px' }}></div>
                        </div>

                        <div className="col-md-3 text-center">
                            <img src="img/foldgomb.png" alt="EcoTrip utazás" id="foldgomb" className="img-fluid globe-image" />
                        </div>

                        <div className="col-md-4">
                            <div className="text-block blue">
                                <p>🌊A kék a tiszta vizeket és az utazás szabadságát jelképezi, mindezt felelősen.</p>
                            </div>
                            <div className="text-block green">
                                <p>🍃A zöld az öko-szemlélet színe, a fenntartható kalandok jelképe.</p>
                            </div>
                            <div className="text-block brown">
                                <p>⛰️A barna a föld erejét és stabilitását idézi, amelyre minden tudatos utazás épül.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
