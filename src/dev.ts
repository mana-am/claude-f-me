import type { IncomingMessage, ServerResponse } from "node:http";
import type { DeviceManager } from "./device/manager.js";
import type { ModeController } from "./modes.js";
import { PRESETS } from "./presets.js";

/**
 * Developer-native triggers — the most "Claude Code plugin" feature there is:
 * drive the device from your dev loop. A tiny HTTP endpoint at `/dev` that a git
 * hook, a CI step, a Pomodoro timer or a shell alias can hit:
 *
 *   curl -fsS localhost:8731/dev -d event=ci_pass
 *   curl -fsS localhost:8731/dev -d 'event=commit&magnitude=0.5'
 *
 * Events → reactions (all pass the safety cap / watchdog like everything else):
 *   commit / push      → a quick pulse
 *   ci_pass / merge    → a reward burst (escalate pattern)
 *   focus_done         → reward (you earned it)
 *   ci_fail / distracted → a short buzz / stop (a nudge, not a treat)
 *
 * Set CFM_DEV_SECRET to require `?secret=` / `secret=` (recommended if the port
 * is reachable beyond localhost). Without it, anything that can reach the port
 * can buzz you — fine for a local-only setup.
 */
export function isDevEnabled(): boolean {
  // always available locally; the endpoint itself enforces the optional secret
  return true;
}

type DevEvent = "commit" | "push" | "ci_pass" | "ci_fail" | "merge" | "focus_done" | "distracted";

export async function handleDev(
  req: IncomingMessage,
  res: ServerResponse,
  manager: DeviceManager,
  modes: ModeController
): Promise<boolean> {
  const url = new URL(req.url ?? "/", "http://localhost");
  let params = url.searchParams;
  if (req.method === "POST") {
    const body = await readBody(req);
    const bp = new URLSearchParams(body);
    // merge body params (body wins)
    for (const [k, v] of bp) params.set(k, v);
  }

  const secret = process.env.CFM_DEV_SECRET ?? "";
  if (secret && params.get("secret") !== secret) {
    res.writeHead(403, { "content-type": "text/plain" });
    res.end("forbidden");
    return true;
  }

  const event = (params.get("event") || "pulse") as DevEvent;
  const mag = clamp01(Number(params.get("magnitude")) || NaN);
  const reaction = await react(event, Number.isFinite(mag) ? mag : undefined, manager, modes);

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, event, reaction }));
  return true;
}

async function react(
  event: DevEvent,
  mag: number | undefined,
  manager: DeviceManager,
  modes: ModeController
): Promise<string> {
  switch (event) {
    case "ci_pass":
    case "merge":
    case "focus_done":
      await modes.gameEvent("all", "reward", mag ?? 0.85);
      manager.log_("cmd", `dev:${event} → reward 🎉`);
      return "reward";
    case "commit":
    case "push":
      await modes.gameEvent("all", "pulse", mag ?? 0.5);
      manager.log_("cmd", `dev:${event} → pulse`);
      return "pulse";
    case "ci_fail":
      await manager.pattern("all", PRESETS.sos, 1);
      manager.log_("cmd", "dev:ci_fail → sos buzz");
      return "sos";
    case "distracted":
      await manager.stop("all");
      manager.log_("cmd", "dev:distracted → stop");
      return "stop";
    default:
      await modes.gameEvent("all", "pulse", mag ?? 0.6);
      return "pulse";
  }
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
