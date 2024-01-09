import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { API, TOKEN } from "../test/fixtures";
import { server } from "../test/server";
import api, { onUnauthorized } from "./api";
import { saveToken } from "./session";

describe("api client", () => {
  let stopListening;
  afterEach(() => stopListening?.());

  it("sends the stored token back exactly as the server issued it", async () => {
    saveToken(TOKEN);
    let received;
    server.use(
      http.get(`${API}/api/v1/events`, ({ request }) => {
        received = request.headers.get("authorization");
        return HttpResponse.json([]);
      })
    );

    await api.get("/api/v1/events");
    expect(received).toBe(TOKEN);
  });

  it("reports an expired session on a protected call", async () => {
    const handler = vi.fn();
    stopListening = onUnauthorized(handler);
    server.use(http.get(`${API}/api/v1/events`, () => new HttpResponse(null, { status: 401 })));

    await expect(api.get("/api/v1/events")).rejects.toThrow();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("treats a 401 from /login as bad credentials, not an expired session", async () => {
    const handler = vi.fn();
    stopListening = onUnauthorized(handler);
    server.use(http.post(`${API}/login`, () => new HttpResponse(null, { status: 401 })));

    await expect(api.post("/login", {})).rejects.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });
});
