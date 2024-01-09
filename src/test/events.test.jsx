import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API, TOKEN, joinableEvents, myEvents } from "./fixtures";
import { renderApp } from "./renderApp";
import { server } from "./server";

const section = (name) => screen.getByRole("region", { name });

beforeEach(() => localStorage.setItem("token", TOKEN));

describe("event workspace", () => {
  it("lists organised, joined and joinable events", async () => {
    renderApp("/");

    expect(await within(section("My Events")).findByText("Riverside Book Swap")).toBeInTheDocument();
    expect(await within(section("Joined Events")).findByText("Saturday Trail Run")).toBeInTheDocument();
    expect(
      await within(section("Join Upcoming Events")).findByText("Community Garden Workday")
    ).toBeInTheDocument();
  });

  it("shows an error with a retry instead of the empty message", async () => {
    let calls = 0;
    server.use(
      http.get(`${API}/api/v1/events`, () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json({ errors: ["Database unavailable"] }, { status: 500 })
          : HttpResponse.json(myEvents);
      })
    );
    const { user } = renderApp("/");

    const mine = section("My Events");
    expect(await within(mine).findByText("Database unavailable")).toBeInTheDocument();
    expect(within(mine).queryByText(/not created any event/)).not.toBeInTheDocument();

    await user.click(within(mine).getByRole("button", { name: "Try again" }));
    expect(await within(mine).findByText("Riverside Book Swap")).toBeInTheDocument();
  });

  it("shows the empty message once a list loads with no rows", async () => {
    server.use(http.get(`${API}/api/v1/events/joined_events`, () => HttpResponse.json([])));
    renderApp("/");

    expect(
      await within(section("Joined Events")).findByText("You have not joined any event yet.")
    ).toBeInTheDocument();
  });

  it("pages through a list using X-Total-Count", async () => {
    const pagesAsked = [];
    server.use(
      http.get(`${API}/api/v1/events/get_events`, ({ request }) => {
        const page = new URL(request.url).searchParams.get("page");
        pagesAsked.push(page);
        const row = { ...joinableEvents[0], id: 30 + Number(page), name: `Meetup page ${page}` };
        return HttpResponse.json([row], { headers: { "X-Total-Count": "2" } });
      })
    );
    const { user } = renderApp("/");

    const joinable = section("Join Upcoming Events");
    await within(joinable).findByText("Meetup page 1");
    await user.click(within(joinable).getByRole("button", { name: "Load more" }));

    expect(await within(joinable).findByText("Meetup page 2")).toBeInTheDocument();
    expect(within(joinable).getByText("Meetup page 1")).toBeInTheDocument();
    expect(within(joinable).queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    expect(pagesAsked).toEqual(["1", "2"]);
  });
});

