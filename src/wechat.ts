import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { DeviceManager } from "./device/manager.js";
import type { ModeController, GameType } from "./modes.js";
import { PRESETS } from "./presets.js";
import { logErr } from "./util.js";

/**
 * WeChat Official Account (公众号) bridge — the *compliant* way to control the
 * device from WeChat, mounted on the console's HTTP server at `/wechat`.
 *
 * We deliberately do NOT touch personal-WeChat web protocols (itchat/wechaty):
 * those violate WeChat's ToS and get accounts banned. This uses the official
 * 公众号 message callback instead:
 *   - GET  /wechat  → server verification (sha1 of token+timestamp+nonce)
 *   - POST /wechat  → an incoming text message (XML); we reply passively (<5s)
 *
 * Enable by setting CFM_WECHAT_TOKEN (the Token you configure in 公众号后台 →
 * 服务器配置). Point that server URL at http(s)://<your-public-host>/wechat
 * (use a tunnel/反向代理 since this runs locally). Restrict who can drive with
 * CFM_WECHAT_ALLOW = comma-separated OpenIDs; empty means anyone who messages
 * the account can control the device — we log a loud warning.
 *
 * For send-only / team use, 企业微信 group-robot webhooks are simpler but can't
 * receive replies; the 公众号 path here is what enables two-way control.
 */
export function isWechatEnabled(): boolean {
  return !!process.env.CFM_WECHAT_TOKEN;
}

const allowList = () =>
  (process.env.CFM_WECHAT_ALLOW ?? "").split(",").map((s) => s.trim()).filter(Boolean);

/** Returns true if it handled the request (path was /wechat). */
export async function handleWechat(
  req: IncomingMessage,
  res: ServerResponse,
  manager: DeviceManager,
  modes: ModeController
): Promise<boolean> {
  const token = process.env.CFM_WECHAT_TOKEN ?? "";
  if (!token) return false;

  const url = new URL(req.url ?? "/", "http://localhost");
  const q = url.searchParams;
  const signature = q.get("signature") ?? "";
  const timestamp = q.get("timestamp") ?? "";
  const nonce = q.get("nonce") ?? "";

  const ok = verify(token, timestamp, nonce, signature);

  if (req.method === "GET") {
    // server verification handshake
    res.writeHead(ok ? 200 : 403, { "content-type": "text/plain" });
    res.end(ok ? q.get("echostr") ?? "" : "invalid signature");
    return true;
  }

  if (req.method === "POST") {
    if (!ok) {
      res.writeHead(403);
      res.end("invalid signature");
      return true;
    }
    const body = await readBody(req);
    const msg = parseXml(body);
    const from = msg.FromUserName; // sender OpenID
    const to = msg.ToUserName;
    let replyText = "";

    const allow = allowList();
    if (allow.length && from && !allow.includes(from)) {
      replyText = "⛔ 未授权 / not authorised";
    } else if (msg.MsgType === "text") {
      replyText = await route(String(msg.Content ?? ""), manager, modes);
    } else if (msg.MsgType === "voice") {
      // a voice note → a warm pulse you can feel them "speaking"
      await manager.pattern("all", PRESETS.heartbeat, 3);
      replyText = "💓 收到你的声音";
    } else if (msg.MsgType === "event" && msg.Event === "subscribe") {
      replyText = "claude-f-me 💕 发 0–100、harder/softer、stop，或 🔥💓🌊🎡📈🎲";
    } else {
      replyText = "发文字：0–100 / harder / softer / stop，或表情 🔥💓🌊🎡📈🎲";
    }

    res.writeHead(200, { "content-type": "application/xml" });
    res.end(replyText ? passiveText(from, to, replyText) : "success");
    return true;
  }

  res.writeHead(405);
  res.end("method not allowed");
  return true;
}

/** sha1(sort(token,timestamp,nonce)) === signature */
function verify(token: string, timestamp: string, nonce: string, signature: string): boolean {
  const hash = createHash("sha1").update([token, timestamp, nonce].sort().join("")).digest("hex");
  return hash === signature && !!signature;
}

