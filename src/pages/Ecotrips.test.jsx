import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Trip from "./Trip";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";


vi.mock("axios");

/* Trip_card helyettesítése egyszerű komponenssel */
vi.mock("./components/Trip_card", () => ({
  default: ({ hotel }) => <div data-testid="trip-card">{hotel.name}</div>,
}));

/* Helyettesített CustomSelect a teszt egyszerűsítéséhez */
vi.mock("./components/CustomSelect", () => ({
  default: () => <div>CustomSelect</div>,
}));

/* Globális segédfüggvény */
global.scrollTo = vi.fn();

/* Tesztadat */
const mockTripData = {
  result: [
    {
      id: 1,
      country: "Magyarország",
      flag: "flags/hu.svg",
      description: "Magyarország leírása",
      hotels: [
        {
          id: 1,
          city: "Budapest",
          name: "Green Hotel Budapest",
        },
      ],
    },
  ],
};

// Teszteset: ellenőrzi, hogy a backendről érkező adatok megjelennek-e az oldalon
test("Green Hotel Budapest megjelenik a Ökoútjaink oldalon", async () => {
  // axios.get helyettesítése, hogy a komponens a fenti tesztadatot kapja
  axios.get = vi.fn().mockResolvedValueOnce({ data: mockTripData });

  // Komponens renderelése navigációs környezetben, hogy a routing működjön
  render(
    <BrowserRouter>
      <Trip />
    </BrowserRouter>
  );

  // Ellenőrzés: megjelenik-e az ország és a szállás neve a felületen
  expect(await screen.findByText("Magyarország")).toBeInTheDocument();
  expect(await screen.findByText("Green Hotel Budapest")).toBeInTheDocument();
});
