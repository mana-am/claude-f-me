import WebSocket from "ws";
import type { DeviceManager } from "./device/manager.js";
import type { ModeController, GameType } from "./modes.js";
import { PRESETS } from "./presets.js";
import { logErr } from "./util.js";

/**
 * Discord bridge — control the device from a Discord DM or channel (like the
 * community's Vencord trigger mod, but server-side and bidirectional). A minimal
 * Gateway client over `ws`, no discord.js dependency: HELLO→heartbeat→IDENTIFY,
 * then react to MESSAGE_CREATE. Replies via the REST API.
 *
 *   CFM_DISCORD_TOKEN   bot token (Developer Portal → Bot). Enable the
 *                       "Message Content Intent" there.
 *   CFM_DISCORD_ALLOW   comma-separated user or channel ids allowed to control.
 *
 * Without an allow-list, anyone who can message the bot can drive it — we warn.
 * The safety cap and "stop"/safeword always apply.
 */
const GATEWAY = "wss://gateway.discord.gg/?v=10&encoding=json";
const API = "https://discord.com/api/v10";
const INTENTS = (1 << 9) | (1 << 12) | (1 << 15); // GUILD_MESSAGES | DIRECT_MESSAGES | MESSAGE_CONTENT

export function startDiscord(
  manager: DeviceManager,
  modes: ModeController,
  token: string,
  allowCsv: string
): { stop(): void } {
  const allow = allowCsv.split(",").map((s) => s.trim()).filter(Boolean);
  if (allow.length === 0) {
    logErr("discord: ⚠ no CFM_DISCORD_ALLOW set — anyone who can message the bot can control the device");
  }

  let ws: WebSocket | null = null;
  let hb: NodeJS.Timeout | null = null;
  let seq: number | null = null;
  let selfId = "";
  let running = true;

  const reply = (channelId: string, content: string) =>
    fetch(`${API}/channels/${channelId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bot ${token}` },
      body: JSON.stringify({ content }),
    }).catch(() => {});

  const curMax = () => manager.snapshot().devices.reduce((a, x) => Math.max(a, x.intensity), 0);

  async function route(text: string): Promise<string> {
    const s = text.trim();
    const low = s.toLowerCase();
    const game = (t: GameType) => modes.startGame("all", t);
    if (low === "!help" || low === "help") {
      return "claude-f-me 💕 — send `0–100`, `harder`/`softer`, `stop`/`safeword`, `scan`, or 🔥💓🌊🎡📈🎲";
    }
    if (/(safeword|^stop$|^!stop$|🛑)/.test(low)) { modes.stop(); await manager.stopAll(); return "🛑 stopped — you're safe."; }
    if (low === "scan" || low === "!scan") { await manager.scan(4000); return "🔍 scanning…"; }
    if (/(harder|more|\+)/.test(low)) { const v = Math.min(1, curMax() + 0.2); await manager.vibrate("all", v); return "🔥 up to " + Math.round(v * 100) + "%"; }
    if (/(softer|less|-)/.test(low)) { const v = Math.max(0, curMax() - 0.2); await manager.vibrate("all", v); return "🫦 down to " + Math.round(v * 100) + "%"; }
    if (low.includes("🔥") || low.includes("edge")) { await game("edge"); return "🔥 edging"; }
    if (low.includes("📈") || low.includes("escalat")) { await game("escalation"); return "📈 escalating"; }
    if (low.includes("🌊") || low.includes("ambient")) { await game("ambient"); return "🌊 ambient"; }
    if (low.includes("🎡") || low.includes("wheel")) { await game("wheel"); return "🎡 wheel"; }
    if (low.includes("💓") || low.includes("heart")) { await manager.pattern("all", PRESETS.heartbeat, 3); return "💓 heartbeat"; }
    if (low.includes("🎲") || low.includes("surprise")) { const g: GameType[] = ["roulette", "ambient", "edge", "wheel"]; await game(g[Math.floor(Math.random() * g.length)]); return "🎲 surprise…"; }
    const num = low.match(/^!?(\d{1,3})\s*%?$/);
    if (num) { const v = Math.max(0, Math.min(1, parseInt(num[1], 10) / 100)); await manager.vibrate("all", v, 60000); return "set to " + Math.round(v * 100) + "%"; }
    return ""; // stay quiet on unrelated chatter
  }

  function connect(): void {
    if (!running) return;
    ws = new WebSocket(GATEWAY);
    ws.on("message", async (raw) => {
      let m: any;
      try { m = JSON.parse(String(raw)); } catch { return; }
      if (m.s != null) seq = m.s;
      if (m.op === 10) {
        const interval = m.d.heartbeat_interval;
        hb = setInterval(() => ws?.send(JSON.stringify({ op: 1, d: seq })), interval);
        ws?.send(JSON.stringify({
          op: 2,
          d: { token, intents: INTENTS, properties: { os: "linux", browser: "claude-f-me", device: "claude-f-me" } },
        }));
      } else if (m.op === 0) {
        if (m.t === "READY") { selfId = m.d?.user?.id ?? ""; logErr("discord: bridge ready"); }
        else if (m.t === "MESSAGE_CREATE") {
          const d = m.d;
          if (!d || d.author?.bot || d.author?.id === selfId) return;
          if (allow.length && !allow.includes(String(d.author?.id)) && !allow.includes(String(d.channel_id))) return;
          const out = await route(String(d.content ?? ""));
          if (out) await reply(d.channel_id, out);
        }
      }
    });
    ws.on("close", () => {
      if (hb) clearInterval(hb);
      hb = null;
      if (running) setTimeout(connect, 3000); // reconnect (fresh identify)
    });
    ws.on("error", (e) => logErr(`discord: ws error ${e}`));
  }

  connect();
  return {
    stop() {
      running = false;
      if (hb) clearInterval(hb);
      try { ws?.close(); } catch { /* ignore */ }
    },
  };
}
