import type { DeviceManager } from "./device/manager.js";
import type { ModeController, GameType } from "./modes.js";
import { PRESETS } from "./presets.js";
import { delay, logErr } from "./util.js";

/**
 * Telegram bridge — control the device from a chat you already use, so a partner
 * (even far away) can drive it with a message or an emoji. Zero dependencies:
 * long-polls the Bot API with global fetch.
 *
 *   CFM_TELEGRAM_TOKEN   bot token from @BotFather (required to enable)
 *   CFM_TELEGRAM_ALLOW   comma-separated chat ids allowed to control (recommended)
 *
 * If no allow-list is set, ANYONE who finds the bot can control the device — we
 * log a loud warning. The global safety cap and "stop"/safeword always apply.
 */
export function startTelegram(
  manager: DeviceManager,
  modes: ModeController,
  token: string,
  allowCsv: string
): { stop(): void } {
  const allow = allowCsv.split(",").map((s) => s.trim()).filter(Boolean);
  if (allow.length === 0) {
    logErr("telegram: ⚠ no CFM_TELEGRAM_ALLOW set — anyone who finds the bot can control the device");
  }
  let offset = 0;
  let running = true;

  const api = (method: string, body: unknown) =>
    fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  const send = (chat: number | string, text: string) => api("sendMessage", { chat_id: chat, text }).catch(() => {});

  const curMax = () => {
    const d = manager.snapshot().devices;
    return d.reduce((a, x) => Math.max(a, x.intensity), 0);
  };
  const game = (t: GameType) => modes.startGame("all", t);
  const pat = (p: string) => manager.pattern("all", PRESETS[p] ?? PRESETS.pulse, 3);

  async function route(text: string): Promise<string> {
    const s = text.trim();
    const low = s.toLowerCase();
    const zh = /[一-鿿]/.test(s);

    if (low === "/start" || low === "help" || low === "/help" || s === "帮助") {
      return zh
        ? "claude-f-me 遥控 💕\n发强度数字 0–100、或 harder/softer、stop/safeword、scan。\n表情：🔥边缘 💓心跳 🌊环境 🎡转盘 📈递增 🎲随机 🛑停止"
        : "claude-f-me remote 💕\nSend a number 0–100, or harder/softer, stop/safeword, scan.\nEmoji: 🔥edge 💓heartbeat 🌊ambient 🎡wheel 📈escalation 🎲surprise 🛑stop";
    }
    if (/(safeword|^stop$|^\/stop$|🛑|停|住手)/.test(low)) {
      modes.stop();
      await manager.stopAll();
      return zh ? "🛑 已全部停止，你是安全的。" : "🛑 everything stopped. you're safe.";
    }
    if (low === "scan" || low === "/scan" || s === "扫描") {
      await manager.scan(4000);
      return zh ? "🔍 扫描中…" : "🔍 scanning…";
    }
    if (/(harder|more|\+|更|强|用力)/.test(low)) {
      const v = Math.min(1, curMax() + 0.2);
      await manager.vibrate("all", v);
      return (zh ? "🔥 加到 " : "🔥 up to ") + Math.round(v * 100) + "%";
    }
    if (/(softer|less|-|轻|温柔|慢)/.test(low)) {
      const v = Math.max(0, curMax() - 0.2);
      await manager.vibrate("all", v);
      return (zh ? "🫦 降到 " : "🫦 down to ") + Math.round(v * 100) + "%";
    }
    // emoji / keyword modes
    if (low.includes("🔥") || low.includes("edge") || s.includes("边缘")) { await game("edge"); return zh ? "🔥 边缘控制开始" : "🔥 edging"; }
    if (low.includes("📈") || low.includes("escalat") || s.includes("递增")) { await game("escalation"); return zh ? "📈 递增中" : "📈 escalating"; }
    if (low.includes("🌊") || low.includes("ambient") || s.includes("环境")) { await game("ambient"); return zh ? "🌊 环境波动" : "🌊 ambient waves"; }
    if (low.includes("🎡") || low.includes("wheel") || s.includes("转盘")) { await game("wheel"); return zh ? "🎡 转盘旋转" : "🎡 spinning the wheel"; }
    if (low.includes("💓") || low.includes("heart") || s.includes("心跳")) { await pat("heartbeat"); return zh ? "💓 心跳节奏" : "💓 heartbeat"; }
    if (low.includes("🎲") || low.includes("surprise") || s.includes("随机") || s.includes("惊喜")) {
      const games: GameType[] = ["roulette", "ambient", "edge", "wheel"];
      await game(games[Math.floor(Math.random() * games.length)]);
      return zh ? "🎲 给你个惊喜…" : "🎲 surprise…";
    }
    // a bare number 0-100 (optionally with %)
    const num = low.match(/^(\d{1,3})\s*%?$/);
    if (num) {
      const v = Math.max(0, Math.min(1, parseInt(num[1], 10) / 100));
      await manager.vibrate("all", v, 60000);
      return (zh ? "设到 " : "set to ") + Math.round(v * 100) + "%";
    }
    return zh ? "没听懂～试试 harder / softer / stop 或 🔥💓🎲" : "didn't catch that — try harder / softer / stop or 🔥💓🎲";
  }

  async function handle(update: any): Promise<void> {
    const msg = update.message ?? update.edited_message;
    if (!msg || typeof msg.text !== "string") return;
    const chat = msg.chat?.id;
    if (allow.length && !allow.includes(String(chat))) {
      await send(chat, "⛔ not authorised");
      return;
    }
    try {
      const reply = await route(msg.text);
      if (reply) await send(chat, reply);
    } catch (e) {
      logErr(`telegram: route error ${e}`);
    }
  }

  async function loop(): Promise<void> {
    logErr("telegram: bridge started (long-polling)");
    while (running) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=30&offset=${offset}`);
        const data: any = await res.json();
        for (const u of data.result ?? []) {
          offset = u.update_id + 1;
          await handle(u);
        }
      } catch (e) {
        logErr(`telegram: poll error ${e}`);
        await delay(2000);
      }
    }
  }

  void loop();
  return { stop() { running = false; } };
}
