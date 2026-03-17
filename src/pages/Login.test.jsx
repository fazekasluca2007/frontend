import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div />,
  toast: { success: vi.fn(), error: vi.fn() },
}));

window.scrollTo = vi.fn();

test("sikeres bejelentkezés", async () => {
  const mockOnLogin = vi.fn();

  axios.post = vi.fn((url) => {
    if (url.includes("login")) {
      return Promise.resolve({
        data: { token: "test-token", user: { id: 1, username: "testuser" } },
      });
    }
  });

  axios.get = vi.fn().mockResolvedValueOnce({
    data: { profileImage: "image.jpg" },
  });

  render(
    <BrowserRouter>
      <Login onLogin={mockOnLogin} />
    </BrowserRouter>
  );

  await userEvent.type(screen.getByPlaceholderText("Felhasználónév"), "testuser");
  await userEvent.type(screen.getByPlaceholderText("Jelszó"), "TestPass123!");

  fireEvent.click(screen.getByRole("button", { name: /bejelentkezés/i }));

  await waitFor(() => {
    expect(mockOnLogin).toHaveBeenCalled();
  });
});
