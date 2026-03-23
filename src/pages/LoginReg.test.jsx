import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

{/* Szimulációk */ }
vi.mock("axios");
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div />,
  toast: { success: vi.fn(), error: vi.fn() },
}));

window.scrollTo = vi.fn();

test("sikeres regisztráció", async () => {
  const mockOnLogin = vi.fn();

  {/* API válaszok szimulálása */ }
  axios.post = vi.fn((url) => {
    if (url.includes("register")) return Promise.resolve({ data: { success: true } });
    if (url.includes("login")) {
      return Promise.resolve({
        data: { token: "test-token", user: { id: 1, username: "testuser" } },
      });
    }
    if (url.includes("Mail")) return Promise.resolve({ data: { success: true } });
  });

  axios.get = vi.fn().mockResolvedValueOnce({ data: { profileImage: "image.jpg" } });

  {/* Login komponens megjelenítése */ }
  render(
    <BrowserRouter>
      <Login onLogin={mockOnLogin} />
    </BrowserRouter>
  );

  {/* Teszt regisztráció megkezdése */ }
  fireEvent.click(screen.getByText("Regisztráljon!"));

  {/* Mezők kitöltése */ }
  const passwordInputs = screen.getAllByPlaceholderText("Jelszó");
  await userEvent.type(screen.getByPlaceholderText("Teljes név"), "Test User");
  await userEvent.type(screen.getByPlaceholderText("Felhasználónév"), "testuser");
  await userEvent.type(screen.getByPlaceholderText("E-mail"), "test@gmail.com");
  await userEvent.type(passwordInputs[0], "TestPass123!");
  await userEvent.type(screen.getByPlaceholderText("Jelszó ismét"), "TestPass123!");
  fireEvent.click(screen.getByText("Nem vagyok robot").closest(".fake-recaptcha"));
  fireEvent.click(screen.getByRole("button", { name: /regisztráció/i }));

  {/* Ellenőrzés */ }
  await waitFor(() => {
    expect(mockOnLogin).toHaveBeenCalled();
  });
});
