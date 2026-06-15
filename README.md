<div align="center">

# opendick

**Control intimate hardware by *chatting* in Claude Code.**

An installable [Claude Code](https://claude.com/claude-code) plugin that turns natural-language
conversation into real device control — backed by the open
[Buttplug / Intiface](https://buttplug.io) ecosystem (750+ supported toys), with a bilingual
(EN / 中文) live web console, a **master remote**, **video (funscript)**, **game** and
**audio-reactive** modes, and a **built-in simulator** so you can build and play with **zero hardware**.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933)](https://nodejs.org)

<img src="./docs/console.png" alt="opendick console" width="720" />

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
  │  + master    │                  │   │   ModeController    │ │  patterns · video · game
  └──────────────┘                  │   └──────────┬──────────┘ │
                                    └──────────────┼────────────┘
                                       ┌───────────┴───────────┐
                                       ▼                       ▼
                              buttplug backend          simulated backend
                          → Intiface → real toy         (preview, no hardware)
```

One process is **both** the MCP server Claude talks to **and** the web console you watch —
so the chat and the dashboard always share the exact same device state.

- 🔌 **Real hardware.** Drives Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer, and
  [750+ devices](https://iostindex.com) through [Intiface Central](https://intiface.com).
- 👑 **Master remote.** A focused phone-friendly control page (`/master`) so another person
  can take control in real time — big dial, hold-to-buzz, presets, emergency stop. Every page
  shows when a master is in control.
- 🎬 **Video mode.** Plays a [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript)
  timeline in real time (position `0..100` → intensity).
- 🎮 **Game mode.** Built-in engines — `roulette`, `escalation`, `ambient` — plus a
  `game_event` hook so Claude can react inside a text adventure ("you found treasure → reward").
- 🎵 **Audio mode.** Drives the device from your **microphone** or **tab/system audio** in real
  time (music, voice, a video's soundtrack) via the browser's Web Audio.
- ⚡ **Reactive "Pulse Core" UI.** A breathing energy orb and an aurora background that glow,
  scale and pulse with live intensity, plus a real-time audio waveform — not a boring dashboard.
- 🌐 **Bilingual.** Console and master remote ship in **English and 中文** with a one-tap toggle.
- 🧪 **Simulator (preview).** No hardware? A fake device the console visualises as a pulsing,
  buzzing motor — build and demo everything for free.
- 🛟 **Safety, built in.** Global max-intensity cap, per-command auto-stop, a watchdog that
  kills the motor if a driver stops feeding, an emergency stop everywhere, and hardware-off on exit.

## Install (as a Claude Code plugin)

```bash
# 1. add this repo as a plugin marketplace
/plugin marketplace add SimonAKing/opendick

# 2. install the plugin
/plugin install opendick@opendick
```

The MCP server (a self-contained bundle, no `node_modules` needed) and the slash commands are
now available. Open a chat and try:

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

## Connect a real device

opendick is built for real hardware first; the simulator is just a preview.

1. Install and open **[Intiface Central](https://intiface.com)** → press **Start Server**
   (default `ws://127.0.0.1:12345`).
2. Pair your toy in Intiface and confirm it appears (this verifies the hardware end-to-end).
   Lovense is the easiest to buy and best supported; almost anything on the
   [device list](https://iostindex.com) works.
3. Set **`OPENDICK_MODE=buttplug`**. For the plugin, edit the `env` block in
   [`.mcp.json`](./.mcp.json); standalone, export the env var before launching.

> The plugin ships defaulting to `simulated` so it runs out of the box even before Intiface is
> set up — flip it to `buttplug` once your device shows up in Intiface.
>
> Node 22+ ships a global `WebSocket`; on older Node, opendick polyfills it from `ws`,
> so real-hardware mode works on Node 18+.

### No hardware yet? Preview mode

```bash
git clone https://github.com/SimonAKing/opendick
cd opendick && npm install && npm run build
npm run console        # open http://localhost:8731
```

Hit **Scan**, drag the sliders, paste a funscript into **Video**, fire a **Game**, enable
**Audio**, and mash **EMERGENCY STOP** — the simulated motor reacts on screen.

## 👑 Master remote

Open the console and click **👑 Remote** (or browse to `/master`). It's a focused, phone-sized
remote — a big intensity dial, a hold-to-buzz button, pattern/game shortcuts, a safety cap, and
a full-width stop. Anyone holding it is counted as a **master**, and every other page shows
`👑 N master in control`.

<div align="center"><img src="./docs/master.png" alt="master remote" width="320" /></div>

To hand the remote to someone **not on your machine**, expose the console port over your LAN or a
tunnel (e.g. `cloudflared tunnel --url http://localhost:8731` or `ngrok http 8731`) and share the
`/master` link. Over a tunnel it's HTTPS, so `wss://` works automatically.

> Only ever hand control to someone the wearer trusts and has consented to. The safety cap and
> the wearer's own EMERGENCY STOP always win.

## 🎵 Audio mode

In the console's **Audio** panel, pick **🎤 Microphone** or **🔊 Tab audio**. opendick reads the
live signal in the browser, computes its loudness each frame, and drives the device in real time —
so the toy pulses to music, a voice, or a video's soundtrack. The **sensitivity** slider scales
it; the safety cap still applies.

## MCP tools

| tool | description |
|---|---|
| `list_devices` | devices, current intensity, battery, mode, cap, console URL, active mode, masters |
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

> Audio mode and the master remote live in the console (they need a browser for mic capture and
> hands-on control); everything else is drivable by Claude through the tools above.

## Configuration

| env var | default | meaning |
|---|---|---|
| `OPENDICK_MODE` | `simulated` | `simulated` or `buttplug` |
| `OPENDICK_CONSOLE_PORT` | `8731` | web console port (also serves `/master`) |
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
  console.ts          HTTP + WebSocket server (console + master + roles)
  consoleHtml.ts      console dashboard (devices, video/game/audio panels, i18n)
  masterHtml.ts       master remote page (i18n)
  presets.ts          shared named patterns
  modes.ts            ModeController — funscript playback + game engines
  device/
    manager.ts        single source of truth: state, safety cap, watchdog, patterns, masters
    simulated.ts      fake backend (preview, zero hardware)
    buttplug.ts       real backend → Intiface
    types.ts          shared interfaces
```

## 🛟 Safety & consent

This is intimate hardware on a real body. The design reflects that, but **you** are the
last line of defense:

- A **global max-intensity cap** clamps everything (`set_max_intensity`, console slider, master remote).
- Every `vibrate` arms an **auto-stop**; even with no `duration_ms` there's a hard 5-minute
  ceiling per command, and continuous drivers (patterns/video/game/audio) have a watchdog that
  stops the motor within seconds if their loop dies.
- `emergency_stop` / `/opendick:panic` / the red console button / the master's STOP all halt
  everything instantly.
- Hardware is turned off when the process exits.

Only ever use this with informed, enthusiastic, revocable consent. Don't log or transmit
usage data. You are responsible for how you use it.

## Credits

Built on the open-source [Buttplug](https://github.com/buttplugio/buttplug) protocol and
[Intiface](https://intiface.com) by [Nonpolynomial](https://nonpolynomial.com). Not affiliated.

## License

[MIT](./LICENSE) © SimonAKing
