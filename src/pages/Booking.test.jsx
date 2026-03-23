import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Booking from "./Booking";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

/* Modulok helyettesítése a teszteléshez */
vi.mock("axios");
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div />,
  toast: { error: vi.fn(), success: vi.fn() },
}));

/* Teszt adatok */
const mockUser = {
  user: {
    id: 1,
    username: "testuser",
    fullName: "Test User",
    email: "test@example.com",
  },
  token: "test-token",
};

const mockHotel = {
  id: 1,
  hotel_name: "Test Hotel",
  city: "TestCity",
  stars: 4,
  main_image: "test.jpg",
  price: 50000,
};

/* Teszteset: ellenőrzi, hogy a bejelentkezett felhasználó neve és email-je előtöltődik */
test("a bejelentkezett felhasználó adatai betöltődnek", async () => {
  // Axios GET helyettesítése, hogy a komponens a mockHotel adatra reagáljon
  axios.get = vi.fn().mockResolvedValue({ data: mockHotel });

  // A komponens renderelése MemoryRouter-rel, hogy a route state is elérhető legyen
  render(
    <MemoryRouter initialEntries={[{ pathname: "/foglalas", state: { trip_id: 1 } }]}>
      <Booking user={mockUser} />
    </MemoryRouter>
  );

  // Várjuk, hogy a név input megjelenjen (a komponens előtölti a mezőt)
  await waitFor(() => {
    expect(screen.getByPlaceholderText("Kovács János")).toBeInTheDocument();
  });

  // Ellenőrzések: a név és az email mezők a tesztadatokkal töltődnek
  expect(screen.getByPlaceholderText("Kovács János")).toHaveValue("Test User");
  expect(screen.getByPlaceholderText("pelda@email.com")).toHaveValue("test@example.com");
});
