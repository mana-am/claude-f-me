import type { IncomingMessage, ServerResponse } from "node:http";
import type { DeviceManager } from "./device/manager.js";
import type { ModeController, GameType } from "./modes.js";
import { PRESETS } from "./presets.js";

/**
 * Universal event endpoint — one webhook the whole world can poke. Point a
 * Stream Deck button, an IFTTT/Home Assistant automation, a Tasker task, a game
 * overlay or a CV script at `POST /event` and drive the device generically:
 *
 *   curl -fsS localhost:8731/event -d 'action=vibrate&intensity=0.6&duration_ms=3000'
 *   curl -fsS localhost:8731/event -d 'action=pattern&name=heartbeat'
 *   curl -fsS localhost:8731/event -d 'action=game&type=edge'
 *   curl -fsS localhost:8731/event -d 'action=event&kind=reward&magnitude=0.8'
 *   curl -fsS localhost:8731/event -d 'action=stop'
 *
 * Optional shared secret: CFM_EVENT_SECRET (falls back to CFM_DEV_SECRET).
 * Everything still passes the safety cap / watchdog. GET works too (query string).
 */
export async function handleEvent(
  req: IncomingMessage,
  res: ServerResponse,
  manager: DeviceManager,
  modes: ModeController
): Promise<boolean> {
  const url = new URL(req.url ?? "/", "http://localhost");
  const p = url.searchParams;
  if (req.method === "POST") {
    for (const [k, v] of new URLSearchParams(await readBody(req))) p.set(k, v);
  }

  const secret = process.env.CFM_EVENT_SECRET ?? process.env.CFM_DEV_SECRET ?? "";
  if (secret && p.get("secret") !== secret) {
    res.writeHead(403, { "content-type": "text/plain" });
    res.end("forbidden");
    return true;
  }

  const action = (p.get("action") || "vibrate").toLowerCase();
  const target = p.get("target") || "all";
  let result: unknown = { ok: true, action };
  try {
    switch (action) {
      case "vibrate": {
        const intensity = clamp01(Number(p.get("intensity")));
        const dur = p.get("duration_ms") ? Number(p.get("duration_ms")) : undefined;
        await manager.vibrate(target, Number.isFinite(intensity) ? intensity : 0.5, dur);
        break;
      }
      case "pattern":
        await manager.pattern(target, PRESETS[p.get("name") || "pulse"] ?? PRESETS.pulse, Number(p.get("loops")) || 2);
        break;
      case "game":
        await modes.startGame(target, (p.get("type") || "ambient") as GameType, {
          durationMs: p.get("duration_ms") ? Number(p.get("duration_ms")) : undefined,
        });
        break;
      case "event": // narrative game_event: reward/penalty/tease/pulse
        await modes.gameEvent(target, (p.get("kind") || "pulse") as any, Number(p.get("magnitude")) || 0.7);
        break;
      case "stop":
        await manager.stop(target);
        break;
      case "scan":
        await manager.scan(Number(p.get("duration_ms")) || 4000);
        break;
      default:
        result = { ok: false, error: `unknown action "${action}"` };
    }
  } catch (e) {
    result = { ok: false, error: String(e instanceof Error ? e.message : e) };
  }

  manager.log_("cmd", `event: ${action}`);
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(result));
  return true;
}

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : NaN);

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 8192) req.destroy();
    });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(data));
  });
}