describe("managing events", () => {
  it("creates an event and shows the server's copy in My Events", async () => {
    let body;
    server.use(
      http.post(`${API}/api/v1/events`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 99, organizer_id: 1, ...body.event }, { status: 201 });
      })
    );
    const { user } = renderApp("/");
    await within(section("My Events")).findByText("Riverside Book Swap");

    await user.click(screen.getByRole("button", { name: "Create an event" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Event name/), "Harbour Cleanup");
    await user.type(within(dialog).getByLabelText(/Description/), "Litter pick along the quay.");
    await user.type(within(dialog).getByLabelText(/Location/), "South Quay");
    await user.click(within(dialog).getByRole("button", { name: "Create Event" }));

    expect(await within(section("My Events")).findByText("Harbour Cleanup")).toBeInTheDocument();
    expect(body.event).toMatchObject({ name: "Harbour Cleanup", location: "South Quay" });
    expect(new Date(body.event.date).toISOString()).toBe(body.event.date);
  });

  it("explains field validation failures and keeps the form open", async () => {
    server.use(
      http.post(`${API}/api/v1/events`, () =>
        HttpResponse.json({ attributes_errors: { date: ["must be in the future"] } }, { status: 422 })
      )
    );
    const { user } = renderApp("/");
    await within(section("My Events")).findByText("Riverside Book Swap");

    await user.click(screen.getByRole("button", { name: "Create an event" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Event name/), "Late Event");
    await user.type(within(dialog).getByLabelText(/Description/), "Too late.");
    await user.type(within(dialog).getByLabelText(/Location/), "Nowhere");
    await user.click(within(dialog).getByRole("button", { name: "Create Event" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Date must be in the future");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("updates a card from the server's response after an edit", async () => {
    server.use(
      http.patch(`${API}/api/v1/events/1`, async ({ request }) => {
        const { event } = await request.json();
        return HttpResponse.json({ ...myEvents[0], ...event });
      })
    );
    const { user } = renderApp("/");

    await user.click(await within(section("My Events")).findByText("Riverside Book Swap"));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByLabelText(/Event name/)).toBeDisabled();
    await user.click(within(dialog).getByRole("button", { name: "Edit" }));
    const name = within(dialog).getByLabelText(/Event name/);
    await user.clear(name);
    await user.type(name, "Riverside Book Swap II");
    await user.click(within(dialog).getByRole("button", { name: "Update Event" }));

    expect(
      await within(section("My Events")).findByText("Riverside Book Swap II")
    ).toBeInTheDocument();
  });

  it("opens the form ready to edit from the card's Edit button", async () => {
    const { user } = renderApp("/");

    await user.click(
      await within(section("My Events")).findByRole("button", { name: "Edit Riverside Book Swap" })
    );

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByLabelText(/Event name/)).toBeEnabled();
    expect(within(dialog).getByRole("button", { name: "Update Event" })).toBeInTheDocument();
  });

  it("deletes an event and closes the confirmation", async () => {
    server.use(http.delete(`${API}/api/v1/events/1`, () => new HttpResponse(null, { status: 204 })));
    const { user } = renderApp("/");
    await within(section("My Events")).findByText("Riverside Book Swap");

    await user.click(screen.getByRole("button", { name: "Delete Riverside Book Swap" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(within(section("My Events")).queryByText("Riverside Book Swap")).not.toBeInTheDocument()
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps the event when the API refuses the delete", async () => {
    server.use(
      http.delete(`${API}/api/v1/events/1`, () =>
        HttpResponse.json({ errors: ["You are not allowed to perform this action"] }, { status: 403 })
      )
    );
    const { user } = renderApp("/");
    await within(section("My Events")).findByText("Riverside Book Swap");

    await user.click(screen.getByRole("button", { name: "Delete Riverside Book Swap" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("not allowed");
    expect(within(section("My Events")).getByText("Riverside Book Swap")).toBeInTheDocument();
  });

  it("moves a joined event from the joinable list to Joined Events", async () => {
    let joinedId;
    server.use(
      http.post(`${API}/api/v1/events/add_user_to_events`, ({ request }) => {
        joinedId = new URL(request.url).searchParams.get("event_id");
        return HttpResponse.json({ id: 1, user_id: 1, event_id: 3 }, { status: 201 });
      })
    );
    const { user } = renderApp("/");
    const joinable = section("Join Upcoming Events");
    await within(joinable).findByText("Community Garden Workday");

    await user.click(within(joinable).getByRole("button", { name: "Join Community Garden Workday" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Join" }));

    expect(
      await within(section("Joined Events")).findByText("Community Garden Workday")
    ).toBeInTheDocument();
    expect(within(joinable).queryByText("Community Garden Workday")).not.toBeInTheDocument();
    expect(joinedId).toBe("3");
  });
});

describe("event details", () => {
  it("opens from a card without reloading the page", async () => {
    server.use(http.get(`${API}/api/v1/events/2`, () => HttpResponse.json({
      id: 2, name: "Saturday Trail Run", description: "An easy 8 km loop.",
      date: "2027-04-03T08:00:00.000Z", location: "North Gate, Hill Park",
    })));
    const { user } = renderApp("/");

    await user.click(await within(section("Joined Events")).findByText("Saturday Trail Run"));

    expect(await screen.findByText("North Gate, Hill Park")).toBeInTheDocument();
    expect(screen.getByText(/April 3, 2027/)).toBeInTheDocument();
  });

  it("says when an event does not exist", async () => {
    server.use(
      http.get(`${API}/api/v1/events/404`, () =>
        HttpResponse.json({ errors: ["Event not found"] }, { status: 404 })
      )
    );
    renderApp("/events/404");

    expect(await screen.findByRole("heading", { name: "Event not found" })).toBeInTheDocument();
  });

  it("offers a retry when the server fails", async () => {
    let calls = 0;
    server.use(
      http.get(`${API}/api/v1/events/5`, () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json({ errors: ["Temporarily unavailable"] }, { status: 503 })
          : HttpResponse.json({ id: 5, name: "Night Market", description: "", date: "2027-05-01T19:00:00Z", location: "Dock 5" });
      })
    );
    const { user } = renderApp("/events/5");

    expect(await screen.findByText("Temporarily unavailable")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Night Market")).toBeInTheDocument();
  });
});
