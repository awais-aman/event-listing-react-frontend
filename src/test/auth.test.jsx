import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API, TOKEN } from "./fixtures";
import { renderApp } from "./renderApp";
import { server } from "./server";

const signInWith = async (user, email = "ada@example.com", password = "password123") => {
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Sign In" }));
};

describe("signing in", () => {
  it("stores the token from the Authorization header and opens the workspace", async () => {
    let body;
    server.use(
      http.post(`${API}/login`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({}, { headers: { Authorization: TOKEN } });
      })
    );
    const { user } = renderApp("/login");

    await signInWith(user);

    expect(await screen.findByRole("heading", { name: "My Events" })).toBeInTheDocument();
    expect(body).toEqual({ user: { email: "ada@example.com", password: "password123" } });
    expect(localStorage.getItem("token")).toBe(TOKEN);
  });

  it("explains wrong credentials and stays signed out", async () => {
    server.use(
      http.post(`${API}/login`, () => new HttpResponse("Invalid Email or password.", { status: 401 }))
    );
    const { user } = renderApp("/login");

    await signInWith(user);

    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("does not sign in when the server sends no token", async () => {
    server.use(http.post(`${API}/login`, () => HttpResponse.json({})));
    const { user } = renderApp("/login");

    await signInWith(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(/no session token/);
    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();
  });

  it("returns to the page that asked for a sign-in", async () => {
    server.use(
      http.get(`${API}/api/v1/events/7`, () =>
        HttpResponse.json({ id: 7, name: "Lantern Walk", description: "", date: "2027-01-01T18:00:00Z", location: "Quay" })
      )
    );
    const { user } = renderApp("/events/7");

    expect(await screen.findByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    await signInWith(user);

    expect(await screen.findByText("Lantern Walk")).toBeInTheDocument();
  });

  it("shows the throttling message from the API", async () => {
    server.use(
      http.post(`${API}/login`, () =>
        HttpResponse.json({ errors: ["Too many attempts. Wait a few minutes and try again."] }, { status: 429 })
      )
    );
    const { user } = renderApp("/login");

    await signInWith(user);

    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts");
  });
});

describe("signing out and expired sessions", () => {
  it("revokes the token on the server and forgets it locally", async () => {
    localStorage.setItem("token", TOKEN);
    let sentToken;
    server.use(
      http.delete(`${API}/logout`, ({ request }) => {
        sentToken = request.headers.get("authorization");
        return HttpResponse.json({ status: 200 });
      })
    );
    const { user } = renderApp("/");

    await user.click(await screen.findByRole("button", { name: "Sign Out" }));

    expect(await screen.findByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    expect(sentToken).toBe(TOKEN);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("still signs out when the server no longer knows the session", async () => {
    localStorage.setItem("token", TOKEN);
    server.use(http.delete(`${API}/logout`, () => new HttpResponse(null, { status: 401 })));
    const { user } = renderApp("/");

    await user.click(await screen.findByRole("button", { name: "Sign Out" }));

    expect(await screen.findByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("sends the user to sign in when the API rejects the stored token", async () => {
    localStorage.setItem("token", "Bearer expired");
    const rejected = () =>
      new HttpResponse("You need to sign in or sign up before continuing.", { status: 401 });
    server.use(
      http.get(`${API}/api/v1/events`, rejected),
      http.get(`${API}/api/v1/events/joined_events`, rejected),
      http.get(`${API}/api/v1/events/get_events`, rejected)
    );
    renderApp("/");

    expect(await screen.findByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(1));
    expect(screen.getByRole("alert")).toHaveTextContent("session has expired");
    await waitFor(() => expect(localStorage.getItem("token")).toBeNull());
  });

  it("keeps a signed-in user away from the sign-in page", async () => {
    localStorage.setItem("token", TOKEN);
    renderApp("/login");

    expect(await screen.findByRole("heading", { name: "My Events" })).toBeInTheDocument();
  });
});

describe("signing up", () => {
  const fillSignUp = async (user, confirmation = "password123") => {
    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), confirmation);
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
  };

  it("sends the confirmation under the name Devise expects", async () => {
    let body;
    server.use(
      http.post(`${API}/signup`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ status: { code: 200 } });
      })
    );
    const { user } = renderApp("/signup");

    await fillSignUp(user);

    expect(await screen.findByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    expect(body.user).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
      password_confirmation: "password123",
    });
  });

  it("stops before calling the API when the passwords differ", async () => {
    const { user } = renderApp("/signup");

    await fillSignUp(user, "different");

    expect(await screen.findByRole("alert")).toHaveTextContent("do not match");
  });

  it("lists the server's validation messages", async () => {
    server.use(
      http.post(`${API}/signup`, () =>
        HttpResponse.json({ status: ["Email has already been taken"] }, { status: 422 })
      )
    );
    const { user } = renderApp("/signup");

    await fillSignUp(user);

    expect(await screen.findByRole("alert")).toHaveTextContent("Email has already been taken");
  });

  it("explains a network failure instead of crashing", async () => {
    server.use(http.post(`${API}/signup`, () => HttpResponse.error()));
    const { user } = renderApp("/signup");

    await fillSignUp(user);

    expect(await screen.findByRole("alert")).toHaveTextContent("could not be reached");
  });
});
