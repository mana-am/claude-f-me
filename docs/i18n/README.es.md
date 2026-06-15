<div align="center">

# claude-f-me

**Controla hardware íntimo *conversando* en Claude Code.**

Un plugin de [Claude Code](https://claude.com/claude-code) que convierte la conversación en lenguaje
natural en control real de dispositivos, apoyado en el ecosistema abierto
[Buttplug / Intiface](https://buttplug.io) (más de 750 dispositivos), con una consola web bilingüe y
reactiva, un mando «master», y modos Muse (composición), personas, dúo, vídeo, juego y audio.
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

## Galería

| Consola reactiva (EN) | Consola (中文) | Mando master |
|---|---|---|
| <img src="../console.png" width="320" /> | <img src="../console.zh.png" width="320" /> | <img src="../master.png" width="150" /> |

## Qué es

Un único proceso es **a la vez** el servidor MCP con el que habla Claude **y** la consola web que
miras, así que el chat y el panel comparten siempre el mismo estado del dispositivo.

- 🔌 **Hardware real**: controla Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer y [750+ dispositivos](https://iostindex.com) vía [Intiface Central](https://intiface.com).
- 🎼 **Modo Muse (composición)**: el modelo *compone* — describe una sensación («slow burn tántrico de 10 min», «una tormenta», «te quiero en morse») y escribe una partitura háptica suave y la reproduce. Guárdalas en una biblioteca. El dispositivo se vuelve un instrumento que toca una IA.
- 🎭 **Personas**: elige *quién manda* — personalidades inspiradas en modelos SOTA: 🕯️ Slow Burn (Opus), 😈 Brat (GPT-5.5), 🎼 Metronome, ⛈️ Storm, 🔮 Oracle, 🍼 Mommy. Cada una cambia el tacto (ritmo/azar/negación/tope). El **modo ciego** oculta cuál es.
- 💞 **Modo dúo**: enlaza dos consolas con un código de sala por un relay interno; la entrada de tu pareja controla tu dispositivo en tiempo real (espejo/guiar/seguir), con presencia y toque 👋.
- ⚡ **UI reactiva «Pulse Core»**: un orbe de energía que respira y una aurora que brillan con la intensidad, más una forma de onda de audio en tiempo real.
- 👑 **Mando master**: una página `/master` apta para móvil para que otra persona tome el control en tiempo real — dial grande, vibración al mantener, presets, parada de emergencia. Cada página muestra cuándo hay un master al mando.
- 🎬 **Modo vídeo**: reproduce una línea de tiempo [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) en tiempo real (posición `0..100` → intensidad). Muestra incorporada de un clic.
- 🎮 **Modo juego**: `roulette`, `escalation`, `ambient`, `edge` (provocar y negar) y `wheel` (girar y parar), más un hook `game_event` para reaccionar en una aventura de texto.
- 🎵 **Modo audio**: controla el dispositivo desde el **micrófono** o el **audio de pestaña/sistema** en tiempo real.
- 🥁 **Patrones**: `pulse`, `wave`, `escalate`, `tease`, `heartbeat`, `staircase`, `sos`, `earthquake`.
- 🧠 **Memoria**: memoria local que aprende tus favoritos, afinidad de persona y señales de rechazo suave (`remember`/`recall`/`forget`); más *tú* con el tiempo, y nunca sale de tu máquina.
- 📜 **Prompts de escena**: escenas guiadas como prompts MCP — mommy, edging, modo historia, componer una sensación, aftercare.
- 💬 **Puentes de chat**: bot opcional de **Telegram** — controla por mensaje o emoji desde un chat que ya usas (ideal a distancia).
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
compose a 5-minute slow build that edges twice then releases
become the Brat persona
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
| `/claude-f-me:muse` | compón una partitura háptica desde una sensación |
| `/claude-f-me:persona` | elige quién manda (Slow Burn / Brat / …) |
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

Abre la consola y pulsa **👑 Remote** (o ve a `/master`). Un mando de tamaño móvil — dial grande, vibración al mantener, accesos a patrones/juegos, tope de seguridad y parada a todo ancho. Quien lo tiene cuenta como **master**, y cada página muestra `👑 N master in control`.

Para dárselo a alguien que **no esté en tu máquina**, expón el puerto por un túnel (p. ej. `cloudflared tunnel --url http://localhost:8731` o `ngrok http 8731`) y comparte el enlace `/master`.

> Cede el control solo a alguien en quien la persona que lo lleva confíe y consienta. El tope de seguridad y el STOP propio siempre ganan.

## Modos y juegos

**🎼 Muse (composición)** — el modelo convierte un brief en una línea de keyframes suave (`{at, level}`, interpolada) y la reproduce. Con la herramienta `compose` en el chat, o desde el cuadro **«describe a vibe»** de la consola con una clave de modelo externa. Guarda en biblioteca y reprodúcelas con `muse_list` / `muse_play`.

**🎭 Personas** — una personalidad que modula cada juego/evento (ritmo/azar/negación/tope) y, con clave, elige qué modelo compone: 🕯️ `slowburn` (Opus) · 😈 `brat` (GPT-5.5) · 🎼 `metronome` · ⛈️ `storm` · 🔮 `oracle` · 🍼 `mommy`. `set_persona blind` la oculta hasta `reveal_persona`.

**💞 Dúo** — abre el panel **Duet**, comparte URL del relay + código de sala, y dos consolas se enlazan por el `/relay` interno. Elige **espejo** / **guiar** / **seguir** y envía un toque 👋. Los niveles entrantes pasan tu tope de seguridad local.

**🎬 Vídeo (funscript)** — reproduce una línea `{at,pos}` en tiempo real (`loop`/`speed`/`invert`), muestra de un clic.

**🎮 Juegos** — roulette · escalation · ambient · edge (provocar y negar, el pico sube cada ronda) · wheel (gira y se detiene).

**🥁 Patrones** — pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake.

**🎵 Audio** — micrófono o audio de pestaña controlan la intensidad por volumen, con deslizador de sensibilidad.

## 🧠 Memoria

Memoria local opcional para que claude-f-me **te conozca**. Registra qué juegos y partituras Muse usas, con qué persona conectas y **señales de rechazo suave** (cosas paradas a los pocos segundos), además de notas libres. Claude puede `recall` antes de componer o subir, y `forget` lo borra.

- Herramientas: `remember "le gusta heartbeat al 60%"` · `recall` · `forget`
- En `~/.claude-f-me/memory.json` — **solo local, nunca se transmite**, un JSON que puedes leer o borrar.

## 📜 Prompts de escena

Escenas guiadas como **prompts MCP** — en Claude Code con `/mcp__claude-f-me__<nombre>`:

| prompt | qué prepara |
|---|---|
| `mommy-scene` | interpretar la persona 🍼 Mommy mientras controla el dispositivo |
| `edge-session` | una sesión estructurada de provocar y negar con chequeos |
| `story-mode` | una aventura de texto donde las decisiones controlan el dispositivo |
| `compose-vibe` | convertir una descripción en una partitura Muse y reproducirla |
| `aftercare` | un cierre suave y reconfortante |

## 💬 Puentes de chat — Telegram

Controla desde una app de chat que ya usas — perfecto para una pareja a distancia. Define un token y el puente arranca solo:

```bash
# de @BotFather; lista los chat ids que pueden controlar (muy recomendable)
export CFM_TELEGRAM_TOKEN=123456:ABC...
export CFM_TELEGRAM_ALLOW=11111111,22222222
```

Luego escribe al bot: un número `0–100`, `harder` / `softer`, `stop` / `safeword`, `scan`, o un emoji — 🔥 edge · 💓 heartbeat · 🌊 ambient · 🎡 wheel · 📈 escalation · 🎲 surprise · 🛑 stop. Las respuestas son bilingües (detecta chino). Sin lista de permitidos, cualquiera que encuentre el bot puede controlarlo, así que **defínela**. El tope de seguridad y `safeword` siempre ganan.

> **¿Por qué no WeChat?** WeChat personal no tiene API oficial de bots; solo protocolos no oficiales/grises (contra los ToS, fácilmente baneados). Ver la [hoja de ruta](#hoja-de-ruta--ideas).

## Herramientas MCP

| herramienta | descripción |
|---|---|
| `list_devices` | dispositivos, intensidad, batería, modo, tope, URL de consola, modo activo, masters |
| `scan_devices` | escanea `duration_ms` y devuelve la lista |
| `vibrate` | `intensity` 0..1, `target` id/`all`, opcional `duration_ms` (auto-parada) |
| `pattern` | `preset`(pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) o `steps`, `loops` |
| `stop` | parar un dispositivo/`all`, cancelar su patrón |
| `emergency_stop` | parar **todos** los dispositivos y modos al instante |
| `set_max_intensity` | tope global de seguridad 0..1 |
| `load_funscript` · `play_video` | cargar + reproducir funscript (`loop`/`speed`/`invert`) |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel` (`intensity_max`, `duration_ms`) |
| `game_event` | `reward`/`penalty`/`tease`/`pulse` puntual para narrativa |
| `compose` | escribes `keyframes`(`[{at,level}]`) desde un `brief` y se reproducen; `save_as`, `loop` |
| `muse_list` · `muse_play` | listar / reproducir partituras de la biblioteca |
| `list_personas` · `set_persona` · `reveal_persona` | elegir persona (o `blind`) y revelarla |
| `remember` · `recall` · `forget` | memoria local: guardar nota/preferencia, recuperar perfil, borrar |
| `stop_mode` | parar el modo vídeo/juego/muse activo |

Además **prompts MCP** (`/mcp__claude-f-me__…`): `mommy-scene`, `edge-session`, `story-mode`, `compose-vibe`, `aftercare`.

> El modo audio, el mando master y el dúo viven en la consola (necesitan navegador); el puente de Telegram corre en segundo plano; el resto lo maneja Claude con las herramientas de arriba.

## Configuración

| variable | por defecto | significado |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` o `buttplug` |
| `CFM_CONSOLE_PORT` | `8731` | puerto de la consola (también sirve `/master`) |
| `CFM_MAX_INTENSITY` | `1.0` | tope de seguridad inicial (0..1) |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | servidor Intiface (modo buttplug) |
| `ANTHROPIC_API_KEY` / `CFM_LLM_API_KEY` | — | *opcional* — que **Claude** componga desde «describe a vibe» |
| `OPENAI_API_KEY`(+ `CFM_OPENAI_BASE_URL`) | — | *opcional* — ídem, vía modelo compatible con OpenAI |
| `CFM_TELEGRAM_TOKEN` | — | *opcional* — activa el puente de Telegram (@BotFather) |
| `CFM_TELEGRAM_ALLOW` | — | chat ids permitidos (separados por coma, ¡ponlo!) |

> Las claves de modelo son **opcionales**. Sin ellas Muse funciona — pide a Claude `compose` en el chat — y las personas siguen modulando localmente. Con clave, el `model` de la persona decide quién compone. Las claves se leen del entorno y no se guardan; el relay del dúo no necesita clave.

## Desarrollo

```bash
npm run dev          # MCP + consola, watch (tsx)
npm run build        # type-check + dist/ (tsc)
npm run bundle       # dist/claude-f-me.mjs autocontenido (esbuild, para el plugin)
```

## 🛟 Seguridad y consentimiento

Es hardware íntimo sobre un cuerpo real. El diseño lo tiene en cuenta, pero **tú** eres la última línea de defensa:

- Un **tope global de intensidad** limita todo (herramienta / consola / mando master).
- Cada `vibrate` arma una **auto-parada**; aun sin `duration_ms` hay un tope duro de 5 minutos, y los controladores continuos tienen un watchdog que para el motor en segundos.
- `emergency_stop` / `/claude-f-me:safeword` / el botón rojo / el STOP del master detienen todo al instante.
- El hardware se apaga al salir del proceso.

Úsalo solo con consentimiento informado, entusiasta y revocable. No registres ni transmitas datos de uso. Eres responsable de cómo lo usas.

## Hoja de ruta / ideas

- 🏆 **Clasificaciones, logros y retos.** Estadísticas personales (sesiones, tiempo total, **edge más largo aguantado**, mejores rachas), logros desbloqueables y tablas comunitarias **anónimas y opt-in** + retos diarios/semanales (p. ej. «aguanta un edge de 5 min»). Rachas de pareja a distancia. Privacidad primero: solo opt-in, sin contenido, alias anónimos.
- 🌍 **Modo de control público.** Una sala pública compartible (el mando master, abierto a muchos) donde un público o un chat de directo controlan el dispositivo — estilo cam «propina/voto para controlar», dial de multitud en vivo, turnos en cola. Con barreras duras: tope forzado bajo, **expulsar/pausar/bloquear** del anfitrión, enfriamiento por espectador, safeword siempre activo y «ir a privado» de un toque. Consentimiento y moderación primero — público significa que quien lo lleva lo activó, y puede revocarlo al instante.
- 🧩 **Compartir partituras y patrones.** Exporta/importa partituras Muse y funscripts con un código corto.
- 🗣️ **Voz de persona.** TTS opcional para que la persona *diga* sus frases (🍼 «buena chica…»).
- 🎮 **Integración con juegos y streams.** Reacciona a eventos de juegos o directos (muerte, victoria, donación).
- 🐾 **Modo mascota (rendimiento del agente).** Conecta un agente de código — **Codex** o Claude Code — y deja que su *ritmo de salida en vivo* controle la intensidad: tokens volando = sube, un parón o build roja = baja. La productividad como bucle de recompensa. Extiende los 🧑‍💻 disparadores de desarrollo de eventos discretos a una señal continua.
- 🔐 **Memoria cifrada con PIN.** Bloquea la memoria local y la consola tras un código.
- 🧠 **Memoria → comportamiento.** Hoy registra y Claude puede `recall`; luego que guíe automáticamente persona/Muse y evite combos no deseados.
- 💬 **Más puentes de chat.** **Discord** (bot oficial, el siguiente natural) y Slack; **WhatsApp** vía Business API. **WeChat** no tiene API oficial de bots para cuentas personales — solo protocolos grises (contra ToS), por eso no se incluye; WeCom es posible pero engorroso.
- 🖥️ **Paneles de consola** para memoria, selector de persona y biblioteca Muse.
- 👩 **Modo discreción «tecla de jefe».** Un atajo que silencia y disfraza la consola al instante (distinto de la *persona* 🍼 Mommy).
- ⏰ **Provocaciones programadas.** Sesiones de «buenos días» y sorpresas temporizadas.
- 🎲 **Juego en grupo.** Una sala donde varias personas controlan un dispositivo a la vez.
- 🗣️ **Notas de voz → modo audio.** Conducir la intensidad desde un mensaje de voz.

## ⭐ Historial de estrellas y colaboradores

Si te sacó una sonrisa (o algo), deja una ⭐ — ayuda de verdad.

[![Star History Chart](https://api.star-history.com/svg?repos=mana-am/claude-f-me&type=Date)](https://star-history.com/#mana-am/claude-f-me&Date)

[![Contributors](https://contrib.rocks/image?repo=mana-am/claude-f-me)](https://github.com/mana-am/claude-f-me/graphs/contributors)

> El gráfico de Star-History y el mapa de colaboradores se muestran cuando el repositorio es **público**.

## Créditos

Construido sobre el protocolo abierto [Buttplug](https://github.com/buttplugio/buttplug) e [Intiface](https://intiface.com) de [Nonpolynomial](https://nonpolynomial.com). Sin afiliación.

## Licencia

[MIT](../../LICENSE) © SimonAKing
