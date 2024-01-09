// Captures docs/screenshots/*.png from a production build in headless Chromium.
// Every API call is answered from scripts/demo-events.json, so no backend runs.
// Usage: npm run build && npm run screenshots
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "@playwright/test";

const DIST = "dist";
const OUT = "docs/screenshots";
const PORT = 4174;
const demo = JSON.parse(readFileSync(new URL("./demo-events.json", import.meta.url)));

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = createServer((req, res) => {
  let file = join(DIST, decodeURIComponent(req.url.split("?")[0]));
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, "index.html");
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

const json = (route, body) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: { "X-Total-Count": String(Array.isArray(body) ? body.length : 1) },
    body: JSON.stringify(body),
  });

const mockApi = async (page) => {
  await page.route(/\/api\/v1\/events(\/[^?]*)?(\?.*)?$/, (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/joined_events")) return json(route, demo.joined);
    if (path.endsWith("/get_events")) return json(route, demo.joinable);
    const id = path.match(/\/events\/(\d+)$/)?.[1];
    if (id) {
      const all = [...demo.mine, ...demo.joined, ...demo.joinable];
      return json(route, all.find((e) => String(e.id) === id));
    }
    return json(route, demo.mine);
  });
};

const shots = [
  { name: "sign-in", path: "/login", signedIn: false, viewport: "desktop" },
  { name: "workspace", path: "/", viewport: "desktop", fullPage: true },
  { name: "create-event", path: "/", viewport: "desktop", action: "create" },
  { name: "event-details", path: "/events/21", viewport: "desktop" },
  { name: "workspace-mobile", path: "/", viewport: "mobile" },
  { name: "event-details-mobile", path: "/events/21", viewport: "mobile" },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

mkdirSync(OUT, { recursive: true });
await new Promise((resolve) => server.listen(PORT, resolve));
const browser = await chromium.launch();

try {
  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: VIEWPORTS[shot.viewport],
      deviceScaleFactor: 1,
      timezoneId: "Europe/London",
      locale: "en-GB",
    });
    if (shot.signedIn !== false) {
      await context.addInitScript(() => localStorage.setItem("token", "Bearer demo-token"));
    }
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (err) => errors.push(String(err)));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    await mockApi(page);

    await page.goto(`http://localhost:${PORT}${shot.path}`, { waitUntil: "networkidle" });
    if (shot.action === "create") {
      await page.getByRole("button", { name: "Create an event" }).click();
      await page.getByLabel("Event name").fill("Harbour Cleanup");
      await page.getByLabel("Description").fill("Litter pick along the quay, bags and grabbers provided.");
      await page.getByLabel("Location").fill("South Quay steps");
      await page.waitForTimeout(400);
    }
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: Boolean(shot.fullPage) });
    if (errors.length) throw new Error(`${shot.name}: ${errors.join("; ")}`);
    console.log(`captured ${shot.name}`);
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
