<div align="center">

# claude-f-me

**在 Claude Code 裡用「聊天」控制情趣硬體。**

一個可安裝的 [Claude Code](https://claude.com/claude-code) 外掛，把自然語言對話變成真實裝置控制——
底層是開源的 [Buttplug / Intiface](https://buttplug.io) 生態（支援 750+ 款裝置），配一個會隨強度
即時反應的雙語 Web 主控台、主人遙控頁，以及 Muse 作曲、人格、雙人、影片、遊戲、音訊等模式。
內建**模擬裝置**，**零硬體**也能完整體驗。

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <b>繁體中文</b> · <a href="README.ja.md">日本語</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a></p>

<img src="../pulse-core.gif" alt="claude-f-me Pulse Core 主控台即時反應" width="640" />

<br/>

<video src="https://github.com/mana-am/claude-f-me/raw/main/docs/promo-zh.mp4" controls muted playsinline width="300"></video>

<sub>▶️ <b>功能速覽</b> — 所有玩法一次看完（約 25 秒）· <a href="https://github.com/mana-am/claude-f-me/raw/main/docs/promo-zh.mp4">開啟影片</a></sub>

<p><b><a href="https://pages.mana.am/">▶ 在瀏覽器裡試玩即時主控台</a></b> — 真實介面、完整可玩、模擬（無硬體）。<sub>由 main 經 GitHub Pages 發布；Pages 啟用後即可存取。</sub></p>

</div>

---

> [!IMPORTANT]
> 這控制的是**真人身上的實體裝置**。務必在配戴者**熱情、持續同意**的前提下使用。把安全上限設得
> 合理、優先用短時長、把緊急停止放在隨手可及處。詳見 [安全與同意](#-安全與同意)。

<details>
<summary><b>📑 目錄</b></summary>

- [它是什麼](#它是什麼)
- [安裝（作為 Claude Code 外掛）](#安裝作為-claude-code-外掛) · [Slash 指令](#slash-指令)
- [🚀 快速上手 — 一步步來](#-快速上手--一步步來)
- [接入真實裝置](#接入真實裝置)
- [👑 主人遙控](#-主人遙控)
- [模式與玩法](#模式與玩法) — Muse · 人格 · 雙人 · 影片 · 遊戲 · 節奏 · 音訊 · 生物回饋 · 錄製
- [📈 市值模式](#-市值模式)
- [🧠 記憶](#-記憶) · [📜 場景提示詞](#-場景提示詞)
- [💬 聊天橋接](#-聊天橋接--telegram) — Telegram · Discord · 微信
- [🧑‍💻 開發者觸發](#-開發者觸發) · [🔌 通用事件 webhook](#-通用事件-webhook)
- [MCP 工具](#mcp-工具) · [設定](#設定) · [開發](#開發)
- [⏱️ 尊重模型與 agent 的速率限制](#️-尊重模型與-agent-的速率限制)
- [🩹 疑難排解](#-疑難排解) · [❓ 常見問題](#-常見問題)
- [🔒 隱私](#-隱私) · [🛟 安全與同意](#-安全與同意)
- [路線圖 / 想法](#路線圖--想法) · [致謝](#致謝) · [授權](#授權)

</details>

## 截圖

🎥 **看主控台即時反應**（或[**在瀏覽器裡試玩 →**](https://pages.mana.am/)）：

<video src="https://github.com/mana-am/claude-f-me/raw/main/docs/pulse-core.mp4" width="640" controls></video>

<sub>影片若無法內嵌播放，[點此開啟](../pulse-core.mp4)，或看頂部的循環預覽。</sub>

| 主控台（英文） | 主控台（中文） | 主人遙控 | 瀏覽器內 demo |
|---|---|---|---|
| <img src="../console.png" width="230" /> | <img src="../console.zh.png" width="230" /> | <img src="../master.png" width="110" /> | <img src="../demo-browser.png" width="230" /> |

## ▶️ 用 Claude Code、Codex 或任意 MCP 用戶端使用

claude-f-me 是標準的 **MCP 服務**——可從 **Claude Code、Codex、Cursor、Cline、Claude Desktop** 或任何支援 MCP 的工具驅動。**無需硬體**，內建模擬器跑完整體驗（位址 **http://localhost:8731**）。現成配置見 [`examples/`](./examples)。

**🟣 Claude Code** —— 作為外掛一鍵安裝（含 slash 指令）：

```bash
/plugin marketplace add mana-am/claude-f-me
/plugin install claude-f-me@claude-f-me
```

**🟢 Codex / Cursor / Cline / Claude Desktop / …** —— 讓用戶端指向本服務，最簡單用 `npx`（Node ≥ 18，無需 clone）：

```jsonc
// "mcpServers" 條目（Claude Desktop / Cursor / Cline / Windsurf）—— 見 examples/mcp.json
"claude-f-me": {
  "command": "npx",
  "args": ["-y", "github:mana-am/claude-f-me"],
  "env": { "CFM_MODE": "simulated" }
}
```

Codex 用 TOML —— 把 [`examples/codex-config.toml`](./examples/codex-config.toml) 放進 `~/.codex/config.toml`。各用戶端對照表見 [`examples/`](./examples)。

然後到處都照樣對話——`掃描裝置` · `開始 edge 遊戲` · `作一段慢曲`——或在 Claude Code 裡用 slash 指令 `/claude-f-me:fuck`、`:edge`、`:morse`、`:safeword`。

> ➡️ 接真機、主人遙控等見 [快速上手](#-快速上手--一步步來)。

## 它是什麼

一個行程**同時**是 Claude 對話用的 MCP 服務，**和**你盯著看的 Web 主控台——所以聊天和面板始終
共享同一份裝置狀態。

**🎛️ 驅動裝置**
- 🎼 **Muse 作曲**——描述一個 vibe（「一場雷暴」、「用摩斯電碼說我愛你」），模型作出平滑觸感曲線並播放；可存、可重播。
- 🥁 **節奏**——`脈衝` · `波浪` · `遞增` · `挑逗` · `心跳` · `樓梯` · `SOS` · `地震`。
- 🎮 **遊戲**——`輪盤` · `遞增` · `環境` · `邊緣`（挑逗-拒絕）· `轉盤`，外加 `game_event` 鉤子供文字冒險用。
- 🎵 **音訊**——用**麥克風**或**分頁/系統聲音**即時驅動強度。

**🎭 由誰掌控**
- 🎭 **人格**——選誰來開車（🕯️ 慢燉/Opus · 😈 小惡魔/GPT-5.5 · 🎼 節拍器 · ⛈️ 風暴 · 🔮 神諭 · 🍼 媽咪），各自改變手感，**盲選模式**藏起是誰。
- 👑 **主人遙控**——把 `/master` 頁面交給別人即時接管（旋鈕、按住震動、預設、急停）。
- 💞 **雙人**——兩台主控台經中繼連起來，伴侶即時驅動你的裝置（鏡像/主導/跟隨），帶 👋 觸碰。

**🌍 真實世界輸入**
- 🎬 **影片**——播放 [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript)，或本機影片+腳本完美同步。
- 📈 **市值**——報上代碼（`特斯拉`、`比特幣`），把即時漲跌變成震動旋律。*(非投資建議。)*
- 💓 **生物回饋**——藍牙心率帶驅動強度，或**自動邊緣**：心率衝過臨界就斷電。
- 🔌 **事件 webhook**——`POST /event`，接 Stream Deck、IFTTT、Home Assistant、遊戲 overlay、CV 腳本…
- 🧑‍💻 **開發者觸發**——commit、CI 通過、合併或 🍅 番茄鐘都能經 `/dev` 讓它響。
- 💬 **聊天橋接**——用訊息或 emoji 從 **Telegram**、**Discord**、**微信公眾號**控制。

**🎨 個性化**
- ⚡ **Pulse Core 介面**——呼吸的能量球 + 極光隨強度脈動，外加即時音波——不是無聊面板。
- 🧠 **記憶**——僅本機；學習你的偏好、人格親和度與軟不喜歡（`remember`/`recall`/`forget`），絕不外傳。
- 🎬 **工作階段錄製**——把裝置做過的一切（手動/雙人/音訊/生物/遊戲）錄成可重播的 Muse 曲子。
- 📜 **場景提示詞**——引導場景做成 MCP prompts（媽咪、邊緣、劇情、作曲、事後溫存）。
- 🌐 **雙語**——主控台與遙控頁支援**中英文**（`?lang=zh`）。

**🔌 硬體與安全**
- 🔌 **真實硬體**——經 [Intiface](https://intiface.com) 驅動 Lovense、We-Vibe、Kiiroo、The Handy、Satisfyer 等 [750+ 款裝置](https://iostindex.com)。
- 🛟 **內建安全**——全域上限、每條指令自動急停、看門狗、隨處可急停、退出即關停。

## 安裝（作為 Claude Code 外掛）

```bash
# 1. 把本倉庫加入為外掛市集
/plugin marketplace add mana-am/claude-f-me

# 2. 安裝外掛
/plugin install claude-f-me@claude-f-me
```

裝完即可在對話裡說：

```
掃描裝置
以 40% 震動 3 秒
跑一遍 heartbeat 節奏
開始 edge 遊戲
作一段 5 分鐘、先 edge 兩次再釋放的曲子
切換成小惡魔人格
給我個驚喜
```

主控台位址 **http://localhost:8731**——用 `/claude-f-me:console` 開啟。

### Slash 指令

| 指令 | 作用 |
|---|---|
| `/claude-f-me:console` | 在瀏覽器開啟主控台 |
| `/claude-f-me:demo` | 跑一段「掃描→震動→節奏→遊戲」示範 |
| `/claude-f-me:fuck` | 開始（自動掃描，然後逐漸升強） |
| `/claude-f-me:harder` / `:softer` | 增強 / 減弱（±20%） |
| `/claude-f-me:edge` / `:tease` | 邊緣控制 / 挑逗節奏 |
| `/claude-f-me:roulette` 🎰 | 隨機間隔的隨機突發——永遠猜不到下一下 |
| `/claude-f-me:wheel` 🎡 | 旋轉各檔位後隨機停留保持 |
| `/claude-f-me:dice` 🎲 | 擲骰子領隨機 dare（強度/時長/模式） |
| `/claude-f-me:countdown` ⏳ | 帶倒數的邊緣控制，數到 0 才釋放（或拒絕） |
| `/claude-f-me:muse` | 從一個 vibe 作一段自訂觸感曲子 |
| `/claude-f-me:morse` 💌 | 把一句悄悄話用摩斯電碼震動「說」出來 |
| `/claude-f-me:market` 📈 | 把股票/加密的即時漲跌變成震動 |
| `/claude-f-me:story` 📖 | 互動文字冒險，你的選擇驅動裝置 |
| `/claude-f-me:persona` | 選擇由誰掌控（慢燉 / 小惡魔 / …） |
| `/claude-f-me:blind` 🎭 | 把控制權隨機交給一個隱藏人格——神秘掌控者 |
| `/claude-f-me:surprise` | 隨機來一個 |
| `/claude-f-me:aftercare` 🛁 | 溫柔漸弱的事後收尾 |
| `/claude-f-me:safeword` · `:panic` | **立即全部停止** |

## 🚀 快速上手 — 一步步來

### 0. 前置條件
- **[Claude Code](https://claude.com/claude-code)**（作為外掛用）——或僅 **Node ≥ 18**（只跑獨立主控台）。
- 一個**瀏覽器**（推薦 Chrome/Edge；麥克風和心率功能需要現代瀏覽器）。
- **硬體可選**——內建**模擬器**不插任何東西就能跑完整體驗。

### 1. 安裝
**A）作為 Claude Code 外掛（推薦）**
```bash
/plugin marketplace add mana-am/claude-f-me
/plugin install claude-f-me@claude-f-me
```
MCP 服務是自包含 bundle——無需 `node_modules`、無需建置。（倉庫私有？確認你的 GitHub 帳號有存取權限，或用下面的原始碼方式。）

**B）獨立 / 原始碼執行**
```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me
npm install
npm run build
npm run console                                   # 只開主控台，不需要 Claude
# …或手動把建置好的服務註冊進 Claude Code：
claude mcp add claude-f-me -- node "$(pwd)/dist/index.js"
```

### 2. 首次執行（零硬體）
1. 開啟主控台 **http://localhost:8731**（或執行 `/claude-f-me:console`）。
2. 點 **Scan** → 出現兩台**模擬**裝置。
3. 拖能量球/滑桿，看它發光脈動。試個**節奏**（心跳、邊緣…）和**遊戲**。
4. 隨時按紅色 **STOP**（或按 `空白鍵`）。鍵盤：`0–9` 設強度、`S` 掃描。

### 3. 用 Claude 驅動它
在 Claude Code 對話裡直接說：
```
掃描裝置
以 30% 震動 5 秒
跑一遍 heartbeat 節奏
開始 edge 遊戲，一分鐘後停
切換成媽咪人格，作一段溫柔的 3 分鐘漸強
```
…或用 slash 指令：`/claude-f-me:fuck`、`:edge`、`:harder`、`:softer`、`:surprise`、`:safeword`。

### 4. 接入真實裝置（可選）
裝 Intiface、配對玩具、設 `CFM_MODE=buttplug`——完整步驟見下一節。

### 5. 進階（全部可選）
- 👑 **把遙控交給別人**——開啟 `/master`（或 👑 遙控 按鈕），透過隧道分享。
- 💬 **從聊天控制**——設 `CFM_TELEGRAM_TOKEN` / `CFM_DISCORD_TOKEN`（見 [聊天橋接](#-聊天橋接--telegram)）。
- 🎼 **讓模型作曲（Muse）**——設 `ANTHROPIC_API_KEY`，但先讀 [速率禮儀](#️-尊重模型與-agent-的速率限制)。

## 接入真實裝置

claude-f-me 以真機為先，模擬器只是預覽。

1. 安裝並開啟 **[Intiface Central](https://intiface.com)** → 點 **Start Server**（預設 `ws://127.0.0.1:12345`）。
2. 在 Intiface 裡配對裝置並確認出現。Lovense 最好買、支援最好。
3. 把 **`CFM_MODE` 設為 `buttplug`**（編輯 [`.mcp.json`](../../.mcp.json) 的 `env`，或獨立執行時匯出環境變數）。

> 外掛預設 `simulated`，開箱即跑。Node 22+ 自帶全域 `WebSocket`；更舊的 Node 用 `ws` 墊底，所以真機模式在 Node 18+ 都能用。

### 還沒有硬體？預覽模式

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # 開啟 http://localhost:8731
```

點 **Scan**、拖能量球、放節奏/遊戲、載入範例腳本、開 **音訊**、按 **STOP**——模擬馬達會在螢幕上即時反應。鍵盤：`0–9` 設強度、`空白鍵` 停止、`S` 掃描。

## 👑 主人遙控

開啟主控台點 **👑 遙控**（或造訪 `/master`）。一個手機大小的專注遙控——大旋鈕、按住震動、節奏/遊戲快捷鍵、安全上限、全寬停止鍵。持有者會被計為**主人**，每個頁面都會顯示 `👑 N 位主人在控制`。

要給**不在同一台機器**的人用，把主控台連接埠透過隧道暴露（如 `cloudflared tunnel --url http://localhost:8731` 或 `ngrok http 8731`），分享 `/master` 連結即可。隧道是 HTTPS，`wss://` 會自動生效。

> 只把控制權交給配戴者信任並同意的人。安全上限和配戴者自己的 STOP 永遠優先。

## 模式與玩法

**🎼 Muse（作曲）**——模型把一句自然語言 brief 變成平滑的關鍵影格曲線（`{at, level}`，內插）並播放。可在對話裡用 `compose` 工具作曲，或在配了外部模型 key 時用主控台的**「描述一個 vibe」**框。曲子可存進曲庫（含內建），用 `muse_list` / `muse_play` 重播。

**🎭 人格**——一種驅動性格，調制每個遊戲/事件（節奏/混亂/拒絕/上限），並在有對應 key 時決定由哪個模型作曲：🕯️ `slowburn`(Opus) · 😈 `brat`(GPT-5.5) · 🎼 `metronome` · ⛈️ `storm` · 🔮 `oracle` · 🍼 `mommy`。`set_persona blind` 藏起選擇直到 `reveal_persona`。

**💞 雙人**——開啟主控台 **Duet** 面板，分享中繼 URL + 房間碼，兩台主控台透過內建 `/relay` 中繼連起來。選 **鏡像**（互相感受）、**主導**（你來驅動）或 **跟隨**（你來接收）；可發 👋 觸碰。收到的強度仍過你本機安全上限。

**🎬 影片（funscript）**——即時播放 `{at,pos}` 時間軸（`循環`/`速度`/`反向`），可一鍵載入範例。或在 **🎬 腳本** 彈窗裡貼上/載入腳本，選一個**本機影片檔**點 **▶ 配影片播放**——瀏覽器播影片、按 `video.currentTime` 驅動裝置，暫停/拖動/倍速都完美同步（不上傳，全本機）。

**🎮 遊戲**——輪盤（隨機突發）· 遞增（爬升保持）· 環境（有機波動）· 邊緣（爬到邊緣後拒絕，峰值逐輪升高）· 轉盤（旋轉後停留）。

**🥁 節奏**——脈衝 · 波浪 · 遞增 · 挑逗 · 心跳 · 樓梯 · SOS · 地震。

**🎵 音訊**——麥克風或分頁聲音按響度驅動強度，帶靈敏度滑桿。

**💓 生物回饋（心率）**——點主控台 **💓 心率** 配對標準藍牙心率帶/手錶（Web Bluetooth，需 Chrome/Edge 且在 `localhost` 或 HTTPS 下）。範圍自動校準後，**跟隨**把心率對應成強度，**自動邊緣**則在心率衝過臨界時斷電、平復後再續。真閉環。

**🎬 工作階段錄製**——點 **⏺ 錄製** 把裝置實際發生的一切（任意驅動來源——滑桿、雙人、音訊、生物回饋、遊戲）錄成一條 Muse 曲子；停止時命名即存進曲庫，可重播/分享。（不足約 1 秒的錄製會被丟棄。）

## 📈 市值模式

感受市場。報上公司名或代碼，它拉取即時行情（Yahoo Finance → Stooq → Coinbase 退回，無需 key），把當日漲跌變成震動旋律：波動幅度決定強度，綠漲播**上行**琶音、紅跌播**下行**。

- 對話裡：`market_mode`，`symbol`（`特斯拉`/`AAPL`/`比特幣`/`BTC-USD`），可選 `interval_ms`(≥5000)、`duration_ms`、`intensity_max`。`stop_mode` / `emergency_stop` 結束。
- 主控台：在 **📈 市值** 框輸代碼，點 **感受它**。
- 常見名字（蘋果/特斯拉/輝達/比特幣…）自動解析成代碼。

> 在你本機輪詢、過安全上限、最快 5 秒一次。非投資建議。

## 💓🎬🧑‍💻 身體、錄製與開發者觸發

**生物回饋**和**工作階段錄製**都活在主控台（見上）——兩者都需要瀏覽器（藍牙、擷取）。**開發者觸發**透過一個小小的本機端點從你的開發流驅動裝置——見 [開發者觸發](#-開發者觸發)。

## 🧠 記憶

可選的本機記憶，讓 claude-f-me **越來越懂你**。它記錄你常玩的遊戲和 Muse 曲子、和哪個人格合拍、以及**軟不喜歡訊號**（剛開始幾秒就被停掉的），還有你寫的筆記。Claude 可在作曲或升強前 `recall`，`forget` 一鍵清空。

- 工具：`remember "喜歡 60% 的心跳"` · `recall` · `forget`
- 存於 `~/.claude-f-me/memory.json`——**僅本機、絕不外傳**，就是一份你能讀能刪的 JSON。

## 📜 場景提示詞

引導場景做成 **MCP prompts**——在 Claude Code 裡用 `/mcp__claude-f-me__<名字>` 觸發：

| prompt | 設定 |
|---|---|
| `mommy-scene` | 扮演 🍼 媽咪人格同時驅動裝置 |
| `edge-session` | 帶中途確認的結構化挑逗-拒絕 |
| `story-mode` | 選擇驅動裝置的互動文字冒險 |
| `compose-vibe` | 把一段描述變成 Muse 曲子並播放 |
| `aftercare` | 溫柔舒緩的事後收尾 |

## 💬 聊天橋接 — Telegram

在你天天用的聊天軟體裡控制——異地伴侶絕配。配好 bot token 即自動啟動：

```bash
# token 來自 @BotFather；強烈建議用 allow-list 限定可控制的 chat id
export CFM_TELEGRAM_TOKEN=123456:ABC...
export CFM_TELEGRAM_ALLOW=11111111,22222222
```

然後給 bot 發訊息：數字 `0–100`、`harder`/`softer`、`stop`/`safeword`、`scan`，或 emoji——🔥邊緣 · 💓心跳 · 🌊環境 · 🎡轉盤 · 📈遞增 · 🎲隨機 · 🛑停止。回覆中英自動識別。不設 allow-list 的話，任何找到 bot 的人都能控制，所以**一定要設**。安全上限和 `safeword` 永遠優先。

## 💬 聊天橋接 — Discord

一個 Discord 機器人（極簡 Gateway 用戶端，不依賴 discord.js）——私訊它或在頻道裡用。

```bash
# token 來自 開發者入口 → Bot（開啟 "Message Content Intent"）
export CFM_DISCORD_TOKEN=...
export CFM_DISCORD_ALLOW=<你的使用者id>,<頻道id>   # allow-list，務必設定！
```

詞彙和 Telegram 一致：`0–100`、`harder`/`softer`、`stop`/`safeword`、`scan`，或 🔥💓🌊🎡📈🎲。無關訊息保持沉默，忽略自己/其他機器人的訊息。

## 💬 聊天橋接 — 微信（公眾號）

用**合規的方式**從微信雙向控制——走官方**公眾號**訊息回呼。我們刻意不碰個人微信網頁協定（itchat/wechaty 那類）：違反微信 ToS、易封號。

```bash
export CFM_WECHAT_TOKEN=你在公眾號後台設的Token
export CFM_WECHAT_ALLOW=openid1,openid2   # 可選：按 OpenID 限定誰能控制
```

然後在**公眾號後台 → 設定與開發 → 基本設定 → 伺服器設定**把 URL 填成 `https://<你的公網網域>/wechat`（本機執行，需 frp/cloudflared 之類隧道）。端點會處理 GET 簽章握手並被動回覆文字/emoji（`0–100`、`harder`/`softer`、`stop`、`掃描`、🔥💓🌊🎡📈🎲）；語音訊息回一段心跳。

> **個人微信**仍無官方機器人 API——別用灰產協定。只發通知/團隊告警用**企業微信群機器人 webhook** 更簡單，但收不到回覆；要雙向控制就走上面的公眾號路線。

## 🧑‍💻 開發者觸發

從開發流驅動裝置——本機 `/dev` 端點，git hook、CI 步驟、番茄鐘或 shell 別名都能打。事件→反應（仍過安全上限）：`commit`/`push`→脈衝 · `ci_pass`/`merge`/`focus_done`→獎勵 🎉 · `ci_fail`→SOS · `distracted`→停止。連接埠非僅本機時設 `CFM_DEV_SECRET` 要求 `secret=`。

```bash
curl -fsS localhost:8731/dev -d event=ci_pass
# git: .git/hooks/post-commit （chmod +x）
curl -fsS localhost:8731/dev -d 'event=commit&magnitude=0.5' >/dev/null 2>&1 || true
```

主控台還內建 **🍅 專注 25 分鐘** 番茄鐘，計時完成觸發 `focus_done`（獎勵）。

## 🔌 通用事件 webhook

一個任何東西都能戳的端點——把 Stream Deck 按鈕、IFTTT / Home Assistant 自動化、Tasker、遊戲 overlay 或 CV 腳本指向 `POST /event`：

```bash
curl -fsS localhost:8731/event -d 'action=vibrate&intensity=0.6&duration_ms=3000'
curl -fsS localhost:8731/event -d 'action=pattern&name=heartbeat'
curl -fsS localhost:8731/event -d 'action=game&type=edge'
curl -fsS localhost:8731/event -d 'action=event&kind=reward&magnitude=0.8'
curl -fsS localhost:8731/event -d 'action=stop'
```

動作：`vibrate`(`intensity`/`duration_ms`) · `pattern`(`name`/`loops`) · `game`(`type`) · `event`(`kind`=reward/penalty/tease/pulse, `magnitude`) · `stop` · `scan`。可選密鑰 `CFM_EVENT_SECRET`（退回到 `CFM_DEV_SECRET`）。一切仍過安全上限。

## MCP 工具

| 工具 | 說明 |
|---|---|
| `list_devices` | 裝置、強度、電量、模式、上限、主控台 URL、活動模式、主人數 |
| `scan_devices` | 掃描 `duration_ms` 後返回清單 |
| `vibrate` | `intensity` 0..1，`target` id/`all`，可選 `duration_ms`（自動停） |
| `pattern` | `preset`(pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) 或 `steps`、`loops` |
| `stop` | 停止某裝置/`all`，取消其節奏 |
| `emergency_stop` | 立即停止**所有**裝置與模式 |
| `set_max_intensity` | 全域安全上限 0..1 |
| `load_funscript` · `play_video` | 載入 + 播放 funscript（`loop`/`speed`/`invert`） |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel`（`intensity_max`、`duration_ms`） |
| `market_mode` | 用即時股票/加密行情驅動（`symbol`、`interval_ms`、`duration_ms`、`intensity_max`） |
| `game_event` | 一次性 `reward`/`penalty`/`tease`/`pulse`，給劇情用 |
| `compose` | 你寫 `keyframes`(`[{at,level}]`) 配 `brief` 並播放；可 `save_as`、`loop` |
| `muse_list` · `muse_play` | 列出 / 重播 曲庫 |
| `list_personas` · `set_persona` · `reveal_persona` | 選驅動人格（或 `blind`）並揭曉 |
| `remember` · `recall` · `forget` | 本機記憶：存筆記/偏好、調出畫像、清空 |
| `stop_mode` | 停止當前 影片/遊戲/muse 模式 |

另有 **MCP prompts**（`/mcp__claude-f-me__…`）：`mommy-scene`、`edge-session`、`story-mode`、`compose-vibe`、`aftercare`。

> 音訊、生物回饋、工作階段錄製、主人遙控、雙人都活在主控台（需瀏覽器採麥克風/藍牙/手動操作）；Telegram 橋、微信 `/wechat` 回呼、`/dev` 開發者端點跑在伺服端；其餘都能被 Claude 透過上面的工具驅動。

## 設定

| 環境變數 | 預設 | 含義 |
|---|---|---|
| `CFM_MODE` | `simulated` | `simulated` 或 `buttplug` |
| `CFM_CONSOLE_PORT` | `8731` | 主控台連接埠（也供 `/master`） |
| `CFM_MAX_INTENSITY` | `1.0` | 初始安全上限（0..1） |
| `CFM_INTIFACE_URL` | `ws://127.0.0.1:12345` | Intiface 服務（buttplug 模式） |
| `ANTHROPIC_API_KEY` / `CFM_LLM_API_KEY` | — | *可選*——讓主控台「描述 vibe」框由 **Claude** 作曲 |
| `OPENAI_API_KEY`(+ `CFM_OPENAI_BASE_URL`) | — | *可選*——同上，走 OpenAI 相容模型（如 GPT 人格） |
| `CFM_TELEGRAM_TOKEN` | — | *可選*——啟用 Telegram 橋（@BotFather 拿 token） |
| `CFM_TELEGRAM_ALLOW` | — | 允許控制的 chat id（逗號分隔，務必設定！） |
| `CFM_DISCORD_TOKEN` | — | *可選*——啟用 Discord 橋（開啟 Message Content Intent） |
| `CFM_DISCORD_ALLOW` | — | 允許控制的 使用者/頻道 id（逗號分隔，務必設定！） |
| `CFM_WECHAT_TOKEN` | — | *可選*——啟用微信公眾號端點 `/wechat`（公眾號後台拿 token） |
| `CFM_WECHAT_ALLOW` | — | 允許控制的 OpenID（逗號分隔） |
| `CFM_DEV_SECRET` | — | *可選*——給 `/dev` 開發者端點要求 `secret=` |
| `CFM_EVENT_SECRET` | — | *可選*——給 `/event` webhook 要求 `secret=`（退回到 `CFM_DEV_SECRET`） |

> 模型 key **可選**。沒有它 Muse 照樣能用——在對話裡讓 Claude `compose` 即可，人格也仍在本機調制手感。有 key 時，人格的 `model` 決定由誰作曲（這就是「🕯️ Opus」對「😈 GPT-5.5」的具體含義）。key 只從環境讀取、絕不落盤；雙人中繼無需 key。

## 開發

```bash
npm run dev          # MCP + 主控台，watch（tsx）
npm run build        # 型別檢查 + 產出 dist/（tsc）
npm run bundle       # 自包含 dist/claude-f-me.mjs（esbuild，給外掛用）
```

## ⏱️ 尊重模型與 agent 的速率限制

任何會用到 **Claude / Codex / OpenAI** 的地方，都被設計成你**每週/每日額度**的文明公民——絕不放縱：

- **Muse 作曲只在你主動觸發時進行**——絕不輪詢、不循環。兩次作曲間強制最小間隔，遇 HTTP **429** 退避一次（尊重 `Retry-After`）後乾淨報錯提示「稍等」，絕不猛敲 API。
- **寵物模式（路線圖）按設計零額度**：它讀程式 agent 的*本機輸出流*（tokens/秒）來定強度——**不會**呼叫任何模型 API。
- **開發者觸發與 webhook** 只對*你*發的事件做反應，不產生任何模型流量。
- 自帶的 key 從環境讀取、只在你顯式作曲時用、**絕不落盤**。沒 key 時，Muse 就讓你正在聊的 Claude 來作。

> 一句話：claude-f-me 永遠不該是你撞上模型上限的原因。一旦接近，它會退避並告訴你——絕不反覆重試。

## 🩹 疑難排解

- **主控台打不開 /「連接埠被占用」**：另一個實例占著 `8731`——停掉它（`lsof -ti tcp:8731 | xargs kill`）或把 `CFM_CONSOLE_PORT` 設到空閒連接埠。
- **Scan 後「無裝置」（真機）**：確認 Intiface Central 已執行且按了 **Start Server**、玩具已在其中配對、`CFM_MODE=buttplug` 已設。模擬器永遠會顯示裝置。
- **麥克風 / 心率啟動不了**：瀏覽器只在安全內容允許——用 `http://localhost`（視為安全）或 HTTPS（隧道即可），在 Chrome/Edge 下。
- **外掛裝不上**：倉庫私有——確認你的 GitHub 登入有存取權限，或走原始碼方式。
- **「composing too fast」**：這是速率守衛——等幾秒。
- **能量球動但不震**：你在 `simulated` 模式（預設）——切到 `buttplug` 才驅動真機。

## ❓ 常見問題

**一定要買硬體才能玩嗎？** 不用。內建**模擬器**是預設——掃描、節奏、遊戲、Muse、音訊和整個介面，不插任何東西都能跑。

**該買哪個裝置？** [Buttplug 裝置清單](https://iostindex.com)上的都行。**Lovense** 最好買、支援最好；We-Vibe、Kiiroo、The Handy、Satisfyer 也都不錯。

**支援哪些系統？** macOS、Windows、Linux——它只是 Node ≥ 18。真機走 **Intiface Central**（跨平台）。麥克風/心率功能需要 Chromium 核心瀏覽器（Chrome/Edge），在 `localhost` 或 HTTPS 下。

**我的資料會被傳走嗎？** 不會。見 [隱私](#-隱私)——記憶僅本機、key 絕不落盤、零遙測。唯一的外發流量是硬體控制（本機）、可選的 Muse 作曲（僅當*你*作曲，發往你自己的 key）、以及市值模式的行情查詢。

**需要 API key 嗎？** 不需要。Muse 預設讓你正在聊的 Claude 來作曲。只有當你想用主控台「描述 vibe」框、脫離 Claude 自己作曲時才需要 key。

**外掛裝不上。** 倉庫是私有的——確認你的 GitHub 登入有存取權限，或用[原始碼方式](#1-安裝)。

## 🔒 隱私

隱私在這裡是一項功能，不是事後補丁：

- **記憶僅本機**：存於 `~/.claude-f-me/memory.json`，是你能讀、能改、能刪的純 JSON——**絕不外傳**。`forget` 一鍵清空。
- **key 絕不落盤**：`ANTHROPIC_API_KEY` / `OPENAI_API_KEY` 從環境讀取，只在你顯式作曲時用。雙人中繼無需 key。
- **零遙測**：你的使用情況不會被記錄或上報。主控台與裝置狀態都留在你機器上；雙人和主人遙控只在*你*連接的主控台之間傳資料。
- **網路面由你掌控**：橋接和 webhook 都是預設關閉、需主動開啟，並由 allow-list / 共享密鑰把關。只在你選擇時才暴露連接埠（且優先用隧道 + 密鑰）。

## 🛟 安全與同意

這是真人身上的硬體，設計已盡力，但**你**是最後一道防線：

- **全域強度上限**鉗住一切（工具 / 主控台滑桿 / 主人遙控）。
- 每條 `vibrate` 都裝了**自動停止**；即使不給時長也有 5 分鐘硬上限，連續驅動（節奏/影片/遊戲/音訊）有看門狗，幾秒內自動停。
- `emergency_stop` / `/claude-f-me:safeword` / 主控台紅色按鈕 / 主人的 STOP 都能立刻全停。
- 行程退出時自動關停硬體。

務必在知情、熱情、可隨時撤回的同意下使用。不要記錄或上傳使用資料。你為自己的使用方式負責。

> **僅限 18+。** 這是面向成年人的成人軟體。使用即表示你已達所在司法管轄區的法定年齡，且所有參與者均已同意。本軟體按「現狀」提供、不含任何擔保（見 [LICENSE](../../LICENSE)）；你自行承擔使用風險。

## 路線圖 / 想法

它要去往哪裡——歡迎 PR 和意見：

- 🏆 **排行榜、成就與挑戰**：個人統計（場次、總時長、**最長 edge 堅持**、最佳連勝）、可解鎖成就，以及**可選加入、匿名**的社群榜單 + 每日/每週挑戰（如「撐過 5 分鐘 edge」）。異地情侶連勝。隱私優先：僅自願加入、不含內容、匿名暱稱。
- 🌍 **公開控制模式**：可分享的公開房間（主人遙控開放給多人），讓觀眾或直播彈幕共同驅動裝置——直播式「打賞/投票控制」、即時人群旋鈕、排隊輪流。配硬護欄：強制低上限、房主**踢人/暫停/鎖定**、每觀眾冷卻、常駐安全詞、一鍵「轉私密」。同意與管控優先——公開意味著配戴者主動開啟、可隨時撤回。
- 🧩 **分享曲子與節奏**：用短碼匯出/匯入 Muse 曲子和 funscript——一個小小的 vibe 社群庫。
- 🗣️ **人格語音**：可選 TTS，讓人格真的「說」出台詞（🍼「乖寶寶…」）。
- 🎮 **遊戲與直播聯動**：對遊戲或直播事件做出反應（死亡、勝利、打賞）。
- 🐾 **寵物模式（agent 輸出速率）**：接入程式 agent——**Codex** 或 Claude Code——用它的**即時輸出速率**驅動強度：token 狂飆＝調高，卡住或紅色建置＝回落。把生產力變成獎勵閉環。把 🧑‍💻 開發者觸發從離散事件擴展成連續訊號（tail agent 輸出流→tokens/秒→強度，當然過安全上限）。
- 🔐 **加密、PIN 鎖記憶**：用密碼鎖住本機記憶和主控台。
- 🧠 **記憶 → 行為**：現在記憶只「記錄」+ Claude 可「調出」；下一步讓它自動影響人格/Muse 選擇、規避不喜歡的組合。
- 💬 **更多聊天橋**：Telegram、Discord、微信公眾號都已上線——下一個是 **Slack** 和走 Business API 的 **WhatsApp**。（**個人微信**無官方 bot API，只有違反 ToS、易封號的灰產協定，所以只支援公眾號路線；企業微信只發不收，可行但笨重。）
- 🖥️ **主控台面板**：記憶畫像、人格選擇器、Muse 曲庫（目前靠工具/對話驅動）。
- 👩 **「老闆鍵」隱蔽模式**：一鍵瞬間靜音 + 把主控台偽裝成無害介面（區別於 🍼 媽咪*人格*）。
- ⏰ **定時撩**：「早安」場景與定時驚喜。
- 🎲 **群控**：多人共控一台裝置的房間（真·命運輪盤）。
- 🗣️ **語音訊息 → 音訊模式**：用一條語音訊息驅動強度，而不只是即時麥克風。

## ⭐ Star 趨勢與貢獻者

如果它讓你（或別的什麼）開心了，點個 ⭐ 真的很有幫助。

[![Star History Chart](https://api.star-history.com/svg?repos=mana-am/claude-f-me&type=Date)](https://star-history.com/#mana-am/claude-f-me&Date)

[![Contributors](https://contrib.rocks/image?repo=mana-am/claude-f-me)](https://github.com/mana-am/claude-f-me/graphs/contributors)

> Star 趨勢圖與貢獻者地圖需在倉庫設為**公開**後才會顯示。

## 致謝

基於 [Nonpolynomial](https://nonpolynomial.com) 的開源 [Buttplug](https://github.com/buttplugio/buttplug) 協定與 [Intiface](https://intiface.com)，與其無隸屬關係。

## 授權

[MIT](../../LICENSE) © SimonAKing
