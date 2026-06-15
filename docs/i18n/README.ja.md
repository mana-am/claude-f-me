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

<img src="../console.png" alt="claude-f-me コンソール" width="760" />

</div>

---

> [!IMPORTANT]
> これは**実在の人の身体に装着された物理デバイス**を制御します。装着者の**熱意ある継続的な同意**の
> もとでのみ使用してください。安全上限を妥当に保ち、短い時間を優先し、緊急停止を手の届く所に。
> 詳しくは [安全と同意](#-安全と同意) を参照。

## ギャラリー

| 反応型コンソール（英語） | コンソール（中国語） | マスターリモート |
|---|---|---|
| <img src="../console.png" width="320" /> | <img src="../console.zh.png" width="320" /> | <img src="../master.png" width="150" /> |

## これは何か

1 つのプロセスが Claude が話す MCP サーバー**であり**、あなたが見る Web コンソール**でもある**——
だからチャットとダッシュボードは常に同じデバイス状態を共有します。

- 🔌 **実機**：[Intiface Central](https://intiface.com) 経由で Lovense、We-Vibe、Kiiroo、The Handy、Satisfyer など [750+ デバイス](https://iostindex.com) を駆動。
- 🎼 **Muse（作曲）モード**：モデルが**作曲**——vibe を言葉で（「10 分のタントラ的スローバーン」「雷雨」「モールスで I love you」）伝えると、滑らかな触覚スコアを書いて再生。ライブラリに保存して再生も。デバイスは AI が奏でる楽器に。
- 🎭 **ペルソナ**：**誰が支配するか**を選ぶ——SOTA モデルを原型にした駆動人格：🕯️ スローバーン(Opus)、😈 ブラット(GPT-5.5)、🎼 メトロノーム、⛈️ ストーム、🔮 オラクル、🍼 マミー。各々が手触り（ペース/ランダム性/焦らし/上限）を変えます。**ブラインドモード**は正体を隠す——謎の支配者。
- 💞 **デュエット**：2 つのコンソールをルームコードで内蔵リレー接続し、相手の入力がリアルタイムであなたのデバイスを駆動（ミラー/リード/フォロー）。在席表示と 👋 タッチ付き。
- ⚡ **反応型「パルスコア」UI**：強度で拡大・発光する呼吸するオーブとオーロラ、リアルタイム音声波形。
- 👑 **マスターリモート**：スマホ対応 `/master` で別の人がリアルタイムに操作を引き受け——大ダイヤル、長押しブザー、プリセット、緊急停止。各ページにマスター接続中を表示。
- 🎬 **動画モード**：[Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) タイムラインをリアルタイム再生（位置 `0..100` → 強度）。サンプル内蔵でワンクリック。
- 🎮 **ゲームモード**：`ルーレット`、`エスカレーション`、`アンビエント`、`エッジ`（焦らし）、`ホイール`（回して止まる）。`game_event` でテキストアドベンチャー中に反応。
- 🎵 **オーディオモード**：**マイク**または**タブ/システム音声**で強度をリアルタイム駆動。
- 🥁 **パターン**：`pulse`・`wave`・`escalate`・`tease`・`heartbeat`・`staircase`・`sos`・`earthquake`。
- 🧠 **メモリ**：好み・ペルソナ相性・「ソフトな苦手」サインを学ぶローカル記憶（`remember`/`recall`/`forget`）。使うほど「あなた仕様」に——そして外に出ません。
- 📜 **シーンプロンプト**：既成の誘導シーンを MCP プロンプトで——マミー、エッジ、ストーリー、vibe 作曲、アフターケア。
- 💬 **チャットブリッジ**：任意の **Telegram** ボット——いつも使うチャットからメッセージや絵文字で操作（遠距離に最適）。
- 🌐 **バイリンガル**：コンソールとリモートが**英語と中国語**、ワンタップ切替（`?lang=zh`）。
- 🛟 **安全機能内蔵**：全体上限、コマンド毎の自動停止、ウォッチドッグ、どこでも緊急停止、終了時にハード停止。

## インストール（Claude Code プラグイン）

```bash
# 1. このリポジトリをプラグインマーケットプレイスに追加
/plugin marketplace add mana-am/claude-f-me

# 2. プラグインをインストール
/plugin install claude-f-me@claude-f-me
```

その後、チャットで：

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
compose a 5-minute slow build that edges twice then releases
become the Brat persona
surprise me
```

コンソールは **http://localhost:8731**——`/claude-f-me:console` で開けます。

### スラッシュコマンド

| コマンド | 動作 |
|---|---|
| `/claude-f-me:console` | ブラウザでコンソールを開く |
| `/claude-f-me:demo` | スキャン→振動→パターン→ゲームの短いデモ |
| `/claude-f-me:fuck` | 開始（自動スキャンして盛り上げる） |
| `/claude-f-me:harder` / `:softer` | 強める / 弱める（±20%） |
| `/claude-f-me:edge` / `:tease` | 焦らしゲーム / 焦らしパターン |
| `/claude-f-me:muse` | vibe から触覚スコアを作曲 |
| `/claude-f-me:persona` | 誰が支配するか選ぶ（スローバーン / ブラット / …） |
| `/claude-f-me:surprise` | ランダムに 1 つ |
| `/claude-f-me:safeword` · `:panic` | **すべて即時停止** |

## 実機につなぐ

claude-f-me は実機優先。シミュレーターはプレビューです。

1. **[Intiface Central](https://intiface.com)** を起動 → **Start Server**（既定 `ws://127.0.0.1:12345`）。
2. Intiface でデバイスをペアリングして表示を確認。Lovense が入手しやすく対応も最良。
3. **`CFM_MODE=buttplug`** に設定（[`.mcp.json`](../../.mcp.json) の `env`、または単体実行時に環境変数）。

> プラグインは既定で `simulated`、すぐ動きます。Node 22+ はグローバル `WebSocket` を持ち、古い Node では `ws` で補完するので実機モードは Node 18+ で動作します。

### まだハードが無い？プレビューモード

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # http://localhost:8731 を開く
```

**Scan**、オーブをドラッグ、パターン/ゲーム、サンプル funscript 読み込み、**オーディオ**、**STOP**——シミュレーターのモーターが画面で反応。キー：`0–9` 強度、`スペース` 停止、`S` スキャン。

## 👑 マスターリモート

コンソールで **👑 Remote**（または `/master`）。スマホサイズの専用リモート——大ダイヤル、長押しブザー、パターン/ゲームのショートカット、安全上限、全幅の停止。持つ人は**マスター**として数えられ、各ページに `👑 N master in control` が表示。

**別端末**の人に渡すには、コンソールのポートをトンネルで公開（例 `cloudflared tunnel --url http://localhost:8731` や `ngrok http 8731`）し `/master` リンクを共有。

> 操作を渡すのは装着者が信頼し同意した相手のみ。安全上限と装着者自身の STOP が常に優先。

## モードと遊び

**🎼 Muse（作曲）**——モデルがブリーフを滑らかなキーフレーム（`{at, level}`、補間）にして再生。チャットの `compose` ツール、または外部モデルキー設定時はコンソールの**「describe a vibe」**から。ライブラリに保存し `muse_list` / `muse_play` で再生。

**🎭 ペルソナ**——ゲーム/イベントの手触り（ペース/ランダム/焦らし/上限）を変え、対応キーがあれば作曲モデルを選ぶ：🕯️ `slowburn`(Opus) · 😈 `brat`(GPT-5.5) · 🎼 `metronome` · ⛈️ `storm` · 🔮 `oracle` · 🍼 `mommy`。`set_persona blind` で `reveal_persona` まで隠す。

**💞 デュエット**——コンソールの **Duet** パネルでリレー URL + ルームコードを共有、内蔵 `/relay` で 2 台を接続。**ミラー**（相互）/**リード**（駆動）/**フォロー**（受信）と 👋 タッチ。受信強度もローカル安全上限を通過。

**🎬 動画（funscript）**——`{at,pos}` をリアルタイム再生（`loop`/`speed`/`invert`）、サンプルをワンクリック。

**🎮 ゲーム**——ルーレット · エスカレーション · アンビエント · エッジ（焦らし、ピーク上昇）· ホイール（回して止まる）。

**🥁 パターン**——pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake。

**🎵 オーディオ**——マイクやタブ音声の音量で強度を駆動、感度スライダー付き。

## 🧠 メモリ

任意のローカル記憶で claude-f-me が**あなたを覚える**。よく遊ぶゲームや Muse スコア、相性の良いペルソナ、**ソフトな苦手サイン**（始まって数秒で止めたもの）やメモを記録。Claude は作曲/強化前に `recall`、`forget` で全消去。

- ツール：`remember "heartbeat を 60% が好き"` · `recall` · `forget`
- 保存先 `~/.claude-f-me/memory.json`——**ローカルのみ・送信なし**、読める/消せる JSON。

## 📜 シーンプロンプト

誘導シーンは **MCP プロンプト**——Claude Code で `/mcp__claude-f-me__<名前>`：

| プロンプト | 内容 |
|---|---|
| `mommy-scene` | 🍼 マミーを演じつつ駆動 |
| `edge-session` | チェックイン付きの焦らし-お預け |
| `story-mode` | 選択がデバイスを駆動するテキストアドベンチャー |
| `compose-vibe` | 説明を Muse スコアにして再生 |
| `aftercare` | 優しいクールダウン |

## 💬 チャットブリッジ — Telegram

いつものチャットから操作——遠距離に最適。ボットトークンを設定すると自動起動：

```bash
# @BotFather のトークン。操作を許可する chat id を必ず allow-list に
export CFM_TELEGRAM_TOKEN=123456:ABC...
export CFM_TELEGRAM_ALLOW=11111111,22222222
```

ボットに送信：数字 `0–100`、`harder`/`softer`、`stop`/`safeword`、`scan`、または絵文字——🔥edge · 💓heartbeat · 🌊ambient · 🎡wheel · 📈escalation · 🎲surprise · 🛑stop。返信は中国語を自動判定。allow-list 未設定だと誰でも操作できるので**必ず設定**。安全上限と `safeword` が常に優先。

> **なぜ WeChat 非対応？** 個人 WeChat に公式ボット API は無く、非公式/グレーのプロトコルのみ（ToS 違反・凍結リスク）。[ロードマップ](#ロードマップ--アイデア)参照。

## MCP ツール

| ツール | 説明 |
|---|---|
| `list_devices` | デバイス、強度、電池、モード、上限、コンソール URL、現モード、マスター数 |
| `scan_devices` | `duration_ms` スキャンして一覧 |
| `vibrate` | `intensity` 0..1、`target` id/`all`、任意 `duration_ms`（自動停止） |
| `pattern` | `preset`(pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) か `steps`、`loops` |
| `stop` | デバイス/`all` 停止、パターン取消 |
| `emergency_stop` | **全**デバイス・モードを即停止 |
| `set_max_intensity` | 全体安全上限 0..1 |
| `load_funscript` · `play_video` | funscript 読込 + 再生（`loop`/`speed`/`invert`） |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel`（`intensity_max`、`duration_ms`） |
| `game_event` | 単発 `reward`/`penalty`/`tease`/`pulse`（物語用） |
| `compose` | `brief` から `keyframes`(`[{at,level}]`) を書いて再生；`save_as`、`loop` |
| `muse_list` · `muse_play` | ライブラリの一覧 / 再生 |
| `list_personas` · `set_persona` · `reveal_persona` | 駆動ペルソナ選択（`blind`）と公開 |
| `remember` · `recall` · `forget` | ローカル記憶：メモ/好み保存、プロフィール取得、消去 |
| `stop_mode` | 現在の 動画/ゲーム/muse モードを停止 |

加えて **MCP プロンプト**（`/mcp__claude-f-me__…`）：`mommy-scene`、`edge-session`、`story-mode`、`compose-vibe`、`aftercare`。

> オーディオ、マスターリモート、デュエットはコンソール常駐（マイク採取/手動操作にブラウザが必要）。Telegram ブリッジは背景で動作。他は Claude が上記ツールで駆動可能。

## 設定

| 環境変数 | 既定 | 意味 |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` か `buttplug` |
| `CFM_CONSOLE_PORT` | `8731` | コンソールのポート（`/master` も提供） |
| `CFM_MAX_INTENSITY` | `1.0` | 初期安全上限（0..1） |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | Intiface サーバー（buttplug 時） |
| `ANTHROPIC_API_KEY` / `CFM_LLM_API_KEY` | — | *任意*——「describe a vibe」を **Claude** が作曲 |
| `OPENAI_API_KEY`(+ `CFM_OPENAI_BASE_URL`) | — | *任意*——OpenAI 互換モデル（GPT ペルソナ等） |
| `CFM_TELEGRAM_TOKEN` | — | *任意*——Telegram ブリッジ有効化（@BotFather） |
| `CFM_TELEGRAM_ALLOW` | — | 操作を許可する chat id（カンマ区切り、必ず設定！） |

> モデルキーは**任意**。無くても Muse は動作（チャットで Claude に `compose`）、ペルソナもローカルで手触りを調整。キーがあるとペルソナの `model` が作曲者を決めます。キーは環境からのみ読み、保存しません。デュエットのリレーはキー不要。

## 開発

```bash
npm run dev          # MCP + コンソール、watch（tsx）
npm run build        # 型チェック + dist/ 出力（tsc）
npm run bundle       # 自己完結 dist/claude-f-me.mjs（esbuild、プラグイン用）
```

## 🛟 安全と同意

実在の身体に装着するハードです。設計は配慮していますが、**あなた**が最後の砦です：

- **全体強度上限**がすべてを制限（ツール / コンソール / マスターリモート）。
- すべての `vibrate` に**自動停止**。時間指定が無くても 5 分のハード上限、連続駆動にはウォッチドッグがあり供給が止まれば数秒で停止。
- `emergency_stop` / `/claude-f-me:safeword` / コンソールの赤ボタン / マスターの STOP で即時全停止。
- プロセス終了時にハードを停止。

必ず、知らされた・熱意ある・撤回可能な同意のもとで使用。使用データを記録/送信しないこと。使い方の責任はあなたに。

## ロードマップ / アイデア

- 🏆 **リーダーボード・実績・チャレンジ**：個人統計（セッション、合計時間、**最長エッジ保持**、最高連続）、解除可能な実績、**オプトインの匿名**コミュニティボード + デイリー/ウィークリー課題（「5 分のエッジを耐える」など）。遠距離カップルの連続記録。プライバシー優先：オプトインのみ、内容なし、匿名ハンドル。
- 🌍 **パブリック操作モード**：共有可能な公開ルーム（マスターリモートを多人数に開放）。観客や配信チャットが共同で駆動——投げ銭/投票で操作、ライブの群衆ダイヤル、順番待ち。強力なガードレール：低い強制上限、ホストの**キック/一時停止/ロック**、視聴者ごとのクールダウン、常時セーフワード、ワンタップ「プライベートへ」。同意とモデレーション最優先——公開は装着者がオプトインした証で、即時に撤回可能。
- 🧩 **スコア＆パターン共有**：Muse スコアや funscript を短いコードでエクスポート/インポート。
- 🗣️ **ペルソナの声**：任意の TTS でペルソナが実際にセリフを*話す*（🍼「いい子だね…」）。
- 🎮 **ゲーム＆配信連携**：ゲームや配信のイベント（死亡、勝利、投げ銭）に反応。
- 🐾 **ペットモード（エージェント出力速度）**：コーディングエージェント（**Codex** や Claude Code）を繋ぎ、その*ライブ出力速度*で強度を駆動：トークンが飛ぶ＝強く、停滞や赤いビルド＝下がる。生産性を報酬ループに。🧑‍💻 デベロッパートリガーを離散イベントから連続信号へ拡張。
- 🔐 **暗号化・PIN ロックのメモリ**：ローカルメモリとコンソールをコードでロック。
- 🧠 **メモリ → 行動**：今は記録 + `recall`。次はペルソナ/Muse 選択を自動で導き、苦手な組合せを回避。
- 💬 **チャットブリッジ追加**：**Discord**（公式ボット、次の自然な一手）、Slack；**WhatsApp** は Business API。**WeChat** は公式ボット API 無し（非公式/グレー、ToS 違反）で非対応；企業 WeChat は可能だが煩雑。
- 🖥️ **コンソールパネル**：メモリ、ペルソナ選択、Muse ライブラリ。
- 👩 **「ボスキー」秘匿モード**：誰か来たら一瞬で無音化 + 無害な画面に偽装（🍼 マミー*ペルソナ*とは別）。
- ⏰ **予約された焦らし**：「おはよう」シーンや時限サプライズ。
- 🎲 **グループプレイ**：複数人で 1 台を共同操作する部屋。
- 🗣️ **ボイスメモ → オーディオモード**：送られた音声メッセージで強度を駆動。

## ⭐ スター推移とコントリビューター

ニヤッとした（か、何かした）なら ⭐ を——本当に助かります。

[![Star History Chart](https://api.star-history.com/svg?repos=mana-am/claude-f-me&type=Date)](https://star-history.com/#mana-am/claude-f-me&Date)

[![Contributors](https://contrib.rocks/image?repo=mana-am/claude-f-me)](https://github.com/mana-am/claude-f-me/graphs/contributors)

> スター推移グラフとコントリビューターマップはリポジトリを**公開**にすると表示されます。

## クレジット

[Nonpolynomial](https://nonpolynomial.com) のオープンソース [Buttplug](https://github.com/buttplugio/buttplug) プロトコルと [Intiface](https://intiface.com) を基盤。提携関係はありません。

## ライセンス

[MIT](../../LICENSE) © SimonAKing
