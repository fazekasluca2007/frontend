import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Trip from "./Trip";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

vi.mock("axios");

vi.mock("./components/Trip_card", () => ({
  default: ({ hotel }) => <div data-testid="trip-card">{hotel.name}</div>,
}));

vi.mock("./components/CustomSelect", () => ({
  default: () => <div>CustomSelect</div>,
}));

global.scrollTo = vi.fn();

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

test("Green Hotel Budapest megjelenik a Ökoútjaink oldalon", async () => {
  axios.get = vi.fn().mockResolvedValueOnce({ data: mockTripData });

  render(
    <BrowserRouter>
      <Trip />
    </BrowserRouter>
  );

  expect(await screen.findByText("Magyarország")).toBeInTheDocument();
  expect(await screen.findByText("Green Hotel Budapest")).toBeInTheDocument();
});
