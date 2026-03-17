import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Booking from "./Booking";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div />,
  toast: { error: vi.fn(), success: vi.fn() },
}));

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

test("a bejelentkezett felhasználó adatai betöltődnek", async () => {
  axios.get = vi.fn().mockResolvedValue({ data: mockHotel });

  render(
    <MemoryRouter initialEntries={[{ pathname: "/foglalas", state: { trip_id: 1 } }]}>
      <Booking user={mockUser} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByPlaceholderText("Kovács János")).toBeInTheDocument();
  });

  expect(screen.getByPlaceholderText("Kovács János")).toHaveValue("Test User");
  expect(screen.getByPlaceholderText("pelda@email.com")).toHaveValue("test@example.com");
});
