import http from "node:http";
import { WebSocketServer, type WebSocket } from "ws";
import type { DeviceManager } from "./device/manager.js";
import type { ModeController, GameType } from "./modes.js";
import { CONSOLE_HTML } from "./consoleHtml.js";
import { logErr } from "./util.js";

/**
 * Serves the web console (HTML + live WebSocket) from the same process that
 * runs the MCP server, so the console and Claude share one device state.
 * Resolves once the port is bound (or skipped on EADDRINUSE).
 */
export function startConsole(
  manager: DeviceManager,
  modes: ModeController,
  port: number
): Promise<void> {
  const httpServer = http.createServer((req, res) => {
    if (req.url === "/" || req.url?.startsWith("/index")) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(CONSOLE_HTML);
    } else if (req.url === "/state") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(manager.snapshot()));
    } else {
      res.writeHead(404);
      res.end("not found");
    }
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const broadcast = () => {
    const msg = JSON.stringify({ type: "state", state: manager.snapshot() });
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(msg);
    }
  };
  manager.on("state", broadcast);

  wss.on("connection", (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: "state", state: manager.snapshot() }));
    ws.on("message", async (raw) => {
      let m: any;
      try {
        m = JSON.parse(String(raw));
      } catch {
        return;
      }
      try {
        switch (m.type) {
          case "set":
            await manager.vibrate(m.id ?? "all", Number(m.intensity), m.durationMs);
            break;
          case "stop_all":
            await manager.stopAll();
            break;
          case "scan":
            await manager.scan(Number(m.ms) || 4000);
            break;
          case "set_max":
            manager.setMaxIntensity(Number(m.value));
            break;
          case "load_funscript":
            await modes.loadFunscript(String(m.source));
            break;
          case "play_video":
            if (m.source) await modes.loadFunscript(String(m.source));
            await modes.playVideo(m.target ?? "all", {
              loop: !!m.loop,
              speed: Number(m.speed) || 1,
              invert: !!m.invert,
            });
            break;
          case "start_game":
            await modes.startGame(m.target ?? "all", m.gameType as GameType, {
              intensityMax: m.intensityMax != null ? Number(m.intensityMax) : undefined,
            });
            break;
          case "stop_mode":
            modes.stop();
            await manager.stop(m.target ?? "all");
            break;
        }
      } catch (e) {
        logErr(`console command error: ${e}`);
      }
    });
  });

  return new Promise<void>((resolve) => {
    httpServer.on("error", (e: NodeJS.ErrnoException) => {
      if (e.code === "EADDRINUSE") {
        logErr(`console: port ${port} in use — console disabled (MCP still running)`);
      } else {
        logErr(`console: server error ${e.message}`);
      }
      resolve();
    });
    httpServer.listen(port, () => {
      logErr(`console: http://localhost:${port}`);
      resolve();
    });
  });
}
