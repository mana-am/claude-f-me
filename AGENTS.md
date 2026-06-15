# AGENTS.md

Guidance for AI coding agents (Codex, Cursor, Gemini CLI, Copilot, Windsurf, …) working in
this repository. This is the open [AGENTS.md](https://agents.md) standard; every agent that
reads it gets the same context.

> **Want to _use_ the device from Codex/Cursor instead of editing this repo?**
> claude-f-me is a standard **MCP server** — don't edit code, just point your client at it.
> See [`examples/codex-config.toml`](./examples/codex-config.toml) and
> [`examples/README.md`](./examples/README.md).

## What this project is

`claude-f-me` is a single Node process that is **both** an MCP (stdio) server and a reactive web
console, for controlling intimate hardware over the open [Buttplug/Intiface](https://buttplug.io)
ecosystem. A built-in **simulator** runs everything with zero hardware. It ships as a Claude Code
plugin but works with any MCP client.

## ⚠️ Safety & consent — non-negotiable

This code drives a **physical device on a real person**. When changing anything that touches
device output, you MUST preserve these invariants — do not weaken them for convenience:

- **Global intensity cap** (`CFM_MAX_INTENSITY`) is always enforced; never let a code path exceed it.
- **Per-command auto-stop / watchdog**: a command must not run the motor indefinitely.
- **Emergency stop / safeword** must remain reachable from every surface (MCP tool, console, master, panic command).
- **Hardware-off on exit**: the process must stop the device when it shuts down.
- Prefer **short durations** and conservative defaults. Never add a feature that bypasses the cap or the watchdog.

If a change could affect any of the above, call it out explicitly in your summary.

## Setup & commands

Node **≥ 18** required.

```bash
npm install
npm run build        # tsc -> dist/ (this is what `npx`/`bin` runs: dist/index.js)
npm run bundle       # esbuild -> dist/claude-f-me.mjs (the self-contained MCP bundle)
npm run dev          # tsx watch src/index.ts (live MCP + console)
npm run dev:console  # console only, no MCP
npm start            # node dist/index.js
```

There is no test suite yet; verify changes by running `npm run dev` and driving the simulator
from the console at **http://localhost:8731** (and, for MCP changes, from an MCP client).

After editing TypeScript, run **`npm run build && npm run bundle`** so both the `bin` entry
(`dist/index.js`) and the bundled MCP entry (`dist/claude-f-me.mjs`) stay in sync — the Claude
Code plugin and `npx` paths load different files.

## Project layout

| Path | What |
|---|---|
| `src/index.ts` | Entry — wires MCP server + console; respects `--console-only` |
| `src/mcp.ts` | MCP tool/prompt definitions |
| `src/device/` | DeviceManager + buttplug / simulated backends, safety cap, watchdog |
| `src/modes.ts`, `src/presets.ts`, `src/personas.ts` | Modes, patterns, personas |
| `src/console*.ts`, `src/masterHtml.ts` | Web console + master remote UI |
| `src/{telegram,discord,wechat}.ts` | Chat bridges |
| `commands/*.md` | Claude Code slash commands (`/claude-f-me:*`) |
| `.claude-plugin/` | Claude Code plugin + marketplace manifests |
| `.mcp.json` | MCP server config consumed by the Claude Code plugin |
| `examples/` | Copy-paste MCP configs for Codex, Cursor, Claude Desktop, … |
| `dist/` | Build output (committed so `npx github:` works without a build step on the user) |

## Conventions

- **TypeScript, ESM** (`"type": "module"`), Node ≥ 18, 2-space indent. Match the style of the
  file you're editing — no broad reformatting.
- Validate external/tool input with **zod** (already a dependency).
- Config is read from **env vars** (`CFM_*`); don't hard-code ports, URLs or caps.
- The console and the MCP server share one device state object — keep that single source of truth.
- Bilingual UI (English / 中文): if you add user-facing console strings, add both.

## Configuration (env vars)

| Var | Default | Meaning |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` (no hardware) or `buttplug` (real device via Intiface) |
| `CFM_CONSOLE_PORT` | `8731` | Web console port |
| `CFM_MAX_INTENSITY` | `1.0` | Hard safety cap, `0`–`1` |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | Intiface Central WebSocket |

## Security / privacy

Memory and session data are **local-only** and must stay that way — do not add code that uploads
device usage, memory, or session recordings anywhere. Treat any network egress as a red flag to
surface in review.
