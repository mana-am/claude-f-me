<div align="center">

# claude-f-me

**Control intimate hardware by *chatting* in Claude Code.**

An installable [Claude Code](https://claude.com/claude-code) plugin that turns natural-language
conversation into real device control — backed by the open
[Buttplug / Intiface](https://buttplug.io) ecosystem (750+ supported toys), with a reactive
bilingual web console, a master remote, and video (funscript), game and audio modes.
A **built-in simulator** lets you build and play with **zero hardware**.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933)](https://nodejs.org)

<p align="center"><b>English</b> · <a href="docs/i18n/README.zh-CN.md">简体中文</a> · <a href="docs/i18n/README.zh-TW.md">繁體中文</a> · <a href="docs/i18n/README.ja.md">日本語</a> · <a href="docs/i18n/README.ko.md">한국어</a> · <a href="docs/i18n/README.es.md">Español</a> · <a href="docs/i18n/README.fr.md">Français</a> · <a href="docs/i18n/README.de.md">Deutsch</a></p>

<img src="./docs/console.png" alt="claude-f-me console" width="760" />

</div>

---

> [!IMPORTANT]
> This controls a **physical device on a real person**. Use it only with the enthusiastic,
> ongoing consent of the person wearing it. Keep the safety cap sane, prefer short durations,
> and keep an emergency stop within reach. See [Safety & consent](#-safety--consent).

## Gallery

| Reactive console (EN) | 控制台 (中文) | Master remote |
|---|---|---|
| <img src="./docs/console.png" width="320" /> | <img src="./docs/console.zh.png" width="320" /> | <img src="./docs/master.png" width="150" /> |

## What it is

```
  ┌──────────────┐   MCP (stdio)    ┌───────────────────────────┐
  │  Claude Code │ ───────────────► │        claude-f-me        │
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
- ⚡ **Reactive "Pulse Core" UI.** A breathing energy orb and an aurora that glow, scale and
  pulse with live intensity, plus a real-time audio waveform — not a boring dashboard.
- 👑 **Master remote.** A phone-friendly page (`/master`) so another person can take control
  in real time — big dial, hold-to-buzz, presets, emergency stop. Every page shows when a master is in control.
- 🎬 **Video mode.** Plays a [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript)
  timeline in real time (position `0..100` → intensity). One-click built-in sample to try it instantly.
- 🎮 **Game mode.** `roulette`, `escalation`, `ambient`, `edge` (tease-and-deny) and `wheel` (spin & land),
  plus a `game_event` hook so Claude can react inside a text adventure.
- 🎵 **Audio mode.** Drives the device from your **microphone** or **tab/system audio** in real time.
- 🥁 **Pattern library.** `pulse`, `wave`, `escalate`, `tease`, `heartbeat`, `staircase`, `sos`, `earthquake`.
- 🌐 **Bilingual.** Console and master remote in **English and 中文**, one-tap toggle (or `?lang=zh`).
- 🛟 **Safety, built in.** Global max cap, per-command auto-stop, watchdog, emergency stop everywhere, hardware-off on exit.

## Install (as a Claude Code plugin)

```bash
# 1. add this repo as a plugin marketplace
/plugin marketplace add mana-am/claude-f-me

# 2. install the plugin
/plugin install claude-f-me@claude-f-me
```

The MCP server (a self-contained bundle, no `node_modules` needed) and the slash commands are
now available. Open a chat and try:

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
surprise me
```

The console comes up at **http://localhost:8731** — run `/claude-f-me:console` to open it.

### Slash commands

| command | what it does |
|---|---|
| `/claude-f-me:console` | open the live web console in your browser |
| `/claude-f-me:demo` | run a short scan → vibrate → pattern → game demo |
| `/claude-f-me:fuck` | start the fun (auto-scan, then build up) |
| `/claude-f-me:harder` | turn it up (+20%) |
| `/claude-f-me:softer` | ease off (−20%) |
| `/claude-f-me:edge` | tease-and-deny game |
| `/claude-f-me:tease` | gentle on-off pattern |
| `/claude-f-me:surprise` | pick a random mode |
| `/claude-f-me:safeword` · `/claude-f-me:panic` | **stop everything immediately** |

## Connect a real device

claude-f-me is built for real hardware first; the simulator is just a preview.

1. Install and open **[Intiface Central](https://intiface.com)** → press **Start Server**
   (default `ws://127.0.0.1:12345`).
2. Pair your toy in Intiface and confirm it appears. Lovense is the easiest to buy and best
   supported; almost anything on the [device list](https://iostindex.com) works.
3. Set **`CFM_MODE=buttplug`** (edit the `env` block in [`.mcp.json`](./.mcp.json), or export it standalone).

> The plugin ships defaulting to `simulated` so it runs out of the box. Node 22+ has a global
> `WebSocket`; on older Node, claude-f-me polyfills it from `ws`, so real-hardware mode works on Node 18+.

### No hardware yet? Preview mode

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # open http://localhost:8731
```

Hit **Scan**, drag the orb, fire patterns/games, load the sample funscript, enable **Audio**,
and mash **STOP** — the simulated motor reacts on screen. Keyboard: `0–9` set level, `space` stop, `S` scan.

## 👑 Master remote

Open the console and click **👑 Remote** (or browse to `/master`). A focused phone-sized remote —
big dial, hold-to-buzz, pattern/game shortcuts, safety cap, full-width stop. Anyone holding it is
counted as a **master**, and every page shows `👑 N master in control`.

To hand the remote to someone **not on your machine**, expose the console port over a tunnel
(e.g. `cloudflared tunnel --url http://localhost:8731` or `ngrok http 8731`) and share the `/master`
link. Over a tunnel it's HTTPS, so `wss://` works automatically.

> Only ever hand control to someone the wearer trusts and consents to. The safety cap and the
> wearer's own STOP always win.

## Modes & games

**🎬 Video (funscript)** — plays a `{at,pos}` timeline, interpolated to intensity in real time
(`loop`, `speed`, `invert`). Use the **Load sample** button to try it with no file.

**🎮 Games** — `roulette` (random bursts) · `escalation` (ramp & hold) · `ambient` (organic waves) ·
`edge` (ramp to the brink, deny, peak creeps up) · `wheel` (spin through levels, land & hold).

**🥁 Patterns** — `pulse` · `wave` · `escalate` · `tease` · `heartbeat` · `staircase` · `sos` · `earthquake`.

**🎵 Audio** — mic or tab/system audio drives intensity by loudness, with a sensitivity slider.

## MCP tools

| tool | description |
|---|---|
| `list_devices` | devices, intensity, battery, mode, cap, console URL, active mode, masters |
| `scan_devices` | scan for `duration_ms`, then return the list |
| `vibrate` | `intensity` 0..1, `target` id/`all`, optional `duration_ms` (auto-stop) |
| `pattern` | `preset` (pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) or `steps`, `loops` |
| `stop` | stop a device / `all`, cancel its pattern |
| `emergency_stop` | stop **all** devices and modes immediately |
| `set_max_intensity` | global safety cap 0..1 |
| `load_funscript` · `play_video` | load + play a funscript (`loop`, `speed`, `invert`) |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel` (`intensity_max`, `duration_ms`) |
| `game_event` | one-shot `reward`/`penalty`/`tease`/`pulse` for narrative games |
| `stop_mode` | stop the active video/game mode |

> Audio mode and the master remote live in the console (they need a browser for mic capture and
> hands-on control); everything else is drivable by Claude through the tools above.

## Configuration

| env var | default | meaning |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` or `buttplug` |
| `CFM_CONSOLE_PORT` | `8731` | web console port (also serves `/master`) |
| `CFM_MAX_INTENSITY` | `1.0` | initial safety cap (0..1) |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | Intiface server (buttplug mode) |

## Development

```bash
npm run dev          # MCP + console, watch mode (tsx)
npm run build        # type-check + emit dist/ (tsc)
npm run bundle       # self-contained dist/claude-f-me.mjs for the plugin (esbuild)
```

## 🛟 Safety & consent

This is intimate hardware on a real body. The design reflects that, but **you** are the last line of defense:

- A **global max-intensity cap** clamps everything (tool, console slider, master remote).
- Every `vibrate` arms an **auto-stop**; even with no `duration_ms` there's a hard 5-minute ceiling,
  and continuous drivers (patterns/video/game/audio) have a watchdog that stops the motor within seconds.
- `emergency_stop` / `/claude-f-me:safeword` / the red console button / the master's STOP halt everything instantly.
- Hardware is turned off when the process exits.

Only ever use this with informed, enthusiastic, revocable consent. Don't log or transmit usage data.
You are responsible for how you use it.

## Credits

Built on the open-source [Buttplug](https://github.com/buttplugio/buttplug) protocol and
[Intiface](https://intiface.com) by [Nonpolynomial](https://nonpolynomial.com). Not affiliated.

## License

[MIT](./LICENSE) © SimonAKing
