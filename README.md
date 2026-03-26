# EcoTrip Frontend

Ez a projekt az EcoTrip vizsgaremek frontend része. A cél egy modern, reszponzív és felhasználóbarát webes felület, ahol a látogatók megismerhetik az utakhoz kapcsolódó információkat, foglalási folyamatot kezdhetnek, valamint tájékoztató oldalakat is elérhetnek.

## Mappaszerkezet

```text
frontend/
|-- public/                           # Statikus, build során közvetlenül kezelt fájlok
|   |-- index.html                    # Alap HTML sablon
|   `-- img/                          # Publikus képek
|       |-- index képek/
|       `-- ...
|
|-- src/                              # Alkalmazás forráskódja
|   |-- App.jsx                       # Fő alkalmazáskomponens
|   |-- App.css                       # Fő stílusok
|   |-- index.js                      # Belépő pont
|   |-- index.css                     # Globális stílusok
|   |-- pages/                        # Oldalszintű nézetek + oldalspecifikus stílusok
|   |   |-- Home.jsx                  # Főoldal
|   |   |-- Home.css                  # Főoldal CSS
|   |   |-- Booking.jsx               # Foglalási oldal
|   |   |-- Booking.css               # Foglalási oldal CSS
|   |   `-- ...                       # További oldalak és hozzájuk tartozó .css/.test fájlok
|   `-- pages/components/             # Újrahasznosítható komponensek
|       |-- Nav.jsx                   # Navigáció
|       |-- Footer.jsx                # Lábléc
|       `-- ...
|
|-- package.json                      # Függőségek és script parancsok
|-- vitest.config.js                  # Tesztkonfiguracio
```

## Projekt elindítása

```bash
npm install
npm start
```
Inditás után a következő címen érhető el az oldal: https://localhost:3000
