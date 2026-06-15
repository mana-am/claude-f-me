<div align="center">

# claude-f-me

**在 Claude Code 裡用「聊天」控制情趣硬體。**

一個可安裝的 [Claude Code](https://claude.com/claude-code) 外掛，把自然語言對話變成真實裝置控制——
底層是開源的 [Buttplug / Intiface](https://buttplug.io) 生態（支援 750+ 款裝置），搭配一個會隨強度
即時反應的雙語 Web 主控台、主人遙控頁，以及影片（funscript）、遊戲、音訊三種模式。
內建**模擬裝置**，**零硬體**也能完整體驗。

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <b>繁體中文</b> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

<img src="../console.png" alt="claude-f-me 主控台" width="760" />

</div>

---

> [!IMPORTANT]
> 這控制的是**真人身上的實體裝置**。務必在配戴者**熱情、持續同意**的前提下使用。把安全上限設得
> 合理、優先用短時長、把緊急停止放在隨手可及處。詳見 [安全與同意](#-安全與同意)。

## 它是什麼

一個行程**同時**是 Claude 對話用的 MCP 服務，**和**你盯著看的 Web 主控台——所以聊天和面板始終
共享同一份裝置狀態。

- 🔌 **真實硬體**：透過 [Intiface Central](https://intiface.com) 驅動 Lovense、We-Vibe、Kiiroo、
  The Handy、Satisfyer 等 [750+ 款裝置](https://iostindex.com)。
- ⚡ **「脈動核心」反應式介面**：呼吸發光的能量球 + 極光背景隨強度即時放大/發光，外加即時音波。
- 👑 **主人遙控**：手機友善的 `/master` 頁面，讓另一個人即時接管控制——大旋鈕、按住震動、預設、緊急停止。每個頁面都會顯示目前有幾位主人在控制。
- 🎬 **影片模式**：即時播放 [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) 時間軸（位置 `0..100` → 強度）。內建範例腳本一鍵試玩。
- 🎮 **遊戲模式**：`輪盤`、`遞增`、`環境`、`邊緣`（挑逗-拒絕）、`轉盤`（旋轉停留），還有 `game_event` 讓 Claude 在文字冒險裡即時反應。
- 🎵 **音訊模式**：用**麥克風**或**分頁/系統聲音**即時驅動強度。
- 🥁 **節奏庫**：`脈衝`、`波浪`、`遞增`、`挑逗`、`心跳`、`樓梯`、`SOS`、`地震`。
- 🌐 **雙語**：主控台與遙控頁支援**中英文**，一鍵切換（或 `?lang=zh`）。
- 🛟 **內建安全**：全域強度上限、每條指令自動急停、看門狗、隨處可急停、結束即關停。

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
| `/claude-f-me:surprise` | 隨機來一個 |
| `/claude-f-me:safeword` · `:panic` | **立即全部停止** |

## 接入真實裝置

claude-f-me 以真機為先，模擬器只是預覽。

1. 安裝並開啟 **[Intiface Central](https://intiface.com)** → 按 **Start Server**（預設 `ws://127.0.0.1:12345`）。
2. 在 Intiface 裡配對裝置並確認出現。Lovense 最好買、支援最好。
3. 把 **`CFM_MODE` 設為 `buttplug`**（編輯 [`.mcp.json`](../../.mcp.json) 的 `env`，或獨立執行時匯出環境變數）。

> 外掛預設 `simulated`，開箱即跑。Node 22+ 內建全域 `WebSocket`；更舊的 Node 會用 `ws` 墊背，所以真機模式在 Node 18+ 都能用。

### 還沒有硬體？預覽模式

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # 開啟 http://localhost:8731
```

點 **Scan**、拖能量球、放節奏/遊戲、載入範例腳本、開 **音訊**、按 **STOP**——模擬馬達會在螢幕上即時反應。鍵盤：`0–9` 設強度、`空白鍵` 停止、`S` 掃描。

## 👑 主人遙控

開啟主控台點 **👑 遙控**（或造訪 `/master`）。一個手機大小的專注遙控——大旋鈕、按住震動、節奏/遊戲捷徑、安全上限、全寬停止鍵。持有者會被計為**主人**，每個頁面都會顯示 `👑 N 位主人在控制`。

要給**不在同一台機器**的人用，把主控台連接埠透過通道暴露（如 `cloudflared tunnel --url http://localhost:8731` 或 `ngrok http 8731`），分享 `/master` 連結即可。

> 只把控制權交給配戴者信任並同意的人。安全上限與配戴者自己的 STOP 永遠優先。

## 模式與玩法

- **🎬 影片**：即時播放 funscript（`循環`/`速度`/`反向`），可一鍵載入範例。
- **🎮 遊戲**：輪盤 · 遞增 · 環境 · 邊緣（挑逗-拒絕，峰值逐輪升高）· 轉盤（旋轉後停留）。
- **🥁 節奏**：脈衝 · 波浪 · 遞增 · 挑逗 · 心跳 · 樓梯 · SOS · 地震。
- **🎵 音訊**：麥克風或分頁聲音按響度驅動強度，附靈敏度滑桿。

## 🛟 安全與同意

這是真人身上的硬體，設計已盡力，但**你**是最後一道防線：

- **全域強度上限**鉗住一切（工具 / 主控台滑桿 / 主人遙控）。
- 每條 `vibrate` 都裝了**自動停止**；即使不給時長也有 5 分鐘硬上限，連續驅動有看門狗，驅動一斷幾秒內自動停。
- `emergency_stop` / `/claude-f-me:safeword` / 主控台紅色按鈕 / 主人的 STOP 都能立刻全停。
- 行程結束時自動關停硬體。

務必在知情、熱情、可隨時撤回的同意下使用。不要記錄或上傳使用資料。你為自己的使用方式負責。

## 致謝

基於 [Nonpolynomial](https://nonpolynomial.com) 的開源 [Buttplug](https://github.com/buttplugio/buttplug) 協定與 [Intiface](https://intiface.com)，與其無隸屬關係。

## 授權

[MIT](../../LICENSE) © SimonAKing
