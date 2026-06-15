<div align="center">

# claude-f-me

**Contrôlez du matériel intime en *discutant* dans Claude Code.**

Un plugin [Claude Code](https://claude.com/claude-code) qui transforme la conversation en langage
naturel en contrôle réel d'appareils, basé sur l'écosystème ouvert
[Buttplug / Intiface](https://buttplug.io) (plus de 750 appareils), avec une console web bilingue
et réactive, une télécommande « master », et des modes vidéo (funscript), jeu et audio.
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

## Qu'est-ce que c'est

Un seul processus est **à la fois** le serveur MCP auquel Claude parle **et** la console web que
vous regardez — le chat et le tableau de bord partagent donc toujours le même état d'appareil.

- 🔌 **Matériel réel** : pilote Lovense, We-Vibe, Kiiroo, The Handy, Satisfyer et
  [750+ appareils](https://iostindex.com) via [Intiface Central](https://intiface.com).
- ⚡ **UI réactive « Pulse Core »** : un orbe d'énergie qui respire et une aurore qui brillent et grossissent avec l'intensité, plus une forme d'onde audio en temps réel.
- 👑 **Télécommande master** : une page `/master` adaptée au mobile pour qu'une autre personne prenne le contrôle en temps réel — grand cadran, vibration en maintien, presets, arrêt d'urgence. Chaque page indique quand un master est aux commandes.
- 🎬 **Mode vidéo** : lit une timeline [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) en temps réel (position `0..100` → intensité). Exemple intégré en un clic.
- 🎮 **Mode jeu** : `roulette`, `escalation`, `ambient`, `edge` (taquiner-refuser) et `wheel` (tourner et s'arrêter), plus un hook `game_event` pour que Claude réagisse dans une aventure textuelle.
- 🎵 **Mode audio** : pilote l'appareil depuis le **micro** ou l'**audio d'onglet/système** en temps réel.
- 🥁 **Motifs** : `pulse`, `wave`, `escalate`, `tease`, `heartbeat`, `staircase`, `sos`, `earthquake`.
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
| `/claude-f-me:surprise` | un mode au hasard |
| `/claude-f-me:safeword` · `:panic` | **tout arrêter immédiatement** |

## Connecter un appareil réel

claude-f-me est conçu pour le matériel réel ; le simulateur n'est qu'un aperçu.

1. Installez et ouvrez **[Intiface Central](https://intiface.com)** → **Start Server** (par défaut `ws://127.0.0.1:12345`).
2. Appairez votre jouet dans Intiface et vérifiez qu'il apparaît. Lovense est le plus simple à acheter et le mieux pris en charge.
3. Mettez **`CFM_MODE=buttplug`** (modifiez le bloc `env` de [`.mcp.json`](../../.mcp.json), ou exportez-le en mode autonome).

> Le plugin démarre en `simulated` par défaut. Node 22+ a un `WebSocket` global ; sur Node ancien il est comblé via `ws`, donc le mode réel marche sur Node 18+.

### Pas encore de matériel ? Mode aperçu

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # ouvrez http://localhost:8731
```

Cliquez **Scan**, faites glisser l'orbe, lancez motifs/jeux, chargez le funscript d'exemple, activez **Audio** et martelez **STOP** — le moteur simulé réagit à l'écran. Clavier : `0–9` niveau, `espace` stop, `S` scan.

## 👑 Télécommande master

Ouvrez la console et cliquez **👑 Remote** (ou allez sur `/master`). Une télécommande dédiée au format mobile — grand cadran, vibration en maintien, raccourcis motifs/jeux, plafond de sécurité, arrêt pleine largeur. Celui qui la tient compte comme **master**, et chaque page affiche `👑 N master in control`.

Pour la confier à quelqu'un qui **n'est pas sur votre machine**, exposez le port de la console via un tunnel (ex. `cloudflared tunnel --url http://localhost:8731` ou `ngrok http 8731`) et partagez le lien `/master`.

> Ne confiez le contrôle qu'à une personne de confiance et consentante. Le plafond de sécurité et le STOP du porteur l'emportent toujours.

## Modes et jeux

- **🎬 Vidéo** : lit un funscript en temps réel (`loop`/`speed`/`invert`), exemple en un clic.
- **🎮 Jeux** : roulette · escalation · ambient · edge (taquiner-refuser, le pic monte à chaque tour) · wheel (tourne et s'arrête).
- **🥁 Motifs** : pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake.
- **🎵 Audio** : le micro ou l'audio d'onglet pilotent l'intensité par le volume, avec curseur de sensibilité.

## 🛟 Sécurité et consentement

C'est du matériel intime sur un corps réel. La conception en tient compte, mais **vous** êtes la dernière ligne de défense :

- Un **plafond global d'intensité** limite tout (outil / curseur de la console / télécommande master).
- Chaque `vibrate` arme un **arrêt auto** ; même sans `duration_ms` il y a un plafond dur de 5 minutes, et les pilotes continus ont un watchdog qui arrête le moteur en quelques secondes si leur boucle meurt.
- `emergency_stop` / `/claude-f-me:safeword` / le bouton rouge de la console / le STOP du master arrêtent tout instantanément.
- Le matériel est coupé à la fin du processus.

À n'utiliser qu'avec un consentement éclairé, enthousiaste et révocable. N'enregistrez ni ne transmettez de données d'usage. Vous êtes responsable de votre usage.

## Crédits

Construit sur le protocole ouvert [Buttplug](https://github.com/buttplugio/buttplug) et [Intiface](https://intiface.com) de [Nonpolynomial](https://nonpolynomial.com). Sans affiliation.

## Licence

[MIT](../../LICENSE) © SimonAKing
