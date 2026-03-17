import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Information from "./Information";
import { vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div />,
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn() };
});

const mockHotel = {
  id: 1,
  hotel_name: "Test Hotel",
  city: "TestCity",
  stars: 4,
  long_description: "Test description",
  main_image: "test.jpg",
  gallery_images: [],
};

test("nem bejelentkezetett felhasználó nem tud foglalni", async () => {
  localStorage.removeItem("user");

  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  axios.get = vi.fn().mockResolvedValue({ data: mockHotel });

  render(
    <MemoryRouter initialEntries={[{ pathname: "/informaciok", state: { trip_id: 1 } }]}>
      <Information />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/Kezdje el a foglalást/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/Kezdje el a foglalást/i));

  expect(toast.error).toHaveBeenCalledWith("A foglaláshoz jelentkezzen be!");
  expect(mockNavigate).not.toHaveBeenCalled();
});
