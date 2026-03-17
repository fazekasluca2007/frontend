import React from "react";
import { render } from "@testing-library/react";
import axios from "axios";
import Home from "./Home";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

vi.mock("axios");

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

vi.mock("leaflet", () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(function() { return this; }),
      getContainer: vi.fn(() => ({
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      scrollWheelZoom: { enable: vi.fn(), disable: vi.fn() },
      remove: vi.fn(),
      on: vi.fn(),
      invalidateSize: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn(function() { return this; }) })),
    control: vi.fn(() => ({ onAdd: null, addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(function() { return this; }), bindPopup: vi.fn(function() { return this; }) })),
    icon: vi.fn(() => ({})),
    DomUtil: { create: vi.fn(() => document.createElement('div')) },
  },
}));

vi.mock("leaflet/dist/leaflet.css");

test("a carousel elemek váltakoznak a megfelelő intervallumban", () => {
  vi.useFakeTimers();

  axios.get = vi.fn().mockResolvedValue({ data: [] });

  const mapDiv = document.createElement('div');
  mapDiv.id = 'map';
  document.body.appendChild(mapDiv);

  const { container } = render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  const items = container.querySelectorAll(".carousel-item");
  expect(items.length).toBeGreaterThan(1);

  expect(items[0]).toHaveClass("active");
  expect(items[1]).not.toHaveClass("active");

  vi.advanceTimersByTime(4000);
  expect(items[0]).not.toHaveClass("active");
  expect(items[1]).toHaveClass("active");

  vi.advanceTimersByTime(4000);
  expect(items[1]).not.toHaveClass("active");
  expect(items[2]).toHaveClass("active");

  vi.useRealTimers();
  document.body.removeChild(mapDiv);
});
