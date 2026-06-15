<div align="center">

# opendick

**Control intimate hardware by *chatting* in Claude Code.**

An installable [Claude Code](https://claude.com/claude-code) plugin that turns natural-language
conversation into real device control — backed by the open
[Buttplug / Intiface](https://buttplug.io) ecosystem (750+ supported toys), with a live web
console, a **built-in simulator** so you can build and play with **zero hardware**, plus
**video (funscript)** and **game** modes.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933)](https://nodejs.org)

</div>

---

> [!IMPORTANT]
> This controls a **physical device on a real person**. Use it only with the enthusiastic,
> ongoing consent of the person wearing it. Keep the safety cap sane, prefer short durations,
> and keep an emergency stop within reach. See [Safety & consent](#-safety--consent).

## What it is

```
  ┌──────────────┐   MCP (stdio)    ┌───────────────────────────┐
  │  Claude Code │ ───────────────► │          opendick         │
  └──────────────┘                  │  (one process)            │
  ┌──────────────┐   WebSocket      │   ┌─────────────────────┐ │
  │  Web console │ ◄──────────────► │   │   DeviceManager     │ │  safety cap · watchdog
  └──────────────┘                  │   │   ModeController    │ │  patterns · video · game
                                    │   └──────────┬──────────┘ │
                                    └──────────────┼────────────┘
                                       ┌───────────┴───────────┐
                                       ▼                       ▼
                              simulated backend        buttplug backend
                              (default, free)      → Intiface → real toy
```

One process is **both** the MCP server Claude talks to **and** the web console you watch —
so the chat and the dashboard always share the exact same device state.

- 🧪 **Simulated mode (default).** A fake device the console visualises as a pulsing,
  buzzing motor whose speed and glow scale with intensity. Build and demo everything for free.
- 🔌 **Real hardware mode.** Drives Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer, and
  [750+ devices](https://iostindex.com) through [Intiface Central](https://intiface.com).
- 🎬 **Video mode.** Plays a [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript)
  timeline in real time (position `0..100` → intensity).
- 🎮 **Game mode.** Built-in engines — `roulette`, `escalation`, `ambient` — plus a
  `game_event` hook so Claude can react inside a text adventure ("you found treasure → reward").
- 🛟 **Safety, built in.** Global max-intensity cap, per-command auto-stop, a watchdog that
  kills the motor if a driver stops feeding, an emergency stop tool + a big red console button,
  and hardware-off on exit.

## Install (as a Claude Code plugin)

```bash
# 1. add this repo as a plugin marketplace
/plugin marketplace add SimonAKing/opendick

# 2. install the plugin
/plugin install opendick@opendick
```

That's it — the MCP server (a self-contained bundle, no `node_modules` needed) and the
slash commands are now available. Open a chat and try:

```
scan for devices
vibrate at 40% for 3 seconds
run the "wave" pattern twice
start an ambient game for 30 seconds
set the safety max to 60%
stop everything
```

The console comes up at **http://localhost:8731** — run `/opendick:console` to open it.

### Slash commands

| command | what it does |
|---|---|
| `/opendick:console` | open the live web console in your browser |
| `/opendick:demo` | run a short scan → vibrate → pattern → game demo |
| `/opendick:panic` | emergency stop — everything off, now |

## Try it without Claude (console only)

```bash
git clone https://github.com/SimonAKing/opendick
cd opendick
npm install
npm run build
npm run console        # open http://localhost:8731
```

Hit **Scan**, drag the sliders, paste a funscript into **Video**, fire a **Game**, and mash
the big **EMERGENCY STOP**. No hardware required — the simulated motor reacts on screen.

## MCP tools

| tool | description |
|---|---|
| `list_devices` | devices, current intensity, battery, mode, cap, console URL, active mode |
| `scan_devices` | scan for `duration_ms`, then return the list |
| `vibrate` | `intensity` 0..1, `target` id/`all`, optional `duration_ms` (auto-stop) |
| `pattern` | `preset` (`pulse`/`wave`/`escalate`/`tease`) or explicit `steps`, `loops` |
| `stop` | stop a device / `all`, cancel its pattern |
| `emergency_stop` | stop **all** devices and modes immediately |
| `set_max_intensity` | global safety cap 0..1 |
| `load_funscript` | load a funscript (JSON string or file path) for video mode |
| `play_video` | play the loaded funscript (`loop`, `speed`, `invert`) |
| `start_game` | start `roulette` / `escalation` / `ambient` (`intensity_max`, `duration_ms`) |
| `game_event` | one-shot `reward`/`penalty`/`tease`/`pulse` for narrative games |
| `stop_mode` | stop the active video/game mode |

## Modes in detail

**🎬 Video (funscript).** A funscript is a JSON timeline of `{at, pos}` actions. opendick
interpolates position over time and maps it to vibration intensity, in real time, with optional
`loop`, `speed`, and `invert`. Paste one into the console's Video panel, or use
`load_funscript` + `play_video`.

**🎮 Game.**
- `roulette` — random-strength bursts at random intervals (suspense).
- `escalation` — ramps up step by step and holds at max until you stop it.
- `ambient` — gentle organic waves (overlapping sines).
- `game_event` — fire `reward`/`penalty`/`tease`/`pulse` from a story Claude is narrating.

## Switch to real hardware

1. Install and open **[Intiface Central](https://intiface.com)** → **Start Server**
   (default `ws://127.0.0.1:12345`).
2. Pair your toy in Intiface and confirm it appears (this verifies the hardware end-to-end).
3. Set `OPENDICK_MODE=buttplug`. For the plugin, edit the `env` block in
   [`.mcp.json`](./.mcp.json); for standalone, export the env var before launching.

> Node 22+ ships a global `WebSocket`; on older Node, opendick polyfills it from `ws`,
> so real-hardware mode works on Node 18+.

## Configuration

| env var | default | meaning |
|---|---|---|
| `OPENDICK_MODE` | `simulated` | `simulated` or `buttplug` |
| `OPENDICK_CONSOLE_PORT` | `8731` | web console port |
| `OPENDICK_MAX_INTENSITY` | `1.0` | initial safety cap (0..1) |
| `OPENDICK_INTIFACE_URL` | `ws://127.0.0.1:12345` | Intiface server (buttplug mode) |

## Development

```bash
npm run dev          # MCP + console, watch mode (tsx)
npm run dev:console  # console only, watch mode
npm run build        # type-check + emit dist/ (tsc)
npm run bundle       # self-contained dist/opendick.mjs for the plugin (esbuild)
```

```
src/
  index.ts            entry — MCP stdio + console + clean-stdout guard + exit-stop
  mcp.ts              the 12 MCP tools
  console.ts          HTTP + WebSocket console server
  consoleHtml.ts      embedded dashboard (device cards, sliders, video/game panels)
  modes.ts            ModeController — funscript playback + game engines
  device/
    manager.ts        single source of truth: state, safety cap, watchdog, patterns
    simulated.ts      fake backend (default, zero hardware)
    buttplug.ts       real backend → Intiface
    types.ts          shared interfaces
```

## 🛟 Safety & consent

This is intimate hardware on a real body. The design reflects that, but **you** are the
last line of defense:

- A **global max-intensity cap** clamps everything (`set_max_intensity`, console slider).
- Every `vibrate` arms an **auto-stop**; even with no `duration_ms` there's a hard 5-minute
  ceiling per command, and continuous drivers (patterns/video/game) have a watchdog that
  stops the motor within seconds if their loop dies.
- `emergency_stop` / `/opendick:panic` / the red console button stop everything instantly.
- Hardware is turned off when the process exits.

Only ever use this with informed, enthusiastic, revocable consent. Don't log or transmit
usage data. You are responsible for how you use it.

## Credits

Built on the open-source [Buttplug](https://github.com/buttplugio/buttplug) protocol and
[Intiface](https://intiface.com) by [Nonpolynomial](https://nonpolynomial.com). Not affiliated.

## License

[MIT](./LICENSE) © SimonAKing
