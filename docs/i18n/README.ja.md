<div align="center">

# claude-f-me

**Claude Code で「会話」しながらインティメイトなハードウェアを操作。**

自然言語の会話を実機制御に変える [Claude Code](https://claude.com/claude-code) プラグイン。
オープンソースの [Buttplug / Intiface](https://buttplug.io) エコシステム（750+ 対応デバイス）を基盤に、
強度にリアルタイムで反応するバイリンガル Web コンソール、マスターリモート、そして
動画（funscript）・ゲーム・オーディオの各モードを備えています。
**内蔵シミュレーター**でハードウェア無しでも丸ごと体験できます。

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.zh-TW.md">繁體中文</a> · <b>日本語</b> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

<img src="../console.png" alt="claude-f-me コンソール" width="760" />

</div>

---

> [!IMPORTANT]
> これは**実在の人の身体に装着された物理デバイス**を制御します。装着者の**熱意ある継続的な同意**の
> もとでのみ使用してください。安全上限を妥当に保ち、短い時間を優先し、緊急停止を手の届く所に。
> 詳しくは [安全と同意](#-安全と同意) を参照。

## これは何か

1 つのプロセスが Claude が話す MCP サーバー**であり**、あなたが見る Web コンソール**でもある**——
だからチャットとダッシュボードは常に同じデバイス状態を共有します。

- 🔌 **実機**：[Intiface Central](https://intiface.com) 経由で Lovense、We-Vibe、Kiiroo、The Handy、
  Satisfyer など [750+ デバイス](https://iostindex.com) を駆動。
- ⚡ **「パルスコア」反応型 UI**：強度に応じて拡大・発光する呼吸するエナジーオーブとオーロラ背景、加えてリアルタイム音声波形。
- 👑 **マスターリモート**：スマホ対応の `/master` ページで別の人がリアルタイムに操作を引き受けられる——大きなダイヤル、長押しブザー、プリセット、緊急停止。各ページにマスター接続中が表示されます。
- 🎬 **動画モード**：[Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) のタイムラインをリアルタイム再生（位置 `0..100` → 強度）。サンプル内蔵でワンクリック試用。
- 🎮 **ゲームモード**：`ルーレット`、`エスカレーション`、`アンビエント`、`エッジ`（焦らし）、`ホイール`（回して止まる）。`game_event` フックでテキストアドベンチャー中に Claude が反応。
- 🎵 **オーディオモード**：**マイク**または**タブ/システム音声**で強度をリアルタイム駆動。
- 🥁 **パターン**：`pulse`・`wave`・`escalate`・`tease`・`heartbeat`・`staircase`・`sos`・`earthquake`。
- 🌐 **バイリンガル**：コンソールとリモートが**英語と中国語**対応、ワンタップ切替（`?lang=zh` も可）。
- 🛟 **安全機能内蔵**：全体強度上限、コマンド毎の自動停止、ウォッチドッグ、どこでも緊急停止、終了時にハード停止。

## インストール（Claude Code プラグインとして）

```bash
# 1. このリポジトリをプラグインマーケットプレイスとして追加
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
| `/claude-f-me:surprise` | ランダムに 1 つ |
| `/claude-f-me:safeword` · `:panic` | **すべて即時停止** |

## 実機につなぐ

claude-f-me は実機優先。シミュレーターはプレビューです。

1. **[Intiface Central](https://intiface.com)** をインストールして起動 → **Start Server**（既定 `ws://127.0.0.1:12345`）。
2. Intiface でデバイスをペアリングして表示を確認。Lovense が入手しやすく対応も最良。
3. **`CFM_MODE=buttplug`** に設定（[`.mcp.json`](../../.mcp.json) の `env` を編集、または単体実行時に環境変数を設定）。

> プラグインは既定で `simulated`、すぐ動きます。Node 22+ はグローバル `WebSocket` を持ち、古い Node では `ws` で補完するので実機モードは Node 18+ で動作します。

### まだハードが無い？プレビューモード

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # http://localhost:8731 を開く
```

**Scan**、オーブをドラッグ、パターン/ゲーム、サンプル funscript 読み込み、**オーディオ**、**STOP**——シミュレーターのモーターが画面で反応します。キー：`0–9` 強度、`スペース` 停止、`S` スキャン。

## 👑 マスターリモート

コンソールで **👑 Remote**（または `/master`）。スマホサイズの専用リモート——大ダイヤル、長押しブザー、パターン/ゲームのショートカット、安全上限、全幅の停止。持っている人は**マスター**として数えられ、各ページに `👑 N master in control` が表示されます。

**別の端末**の人に渡すには、コンソールのポートをトンネルで公開（例 `cloudflared tunnel --url http://localhost:8731` や `ngrok http 8731`）し `/master` リンクを共有。

> 操作を渡すのは装着者が信頼し同意した相手のみ。安全上限と装着者自身の STOP が常に優先します。

## モードと遊び

- **🎬 動画**：funscript をリアルタイム再生（`loop`/`speed`/`invert`）、サンプルをワンクリック。
- **🎮 ゲーム**：ルーレット · エスカレーション · アンビエント · エッジ（焦らし、ピークが毎回上昇）· ホイール（回して止まる）。
- **🥁 パターン**：pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake。
- **🎵 オーディオ**：マイクやタブ音声の音量で強度を駆動、感度スライダー付き。

## 🛟 安全と同意

実在の身体に装着するハードです。設計は配慮していますが、**あなた**が最後の砦です：

- **全体強度上限**がすべてを制限（ツール / コンソールのスライダー / マスターリモート）。
- すべての `vibrate` に**自動停止**。時間指定が無くても 5 分のハード上限、連続駆動にはウォッチドッグがあり、供給が止まれば数秒で停止。
- `emergency_stop` / `/claude-f-me:safeword` / コンソールの赤ボタン / マスターの STOP で即時全停止。
- プロセス終了時にハードを停止。

必ず、知らされた・熱意ある・撤回可能な同意のもとで使用してください。使用データを記録・送信しないこと。使い方の責任はあなたにあります。

## クレジット

[Nonpolynomial](https://nonpolynomial.com) のオープンソース [Buttplug](https://github.com/buttplugio/buttplug) プロトコルと [Intiface](https://intiface.com) を基盤としています。提携関係はありません。

## ライセンス

[MIT](../../LICENSE) © SimonAKing
