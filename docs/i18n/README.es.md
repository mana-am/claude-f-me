<div align="center">

# claude-f-me

**Controla hardware íntimo *conversando* en Claude Code.**

Un plugin de [Claude Code](https://claude.com/claude-code) que convierte la conversación en
lenguaje natural en control real de dispositivos, apoyado en el ecosistema abierto
[Buttplug / Intiface](https://buttplug.io) (más de 750 dispositivos), con una consola web bilingüe
y reactiva, un mando «master», y modos de vídeo (funscript), juego y audio.
Un **simulador integrado** te deja construir y jugar **sin hardware**.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <b>Español</b> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

<img src="../console.png" alt="consola claude-f-me" width="760" />

</div>

---

> [!IMPORTANT]
> Esto controla un **dispositivo físico sobre una persona real**. Úsalo solo con el consentimiento
> entusiasta y continuo de quien lo lleva puesto. Mantén un tope de seguridad razonable, prefiere
> duraciones cortas y ten a mano una parada de emergencia. Ver [Seguridad y consentimiento](#-seguridad-y-consentimiento).

## Qué es

Un único proceso es **a la vez** el servidor MCP con el que habla Claude **y** la consola web que
miras, así que el chat y el panel comparten siempre el mismo estado del dispositivo.

- 🔌 **Hardware real**: controla Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer y
  [750+ dispositivos](https://iostindex.com) vía [Intiface Central](https://intiface.com).
- ⚡ **UI reactiva «Pulse Core»**: un orbe de energía que respira y una aurora que brillan y crecen con la intensidad, más una forma de onda de audio en tiempo real.
- 👑 **Mando master**: una página `/master` apta para móvil para que otra persona tome el control en tiempo real — dial grande, vibración al mantener pulsado, presets, parada de emergencia. Cada página muestra cuándo hay un master al mando.
- 🎬 **Modo vídeo**: reproduce una línea de tiempo [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) en tiempo real (posición `0..100` → intensidad). Muestra incorporada de un clic.
- 🎮 **Modo juego**: `roulette`, `escalation`, `ambient`, `edge` (provocar y negar) y `wheel` (girar y parar), más un hook `game_event` para que Claude reaccione en una aventura de texto.
- 🎵 **Modo audio**: controla el dispositivo desde el **micrófono** o el **audio de pestaña/sistema** en tiempo real.
- 🥁 **Patrones**: `pulse`, `wave`, `escalate`, `tease`, `heartbeat`, `staircase`, `sos`, `earthquake`.
- 🌐 **Bilingüe**: consola y mando en **inglés y chino**, cambio con un toque (o `?lang=zh`).
- 🛟 **Seguridad integrada**: tope global, auto-parada por comando, watchdog, parada de emergencia en todas partes y apagado al salir.

## Instalación (como plugin de Claude Code)

```bash
# 1. añade este repo como marketplace de plugins
/plugin marketplace add mana-am/claude-f-me

# 2. instala el plugin
/plugin install claude-f-me@claude-f-me
```

Luego, en el chat:

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
surprise me
```

La consola está en **http://localhost:8731** — ábrela con `/claude-f-me:console`.

### Comandos slash

| comando | qué hace |
|---|---|
| `/claude-f-me:console` | abre la consola en el navegador |
| `/claude-f-me:demo` | demo corta: escanear → vibrar → patrón → juego |
| `/claude-f-me:fuck` | empieza (auto-escaneo y subida) |
| `/claude-f-me:harder` / `:softer` | sube / baja (±20%) |
| `/claude-f-me:edge` / `:tease` | juego de provocar / patrón suave |
| `/claude-f-me:surprise` | un modo al azar |
| `/claude-f-me:safeword` · `:panic` | **detener todo de inmediato** |

## Conectar un dispositivo real

claude-f-me está pensado para hardware real; el simulador es solo una vista previa.

1. Instala y abre **[Intiface Central](https://intiface.com)** → **Start Server** (por defecto `ws://127.0.0.1:12345`).
2. Empareja tu juguete en Intiface y confirma que aparece. Lovense es lo más fácil de comprar y mejor soportado.
3. Pon **`CFM_MODE=buttplug`** (edita el bloque `env` de [`.mcp.json`](../../.mcp.json), o expórtalo en modo independiente).

> El plugin viene en `simulated` por defecto. Node 22+ trae `WebSocket` global; en Node antiguo se rellena con `ws`, así que el modo real funciona en Node 18+.

### ¿Aún sin hardware? Modo vista previa

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # abre http://localhost:8731
```

Pulsa **Scan**, arrastra el orbe, lanza patrones/juegos, carga el funscript de muestra, activa **Audio** y aporrea **STOP** — el motor simulado reacciona en pantalla. Teclado: `0–9` nivel, `espacio` parar, `S` escanear.

## 👑 Mando master

Abre la consola y pulsa **👑 Remote** (o ve a `/master`). Un mando enfocado de tamaño móvil — dial grande, vibración al mantener, accesos a patrones/juegos, tope de seguridad y parada a todo ancho. Quien lo tiene cuenta como **master**, y cada página muestra `👑 N master in control`.

Para dárselo a alguien que **no esté en tu máquina**, expón el puerto de la consola por un túnel (p. ej. `cloudflared tunnel --url http://localhost:8731` o `ngrok http 8731`) y comparte el enlace `/master`.

> Cede el control solo a alguien en quien la persona que lo lleva confíe y consienta. El tope de seguridad y el STOP propio siempre ganan.

## Modos y juegos

- **🎬 Vídeo**: reproduce funscript en tiempo real (`loop`/`speed`/`invert`), muestra de un clic.
- **🎮 Juegos**: roulette · escalation · ambient · edge (provocar y negar, el pico sube cada ronda) · wheel (gira y se detiene).
- **🥁 Patrones**: pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake.
- **🎵 Audio**: micrófono o audio de pestaña controlan la intensidad por volumen, con deslizador de sensibilidad.

## 🛟 Seguridad y consentimiento

Es hardware íntimo sobre un cuerpo real. El diseño lo tiene en cuenta, pero **tú** eres la última línea de defensa:

- Un **tope global de intensidad** limita todo (herramienta / deslizador de la consola / mando master).
- Cada `vibrate` arma una **auto-parada**; aun sin `duration_ms` hay un tope duro de 5 minutos, y los controladores continuos tienen un watchdog que detiene el motor en segundos si su bucle muere.
- `emergency_stop` / `/claude-f-me:safeword` / el botón rojo de la consola / el STOP del master detienen todo al instante.
- El hardware se apaga al salir del proceso.

Úsalo solo con consentimiento informado, entusiasta y revocable. No registres ni transmitas datos de uso. Eres responsable de cómo lo usas.

## Créditos

Construido sobre el protocolo abierto [Buttplug](https://github.com/buttplugio/buttplug) e [Intiface](https://intiface.com) de [Nonpolynomial](https://nonpolynomial.com). Sin afiliación.

## Licencia

[MIT](../../LICENSE) © SimonAKing
