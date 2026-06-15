<div align="center">

# claude-f-me

**在 Claude Code 里用「聊天」控制情趣硬件。**

一个可安装的 [Claude Code](https://claude.com/claude-code) 插件，把自然语言对话变成真实设备控制——
底层是开源的 [Buttplug / Intiface](https://buttplug.io) 生态（支持 750+ 款设备），配一个会随强度
实时反应的双语 Web 控制台、主人遥控页，以及视频（funscript）、游戏、音频三种模式。
内置**模拟设备**，**零硬件**也能完整体验。

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <b>简体中文</b> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

<img src="../console.png" alt="claude-f-me 控制台" width="760" />

</div>

---

> [!IMPORTANT]
> 这控制的是**真人身上的物理设备**。务必在佩戴者**热情、持续同意**的前提下使用。把安全上限设得
> 合理、优先用短时长、把紧急停止放在随手可及处。详见 [安全与同意](#-安全与同意)。

## 它是什么

一个进程**同时**是 Claude 对话用的 MCP 服务，**和**你盯着看的 Web 控制台——所以聊天和面板始终
共享同一份设备状态。

- 🔌 **真实硬件**：通过 [Intiface Central](https://intiface.com) 驱动 Lovense、We-Vibe、Kiiroo、
  The Handy、Satisfyer 等 [750+ 款设备](https://iostindex.com)。
- ⚡ **「脉动核心」反应式界面**：呼吸发光的能量球 + 极光背景随强度实时放大/发光，外加实时音波——不是无聊的仪表盘。
- 👑 **主人遥控**：手机友好的 `/master` 页面，让另一个人实时接管控制——大旋钮、按住震动、预设、急停。每个页面都会显示当前有几位主人在控制。
- 🎬 **视频模式**：实时播放 [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) 时间轴（位置 `0..100` → 强度）。内置示例脚本一键试玩。
- 🎮 **游戏模式**：`轮盘`、`递增`、`环境`、`边缘`（挑逗-拒绝）、`转盘`（旋转停留），还有 `game_event` 钩子让 Claude 在文字冒险里即时反应。
- 🎵 **音频模式**：用**麦克风**或**标签页/系统声音**实时驱动强度。
- 🥁 **节奏库**：`脉冲`、`波浪`、`递增`、`挑逗`、`心跳`、`楼梯`、`SOS`、`地震`。
- 🌐 **双语**：控制台与遥控页支持**中英文**，一键切换（或 `?lang=zh`）。
- 🛟 **内置安全**：全局强度上限、每条指令自动急停、看门狗、随处可急停、退出即关停。

## 安装（作为 Claude Code 插件）

```bash
# 1. 把本仓库添加为插件市场
/plugin marketplace add mana-am/claude-f-me

# 2. 安装插件
/plugin install claude-f-me@claude-f-me
```

装完即可在对话里说：

```
扫描设备
以 40% 震动 3 秒
跑一遍 heartbeat 节奏
开始 edge 游戏
给我个惊喜
```

控制台地址 **http://localhost:8731**——用 `/claude-f-me:console` 打开。

### Slash 命令

| 命令 | 作用 |
|---|---|
| `/claude-f-me:console` | 在浏览器打开控制台 |
| `/claude-f-me:demo` | 跑一段「扫描→震动→节奏→游戏」演示 |
| `/claude-f-me:fuck` | 开始（自动扫描，然后逐渐升强） |
| `/claude-f-me:harder` / `:softer` | 增强 / 减弱（±20%） |
| `/claude-f-me:edge` / `:tease` | 边缘控制 / 挑逗节奏 |
| `/claude-f-me:surprise` | 随机来一个 |
| `/claude-f-me:safeword` · `:panic` | **立即全部停止** |

## 接入真实设备

claude-f-me 以真机为先，模拟器只是预览。

1. 安装并打开 **[Intiface Central](https://intiface.com)** → 点 **Start Server**（默认 `ws://127.0.0.1:12345`）。
2. 在 Intiface 里配对设备并确认出现。Lovense 最好买、支持最好。
3. 把 **`CFM_MODE` 设为 `buttplug`**（编辑 [`.mcp.json`](../../.mcp.json) 的 `env`，或独立运行时导出环境变量）。

> 插件默认 `simulated`，开箱即跑。Node 22+ 自带全局 `WebSocket`；更老的 Node 会用 `ws` 兜底，所以真机模式在 Node 18+ 都能用。

### 还没有硬件？预览模式

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # 打开 http://localhost:8731
```

点 **Scan**、拖能量球、放节奏/游戏、载入示例脚本、开 **音频**、按 **STOP**——模拟马达会在屏幕上实时反应。键盘：`0–9` 设强度、`空格` 停止、`S` 扫描。

## 👑 主人遥控

打开控制台点 **👑 遥控**（或访问 `/master`）。一个手机大小的专注遥控——大旋钮、按住震动、节奏/游戏快捷键、安全上限、全宽停止键。持有者会被计为**主人**，每个页面都会显示 `👑 N 位主人在控制`。

要给**不在同一台机器**的人用，把控制台端口通过隧道暴露（如 `cloudflared tunnel --url http://localhost:8731` 或 `ngrok http 8731`），分享 `/master` 链接即可。隧道是 HTTPS，`wss://` 会自动生效。

> 只把控制权交给佩戴者信任并同意的人。安全上限和佩戴者自己的 STOP 永远优先。

## 模式与玩法

- **🎬 视频**：实时播放 funscript（`循环`/`速度`/`反向`），可一键载入示例。
- **🎮 游戏**：轮盘 · 递增 · 环境 · 边缘（挑逗-拒绝，峰值逐轮升高）· 转盘（旋转后停留）。
- **🥁 节奏**：脉冲 · 波浪 · 递增 · 挑逗 · 心跳 · 楼梯 · SOS · 地震。
- **🎵 音频**：麦克风或标签页声音按响度驱动强度，带灵敏度滑块。

## 🛟 安全与同意

这是真人身上的硬件，设计已尽力，但**你**是最后一道防线：

- **全局强度上限**钳住一切（工具 / 控制台滑块 / 主人遥控）。
- 每条 `vibrate` 都装了**自动停止**；即使不给时长也有 5 分钟硬上限，连续驱动（节奏/视频/游戏/音频）有看门狗，驱动一断几秒内自动停。
- `emergency_stop` / `/claude-f-me:safeword` / 控制台红色按钮 / 主人的 STOP 都能立刻全停。
- 进程退出时自动关停硬件。

务必在知情、热情、可随时撤回的同意下使用。不要记录或上传使用数据。你为自己的使用方式负责。

## 致谢

基于 [Nonpolynomial](https://nonpolynomial.com) 的开源 [Buttplug](https://github.com/buttplugio/buttplug) 协议与 [Intiface](https://intiface.com)，与其无隶属关系。

## 许可

[MIT](../../LICENSE) © SimonAKing
