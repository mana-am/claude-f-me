<div align="center">

# claude-f-me

**在 Claude Code 裡用「聊天」控制情趣硬體。**

一個可安裝的 [Claude Code](https://claude.com/claude-code) 外掛，把自然語言對話變成真實裝置控制——
底層是開源的 [Buttplug / Intiface](https://buttplug.io) 生態（支援 750+ 款裝置），搭配一個會隨強度
即時反應的雙語 Web 主控台、主人遙控頁，以及 Muse 作曲、人格、雙人、影片、遊戲、音訊等模式。
內建**模擬裝置**，**零硬體**也能完整體驗。

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <b>繁體中文</b> · <a href="README.ja.md">日本語</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a></p>

<img src="../console.png" alt="claude-f-me 主控台" width="760" />

</div>

---

> [!IMPORTANT]
> 這控制的是**真人身上的實體裝置**。務必在配戴者**熱情、持續同意**的前提下使用。把安全上限設得
> 合理、優先用短時長、把緊急停止放在隨手可及處。詳見 [安全與同意](#-安全與同意)。

## 截圖

| 反應式主控台（英文） | 主控台（中文） | 主人遙控 |
|---|---|---|
| <img src="../console.png" width="320" /> | <img src="../console.zh.png" width="320" /> | <img src="../master.png" width="150" /> |

## 它是什麼

一個行程**同時**是 Claude 對話用的 MCP 服務，**和**你盯著看的 Web 主控台——所以聊天和面板始終
共享同一份裝置狀態。

- 🔌 **真實硬體**：透過 [Intiface Central](https://intiface.com) 驅動 Lovense、We-Vibe、Kiiroo、The Handy、Satisfyer 等 [750+ 款裝置](https://iostindex.com)。
- 🎼 **Muse 作曲模式**：模型來**作曲**——你描述一個 vibe（「10 分鐘譚崔式慢燉」、「一場雷暴」、「用摩斯電碼說我愛你」），它寫出一條平滑的觸感曲線並播放。可存進曲庫反覆播放。裝置變成 AI 演奏的樂器。
- 🎭 **人格**：選擇**由誰掌控**——依 SOTA 模型原型設計的驅動人格：🕯️ 慢燉(Opus)、😈 小惡魔(GPT-5.5)、🎼 節拍器、⛈️ 風暴、🔮 神諭、🍼 媽咪。各自改變手感（節奏/混亂度/拒絕傾向/上限）。**盲選模式**藏起是誰——神秘掌控者。
- 💞 **雙人模式**：兩台主控台用房間碼透過內建中繼連起來，伴侶的輸入即時驅動你的裝置（鏡像/主導/跟隨），帶在線狀態和 👋 觸碰手勢。
- ⚡ **「脈動核心」反應式介面**：呼吸發光的能量球 + 極光背景隨強度即時放大/發光，外加即時音波。
- 👑 **主人遙控**：手機友善的 `/master` 頁面，讓另一個人即時接管控制——大旋鈕、按住震動、預設、緊急停止。每個頁面都會顯示有幾位主人在控制。
- 🎬 **影片模式**：即時播放 [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) 時間軸（位置 `0..100` → 強度）。內建範例腳本一鍵試玩。
- 🎮 **遊戲模式**：`輪盤`、`遞增`、`環境`、`邊緣`（挑逗-拒絕）、`轉盤`（旋轉停留），還有 `game_event` 讓 Claude 在文字冒險裡即時反應。
- 🎵 **音訊模式**：用**麥克風**或**分頁/系統聲音**即時驅動強度。
- 🥁 **節奏庫**：`脈衝`、`波浪`、`遞增`、`挑逗`、`心跳`、`樓梯`、`SOS`、`地震`。
- 🧠 **記憶**：本地記憶，學習你的偏好、人格親和度與「軟不喜歡」訊號（`remember`/`recall`/`forget`），越用越懂你——且絕不外傳。
- 📜 **場景提示詞**：現成的引導場景，做成 MCP prompts——媽咪場景、邊緣控制、劇情模式、作曲一個 vibe、事後溫存。
- 💬 **聊天橋接**：可選 **Telegram** 機器人——在你天天用的聊天軟體裡用訊息或 emoji 控制（異地伴侶神器）。
- 🌐 **雙語**：主控台與遙控頁支援**中英文**，一鍵切換（或 `?lang=zh`）。
- 🛟 **內建安全**：全域上限、每條指令自動急停、看門狗、隨處可急停、結束即關停。

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
| `/claude-f-me:fuck` | 開始（自動掃描，然後逐漸增強） |
| `/claude-f-me:harder` / `:softer` | 增強 / 減弱（±20%） |
| `/claude-f-me:edge` / `:tease` | 邊緣控制 / 挑逗節奏 |
| `/claude-f-me:muse` | 從一個 vibe 作一段自訂觸感曲子 |
| `/claude-f-me:persona` | 選擇由誰掌控（慢燉 / 小惡魔 / …） |
| `/claude-f-me:surprise` | 隨機來一個 |
| `/claude-f-me:safeword` · `:panic` | **立即全部停止** |

## 接入真實裝置

claude-f-me 以真機為先，模擬器只是預覽。

1. 安裝並開啟 **[Intiface Central](https://intiface.com)** → 按 **Start Server**（預設 `ws://127.0.0.1:12345`）。
2. 在 Intiface 裡配對裝置並確認出現。Lovense 最好買、支援最好。
3. 把 **`CFM_MODE` 設為 `buttplug`**（編輯 [`.mcp.json`](../../.mcp.json) 的 `env`，或獨立執行時匯出環境變數）。

> 外掛預設 `simulated`，開箱即跑。Node 22+ 內建全域 `WebSocket`；更舊的 Node 用 `ws` 墊背，所以真機模式在 Node 18+ 都能用。

### 還沒有硬體？預覽模式

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # 開啟 http://localhost:8731
```

點 **Scan**、拖能量球、放節奏/遊戲、載入範例腳本、開 **音訊**、按 **STOP**——模擬馬達會在螢幕上即時反應。鍵盤：`0–9` 設強度、`空白鍵` 停止、`S` 掃描。

## 👑 主人遙控

開啟主控台點 **👑 遙控**（或造訪 `/master`）。一個手機大小的專注遙控——大旋鈕、按住震動、節奏/遊戲捷徑、安全上限、全寬停止鍵。持有者會被計為**主人**，每個頁面都會顯示 `👑 N 位主人在控制`。

要給**不在同一台機器**的人用，把主控台連接埠透過通道暴露（如 `cloudflared tunnel --url http://localhost:8731` 或 `ngrok http 8731`），分享 `/master` 連結即可。通道是 HTTPS，`wss://` 會自動生效。

> 只把控制權交給配戴者信任並同意的人。安全上限和配戴者自己的 STOP 永遠優先。

## 模式與玩法

**🎼 Muse（作曲）**——模型把一句自然語言 brief 變成平滑的關鍵影格曲線（`{at, level}`，內插）並播放。可在對話裡用 `compose` 工具作曲，或在配了外部模型 key 時用主控台的**「描述一個 vibe」**框。曲子可存進曲庫（含內建），用 `muse_list` / `muse_play` 重播。

**🎭 人格**——一種驅動性格，調制每個遊戲/事件（節奏/混亂/拒絕/上限），並在有對應 key 時決定由哪個模型作曲：🕯️ `slowburn`(Opus) · 😈 `brat`(GPT-5.5) · 🎼 `metronome` · ⛈️ `storm` · 🔮 `oracle` · 🍼 `mommy`。`set_persona blind` 藏起選擇直到 `reveal_persona`。

**💞 雙人**——開啟主控台 **Duet** 面板，分享中繼 URL + 房間碼，兩台主控台透過內建 `/relay` 中繼連起來。選 **鏡像**（互相感受）、**主導**（你來驅動）或 **跟隨**（你來接收）；可發 👋 觸碰。收到的強度仍過你本地安全上限。

**🎬 影片（funscript）**——即時播放 `{at,pos}` 時間軸（`循環`/`速度`/`反向`），可一鍵載入範例。

**🎮 遊戲**——輪盤（隨機突發）· 遞增（爬升保持）· 環境（有機波動）· 邊緣（爬到邊緣後拒絕，峰值逐輪升高）· 轉盤（旋轉後停留）。

**🥁 節奏**——脈衝 · 波浪 · 遞增 · 挑逗 · 心跳 · 樓梯 · SOS · 地震。

**🎵 音訊**——麥克風或分頁聲音按響度驅動強度，附靈敏度滑桿。

## 🧠 記憶

可選的本地記憶，讓 claude-f-me **越來越懂你**。它記錄你常玩的遊戲和 Muse 曲子、和哪個人格合拍、以及**軟不喜歡訊號**（剛開始幾秒就被停掉的），還有你寫的筆記。Claude 可在作曲或增強前 `recall`，`forget` 一鍵清空。

- 工具：`remember "喜歡 60% 的心跳"` · `recall` · `forget`
- 存於 `~/.claude-f-me/memory.json`——**僅本地、絕不外傳**，就是一份你能讀能刪的 JSON。

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

然後給 bot 發訊息：數字 `0–100`、`harder`/`softer`、`stop`/`safeword`、`scan`，或 emoji——🔥邊緣 · 💓心跳 · 🌊環境 · 🎡轉盤 · 📈遞增 · 🎲隨機 · 🛑停止。回覆中英自動辨識。不設 allow-list 的話，任何找到 bot 的人都能控制，所以**一定要設**。安全上限和 `safeword` 永遠優先。

> **為什麼不做微信？** 個人微信沒有官方機器人 API，只有非官方/灰產協議（違反 ToS、易封號）。見 [路線圖](#路線圖--想法)。

## MCP 工具

| 工具 | 說明 |
|---|---|
| `list_devices` | 裝置、強度、電量、模式、上限、主控台 URL、活動模式、主人數 |
| `scan_devices` | 掃描 `duration_ms` 後返回列表 |
| `vibrate` | `intensity` 0..1，`target` id/`all`，可選 `duration_ms`（自動停） |
| `pattern` | `preset`(pulse/wave/escalate/tease/heartbeat/staircase/sos/earthquake) 或 `steps`、`loops` |
| `stop` | 停止某裝置/`all`，取消其節奏 |
| `emergency_stop` | 立即停止**所有**裝置與模式 |
| `set_max_intensity` | 全域安全上限 0..1 |
| `load_funscript` · `play_video` | 載入 + 播放 funscript（`loop`/`speed`/`invert`） |
| `start_game` | `roulette`/`escalation`/`ambient`/`edge`/`wheel`（`intensity_max`、`duration_ms`） |
| `game_event` | 一次性 `reward`/`penalty`/`tease`/`pulse`，給劇情用 |
| `compose` | 你寫 `keyframes`(`[{at,level}]`) 配 `brief` 並播放；可 `save_as`、`loop` |
| `muse_list` · `muse_play` | 列出 / 重播 曲庫 |
| `list_personas` · `set_persona` · `reveal_persona` | 選驅動人格（或 `blind`）並揭曉 |
| `remember` · `recall` · `forget` | 本地記憶：存筆記/偏好、調出畫像、清空 |
| `stop_mode` | 停止當前 影片/遊戲/muse 模式 |

另有 **MCP prompts**（`/mcp__claude-f-me__…`）：`mommy-scene`、`edge-session`、`story-mode`、`compose-vibe`、`aftercare`。

> 音訊模式、主人遙控、雙人都活在主控台（需瀏覽器採麥克風/手動操作）；Telegram 橋在背景跑；其餘都能被 Claude 透過上面的工具驅動。

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

> 模型 key **可選**。沒有它 Muse 照樣能用——在對話裡讓 Claude `compose` 即可，人格也仍在本地調制手感。有 key 時，人格的 `model` 決定由誰作曲。key 只從環境讀取、絕不落盤；雙人中繼無需 key。

## 開發

```bash
npm run dev          # MCP + 主控台，watch（tsx）
npm run build        # 型別檢查 + 產出 dist/（tsc）
npm run bundle       # 自包含 dist/claude-f-me.mjs（esbuild，給外掛用）
```

## 🛟 安全與同意

這是真人身上的硬體，設計已盡力，但**你**是最後一道防線：

- **全域強度上限**鉗住一切（工具 / 主控台滑桿 / 主人遙控）。
- 每條 `vibrate` 都裝了**自動停止**；即使不給時長也有 5 分鐘硬上限，連續驅動有看門狗，幾秒內自動停。
- `emergency_stop` / `/claude-f-me:safeword` / 主控台紅色按鈕 / 主人的 STOP 都能立刻全停。
- 行程結束時自動關停硬體。

務必在知情、熱情、可隨時撤回的同意下使用。不要記錄或上傳使用資料。你為自己的使用方式負責。

## 路線圖 / 想法

它要去往哪裡——歡迎 PR 和意見：

- 🏆 **排行榜、成就與挑戰**：個人統計（場次、總時長、**最長 edge 堅持**、最佳連勝）、可解鎖成就，以及**可選加入、匿名**的社群榜單 + 每日/每週挑戰（如「撐過 5 分鐘 edge」）。異地情侶連勝。隱私優先：僅自願加入、不含內容、匿名暱稱。
- 🌍 **公開控制模式**：可分享的公開房間（主人遙控開放給多人），讓觀眾或直播彈幕共同驅動裝置——直播式「打賞/投票控制」、即時人群旋鈕、排隊輪流。配硬護欄：強制低上限、房主**踢人/暫停/鎖定**、每觀眾冷卻、常駐安全詞、一鍵「轉私密」。同意與管控優先——公開意味著配戴者主動開啟、可隨時撤回。
- 🧩 **分享曲子與節奏**：用短碼匯出/匯入 Muse 曲子和 funscript——一個小小的 vibe 社群庫。
- 🗣️ **人格語音**：可選 TTS，讓人格真的「說」出台詞（🍼「乖寶寶…」）。
- 🎮 **遊戲與直播聯動**：對遊戲或直播事件做出反應（死亡、勝利、打賞）。
- 🐾 **寵物模式（agent 輸出速率）**：接入編程 agent——**Codex** 或 Claude Code——用它的**即時輸出速率**驅動強度：token 狂飆＝調高，卡住或紅色建置＝回落。把生產力變成獎勵閉環。把 🧑‍💻 開發者觸發從離散事件擴展成連續訊號（tail agent 輸出流→tokens/秒→強度，當然過安全上限）。
- 🔐 **加密、PIN 鎖記憶**：用密碼鎖住本地記憶和主控台。
- 🧠 **記憶 → 行為**：現在記憶只「記錄」+ Claude 可「調出」；下一步讓它自動影響人格/Muse 選擇、規避不喜歡的組合。
- 💬 **更多聊天橋**：**Discord**（官方 bot，最自然的下一個）、Slack；**WhatsApp** 走 Business API。**微信**無官方個人號 bot API，只有非官方/灰產協議（違反 ToS、易封），故意不做；企業微信可行但笨重。
- 🖥️ **主控台面板**：記憶畫像、人格選擇器、Muse 曲庫（目前靠工具/對話驅動）。
- 👩 **「老闆鍵」隱蔽模式**：一鍵瞬間靜音 + 把主控台偽裝成無害介面（區別於 🍼 媽咪*人格*）。
- ⏰ **定時撩**：「早安」場景與定時驚喜。
- 🎲 **群控**：多人共控一台裝置的房間（真·命運輪盤）。
- 🗣️ **語音條 → 音訊模式**：用一條語音訊息驅動強度，而不只是即時麥克風。

## ⭐ Star 趨勢與貢獻者

如果它讓你（或別的什麼）開心了，點個 ⭐ 真的很有幫助。

[![Star History Chart](https://api.star-history.com/svg?repos=mana-am/claude-f-me&type=Date)](https://star-history.com/#mana-am/claude-f-me&Date)

[![Contributors](https://contrib.rocks/image?repo=mana-am/claude-f-me)](https://github.com/mana-am/claude-f-me/graphs/contributors)

> Star 趨勢圖與貢獻者地圖需在倉庫設為**公開**後才會顯示。

## 致謝

基於 [Nonpolynomial](https://nonpolynomial.com) 的開源 [Buttplug](https://github.com/buttplugio/buttplug) 協定與 [Intiface](https://intiface.com)，與其無隸屬關係。

## 授權

[MIT](../../LICENSE) © SimonAKing
