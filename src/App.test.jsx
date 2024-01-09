import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";
import { EventProvider } from "./context/EventContext";

describe("App", () => {
  it("sends a signed-out visitor to the sign-in form", async () => {
    render(
      <EventProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </EventProvider>
    );

    expect(
      await screen.findByRole("heading", { name: "Sign In" })
    ).toBeInTheDocument();
  });
});
