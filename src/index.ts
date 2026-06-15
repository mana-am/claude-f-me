#!/usr/bin/env node
import { DeviceManager } from "./device/manager.js";
import { SimulatedBackend } from "./device/simulated.js";
import { ButtplugBackend } from "./device/buttplug.js";
import { startConsole } from "./console.js";
import { startMcp } from "./mcp.js";
import { ModeController } from "./modes.js";
import { Memory } from "./memory.js";
import { startTelegram } from "./telegram.js";
import { startDiscord } from "./discord.js";
import { logErr } from "./util.js";
import type { DeviceBackend } from "./device/types.js";

const args = process.argv.slice(2);
const consoleOnly = args.includes("--console-only");

// When acting as an MCP stdio server, stdout is the JSON-RPC channel and MUST
// stay clean. Redirect any stray console.* to stderr as a hard safeguard.
if (!consoleOnly) {
  const toErr = (...a: unknown[]) => logErr(...a);
  console.log = toErr as typeof console.log;
  console.info = toErr as typeof console.info;
  console.debug = toErr as typeof console.debug;
  console.warn = toErr as typeof console.warn;
}

const mode = (process.env.CFM_MODE ?? "simulated").toLowerCase();
const port = Number(process.env.CFM_CONSOLE_PORT ?? 8731);
const maxIntensity = Number(process.env.CFM_MAX_INTENSITY ?? 1);
const intifaceUrl = process.env.CFM_INTIFACE_URL ?? "ws://127.0.0.1:12345";

const backend: DeviceBackend =
  mode === "buttplug" ? new ButtplugBackend(intifaceUrl) : new SimulatedBackend();

const manager = new DeviceManager(backend, {
  maxIntensity,
  consoleUrl: `http://localhost:${port}`,
});
const modes = new ModeController(manager);

const memory = new Memory();
await memory.load();
modes.attachMemory(memory);

try {
  await manager.connect();
} catch (e) {
  logErr(`backend connect failed (${mode}): ${e}`);
  if (mode === "buttplug") {
    logErr("is Intiface Central running with its server started on " + intifaceUrl + " ?");
  }
}

await startConsole(manager, modes, port);

// Optional Telegram bridge — control from chat (set CFM_TELEGRAM_TOKEN to enable).
const tgToken = process.env.CFM_TELEGRAM_TOKEN ?? "";
if (tgToken) startTelegram(manager, modes, tgToken, process.env.CFM_TELEGRAM_ALLOW ?? "");

// Optional Discord bridge — control from a DM/channel (set CFM_DISCORD_TOKEN to enable).
const dcToken = process.env.CFM_DISCORD_TOKEN ?? "";
if (dcToken) startDiscord(manager, modes, dcToken, process.env.CFM_DISCORD_ALLOW ?? "");

if (consoleOnly) {
  logErr(`claude-f-me: console-only mode — open http://localhost:${port}`);
} else {
  await startMcp(manager, modes, memory);
  logErr(`claude-f-me: ready (MCP stdio + console at http://localhost:${port})`);
}

// Best-effort: make sure hardware is left off on exit.
const cleanup = () => {
  void manager.stopAll().finally(() => process.exit(0));
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
