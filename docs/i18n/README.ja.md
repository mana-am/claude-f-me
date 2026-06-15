<div align="center">

# claude-f-me

**Claude Code で「会話」しながらインティメイトなハードウェアを操作。**

自然言語の会話を実機制御に変える [Claude Code](https://claude.com/claude-code) プラグイン。
オープンソースの [Buttplug / Intiface](https://buttplug.io) エコシステム（750+ 対応デバイス）を基盤に、
強度にリアルタイム反応するバイリンガル Web コンソール、マスターリモート、そして Muse 作曲・
ペルソナ・デュエット・動画・ゲーム・オーディオの各モードを備えます。
**内蔵シミュレーター**でハードウェア無しでも丸ごと体験できます。

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.zh-TW.md">繁體中文</a> · <b>日本語</b> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a></p>

<img src="../pulse-core.gif" alt="claude-f-me Pulse Core コンソールがリアルタイムに反応" width="640" />

<br/>

<video src="https://github.com/mana-am/claude-f-me/raw/main/docs/promo-en.mp4" controls muted playsinline width="300"></video>

<sub>▶️ <b>機能ツアー</b> — すべてのモードを一望（約25秒）· <a href="https://github.com/mana-am/claude-f-me/raw/main/docs/promo-en.mp4">動画を開く</a></sub>

<p><b><a href="https://pages.mana.am/">▶ ブラウザでライブコンソールを試す</a></b> — 本物の UI、フル操作可能、シミュレート（ハードウェア不要）。<sub>main から GitHub Pages で公開。Pages を有効化すると表示されます。</sub></p>

</div>

---

> [!IMPORTANT]
> これは**実在の人物が身につける物理デバイス**を操作します。装着者の積極的かつ継続的な同意のもとでのみ
> 使用してください。安全上限を妥当に保ち、短い時間を優先し、緊急停止を常に手の届くところに。
> 詳しくは [安全と同意](#-安全と同意) を参照。

<details>
<summary><b>📑 目次</b></summary>

- [これは何か](#これは何か)
- [インストール（Claude Code プラグインとして）](#インストールclaude-code-プラグインとして) · [スラッシュコマンド](#スラッシュコマンド)
- [🚀 はじめ方 — ステップ・バイ・ステップ](#-はじめ方--ステップバイステップ)
- [実機を接続する](#実機を接続する)
- [👑 マスターリモート](#-マスターリモート)
- [モードとゲーム](#モードとゲーム) — Muse · ペルソナ · デュエット · 動画 · ゲーム · パターン · オーディオ · バイオフィードバック · 録音
- [📈 マーケットモード](#-マーケットモード)
- [🧠 メモリ](#-メモリ) · [📜 シーンプロンプト](#-シーンプロンプト)
- [💬 チャットブリッジ](#-チャットブリッジ--telegram) — Telegram · Discord · WeChat
- [🧑‍💻 開発者トリガー](#-開発者トリガー) · [🔌 汎用イベント webhook](#-汎用イベント-webhook)
- [MCP ツール](#mcp-ツール) · [設定](#設定) · [開発](#開発)
- [⏱️ モデル・エージェントのレート制限を尊重する](#️-モデルエージェントのレート制限を尊重する)
- [🩹 トラブルシューティング](#-トラブルシューティング) · [❓ FAQ](#-faq)
- [🔒 プライバシー](#-プライバシー) · [🛟 安全と同意](#-安全と同意)
- [ロードマップ / アイデア](#ロードマップ--アイデア) · [クレジット](#クレジット) · [ライセンス](#ライセンス)

</details>

## スクリーンショット

🎥 **コンソールがリアルタイムに反応する様子**（または[**ブラウザで試す →**](https://pages.mana.am/)）：

<video src="https://github.com/mana-am/claude-f-me/raw/main/docs/pulse-core.mp4" width="640" controls></video>

<sub>動画がインラインで再生されない場合は[こちらで開く](../pulse-core.mp4)、または上部のループプレビューを参照。</sub>

| コンソール（英語） | コンソール（中国語） | マスターリモート | ブラウザ内デモ |
|---|---|---|---|
| <img src="../console.png" width="230" /> | <img src="../console.zh.png" width="230" /> | <img src="../master.png" width="110" /> | <img src="../demo-browser.png" width="230" /> |

## ▶️ Claude Code・Codex・任意の MCP クライアントで使う

claude-f-me は標準の **MCP サーバー**——**Claude Code・Codex・Cursor・Cline・Claude Desktop** など MCP を話せるものなら何でも駆動できます。**ハードウェア不要**、内蔵シミュレーターがすべてを動かします（**http://localhost:8731**）。すぐ使える設定は [`examples/`](./examples) にあります。

**🟣 Claude Code** —— プラグインとしてワンクリック導入（スラッシュコマンド付き）：

```bash
/plugin marketplace add mana-am/claude-f-me
/plugin install claude-f-me@claude-f-me
```

**🟢 Codex / Cursor / Cline / Claude Desktop / …** —— クライアントをサーバーに向けるだけ。最も簡単なのは `npx`（Node ≥ 18、クローン不要）：

```jsonc
// "mcpServers" エントリ（Claude Desktop / Cursor / Cline / Windsurf）—— examples/mcp.json 参照
"claude-f-me": {
  "command": "npx",
  "args": ["-y", "github:mana-am/claude-f-me"],
  "env": { "CFM_MODE": "simulated" }
}
```

Codex は TOML —— [`examples/codex-config.toml`](./examples/codex-config.toml) を `~/.codex/config.toml` に入れます。クライアント別の一覧は [`examples/`](./examples)。

あとはどこでも同じように会話——`scan for devices` · `start an edge game` · `compose a slow build`——または Claude Code ではスラッシュコマンド `/claude-f-me:fuck`、`:edge`、`:morse`、`:safeword`。

> ➡️ 実機の接続、マスターリモートなどは [はじめ方](#-はじめ方--ステップバイステップ) を参照。

## これは何か

ひとつのプロセスが、Claude が話す MCP サーバー**でもあり**、あなたが眺める Web コンソール**でもある**——
だからチャットとダッシュボードは常に同じデバイス状態を共有します。

**🎛️ デバイスを駆動**
- 🎼 **Muse 作曲**——vibe を伝えると（「雷雨」「モールス信号で I love you」）、モデルが滑らかな触覚スコアを書いて再生。保存・再生も可能。
- 🥁 **パターン**——`pulse` · `wave` · `escalate` · `tease` · `heartbeat` · `staircase` · `sos` · `earthquake`。
- 🎮 **ゲーム**——`roulette` · `escalation` · `ambient` · `edge`（焦らして寸止め）· `wheel`、加えて `game_event` フックでテキストアドベンチャーに対応。
- 🎵 **オーディオ**——**マイク**または**タブ／システム音声**から強度をリアルタイム駆動。

**🎭 誰が支配するか**
- 🎭 **ペルソナ**——誰が運転するか選ぶ（🕯️ スローバーン/Opus · 😈 ブラット/GPT-5.5 · 🎼 メトロノーム · ⛈️ ストーム · 🔮 オラクル · 🍼 マミー）。感触が変わり、**ブラインドモード**は誰かを隠す。
- 👑 **マスターリモート**——`/master` ページを誰かに渡してリアルタイムに操作を引き継ぐ（ダイヤル・長押しブザー・プリセット・停止）。
- 💞 **デュエット**——2 台のコンソールをリレーで接続し、パートナーがあなたのデバイスを駆動（ミラー／リード／フォロー）、👋 タッチ付き。

**🌍 現実世界からの入力**
- 🎬 **動画**——[Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) を再生、またはローカル動画+スクリプトを完全同期。
- 📈 **マーケット**——ティッカー（`tesla`・`bitcoin`）を指定し、ライブの値動きを振動メロディで感じる。*(投資助言ではありません。)*
- 💓 **バイオフィードバック**——Bluetooth 心拍ストラップで強度を駆動、または**オートエッジ**：脈拍が限界を超えるとゼロに。
- 🔌 **イベント webhook**——`POST /event` で Stream Deck・IFTTT・Home Assistant・ゲームオーバーレイ・CV スクリプトから。
- 🧑‍💻 **開発者トリガー**——コミット・CI 成功・マージ・🍅 ポモドーロが `/dev` 経由でブザーに。
- 💬 **チャットブリッジ**——メッセージや絵文字で **Telegram**・**Discord**・**WeChat 公众号** から操作。

**🎨 自分仕様に**
- ⚡ **Pulse Core UI**——呼吸するオーブ + オーロラが強度で脈動し、リアルタイム波形も——退屈なダッシュボードではない。
- 🧠 **メモリ**——ローカル専用。お気に入り・ペルソナ親和性・ソフトな苦手を学習（`remember`／`recall`／`forget`）、外には出ない。
- 🎬 **セッション録音**——デバイスがやったこと（手動／デュエット／オーディオ／バイオ／ゲーム）を再生可能な Muse スコアに。
- 📜 **シーンプロンプト**——誘導シーンを MCP プロンプトに（マミー・エッジング・ストーリー・作曲・アフターケア）。
- 🌐 **バイリンガル**——コンソール＆マスターリモートが**英語と中国語**（`?lang=zh`）。

**🔌 ハードウェアと安全**
- 🔌 **実機対応**——[Intiface](https://intiface.com) 経由で Lovense・We-Vibe・Kiiroo・The Handy・Satisfyer など [750+ デバイス](https://iostindex.com) を駆動。
- 🛟 **安全を標準装備**——グローバル上限、コマンドごとの自動停止、ウォッチドッグ、どこでも緊急停止、終了時にハードウェアオフ。

## インストール（Claude Code プラグインとして）

```bash
# 1. このリポジトリをプラグインマーケットプレイスとして追加
/plugin marketplace add mana-am/claude-f-me

# 2. プラグインをインストール
/plugin install claude-f-me@claude-f-me
```

MCP サーバー（自己完結バンドル、`node_modules` 不要）とスラッシュコマンドが使えるようになります。
チャットを開いて試してみましょう：

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
compose a 5-minute slow build that edges twice then releases
become the Brat persona
surprise me
```

コンソールは **http://localhost:8731** に表示されます——`/claude-f-me:console` で開けます。

### スラッシュコマンド

| コマンド | 動作 |
|---|---|
| `/claude-f-me:console` | ブラウザでライブコンソールを開く |
| `/claude-f-me:demo` | スキャン→振動→パターン→ゲームの短いデモ |
| `/claude-f-me:fuck` | 開始（自動スキャンしてから盛り上げる） |
| `/claude-f-me:harder` / `:softer` | 強める / 弱める（±20%） |
| `/claude-f-me:edge` / `:tease` | 寸止めゲーム / やさしいオンオフ |
| `/claude-f-me:roulette` 🎰 | ランダムな間隔のランダムな噴出——次がいつ来るか分からない |
| `/claude-f-me:wheel` 🎡 | レベルを回してランダムな位置で止まって保持 |
| `/claude-f-me:dice` 🎲 | サイコロでランダムな dare（強度/時間/モード） |
| `/claude-f-me:countdown` ⏳ | 寸止めからカウントダウン、ゼロで解放（または焦らし） |
| `/claude-f-me:muse` | vibe からカスタム触覚スコアを作曲 |
| `/claude-f-me:morse` 💌 | 秘密のメッセージをモールス信号の振動で伝える |
| `/claude-f-me:market` 📈 | 株/暗号資産のライブな値動きを振動で感じる |
| `/claude-f-me:story` 📖 | 選択がデバイスを駆動するインタラクティブな物語 |
| `/claude-f-me:persona` | 誰が支配するかを選ぶ（スローバーン / ブラット / …） |
| `/claude-f-me:blind` 🎭 | ランダムな隠しペルソナに支配を委ねる——謎の支配者 |
| `/claude-f-me:surprise` | ランダムなモードを選ぶ |
| `/claude-f-me:aftercare` 🛁 | やさしく落ち着かせるクールダウン |
| `/claude-f-me:safeword` · `:panic` | **すべて即座に停止** |

## 🚀 はじめ方 — ステップ・バイ・ステップ

### 0. 前提条件
- プラグインとして使うなら **[Claude Code](https://claude.com/claude-code)**——スタンドアロンのコンソールだけなら **Node ≥ 18**。
- **ブラウザ**（Chrome/Edge 推奨。マイクと心拍機能はモダンブラウザが必要）。
- **ハードウェアは任意**——内蔵**シミュレーター**が何も挿さずにすべてを動かします。

### 1. インストール
**A）Claude Code プラグインとして（推奨）**
```bash
/plugin marketplace add mana-am/claude-f-me
/plugin install claude-f-me@claude-f-me
```
MCP サーバーは自己完結バンドル——`node_modules` もビルドも不要。（リポジトリが非公開？GitHub アカウントにアクセス権があるか確認するか、下のソースからの方法を使用。）

**B）スタンドアロン / ソースから**
```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me
npm install
npm run build
npm run console                                   # コンソールのみ、Claude 不要
# …またはビルド済みサーバーを Claude Code に手動登録：
claude mcp add claude-f-me -- node "$(pwd)/dist/index.js"
```

### 2. 初回起動（ハードウェア無し）
1. コンソールを **http://localhost:8731** で開く（または `/claude-f-me:console`）。
2. **Scan** をクリック → **シミュレート**デバイスが 2 台表示。
3. オーブ/スクラバーをドラッグして光と脈動を確認。**パターン**（heartbeat、edge…）や**ゲーム**を試す。
4. いつでも赤い **STOP**（または `space`）。キーボード：`0–9` で強度、`S` でスキャン。

### 3. Claude から駆動する
Claude Code のチャットでただ話しかけます：
```
scan for devices
vibrate at 30% for 5 seconds
run the heartbeat pattern
start an edge game, then stop after a minute
become the mommy persona and compose a gentle 3-minute build
```
…またはスラッシュコマンド：`/claude-f-me:fuck`、`:edge`、`:harder`、`:softer`、`:surprise`、`:safeword`。

### 4. 実機を接続する（任意）
Intiface をインストールし、トイをペアリングして `CFM_MODE=buttplug` を設定——詳しい手順はすぐ下。

### 5. さらに先へ（すべて任意）
- 👑 **リモートを誰かに渡す**——`/master`（または 👑 リモート ボタン）を開き、トンネル越しに共有。
- 💬 **チャットから操作**——`CFM_TELEGRAM_TOKEN` / `CFM_DISCORD_TOKEN` を設定（[チャットブリッジ](#-チャットブリッジ--telegram)）。
- 🎼 **モデルに作曲させる（Muse）**——`ANTHROPIC_API_KEY` を設定。ただし先に [レート制限のエチケット](#️-モデルエージェントのレート制限を尊重する) を読むこと。

## 実機を接続する

claude-f-me は実機を第一に設計されており、シミュレーターはあくまでプレビューです。

1. **[Intiface Central](https://intiface.com)** をインストールして開き、**Start Server** を押す（既定 `ws://127.0.0.1:12345`）。
2. Intiface でトイをペアリングし、表示を確認。Lovense が最も入手しやすくサポートも最良。ほぼ [デバイスリスト](https://iostindex.com) のすべてが動きます。
3. **`CFM_MODE=buttplug`** を設定（[`.mcp.json`](../../.mcp.json) の `env` を編集、またはスタンドアロンで export）。

> プラグインは既定で `simulated` なのですぐ動きます。Node 22+ はグローバル `WebSocket` を持ち、古い Node では `ws` でポリフィルするため、実機モードは Node 18+ で動作します。

### まだハードウェアが無い？プレビューモード

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # http://localhost:8731 を開く
```

**Scan** を押し、オーブをドラッグし、パターン/ゲームを発火し、サンプル funscript を読み込み、**Audio** を有効化し、**STOP** を連打——シミュレートされたモーターが画面上で反応します。キーボード：`0–9` で強度、`space` で停止、`S` でスキャン。

## 👑 マスターリモート

コンソールを開いて **👑 リモート** をクリック（または `/master` へ）。スマホサイズの集中リモート——大きなダイヤル、長押しブザー、パターン/ゲームのショートカット、安全上限、全幅の停止。保持している人は**マスター**としてカウントされ、全ページに `👑 N master in control` と表示されます。

**同じマシンにいない**人にリモートを渡すには、コンソールのポートをトンネルで公開し（例 `cloudflared tunnel --url http://localhost:8731` や `ngrok http 8731`）、`/master` のリンクを共有します。トンネル越しは HTTPS なので `wss://` が自動的に機能します。

> 操作を渡すのは、装着者が信頼し同意している相手だけに。安全上限と装着者自身の STOP が常に優先します。

## モードとゲーム

**🎼 Muse（作曲スコア）**——モデルが自然言語のブリーフを滑らかなキーフレームタイムライン（`{at, level}`、補間）に変えて再生。チャットで `compose` ツールを使う、または外部モデルキーが設定されていればコンソールの**「describe a vibe」**ボックスから。スコアはライブラリ（内蔵あり）に保存し、`muse_list` / `muse_play` で再生できます。

**🎭 ペルソナ**——すべてのゲーム/イベント（ペース・ランダム性・焦らし・上限）を調整するドライバー人格。対応キーがあれば Muse スコアを作曲するモデルも決めます：🕯️ `slowburn`(Opus) · 😈 `brat`(GPT-5.5) · 🎼 `metronome` · ⛈️ `storm` · 🔮 `oracle` · 🍼 `mommy`。`set_persona blind` は `reveal_persona` まで選択を隠します。

**💞 デュエット**——コンソールの **Duet** パネルを開き、リレー URL + ルームコードを共有すると、2 台のコンソールが内蔵 `/relay` ハブで接続。**mirror**（互いに感じる）・**lead**（あなたが駆動）・**follow**（あなたが受信）を選び、👋 タッチを送れます。受信した強度もローカルの安全上限を通過します。

**🎬 動画（funscript）**——`{at,pos}` タイムラインを強度に補間してリアルタイム再生（`loop`・`speed`・`invert`）。**Load sample** でファイル無しで試せます。または **🎬 Funscript** ダイアログでスクリプトを貼り付け/読み込み、**ローカル動画ファイル**を選んで **▶ Play with video**——ブラウザが動画を再生し `video.currentTime` からデバイスを駆動するので、一時停止・シーク・再生速度が完全同期（何もアップロードされず、すべてローカル）。

**🎮 ゲーム**——roulette（ランダムな噴出）· escalation（上昇して保持）· ambient（有機的な波）· edge（限界まで上げて寸止め、ピークが少しずつ上がる）· wheel（レベルを回して止まる）。

**🥁 パターン**——pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake。

**🎵 オーディオ**——マイクまたはタブ/システム音声が音量で強度を駆動、感度スライダー付き。

**💓 バイオフィードバック（心拍）**——コンソールの **💓 Heart rate** をクリックして標準的な Bluetooth 心拍ストラップ/ウォッチをペアリング（Web Bluetooth — Chrome/Edge で `localhost` または HTTPS）。レンジは自動キャリブレーションされ、**follow** が脈拍を強度にマッピング、**auto-edge** は心拍が限界を超えるとゼロに落とし、落ち着くと再開。本物の閉ループ。

**🎬 セッション録音**——**⏺ Record** を押すと、どのドライバー（スライダー・デュエット・オーディオ・バイオ・ゲーム）からでもデバイスの動きを Muse スコアとして取り込み、停止時に名前を付けるとライブラリに入り再生/共有できます。（約 1 秒未満の録音は破棄）

## 📈 マーケットモード

市場を感じる。会社名やティッカーを指定すると、ライブ相場（Yahoo Finance → Stooq → Coinbase フォールバック、キー不要）をポーリングし、当日の値動きから振動メロディを再生：変動の大きさで強度がスケールし、緑（上昇）は**上行**アルペジオ、赤（下落）は**下行**。

- チャットで：`market_mode` に `symbol`（`tesla` / `AAPL` / `bitcoin` / `BTC-USD`）、任意で `interval_ms`（最小 5000）・`duration_ms`・`intensity_max`。`stop_mode` / `emergency_stop` で終了。
- コンソールで：**📈 Market** ボックスにティッカーを入力して **Feel it**。
- 親しみやすい名前（apple/tesla/nvidia/bitcoin/… 中国語含む）は自動でティッカーに解決されます。

> ポーリングはあなたのマシン上で、安全上限を尊重し、5 秒に 1 回より速くは動きません。投資助言ではありません。

## 💓🎬🧑‍💻 身体・録音・開発者トリガー

**バイオフィードバック**と**セッション録音**はコンソールに存在します（上記）——どちらもブラウザ（Bluetooth、キャプチャ）が必要です。**開発者トリガー**は小さなローカルエンドポイント経由で開発ループからデバイスを駆動します——[開発者トリガー](#-開発者トリガー)を参照。

## 🧠 メモリ

claude-f-me が**あなたを知っていく**ための任意のローカルメモリ。よく使うゲームや Muse スコア、どのペルソナと合うか、そして**ソフトな苦手シグナル**（始めて数秒で止められたもの）、さらに自由記述のメモを記録します。Claude は作曲やエスカレートの前に `recall` でき、`forget` で消去できます。

- ツール：`remember "60% の heartbeat が好き"` · `recall` · `forget`
- `~/.claude-f-me/memory.json` に保存——**ローカル専用、決して送信されない**、読んだり消したりできるプレーン JSON。

## 📜 シーンプロンプト

誘導シーンは **MCP プロンプト**として同梱——Claude Code から `/mcp__claude-f-me__<名前>` で実行：

| prompt | 何を用意するか |
|---|---|
| `mommy-scene` | デバイスを駆動しながら 🍼 マミーペルソナを演じる |
| `edge-session` | チェックイン付きの構造化された寸止めセッション |
| `story-mode` | 選択がデバイスを駆動するインタラクティブなテキストアドベンチャー |
| `compose-vibe` | 説明を Muse スコアに変えて再生 |
| `aftercare` | やさしく落ち着かせるクールダウン |

## 💬 チャットブリッジ — Telegram

すでに使っているチャットアプリから操作——遠距離パートナーに最適。ボットトークンを設定すればブリッジは自動起動します：

```bash
# @BotFather から。操作を許可する chat id を許可リストに（強く推奨）
export CFM_TELEGRAM_TOKEN=123456:ABC...
export CFM_TELEGRAM_ALLOW=11111111,22222222
```

そしてボットにメッセージを送ります：数字 `0–100`、`harder` / `softer`、`stop` / `safeword`、`scan`、または絵文字——🔥 edge · 💓 heartbeat · 🌊 ambient · 🎡 wheel · 📈 escalation · 🎲 surprise · 🛑 stop。返信はバイリンガル（中国語を自動検出）。許可リストが無いと、ボットを見つけた誰もが操作できてしまうので、設定してください。安全上限と `safeword` が常に優先します。

## 💬 チャットブリッジ — Discord

Discord ボット（最小限の Gateway クライアント、`discord.js` 依存なし）——DM するかチャンネルで使います。

```bash
# ボットトークンは Developer Portal → Bot から（"Message Content Intent" を有効化）
export CFM_DISCORD_TOKEN=...
export CFM_DISCORD_ALLOW=<あなたの-user-id>,<channel-id>   # 許可リスト（設定して！）
```

Telegram と同じ語彙：`0–100`、`harder`/`softer`、`stop`/`safeword`、`scan`、または 🔥💓🌊🎡📈🎲。無関係な雑談には黙り、自分や他のボットのメッセージは無視します。

## 💬 チャットブリッジ — WeChat (公众号)

WeChat からの双方向操作を**コンプライアンスに沿った方法**で——公式の**公式アカウント（公众号）**メッセージコールバック経由。個人 WeChat のウェブプロトコル（itchat/wechaty）は意図的に避けます：WeChat の ToS に反し、アカウント停止を招きます。

```bash
export CFM_WECHAT_TOKEN=公众号后台で設定したToken
export CFM_WECHAT_ALLOW=openid1,openid2   # 任意：OpenID で操作できる人を制限
```

次に **公众号后台 → 设置与开发 → 基本配置 → 服务器配置** で URL を `https://<あなたの公開ホスト>/wechat` に向けます（これはローカルで動くので cloudflared のようなトンネル/リバースプロキシを使用）。エンドポイントは GET 署名ハンドシェイクを処理し、テキスト/絵文字メッセージに受動的に応答します（`0–100`、`harder`/`softer`、`stop`、`扫描`、🔥💓🌊🎡📈🎲）；ボイスノートには heartbeat が返ります。

> **個人 WeChat** には依然として公式ボット API がありません——グレーなウェブプロトコルは使わないこと。送信のみ/チーム通知には **企业微信のグループロボット webhook** が簡単ですが返信は受けられません。双方向操作を可能にするのは上記の公众号の経路です。

## 🧑‍💻 開発者トリガー

開発ループからデバイスを駆動——git hook・CI ステップ・ポモドーロ・シェルエイリアスが叩けるローカル HTTP エンドポイント `/dev`。イベントは反応にマッピングされます（すべて安全上限を通過）：`commit`/`push` → pulse · `ci_pass`/`merge`/`focus_done` → 報酬 🎉 · `ci_fail` → SOS · `distracted` → stop。ポートがローカル専用でない場合は `CFM_DEV_SECRET` を設定して `secret=` を要求します。

```bash
curl -fsS localhost:8731/dev -d event=ci_pass
# git: .git/hooks/post-commit  (chmod +x)
curl -fsS localhost:8731/dev -d 'event=commit&magnitude=0.5' >/dev/null 2>&1 || true
```

コンソールには **🍅 Focus 25m** ポモドーロも内蔵され、タイマー完了時に `focus_done`（報酬）を発火します。

## 🔌 汎用イベント webhook

世界中の何でも突けるエンドポイント——Stream Deck ボタン、IFTTT / Home Assistant の自動化、Tasker タスク、ゲームオーバーレイ、CV スクリプトを `POST /event` に向けます：

```bash
curl -fsS localhost:8731/event -d 'action=vibrate&intensity=0.6&duration_ms=3000'
curl -fsS localhost:8731/event -d 'action=pattern&name=heartbeat'
curl -fsS localhost:8731/event -d 'action=game&type=edge'
curl -fsS localhost:8731/event -d 'action=event&kind=reward&magnitude=0.8'
curl -fsS localhost:8731/event -d 'action=stop'
```

アクション：`vibrate` (`intensity`, `duration_ms`) · `pattern` (`name`, `loops`) · `game` (`type`) · `event` (`kind` reward/penalty/tease/pulse, `magnitude`) · `stop` · `scan`。任意の共有シークレット `CFM_EVENT_SECRET`（`CFM_DEV_SECRET` にフォールバック）。すべて安全上限を通過します。

## MCP ツール

| ツール | 説明 |
|---|---|
| `list_devices` | デバイス、強度、バッテリー、モード、上限、コンソール URL、アクティブモード、マスター数 |
| `scan_devices` | `duration_ms` スキャンしてリストを返す |
| `vibrate` | `intensity` 0..1、`target` id/`all`、任意の `duration_ms`（自動停止） |
| `pattern` | `preset`(pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) または `steps`、`loops` |
| `stop` | デバイス / `all` を停止し、そのパターンをキャンセル |
| `emergency_stop` | **すべての**デバイスとモードを即座に停止 |
| `set_max_intensity` | グローバル安全上限 0..1 |
| `load_funscript` · `play_video` | funscript の読み込み + 再生（`loop`・`speed`・`invert`） |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel`（`intensity_max`・`duration_ms`） |
| `market_mode` | ライブ株式/暗号資産の相場から駆動（`symbol`・`interval_ms`・`duration_ms`・`intensity_max`） |
| `game_event` | ナラティブ向けの単発 `reward`/`penalty`/`tease`/`pulse` |
| `compose` | `brief` から `keyframes`(`[{at,level}]`) を書いて再生；任意で `save_as`・`loop` |
| `muse_list` · `muse_play` | 保存済み & 内蔵 Muse スコアの一覧 / 再生 |
| `list_personas` · `set_persona` · `reveal_persona` | ドライバー人格を選ぶ（または `blind`）／公開する |
| `remember` · `recall` · `forget` | ローカルメモリ：メモ/好みの保存、プロファイルの呼び出し、消去 |
| `stop_mode` | アクティブな 動画/ゲーム/muse モードを停止 |

さらに **MCP プロンプト**（`/mcp__claude-f-me__…`）：`mommy-scene`、`edge-session`、`story-mode`、`compose-vibe`、`aftercare`。

> オーディオ・バイオフィードバック・セッション録音・動画同期・マスターリモート・デュエットはコンソールに存在し（マイク/Bluetooth/ファイル取り込みと手元操作にブラウザが必要）、Telegram & Discord ブリッジ、WeChat `/wechat` コールバック、`/dev` + `/event` エンドポイントはサーバーで動きます。それ以外はすべて上記ツールを通じて Claude が駆動できます。

## 設定

| 環境変数 | 既定 | 意味 |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` または `buttplug` |
| `CFM_CONSOLE_PORT` | `8731` | Web コンソールのポート（`/master` も配信） |
| `CFM_MAX_INTENSITY` | `1.0` | 初期安全上限（0..1） |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | Intiface サーバー（buttplug モード） |
| `ANTHROPIC_API_KEY` / `CFM_LLM_API_KEY` | — | *任意*——コンソールの「describe a vibe」を **Claude** に作曲させる |
| `OPENAI_API_KEY`(+ `CFM_OPENAI_BASE_URL`) | — | *任意*——同上、OpenAI 互換モデル経由（例：GPT ペルソナ） |
| `CFM_TELEGRAM_TOKEN` | — | *任意*——Telegram ブリッジを有効化（@BotFather のトークン） |
| `CFM_TELEGRAM_ALLOW` | — | Telegram で操作を許可する chat id（カンマ区切り、設定必須！） |
| `CFM_DISCORD_TOKEN` | — | *任意*——Discord ブリッジを有効化（Message Content Intent を有効に） |
| `CFM_DISCORD_ALLOW` | — | Discord で操作を許可する user/channel id（カンマ区切り、設定必須！） |
| `CFM_WECHAT_TOKEN` | — | *任意*——WeChat 公式アカウントの `/wechat` を有効化（公众号後台のトークン） |
| `CFM_WECHAT_ALLOW` | — | WeChat で操作を許可する OpenID（カンマ区切り） |
| `CFM_DEV_SECRET` | — | *任意*——`/dev` 開発者トリガーに `secret=` を要求 |
| `CFM_EVENT_SECRET` | — | *任意*——`/event` webhook に `secret=` を要求（`CFM_DEV_SECRET` にフォールバック） |

> モデルキーは**任意**。無くても Muse は動きます——チャットで Claude に `compose` を頼むだけで OK、ペルソナもローカルで感触を調整します。キーがあると、ペルソナの `model` が誰が作曲するかを決めます（これが「🕯️ Opus」対「😈 GPT-5.5」を文字どおりにするもの）。キーは環境から読み取られ、ディスクには決して書かれません。デュエットのリレーはキー不要です。

## 開発

```bash
npm run dev          # MCP + コンソール、watch モード（tsx）
npm run build        # 型チェック + dist/ を出力（tsc）
npm run bundle       # プラグイン用の自己完結 dist/claude-f-me.mjs（esbuild）
```

## ⏱️ モデル・エージェントのレート制限を尊重する

**Claude / Codex / OpenAI** に触れるものはすべて、あなたの**週次・日次の利用上限**に対する礼儀正しい市民として設計されています——決して放埒にはなりません：

- **Muse の作曲はオンデマンドのみ**——ループもポーリングもしません。作曲呼び出しの間に最小間隔を強制し、HTTP **429** では一度だけバックオフ（`Retry-After` を尊重）してから「少し待って」のメッセージでクリーンに失敗します。API を叩き続けることはありません。
- **ペットモード（ロードマップ）は設計上ゼロクォータ**：コーディングエージェントの*ローカル出力ストリーム*（tokens/秒）を読んで強度を決めます——モデル API 自体は呼び出しません。
- **開発者トリガー & webhook** は*あなたが*送ったイベントに反応するだけで、モデルトラフィックを発生させません。
- 持ち込みキーは環境から読み取られ、明示的に作曲するときだけ使われ、**ディスクには決して書かれません**。キーが無ければ、Muse はすでにチャット中の Claude に頼むだけです。

> 経験則：claude-f-me があなたのモデル上限到達の原因になることは決してありません。近づけば、バックオフして知らせます——リトライを繰り返したりはしません。

## 🩹 トラブルシューティング

- **コンソールが開かない /「ポート使用中」**：別のインスタンスが `8731` を保持——停止する（`lsof -ti tcp:8731 | xargs kill`）か、`CFM_CONSOLE_PORT` を空きポートに設定。
- **Scan 後に「No devices」（実機）**：Intiface Central が起動し **Start Server** が押され、トイがそこでペアリング済みで、`CFM_MODE=buttplug` が設定されているか確認。シミュレーターは常にデバイスを表示します。
- **マイク / 心拍が起動しない**：ブラウザはセキュアコンテキストでのみ許可——`http://localhost`（セキュア扱い）または HTTPS（トンネルで可）を Chrome/Edge で使用。
- **プラグインがインストールできない**：リポジトリが非公開——GitHub ログインにアクセス権があるか確認するか、ソースからの方法を使用。
- **「composing too fast」**：これはレート制限ガード——数秒待ちます。
- **オーブは動くが振動しない**：`simulated` モード（既定）です——実機には `buttplug` に切り替え。

## ❓ FAQ

**試すのにハードウェアの購入は必要？** いいえ。内蔵**シミュレーター**が既定です——スキャン・パターン・ゲーム・Muse・オーディオ・UI 全体が、何も挿さずに動きます。

**どのデバイスを買えばいい？** [Buttplug デバイスリスト](https://iostindex.com) のものなら何でも。**Lovense** が最も入手しやすくサポートも最良。We-Vibe・Kiiroo・The Handy・Satisfyer も堅実です。

**どの OS で動く？** macOS・Windows・Linux——Node ≥ 18 だけです。実機は **Intiface Central**（クロスプラットフォーム）経由。マイク/心拍機能は Chromium 系ブラウザ（Chrome/Edge）で `localhost` または HTTPS が必要。

**データはどこかに送られる？** いいえ。[プライバシー](#-プライバシー) を参照——メモリはローカル専用、キーはディスクに書かれず、テレメトリもありません。外向き通信は、ハードウェア制御（ローカル）、任意の Muse 作曲（*あなたが*作曲するときだけ、あなた自身のキーへ）、マーケットモードの相場取得のみ。

**API キーは必要？** いいえ。Muse はすでにチャット中の Claude に頼んで動きます。キーが要るのは、コンソールの「describe a vibe」ボックスで Claude を介さず作曲する場合だけです。

**プラグインがインストールできない。** リポジトリは非公開です——GitHub ログインにアクセス権があるか確認するか、[ソースからの方法](#1-インストール)を使用。

## 🔒 プライバシー

ここではプライバシーは後付けではなく機能です：

- **メモリはローカル専用**：`~/.claude-f-me/memory.json` に、読み・編集・削除できるプレーン JSON として存在——**決して送信されません**。`forget` で消去。
- **キーはディスクに触れない**：`ANTHROPIC_API_KEY` / `OPENAI_API_KEY` は環境から読み取られ、明示的に作曲するときだけ使われます。デュエットのリレーはキー不要。
- **テレメトリなし**：利用状況がログされたり送信されたりすることはありません。コンソールとデバイス状態はあなたのマシンに留まり、デュエットとマスターリモートは*あなたが*接続したコンソール間でのみデータを動かします。
- **ネットワーク面はあなたが掌握**：ブリッジと webhook はオプトイン・既定オフで、許可リスト / 共有シークレットで保護。ポートを公開するのはあなたが選んだときだけ（トンネル + シークレット推奨）。

## 🛟 安全と同意

これは実在の身体に対するインティメイトなハードウェアです。設計はそれを反映していますが、**あなた**が最後の防衛線です：

- **グローバル強度上限**がすべて（ツール・コンソールスライダー・マスターリモート）をクランプ。
- すべての `vibrate` が**自動停止**を仕込みます。`duration_ms` 無しでも 5 分のハード上限があり、連続ドライバー（パターン/動画/ゲーム/オーディオ）にはモーターを数秒で止めるウォッチドッグ。
- `emergency_stop` / `/claude-f-me:safeword` / コンソールの赤ボタン / マスターの STOP がすべてを即座に停止。
- プロセス終了時にハードウェアはオフになります。

必ず、知らされた・積極的な・撤回可能な同意のもとで使用してください。利用データを記録・送信しないこと。使い方の責任はあなたにあります。

> **18+ 限定。** これは同意した成人のための成人向けソフトウェアです。使用することで、あなたが自分の法域で法定年齢に達しており、関係者全員が同意していることを確認したものとみなします。本ソフトウェアは「現状のまま」提供され、いかなる保証もありません（[LICENSE](../../LICENSE) を参照）。使い方のリスクはすべてあなたが負います。

## ロードマップ / アイデア

これからの方向性——PR と意見を歓迎します：

- 🏆 **リーダーボード・実績・チャレンジ**：個人統計（セッション数、合計時間、**最長エッジ保持**、ベストストリーク）、解除可能な実績、そして**オプトイン・匿名**のコミュニティボード + デイリー/ウィークリーチャレンジ（例「5 分のエッジを生き延びる」）。遠距離パートナー向けのカップルストリーク。プライバシー優先：オプトインのみ、内容なし、匿名ハンドル。
- 🌍 **公開コントロールモード**：共有可能な公開ルーム（マスターリモートを多人数に開放）で、観客や配信チャットが集団でデバイスを駆動——投げ銭/投票で操作、ライブの群衆ダイヤル、順番待ち。強固なガードレール付き：低い強制上限、ホストの**キック / 一時停止 / ロック**、視聴者ごとのクールダウン、常時セーフワード、ワンタップ「プライベートに戻す」。同意とモデレーション優先——公開とは*装着者がオプトインした*という意味で、即座に撤回できます。
- 🧩 **スコア & パターンの共有**：短いコードで Muse スコアと funscript をエクスポート/インポート——小さな vibe のコミュニティライブラリ。
- 🗣️ **ペルソナの声**：オプションの TTS でペルソナが実際にセリフを*話す*（🍼「good girl…」）。
- 🎮 **ゲーム & 配信連携**：ゲームや配信のイベント（死亡・勝利・投げ銭）に反応。
- 🐾 **ペットモード（エージェントのスループット）**：コーディングエージェント——**Codex** または Claude Code——を接続し、その**ライブ出力レート**で強度を駆動：トークンが飛び交えば上昇、停滞や赤いビルドで低下。生産性を報酬ループに。🧑‍💻 開発者トリガーを離散イベントから連続シグナルへ拡張（エージェントのストリームを tail → tokens/秒 → 強度、もちろん安全上限を通して）。
- 🔐 **暗号化・PIN ロックのメモリ**：ローカルメモリとコンソールをコードでロック。
- 🧠 **メモリ → 振る舞い**：今はメモリは*記録*し Claude が*呼び出せる*だけ。次は、頼まなくてもペルソナ/Muse の選択を自動的に導き、苦手な組み合わせを避けるように。
- 💬 **さらなるチャットブリッジ**：Telegram・Discord・WeChat 公众号はすでに出荷済み——次は **Slack** と Business API 経由の **WhatsApp**。（**個人 WeChat** には公式ボット API が無く、ToS に反しアカウント停止を招くグレーなプロトコルしかないため、公众号の経路のみサポート。企业微信（WeCom）の送信専用ロボットは可能ですが扱いにくい。）
- 🖥️ **コンソールパネル**：メモリプロファイル、ペルソナピッカー、Muse ライブラリ（今はツール/チャット駆動）。
- 👩 **「ボスキー」ディスクリションモード**：誰かが入ってきたとき、コンソールを瞬時にミュート + 無害なものに偽装するホットキー（🍼 マミー*ペルソナ*とは別物）。
- ⏰ **スケジュールされた焦らし**：「おはよう」セッションとタイマー仕掛けのサプライズ。
- 🎲 **グループプレイ**：複数人が 1 台のデバイスを集団で操作する共有ルーム（本物のルーレット）。
- 🗣️ **ボイスメモ → オーディオモード**：ライブマイクだけでなく、送られたボイスメッセージから強度を駆動。

## ⭐ スターと貢献者

これで笑顔になったら（あるいは何か別のことが起きたら）、⭐ をひとつ——本当に助かります。

[![Star History Chart](https://api.star-history.com/svg?repos=mana-am/claude-f-me&type=Date)](https://star-history.com/#mana-am/claude-f-me&Date)

[![Contributors](https://contrib.rocks/image?repo=mana-am/claude-f-me)](https://github.com/mana-am/claude-f-me/graphs/contributors)

> スター履歴チャートと貢献者マップは、リポジトリが**公開**になると表示されます。

## クレジット

[Nonpolynomial](https://nonpolynomial.com) によるオープンソースの [Buttplug](https://github.com/buttplugio/buttplug) プロトコルと [Intiface](https://intiface.com) を基盤にしています。提携関係はありません。

## ライセンス

[MIT](../../LICENSE) © SimonAKing
