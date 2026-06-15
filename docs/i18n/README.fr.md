<div align="center">

# claude-f-me

**Contrôlez du matériel intime en *discutant* dans Claude Code.**

Un plugin [Claude Code](https://claude.com/claude-code) qui transforme la conversation en langage
naturel en contrôle réel d'appareils, basé sur l'écosystème ouvert
[Buttplug / Intiface](https://buttplug.io) (plus de 750 appareils), avec une console web bilingue et
réactive, une télécommande « master », et des modes Muse (composition), personas, duo, vidéo, jeu et audio.
Un **simulateur intégré** permet de tout essayer **sans matériel**.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <b>Français</b> · <a href="README.de.md">Deutsch</a></p>

<img src="../console.png" alt="console claude-f-me" width="760" />

</div>

---

> [!IMPORTANT]
> Ceci contrôle un **appareil physique sur une personne réelle**. À n'utiliser qu'avec le
> consentement enthousiaste et continu de la personne qui le porte. Gardez un plafond de sécurité
> raisonnable, privilégiez les durées courtes et gardez un arrêt d'urgence à portée de main.
> Voir [Sécurité et consentement](#-sécurité-et-consentement).

## Galerie

| Console réactive (EN) | Console (中文) | Télécommande master |
|---|---|---|
| <img src="../console.png" width="320" /> | <img src="../console.zh.png" width="320" /> | <img src="../master.png" width="150" /> |

## Qu'est-ce que c'est

Un seul processus est **à la fois** le serveur MCP auquel Claude parle **et** la console web que vous
regardez — le chat et le tableau de bord partagent donc toujours le même état d'appareil.

- 🔌 **Matériel réel** : pilote Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer et [750+ appareils](https://iostindex.com) via [Intiface Central](https://intiface.com).
- 🎼 **Mode Muse (composition)** : le modèle *compose* — décrivez une ambiance (« slow burn tantrique de 10 min », « un orage », « je t'aime en morse ») et il écrit une partition haptique fluide et la joue. À sauvegarder dans une bibliothèque. L'appareil devient un instrument joué par une IA.
- 🎭 **Personas** : choisissez *qui commande* — des personnalités inspirées des modèles SOTA : 🕯️ Slow Burn (Opus), 😈 Brat (GPT-5.5), 🎼 Metronome, ⛈️ Storm, 🔮 Oracle, 🍼 Mommy. Chacune change le ressenti (rythme/aléa/refus/plafond). Le **mode aveugle** cache laquelle.
- 💞 **Mode duo** : relie deux consoles par un code de salon via un relais interne ; l'entrée de votre partenaire pilote votre appareil en temps réel (miroir/mener/suivre), avec présence et toucher 👋.
- ⚡ **UI réactive « Pulse Core »** : un orbe d'énergie qui respire et une aurore qui brillent avec l'intensité, plus une forme d'onde audio en temps réel.
- 👑 **Télécommande master** : une page `/master` adaptée au mobile pour qu'une autre personne prenne le contrôle en temps réel — grand cadran, vibration en maintien, presets, arrêt d'urgence. Chaque page indique quand un master est aux commandes.
- 🎬 **Mode vidéo** : lit une timeline [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) en temps réel (position `0..100` → intensité). Exemple intégré en un clic.
- 🎮 **Mode jeu** : `roulette`, `escalation`, `ambient`, `edge` (taquiner-refuser) et `wheel` (tourner et s'arrêter), plus un hook `game_event` pour réagir dans une aventure textuelle.
- 🎵 **Mode audio** : pilote l'appareil depuis le **micro** ou l'**audio d'onglet/système** en temps réel.
- 🥁 **Motifs** : `pulse`, `wave`, `escalate`, `tease`, `heartbeat`, `staircase`, `sos`, `earthquake`.
- 🧠 **Mémoire** : mémoire locale qui apprend vos favoris, votre affinité de persona et des signaux de rejet doux (`remember`/`recall`/`forget`) ; plus *vous* avec le temps, et ne quitte jamais votre machine.
- 📜 **Prompts de scène** : scènes guidées en tant que prompts MCP — mommy, edging, mode histoire, composer une ambiance, aftercare.
- 💬 **Ponts de chat** : bot **Telegram** optionnel — contrôlez par message ou emoji depuis un chat que vous utilisez déjà (idéal à distance).
- 🌐 **Bilingue** : console et télécommande en **anglais et chinois**, bascule en un geste (ou `?lang=zh`).
- 🛟 **Sécurité intégrée** : plafond global, arrêt auto par commande, watchdog, arrêt d'urgence partout, extinction à la sortie.

## Installation (en tant que plugin Claude Code)

```bash
# 1. ajoutez ce dépôt comme marketplace de plugins
/plugin marketplace add mana-am/claude-f-me

# 2. installez le plugin
/plugin install claude-f-me@claude-f-me
```

Puis, dans le chat :

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
compose a 5-minute slow build that edges twice then releases
become the Brat persona
surprise me
```

La console est sur **http://localhost:8731** — ouvrez-la avec `/claude-f-me:console`.

### Commandes slash

| commande | effet |
|---|---|
| `/claude-f-me:console` | ouvre la console dans le navigateur |
| `/claude-f-me:demo` | démo courte : scan → vibration → motif → jeu |
| `/claude-f-me:fuck` | démarre (scan auto puis montée) |
| `/claude-f-me:harder` / `:softer` | plus fort / plus doux (±20%) |
| `/claude-f-me:edge` / `:tease` | jeu de teasing / motif doux |
| `/claude-f-me:muse` | compose une partition haptique depuis une ambiance |
| `/claude-f-me:persona` | choisis qui commande (Slow Burn / Brat / …) |
| `/claude-f-me:surprise` | un mode au hasard |
| `/claude-f-me:safeword` · `:panic` | **tout arrêter immédiatement** |

## Connecter un appareil réel

claude-f-me est conçu pour le matériel réel ; le simulateur n'est qu'un aperçu.

1. Installez et ouvrez **[Intiface Central](https://intiface.com)** → **Start Server** (par défaut `ws://127.0.0.1:12345`).
2. Appairez votre jouet dans Intiface et vérifiez qu'il apparaît. Lovense est le plus simple à acheter et le mieux pris en charge.
3. Mettez **`CFM_MODE=buttplug`** (bloc `env` de [`.mcp.json`](../../.mcp.json), ou exportez-le en mode autonome).

> Le plugin démarre en `simulated` par défaut. Node 22+ a un `WebSocket` global ; sur Node ancien il est comblé via `ws`, donc le mode réel marche sur Node 18+.

### Pas encore de matériel ? Mode aperçu

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # ouvrez http://localhost:8731
```

Cliquez **Scan**, faites glisser l'orbe, lancez motifs/jeux, chargez le funscript d'exemple, activez **Audio** et martelez **STOP** — le moteur simulé réagit à l'écran. Clavier : `0–9` niveau, `espace` stop, `S` scan.

## 👑 Télécommande master

Ouvrez la console et cliquez **👑 Remote** (ou `/master`). Une télécommande au format mobile — grand cadran, vibration en maintien, raccourcis motifs/jeux, plafond de sécurité, arrêt pleine largeur. Celui qui la tient compte comme **master**, et chaque page affiche `👑 N master in control`.

Pour la confier à quelqu'un qui **n'est pas sur votre machine**, exposez le port via un tunnel (ex. `cloudflared tunnel --url http://localhost:8731` ou `ngrok http 8731`) et partagez le lien `/master`.

> Ne confiez le contrôle qu'à une personne de confiance et consentante. Le plafond de sécurité et le STOP du porteur l'emportent toujours.

## Modes et jeux

**🎼 Muse (composition)** — le modèle transforme un brief en une timeline de keyframes fluide (`{at, level}`, interpolée) et la joue. Via l'outil `compose` dans le chat, ou depuis le champ **« describe a vibe »** de la console avec une clé de modèle externe. Sauvegardez et rejouez avec `muse_list` / `muse_play`.

**🎭 Personas** — une personnalité qui module chaque jeu/événement (rythme/aléa/refus/plafond) et, avec une clé, choisit le modèle qui compose : 🕯️ `slowburn` (Opus) · 😈 `brat` (GPT-5.5) · 🎼 `metronome` · ⛈️ `storm` · 🔮 `oracle` · 🍼 `mommy`. `set_persona blind` la cache jusqu'à `reveal_persona`.

**💞 Duo** — ouvrez le panneau **Duet**, partagez l'URL du relais + un code de salon, et deux consoles se relient via le `/relay` interne. Choisissez **miroir** / **mener** / **suivre** et envoyez un toucher 👋. Les niveaux entrants passent votre plafond de sécurité local.

**🎬 Vidéo (funscript)** — lit une timeline `{at,pos}` en temps réel (`loop`/`speed`/`invert`), exemple en un clic.

**🎮 Jeux** — roulette · escalation · ambient · edge (taquiner-refuser, le pic monte à chaque tour) · wheel (tourne et s'arrête).

**🥁 Motifs** — pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake.

**🎵 Audio** — le micro ou l'audio d'onglet pilotent l'intensité par le volume, avec curseur de sensibilité.

## 🧠 Mémoire

Mémoire locale optionnelle pour que claude-f-me **vous connaisse**. Elle note quels jeux et partitions Muse vous utilisez, avec quelle persona vous accrochez et des **signaux de rejet doux** (choses arrêtées en quelques secondes), plus des notes libres. Claude peut `recall` avant de composer ou monter, et `forget` efface tout.

- Outils : `remember "aime heartbeat à 60%"` · `recall` · `forget`
- Dans `~/.claude-f-me/memory.json` — **local uniquement, jamais transmis**, un JSON lisible et supprimable.

## 📜 Prompts de scène

Scènes guidées en tant que **prompts MCP** — dans Claude Code via `/mcp__claude-f-me__<nom>` :

| prompt | ce qu'il met en place |
|---|---|
| `mommy-scene` | incarner la persona 🍼 Mommy tout en pilotant l'appareil |
| `edge-session` | une session structurée de taquiner-refuser avec des points d'étape |
| `story-mode` | une aventure textuelle où les choix pilotent l'appareil |
| `compose-vibe` | transformer une description en partition Muse et la jouer |
| `aftercare` | une fin de séance douce et rassurante |

## 💬 Ponts de chat — Telegram

Contrôlez depuis une app de chat que vous utilisez déjà — parfait à distance. Définissez un token et le pont démarre seul :

```bash
# de @BotFather ; listez les chat ids autorisés (fortement recommandé)
export CFM_TELEGRAM_TOKEN=123456:ABC...
export CFM_TELEGRAM_ALLOW=11111111,22222222
```

Puis écrivez au bot : un nombre `0–100`, `harder` / `softer`, `stop` / `safeword`, `scan`, ou un emoji — 🔥 edge · 💓 heartbeat · 🌊 ambient · 🎡 wheel · 📈 escalation · 🎲 surprise · 🛑 stop. Réponses bilingues (détecte le chinois). Sans liste d'autorisés, quiconque trouve le bot peut le contrôler, alors **définissez-la**. Le plafond de sécurité et `safeword` l'emportent toujours.

> **Pourquoi pas WeChat ?** WeChat personnel n'a pas d'API bot officielle ; seulement des protocoles non officiels/gris (contre les CGU, bannissables). Voir la [feuille de route](#feuille-de-route--idées).

## Outils MCP

| outil | description |
|---|---|
| `list_devices` | appareils, intensité, batterie, mode, plafond, URL console, mode actif, masters |
| `scan_devices` | scanne `duration_ms` et renvoie la liste |
| `vibrate` | `intensity` 0..1, `target` id/`all`, `duration_ms` optionnel (arrêt auto) |
| `pattern` | `preset`(pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) ou `steps`, `loops` |
| `stop` | arrêter un appareil/`all`, annuler son motif |
| `emergency_stop` | arrêter **tous** les appareils et modes immédiatement |
| `set_max_intensity` | plafond global de sécurité 0..1 |
| `load_funscript` · `play_video` | charger + jouer un funscript (`loop`/`speed`/`invert`) |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel` (`intensity_max`, `duration_ms`) |
| `game_event` | `reward`/`penalty`/`tease`/`pulse` ponctuel pour la narration |
| `compose` | vous écrivez `keyframes`(`[{at,level}]`) depuis un `brief` et ça joue ; `save_as`, `loop` |
| `muse_list` · `muse_play` | lister / rejouer les partitions de la bibliothèque |
| `list_personas` · `set_persona` · `reveal_persona` | choisir la persona (ou `blind`) et la révéler |
| `remember` · `recall` · `forget` | mémoire locale : enregistrer une note/préférence, récupérer le profil, effacer |
| `stop_mode` | arrêter le mode vidéo/jeu/muse actif |

Plus des **prompts MCP** (`/mcp__claude-f-me__…`) : `mommy-scene`, `edge-session`, `story-mode`, `compose-vibe`, `aftercare`.

> Le mode audio, la télécommande master et le duo vivent dans la console (navigateur requis) ; le pont Telegram tourne en arrière-plan ; le reste est piloté par Claude via les outils ci-dessus.

## Configuration

| variable | défaut | signification |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` ou `buttplug` |
| `CFM_CONSOLE_PORT` | `8731` | port de la console (sert aussi `/master`) |
| `CFM_MAX_INTENSITY` | `1.0` | plafond de sécurité initial (0..1) |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | serveur Intiface (mode buttplug) |
| `ANTHROPIC_API_KEY` / `CFM_LLM_API_KEY` | — | *optionnel* — **Claude** compose depuis « describe a vibe » |
| `OPENAI_API_KEY`(+ `CFM_OPENAI_BASE_URL`) | — | *optionnel* — idem, via un modèle compatible OpenAI |
| `CFM_TELEGRAM_TOKEN` | — | *optionnel* — active le pont Telegram (@BotFather) |
| `CFM_TELEGRAM_ALLOW` | — | chat ids autorisés (séparés par des virgules, mettez-le !) |

> Les clés de modèle sont **optionnelles**. Sans elles, Muse fonctionne (demandez à Claude `compose`) et les personas modulent localement. Avec une clé, le `model` de la persona décide qui compose. Les clés sont lues depuis l'environnement et jamais écrites ; le relais du duo n'a pas besoin de clé.

## Développement

```bash
npm run dev          # MCP + console, watch (tsx)
npm run build        # type-check + dist/ (tsc)
npm run bundle       # dist/claude-f-me.mjs autonome (esbuild, pour le plugin)
```

## 🛟 Sécurité et consentement

C'est du matériel intime sur un corps réel. La conception en tient compte, mais **vous** êtes la dernière ligne de défense :

- Un **plafond global d'intensité** limite tout (outil / console / télécommande master).
- Chaque `vibrate` arme un **arrêt auto** ; même sans `duration_ms` il y a un plafond dur de 5 minutes, et les pilotes continus ont un watchdog qui arrête le moteur en quelques secondes.
- `emergency_stop` / `/claude-f-me:safeword` / le bouton rouge / le STOP du master arrêtent tout instantanément.
- Le matériel est coupé à la fin du processus.

À n'utiliser qu'avec un consentement éclairé, enthousiaste et révocable. N'enregistrez ni ne transmettez de données d'usage. Vous êtes responsable de votre usage.

## Feuille de route / idées

- 🏆 **Classements, succès & défis.** Stats perso (séances, temps total, plus long edge tenu, meilleures séries), succès à débloquer, et classements communautaires **anonymes et opt-in** + défis quotidiens/hebdo (« survis à un edge de 5 min »). Séries de couple pour les partenaires à distance. Confidentialité d'abord — opt-in, aucun contenu, pseudonymes anonymes.
- 🌍 **Mode de contrôle public.** Une salle publique partageable (la télécommande master ouverte à plusieurs) où un public ou un chat de live pilote l'appareil — style cam « pourboire/vote pour contrôler », cadran de foule en direct, tours en file. Avec garde-fous stricts : plafond forcé bas, **éjecter/pause/verrou** de l'hôte, recharge par spectateur, safeword permanent et « passer en privé » en un geste. Consentement et modération d'abord — public veut dire que le porteur l'a activé, et peut le révoquer à l'instant.
- 🐾 **Mode animal (débit de l'agent).** Branchez un agent de code — **Codex** ou Claude Code — et laissez son *débit de sortie en direct* piloter l'intensité : des tokens qui fusent = ça monte, un blocage ou un build rouge = ça baisse. La productivité comme boucle de récompense. Étend les 🧑‍💻 déclencheurs développeur d'événements discrets à un signal continu.
- 🧠 **Mémoire → comportement.** Aujourd'hui elle enregistre et Claude peut `recall` ; ensuite, qu'elle oriente automatiquement persona/Muse et évite les combos non désirés.
- 💬 **Plus de ponts de chat.** **Discord** (bot officiel, le suivant) et Slack ; **WhatsApp** via Business API. **WeChat** n'a pas d'API bot officielle (protocoles gris, contre CGU), donc non inclus ; WeCom possible mais lourd.
- 🫀 **Sync biométrique.** Piloter l'intensité depuis votre rythme cardiaque (montre / ceinture / webcam) — vibrer au rythme de votre cœur.
- 🎮 **Intégration jeux & stream.** Réagir aux événements d'un jeu ou d'un live (mort, victoire, don).
- 🧩 **Partage de partitions & motifs.** Exporter/importer des partitions Muse et des funscripts via un code court.
- 🗣️ **Voix de persona.** TTS optionnel pour que la persona dise vraiment ses répliques.
- 🖥️ **Panneaux de console** pour la mémoire, le sélecteur de persona et la bibliothèque Muse.
- 👩 **Mode discrétion « touche patron ».** Un raccourci qui coupe le son et déguise la console instantanément (distinct de la *persona* 🍼 Mommy).
- ⏰ **Teasing programmé.** Séances « bonjour » et surprises minutées.
- 🎲 **Jeu en groupe.** Une salle où plusieurs personnes contrôlent un appareil ensemble.
- 🔐 **Mémoire chiffrée, verrouillée par code.**

## ⭐ Historique des étoiles et contributeurs

Si ça vous a fait sourire (ou autre), laissez une ⭐ — ça aide vraiment.

[![Star History Chart](https://api.star-history.com/svg?repos=mana-am/claude-f-me&type=Date)](https://star-history.com/#mana-am/claude-f-me&Date)

[![Contributors](https://contrib.rocks/image?repo=mana-am/claude-f-me)](https://github.com/mana-am/claude-f-me/graphs/contributors)

> Le graphe Star-History et la carte des contributeurs s'affichent une fois le dépôt **public**.

## Crédits

Construit sur le protocole ouvert [Buttplug](https://github.com/buttplugio/buttplug) et [Intiface](https://intiface.com) de [Nonpolynomial](https://nonpolynomial.com). Sans affiliation.

## Licence

[MIT](../../LICENSE) © SimonAKing
