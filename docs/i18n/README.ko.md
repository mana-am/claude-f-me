<div align="center">

# claude-f-me

**Claude Code에서 "대화"로 인티밋 하드웨어를 제어하세요.**

자연어 대화를 실제 기기 제어로 바꾸는 [Claude Code](https://claude.com/claude-code) 플러그인입니다.
오픈소스 [Buttplug / Intiface](https://buttplug.io) 생태계(750+ 기기 지원)를 기반으로, 강도에
실시간 반응하는 이중 언어 웹 콘솔, 마스터 리모트, 그리고 비디오(funscript)·게임·오디오 모드를 제공합니다.
**내장 시뮬레이터**로 하드웨어 없이도 전체를 체험할 수 있습니다.

[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-7c3aed)](https://modelcontextprotocol.io)
[![Buttplug](https://img.shields.io/badge/Buttplug-Intiface-ff4d8d)](https://buttplug.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

<p align="center"><a href="../../README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.ja.md">日本語</a> · <b>한국어</b> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

<img src="../console.png" alt="claude-f-me 콘솔" width="760" />

</div>

---

> [!IMPORTANT]
> 이것은 **실제 사람의 몸에 착용된 물리적 기기**를 제어합니다. 착용자의 **적극적이고 지속적인 동의**
> 하에서만 사용하세요. 안전 상한을 합리적으로 두고, 짧은 지속시간을 우선하며, 긴급 정지를 손이 닿는
> 곳에 두세요. [안전과 동의](#-안전과-동의) 참고.

## 무엇인가

하나의 프로세스가 Claude가 대화하는 MCP 서버**이자** 당신이 보는 웹 콘솔이기도 합니다 — 그래서
채팅과 대시보드는 항상 동일한 기기 상태를 공유합니다.

- 🔌 **실제 하드웨어**: [Intiface Central](https://intiface.com)을 통해 Lovense, We-Vibe, Kiiroo,
  The Handy, Satisfyer 등 [750+ 기기](https://iostindex.com)를 구동.
- ⚡ **"펄스 코어" 반응형 UI**: 강도에 따라 커지고 빛나는 숨쉬는 에너지 오브와 오로라 배경, 실시간 오디오 파형.
- 👑 **마스터 리모트**: 모바일 친화적 `/master` 페이지로 다른 사람이 실시간 제어를 넘겨받기 — 큰 다이얼, 길게 눌러 진동, 프리셋, 긴급 정지. 모든 페이지에 마스터 접속 여부가 표시됩니다.
- 🎬 **비디오 모드**: [Funscript](https://github.com/FredTungsten/ScriptPlayer/wiki/Funscript) 타임라인을 실시간 재생(위치 `0..100` → 강도). 내장 샘플로 원클릭 체험.
- 🎮 **게임 모드**: `roulette`, `escalation`, `ambient`, `edge`(애태우기), `wheel`(돌려서 멈춤). `game_event` 훅으로 텍스트 어드벤처 중 Claude가 반응.
- 🎵 **오디오 모드**: **마이크** 또는 **탭/시스템 오디오**로 강도를 실시간 구동.
- 🥁 **패턴**: `pulse`·`wave`·`escalate`·`tease`·`heartbeat`·`staircase`·`sos`·`earthquake`.
- 🌐 **이중 언어**: 콘솔과 리모트가 **영어와 중국어** 지원, 원탭 전환(`?lang=zh`도 가능).
- 🛟 **내장 안전**: 전역 강도 상한, 명령별 자동 정지, 워치독, 어디서나 긴급 정지, 종료 시 하드웨어 정지.

## 설치 (Claude Code 플러그인)

```bash
# 1. 이 저장소를 플러그인 마켓플레이스로 추가
/plugin marketplace add mana-am/claude-f-me

# 2. 플러그인 설치
/plugin install claude-f-me@claude-f-me
```

설치 후 채팅에서:

```
scan for devices
vibrate at 40% for 3 seconds
run the "heartbeat" pattern
start an edge game
surprise me
```

콘솔 주소는 **http://localhost:8731** — `/claude-f-me:console`로 엽니다.

### 슬래시 명령

| 명령 | 동작 |
|---|---|
| `/claude-f-me:console` | 브라우저에서 콘솔 열기 |
| `/claude-f-me:demo` | 스캔→진동→패턴→게임 짧은 데모 |
| `/claude-f-me:fuck` | 시작 (자동 스캔 후 점점 강하게) |
| `/claude-f-me:harder` / `:softer` | 강하게 / 약하게 (±20%) |
| `/claude-f-me:edge` / `:tease` | 애태우기 게임 / 애태우기 패턴 |
| `/claude-f-me:surprise` | 무작위로 하나 |
| `/claude-f-me:safeword` · `:panic` | **모든 것 즉시 정지** |

## 실제 기기 연결

claude-f-me는 실제 기기 우선이며, 시뮬레이터는 미리보기입니다.

1. **[Intiface Central](https://intiface.com)** 설치 후 실행 → **Start Server**(기본 `ws://127.0.0.1:12345`).
2. Intiface에서 기기를 페어링하고 표시되는지 확인. Lovense가 구하기 쉽고 지원이 가장 좋습니다.
3. **`CFM_MODE=buttplug`** 설정([`.mcp.json`](../../.mcp.json)의 `env` 편집, 또는 단독 실행 시 환경변수).

> 플러그인은 기본값이 `simulated`라 바로 동작합니다. Node 22+는 전역 `WebSocket`이 있고, 구버전은 `ws`로 보완하므로 실기 모드는 Node 18+에서 동작합니다.

### 아직 하드웨어가 없다면? 미리보기 모드

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me && npm install && npm run build
npm run console        # http://localhost:8731 열기
```

**Scan**, 오브 드래그, 패턴/게임, 샘플 funscript 로드, **오디오**, **STOP** — 시뮬레이터 모터가 화면에서 반응합니다. 키보드: `0–9` 강도, `스페이스` 정지, `S` 스캔.

## 👑 마스터 리모트

콘솔에서 **👑 Remote**(또는 `/master`). 모바일 크기의 전용 리모트 — 큰 다이얼, 길게 눌러 진동, 패턴/게임 단축, 안전 상한, 전체 폭 정지. 들고 있는 사람은 **마스터**로 집계되며 모든 페이지에 `👑 N master in control`이 표시됩니다.

**다른 기기**의 사람에게 넘기려면 콘솔 포트를 터널로 공개(예 `cloudflared tunnel --url http://localhost:8731` 또는 `ngrok http 8731`)하고 `/master` 링크를 공유하세요.

> 착용자가 신뢰하고 동의한 사람에게만 제어를 넘기세요. 안전 상한과 착용자 본인의 STOP이 항상 우선합니다.

## 모드와 놀이

- **🎬 비디오**: funscript 실시간 재생(`loop`/`speed`/`invert`), 샘플 원클릭.
- **🎮 게임**: roulette · escalation · ambient · edge(애태우기, 피크가 매 라운드 상승) · wheel(돌려서 멈춤).
- **🥁 패턴**: pulse · wave · escalate · tease · heartbeat · staircase · sos · earthquake.
- **🎵 오디오**: 마이크나 탭 오디오의 음량으로 강도 구동, 민감도 슬라이더 포함.

## 🛟 안전과 동의

실제 몸에 착용하는 하드웨어입니다. 설계가 배려하지만 **당신**이 마지막 방어선입니다:

- **전역 강도 상한**이 모든 것을 제한(도구 / 콘솔 슬라이더 / 마스터 리모트).
- 모든 `vibrate`에 **자동 정지**가 걸립니다. 지속시간이 없어도 5분 하드 상한이 있고, 연속 구동에는 워치독이 있어 공급이 멈추면 수초 내 정지.
- `emergency_stop` / `/claude-f-me:safeword` / 콘솔의 빨간 버튼 / 마스터의 STOP이 즉시 전부 정지.
- 프로세스 종료 시 하드웨어를 끕니다.

반드시 정보에 입각하고, 적극적이며, 철회 가능한 동의 하에 사용하세요. 사용 데이터를 기록·전송하지 마세요. 사용 방식에 대한 책임은 당신에게 있습니다.

## 크레딧

[Nonpolynomial](https://nonpolynomial.com)의 오픈소스 [Buttplug](https://github.com/buttplugio/buttplug) 프로토콜과 [Intiface](https://intiface.com) 기반. 제휴 관계 없음.

## 라이선스

[MIT](../../LICENSE) © SimonAKing
