import { Hono } from "hono";
import { serve, upgradeWebSocket } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { WebSocketServer } from "ws";
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

const wss = new WebSocketServer({ noServer: true });

const server = serve({
  fetch: app.fetch,
  websocket: { server: wss },
});

export default server;
