import http from "node:http";
import { WebSocketServer, type WebSocket } from "ws";
import type { DeviceManager } from "./device/manager.js";
import type { ModeController, GameType } from "./modes.js";
import { CONSOLE_HTML } from "./consoleHtml.js";
import { MASTER_HTML } from "./masterHtml.js";
import { PRESETS } from "./presets.js";
import { isLlmConfigured } from "./llm.js";
import { handleWechat, isWechatEnabled } from "./wechat.js";
import { handleDev } from "./dev.js";
import { handleEvent } from "./events.js";
import { Recorder } from "./recorder.js";
import { logErr } from "./util.js";

/**
 * Serves the web console (HTML + live WebSocket) from the same process that
 * runs the MCP server, so the console and Claude share one device state.
 *
 * Two pages share one WebSocket:
 *   /         the full console (wearer / operator view)
 *   /master   a focused remote for a "master" controlling the device
 * A client that connects to /ws?role=master is counted as a master so every
 * page can show that a master is in control.
 *
 * Resolves once the port is bound (or skipped on EADDRINUSE).
 */
export function startConsole(
  manager: DeviceManager,
  modes: ModeController,
  port: number
): Promise<void> {
  const httpServer = http.createServer((req, res) => {
    const path = (req.url ?? "/").split("?")[0];
    if (path === "/wechat") {
      // WeChat Official Account callback (compliant two-way control). Async.
      void handleWechat(req, res, manager, modes).catch((e) => {
        logErr(`wechat: ${e}`);
        if (!res.headersSent) { res.writeHead(500); res.end("error"); }
      });
      return;
    }
    if (path === "/dev") {
      // Developer-native triggers (CI / git hook / Pomodoro). Async.
      void handleDev(req, res, manager, modes).catch((e) => {
        logErr(`dev: ${e}`);
        if (!res.headersSent) { res.writeHead(500); res.end("error"); }
      });
      return;
    }
    if (path === "/event") {
      // Universal event webhook (Stream Deck / IFTTT / Home Assistant / overlays). Async.
      void handleEvent(req, res, manager, modes).catch((e) => {
        logErr(`event: ${e}`);
        if (!res.headersSent) { res.writeHead(500); res.end("error"); }
      });
      return;
    }
    if (path === "/" || path.startsWith("/index")) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(CONSOLE_HTML);
    } else if (path === "/master") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(MASTER_HTML);
    } else if (path === "/state") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(manager.snapshot()));
    } else {
      res.writeHead(404);
      res.end("not found");
    }
  });

  // Two endpoints share one HTTP server. Use noServer + a single upgrade router
  // rather than two `{server}` WebSocketServers (which would both listen for the
  // 'upgrade' event and can double-handshake a socket → corrupt frames).
  const wss = new WebSocketServer({ noServer: true });
  const relay = new WebSocketServer({ noServer: true });
  httpServer.on("upgrade", (req, socket, head) => {
    const p = (req.url ?? "").split("?")[0];
    if (p === "/ws") wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    else if (p === "/relay") relay.handleUpgrade(req, socket, head, (ws) => relay.emit("connection", ws, req));
    else socket.destroy();
  });
  const masters = new Set<WebSocket>();
  const recorder = new Recorder(manager, modes);

  // ---- Duet relay hub: a tiny in-memory room switch on the same server, so any
  // claude-f-me instance (even --console-only) can relay two consoles to each
  // other. It only forwards messages between members of the same room; it never
  // touches a device. Each browser decides what to apply to its own device.
  const rooms = new Map<string, Set<WebSocket>>();
  const announce = (room: string) => {
    const set = rooms.get(room);
    const msg = JSON.stringify({ type: "peers", peers: set?.size ?? 0 });
    for (const c of set ?? []) if (c.readyState === c.OPEN) c.send(msg);
  };
  relay.on("connection", (ws: WebSocket, req) => {
    const room = new URLSearchParams((req.url ?? "").split("?")[1] || "").get("room") || "lobby";
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room)!.add(ws);
    announce(room);
    ws.on("message", (raw) => {
      const set = rooms.get(room);
      if (!set) return;
      for (const c of set) if (c !== ws && c.readyState === c.OPEN) c.send(String(raw));
    });
    ws.on("close", () => {
      rooms.get(room)?.delete(ws);
      if (rooms.get(room)?.size === 0) rooms.delete(room);
      announce(room);
    });
  });

  const broadcast = () => {
    const msg = JSON.stringify({ type: "state", state: manager.snapshot() });
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(msg);
    }
  };
  manager.on("state", broadcast);

  wss.on("connection", (ws: WebSocket, req) => {
    const isMaster = (req.url ?? "").includes("role=master");
    if (isMaster) {
      masters.add(ws);
      manager.setMasterCount(masters.size);
    }
    const reply = (o: unknown) => {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(o));
    };
    ws.send(JSON.stringify({ type: "state", state: manager.snapshot() }));
    reply({ type: "muse_list", scores: modes.listScores(), llm: isLlmConfigured() });

    ws.on("close", () => {
      if (masters.delete(ws)) manager.setMasterCount(masters.size);
    });

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
          case "drive": // high-frequency, low-noise (audio mode)
            for (const id of manager.resolveTargets(m.target ?? "all")) {
              await manager.driveStep(id, Number(m.intensity));
            }
            break;
          case "audio_start":
            manager.setActiveMode({ type: "audio", label: String(m.source ?? "mic") });
            break;
          case "audio_stop":
            await manager.stop(m.target ?? "all");
            manager.setActiveMode(null);
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
          case "pattern": {
            const steps = PRESETS[m.preset as string] ?? PRESETS.pulse;
            await manager.pattern(m.target ?? "all", steps, Number(m.loops) || 1);
            break;
          }
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
          case "muse_list":
            reply({ type: "muse_list", scores: modes.listScores(), llm: isLlmConfigured() });
            break;
          case "play_score": {
            const score = m.name ? modes.getScore(String(m.name)) : { brief: m.brief, keyframes: m.keyframes };
            if (!score) { reply({ type: "muse_error", message: "no such score" }); break; }
            await modes.playScore(m.target ?? "all", score, { loop: !!m.loop });
            break;
          }
          case "muse_compose": {
            try {
              const score = await modes.composeViaModel(String(m.brief), m.model);
              if (m.save_as) await modes.saveScore(String(m.save_as), score);
              await modes.playScore(m.target ?? "all", score, { loop: !!m.loop });
              reply({ type: "muse_list", scores: modes.listScores(), llm: true });
            } catch (e) {
              reply({ type: "muse_error", message: String(e instanceof Error ? e.message : e) });
            }
            break;
          }
          case "set_persona":
            modes.setPersona(String(m.id));
            break;
          case "reveal_persona":
            modes.reveal();
            break;
          case "bio_start":
            manager.setActiveMode({ type: "bio", label: String(m.label ?? "heart rate") });
            break;
          case "bio_stop":
            await manager.stop(m.target ?? "all");
            manager.setActiveMode(null);
            break;
          case "clientmode": // a browser-driven mode (e.g. video sync) sets its own badge
            if (m.on) manager.setActiveMode({ type: (m.modeType ?? "video"), label: String(m.label ?? "") });
            else { await manager.stop(m.target ?? "all"); manager.setActiveMode(null); }
            break;
          case "rec_start":
            recorder.begin();
            break;
          case "rec_stop": {
            const r = await recorder.end(m.name ? String(m.name) : undefined);
            reply({ type: "muse_list", scores: modes.listScores(), llm: isLlmConfigured(), recorded: r });
            break;
          }
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
      logErr(`console: http://localhost:${port}  (master remote: /master)`);
      if (isWechatEnabled()) logErr(`console: wechat 公众号 endpoint at /wechat`);
      resolve();
    });
  });
}
