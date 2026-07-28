import { Hono } from "hono";
import { serveStatic, upgradeWebSocket, websocket } from "hono/bun";
import { handleCallEvent, createMediaStreamHandler } from "./handlers";

const app = new Hono();

// Health check
app.get("/intercom", (c) => c.html(`<h1>hi</h1>`));

// Static files
app.use("/public/*", serveStatic({ root: "./" }));
app.get("/beep.mp3", serveStatic({ path: "./public/beep.mp3" }));

// Telnyx webhook for call events
app.post("/intercom", handleCallEvent);

// WebSocket for media streaming
app.get(
  "/media-stream",
  upgradeWebSocket(() => createMediaStreamHandler())
);

const server = Bun.serve({
  fetch: app.fetch,
  websocket,
)};

export default server;
