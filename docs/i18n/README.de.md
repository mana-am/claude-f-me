<div align="center">

# claude-f-me

**Steuere intime Hardware per *Chat* in Claude Code.**

Ein installierbares [Claude Code](https://claude.com/claude-code)-Plugin, das natürliche Sprache in
echte Gerätesteuerung verwandelt – auf Basis des offenen Ökosystems
[Buttplug / Intiface](https://buttplug.io) (750+ Geräte), mit einer reaktiven, zweisprachigen
Web-Konsole, einer Master-Fernbedienung sowie Video- (funscript), Spiel- und Audio-Modi.
Ein **eingebauter Simulator** lässt dich alles **ohne Hardware** ausprobieren.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <b>Deutsch</b></p>

<img src="../console.png" alt="claude-f-me Konsole" width="760" />

</div>

---

> [!IMPORTANT]
> Dies steuert ein **physisches Gerät an einer echten Person**. Nur mit der begeisterten,
> fortlaufenden Zustimmung der tragenden Person verwenden. Halte das Sicherheitslimit vernünftig,
> bevorzuge kurze Dauern und halte einen Not-Stopp griffbereit. Siehe [Sicherheit & Zustimmung](#-sicherheit--zustimmung).

## Was es ist

Ein Prozess ist **zugleich** der MCP-Server, mit dem Claude spricht, **und** die Web-Konsole, die du
ansiehst – Chat und Dashboard teilen sich also stets denselben Gerätezustand.

- 🔌 **Echte Hardware**: steuert Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer und
  [750+ Geräte](https://iostindex.com) über [Intiface Central](https://intiface.com).
- ⚡ **Reaktives „Pulse Core“-UI**: eine atmende Energiekugel und eine Aurora, die mit der Intensität leuchten und wachsen, plus eine Echtzeit-Audiowellenform.
- 👑 **Master-Fernbedienung**: eine handytaugliche Seite `/master`, damit eine andere Person in Echtzeit die Kontrolle übernimmt – großes Rad, Halten-zum-Vibrieren, Presets, Not-Stopp. Jede Seite zeigt, wenn ein Master die Kontrolle hat.
- 🎬 **Video-Modus**: spielt eine [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript)-Zeitleiste in Echtzeit (Position `0..100` → Intensität). Eingebaute Beispiel-Datei per Klick.
- 🎮 **Spiel-Modus**: `roulette`, `escalation`, `ambient`, `edge` (Necken & Verweigern) und `wheel` (drehen & landen), plus ein `game_event`-Hook, damit Claude in einem Textabenteuer reagiert.
- 🎵 **Audio-Modus**: treibt das Gerät aus **Mikrofon** oder **Tab-/System-Audio** in Echtzeit.
- 🥁 **Muster**: `pulse`, `wave`, `escalate`, `tease`, `heartbeat`, `staircase`, `sos`, `earthquake`.
- 🌐 **Zweisprachig**: Konsole und Fernbedienung in **Englisch und Chinesisch**, Umschalten per Tipp (oder `?lang=zh`).
- 🛟 **Sicherheit eingebaut**: globales Limit, Auto-Stopp pro Befehl, Watchdog, Not-Stopp überall, Abschalten beim Beenden.

## Installation (als Claude-Code-Plugin)

```bash
# 1. dieses Repo als Plugin-Marketplace hinzufügen
/plugin marketplace add mana-am/claude-f-me

# 2. das Plugin installieren
/plugin install claude-f-me@claude-f-me
```

Dann im Chat:

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
surprise me
```

Die Konsole läuft auf **http://localhost:8731** – öffne sie mit `/claude-f-me:console`.

### Slash-Befehle

| Befehl | Wirkung |
|---|---|
| `/claude-f-me:console` | Konsole im Browser öffnen |
| `/claude-f-me:demo` | kurze Demo: scannen → vibrieren → Muster → Spiel |
| `/claude-f-me:fuck` | starten (Auto-Scan, dann steigern) |
| `/claude-f-me:harder` / `:softer` | stärker / sanfter (±20%) |
| `/claude-f-me:edge` / `:tease` | Neck-Spiel / sanftes Muster |
| `/claude-f-me:surprise` | ein zufälliger Modus |
| `/claude-f-me:safeword` · `:panic` | **sofort alles stoppen** |

## Ein echtes Gerät verbinden

claude-f-me ist auf echte Hardware ausgelegt; der Simulator ist nur eine Vorschau.

1. **[Intiface Central](https://intiface.com)** installieren und öffnen → **Start Server** (Standard `ws://127.0.0.1:12345`).
2. Dein Spielzeug in Intiface koppeln und prüfen, dass es erscheint. Lovense ist am einfachsten zu kaufen und am besten unterstützt.
3. **`CFM_MODE=buttplug`** setzen (den `env`-Block in [`.mcp.json`](../../.mcp.json) bearbeiten oder eigenständig exportieren).

> Das Plugin startet standardmäßig in `simulated`. Node 22+ hat globales `WebSocket`; auf älterem Node wird es per `ws` ergänzt, der Echt-Modus läuft also ab Node 18+.

### Noch keine Hardware? Vorschau-Modus

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # http://localhost:8731 öffnen
```

**Scan** drücken, die Kugel ziehen, Muster/Spiele auslösen, das Beispiel-Funscript laden, **Audio** aktivieren und **STOP** hämmern – der simulierte Motor reagiert am Bildschirm. Tastatur: `0–9` Stufe, `Leertaste` Stopp, `S` Scan.

## 👑 Master-Fernbedienung

Konsole öffnen und **👑 Remote** klicken (oder `/master` aufrufen). Eine fokussierte Fernbedienung in Handygröße – großes Rad, Halten-zum-Vibrieren, Muster-/Spiel-Kürzel, Sicherheitslimit, Stopp über volle Breite. Wer sie hält, zählt als **Master**, und jede Seite zeigt `👑 N master in control`.

Um sie jemandem zu geben, der **nicht an deinem Rechner** ist, exponiere den Konsolen-Port über einen Tunnel (z. B. `cloudflared tunnel --url http://localhost:8731` oder `ngrok http 8731`) und teile den `/master`-Link.

> Übergib die Kontrolle nur an jemanden, dem die tragende Person vertraut und zustimmt. Das Sicherheitslimit und der eigene STOP haben immer Vorrang.

## Modi & Spiele

- **🎬 Video**: spielt funscript in Echtzeit (`loop`/`speed`/`invert`), Beispiel per Klick.
- **🎮 Spiele**: roulette · escalation · ambient · edge (Necken & Verweigern, Spitze steigt pro Runde) · wheel (drehen und stoppen).
- **🥁 Muster**: pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake.
- **🎵 Audio**: Mikrofon oder Tab-Audio treiben die Intensität über die Lautstärke, mit Empfindlichkeitsregler.

## 🛟 Sicherheit & Zustimmung

Das ist intime Hardware an einem echten Körper. Das Design berücksichtigt das, aber **du** bist die letzte Verteidigungslinie:

- Ein **globales Intensitätslimit** begrenzt alles (Tool / Konsolen-Regler / Master-Fernbedienung).
- Jedes `vibrate` schärft einen **Auto-Stopp**; selbst ohne `duration_ms` gibt es ein hartes 5-Minuten-Limit, und Dauer-Treiber haben einen Watchdog, der den Motor binnen Sekunden stoppt, wenn ihre Schleife stirbt.
- `emergency_stop` / `/claude-f-me:safeword` / der rote Konsolen-Knopf / der STOP des Masters halten sofort alles an.
- Beim Beenden des Prozesses wird die Hardware abgeschaltet.

Nur mit informierter, begeisterter, widerrufbarer Zustimmung verwenden. Keine Nutzungsdaten protokollieren oder übertragen. Du bist für deine Nutzung verantwortlich.

## Danksagung

Aufgebaut auf dem offenen [Buttplug](https://github.com/buttplugio/buttplug)-Protokoll und [Intiface](https://intiface.com) von [Nonpolynomial](https://nonpolynomial.com). Keine Verbindung.

## Lizenz

[MIT](../../LICENSE) © SimonAKing
