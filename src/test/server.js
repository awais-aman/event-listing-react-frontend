import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { API, TOKEN, joinableEvents, joinedEvents, myEvents } from "./fixtures";

export const handlers = [
  http.post(`${API}/login`, () =>
    HttpResponse.json(
      { status: { code: 200, message: "Logged in successfully." } },
      { headers: { Authorization: TOKEN, "Access-Control-Expose-Headers": "Authorization" } }
    )
  ),
  http.delete(`${API}/logout`, () =>
    HttpResponse.json({ status: 200, message: "Logged out successfully." })
  ),
  http.post(`${API}/signup`, () =>
    HttpResponse.json({ status: { code: 200, message: "Signed up successfully." } })
  ),
  http.get(`${API}/api/v1/events`, () => HttpResponse.json(myEvents)),
  http.get(`${API}/api/v1/events/joined_events`, () => HttpResponse.json(joinedEvents)),
  http.get(`${API}/api/v1/events/get_events`, () => HttpResponse.json(joinableEvents)),
];

export const server = setupServer(...handlers);