const tag = (xml: string, name: string): string | undefined => {
  const m =
    xml.match(new RegExp("<" + name + "><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></" + name + ">")) ||
    xml.match(new RegExp("<" + name + ">([\\s\\S]*?)</" + name + ">"));
  return m ? m[1] : undefined;
};

function parseXml(xml: string): Record<string, string | undefined> {
  return {
    ToUserName: tag(xml, "ToUserName"),
    FromUserName: tag(xml, "FromUserName"),
    MsgType: tag(xml, "MsgType"),
    Content: tag(xml, "Content"),
    Event: tag(xml, "Event"),
  };
}

function passiveText(toUser: string | undefined, fromUser: string | undefined, content: string): string {
  const now = Math.floor(Date.now() / 1000);
  // in the reply, ToUserName is the original sender, FromUserName is the account
  return (
    "<xml>" +
    `<ToUserName><![CDATA[${toUser ?? ""}]]></ToUserName>` +
    `<FromUserName><![CDATA[${fromUser ?? ""}]]></FromUserName>` +
    `<CreateTime>${now}</CreateTime>` +
    "<MsgType><![CDATA[text]]></MsgType>" +
    `<Content><![CDATA[${content}]]></Content>` +
    "</xml>"
  );
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 64 * 1024) req.destroy(); // guard
    });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(data));
  });
}

const curMax = (manager: DeviceManager): number =>
  manager.snapshot().devices.reduce((a, x) => Math.max(a, x.intensity), 0);

/** Parse a text/emoji command into an action; mirrors the Telegram bridge. */
async function route(text: string, manager: DeviceManager, modes: ModeController): Promise<string> {
  const s = text.trim();
  const low = s.toLowerCase();
  const game = (t: GameType) => modes.startGame("all", t);

  if (/(safeword|^stop$|🛑|停|住手)/.test(low)) {
    modes.stop();
    await manager.stopAll();
    return "🛑 已全部停止，你是安全的。";
  }
  if (low === "scan" || s === "扫描") {
    await manager.scan(4000);
    return "🔍 扫描中…";
  }
  if (/(harder|more|\+|更|强|用力)/.test(low)) {
    const v = Math.min(1, curMax(manager) + 0.2);
    await manager.vibrate("all", v);
    return "🔥 加到 " + Math.round(v * 100) + "%";
  }
  if (/(softer|less|-|轻|温柔|慢)/.test(low)) {
    const v = Math.max(0, curMax(manager) - 0.2);
    await manager.vibrate("all", v);
    return "🫦 降到 " + Math.round(v * 100) + "%";
  }
  if (low.includes("🔥") || low.includes("edge") || s.includes("边缘")) { await game("edge"); return "🔥 边缘控制开始"; }
  if (low.includes("📈") || s.includes("递增")) { await game("escalation"); return "📈 递增中"; }
  if (low.includes("🌊") || s.includes("环境")) { await game("ambient"); return "🌊 环境波动"; }
  if (low.includes("🎡") || s.includes("转盘")) { await game("wheel"); return "🎡 转盘旋转"; }
  if (low.includes("💓") || s.includes("心跳")) { await manager.pattern("all", PRESETS.heartbeat, 3); return "💓 心跳节奏"; }
  if (low.includes("🎲") || s.includes("随机") || s.includes("惊喜")) {
    const g: GameType[] = ["roulette", "ambient", "edge", "wheel"];
    await game(g[Math.floor(Math.random() * g.length)]);
    return "🎲 给你个惊喜…";
  }
  const num = low.match(/^(\d{1,3})\s*%?$/);
  if (num) {
    const v = Math.max(0, Math.min(1, parseInt(num[1], 10) / 100));
    await manager.vibrate("all", v, 60000);
    return "设到 " + Math.round(v * 100) + "%";
  }
  return "没听懂～试试 harder / softer / stop 或 🔥💓🎲";
}
