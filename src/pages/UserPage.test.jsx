import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import UserPage from "./UserPage";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import userEvent from "@testing-library/user-event";

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
    profileImage: "image.jpg",
  },
  token: "test-token",
};

test("hibás jelszóval nem lehet profilt törölni", async () => {
  axios.delete = vi.fn().mockRejectedValue({ response: { status: 401 } });
  localStorage.setItem("token", "test-token");

  const mockOnLogout = vi.fn();
  const mockUpdateUser = vi.fn();

  render(
    <MemoryRouter>
      <UserPage user={mockUser} onLogout={mockOnLogout} updateUser={mockUpdateUser} />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByTitle("Profil módosítása"));

  const passwordInput = document.querySelector(".delete-profile-box input[type='password']");
  await userEvent.type(passwordInput, "wrongpassword123");

  fireEvent.click(document.querySelector("#confirmDelete"));
  fireEvent.click(screen.getByRole("button", { name: /profil végleges törlése|törlés/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Hibás jelszó!");
  });

  expect(axios.delete).toHaveBeenCalledWith(
    `${process.env.REACT_APP_BACKEND_URL}Profile/delete`,
    { headers: { Authorization: "Bearer test-token" }, data: { password: "wrongpassword123" } }
  );

  expect(mockOnLogout).not.toHaveBeenCalled();
});
