// Self-contained "Pulse Core" console UI, embedded as a string (no asset paths
// after tsc). Talks to the same process over ws://<host>/ws. Bilingual EN/中文.
// Inline scripts use string concatenation only — no backticks / ${} — because
// this whole file is a single template literal.
export const CONSOLE_HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>claude-f-me</title>
<style>
  :root { color-scheme: dark; --lvl: 0; }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin:0; overflow:hidden; color:#f3e9f5; background:#070509;
    font:14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }
  #aurora { position:fixed; inset:0; z-index:0; display:block; }
  .grain { position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.05;
    background-image:radial-gradient(#fff 1px, transparent 1px); background-size:3px 3px; }
  .wrap { position:relative; z-index:2; height:100%; display:flex; flex-direction:column; }

  header { display:flex; align-items:center; gap:10px; padding:14px 18px; flex-wrap:wrap; }
  .brand { font-size:16px; font-weight:800; letter-spacing:.5px;
    background:linear-gradient(90deg,#ff8ec7,#c9a0ff); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .pill { font-size:11px; padding:3px 9px; border-radius:999px; border:1px solid #ffffff1f; color:#d8c8e2;
    background:#ffffff0a; backdrop-filter:blur(8px); }
  .pill.sim { color:#7fe0c4; border-color:#1f4a3e88; }
  .pill.bp  { color:#ffc187; border-color:#4a332088; }
  .pill.act { color:#d7b3ff; border-color:#7a4bd055; background:#c9a0ff14; }
  .pill.dot { display:inline-flex; align-items:center; gap:6px; }
  .dot { width:7px;height:7px;border-radius:50%;background:#6a6076; }
  .dot.on { background:#7fe0c4; box-shadow:0 0 8px #7fe0c4; }
  .spacer { flex:1; }
  .btn { font:inherit; cursor:pointer; border-radius:11px; border:1px solid #ffffff1f; color:#f3e9f5;
    background:#ffffff0d; backdrop-filter:blur(8px); padding:8px 13px; transition:.15s; }
  .btn:hover { background:#ffffff1a; border-color:#ffffff33; }
  .btn.ghost { padding:6px 10px; font-size:12px; }
  .btn.estop { background:linear-gradient(90deg,#d6443b,#b3261e); border:none; color:#fff; font-weight:800; box-shadow:0 4px 24px #b3261e55; }

  .stage { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding:6px 16px; min-height:0; }
  .orb-host { position:relative; width:min(54vh,300px); height:min(54vh,300px); display:flex; align-items:center; justify-content:center; }
  .rings { position:absolute; inset:0; opacity:0; }
  .ring { position:absolute; inset:0; border-radius:50%; border:1.5px solid #ff8ec7; animation:ringPulse var(--rspd,1.4s) ease-out infinite; }
  .ring:nth-child(2){ animation-delay:calc(var(--rspd,1.4s) * .33); }
  .ring:nth-child(3){ animation-delay:calc(var(--rspd,1.4s) * .66); }
  @keyframes ringPulse { 0%{transform:scale(.62);opacity:.55} 100%{transform:scale(1.85);opacity:0} }
  .orb { position:relative; width:74%; height:74%; border-radius:50%; transition:transform .12s linear, filter .12s linear;
    display:flex; align-items:center; justify-content:center; will-change:transform; }
  .orb-core { position:absolute; inset:0; border-radius:50%; animation:spin 9s linear infinite, breathe 3.8s ease-in-out infinite;
    background:
      radial-gradient(circle at 36% 30%, #ffd6ec 0%, #ff7eb3 22%, #d83b8e 52%, #7a1f6b 78%, #2a0b2e 100%);
    box-shadow: inset 0 0 60px #ffffff55, inset 0 -30px 60px #5a0f5a99; }
  .orb-glow { position:absolute; inset:-6%; border-radius:50%; pointer-events:none;
    box-shadow:0 0 calc(40px + 220px*var(--lvl)) calc(6px + 40px*var(--lvl)) #ff5ea6aa; opacity:calc(.35 + .65*var(--lvl)); }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes breathe { 0%,100%{ transform:scale(1) } 50%{ transform:scale(1.035) } }
  .orb-num { position:relative; z-index:2; text-align:center; text-shadow:0 2px 18px #00000088; }
  .orb-num b { font-size:clamp(40px,9vh,72px); font-weight:800; letter-spacing:-2px; }
  .orb-num small { display:block; font-size:12px; color:#ffffffcc; margin-top:2px; letter-spacing:.08em; }
  .orb-empty { position:relative; z-index:2; text-align:center; color:#fff; font-weight:600; }

  .scrub { width:min(86vw,520px); margin-top:6px; }
  .scrub input { width:100%; -webkit-appearance:none; appearance:none; height:34px; background:transparent; }
  .scrub input::-webkit-slider-runnable-track { height:10px; border-radius:999px; background:linear-gradient(90deg,#ff8ec7,#a06bff); box-shadow:0 0 18px #ff5ea655; }
  .scrub input::-webkit-slider-thumb { -webkit-appearance:none; width:26px;height:26px;border-radius:50%;background:#fff; margin-top:-8px; box-shadow:0 2px 12px #000; }

  .dock { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; max-width:92vw; }
  .chip { cursor:pointer; border:1px solid #ffffff1f; background:#ffffff0a; backdrop-filter:blur(8px); color:#f3e9f5;
    border-radius:999px; padding:7px 12px; font-size:13px; display:inline-flex; align-items:center; gap:8px; transition:.15s; }
  .chip:hover { background:#ffffff18; }
  .chip.sel { border-color:#ff8ec7; box-shadow:0 0 0 1px #ff8ec7aa, 0 0 16px #ff5ea644; }
  .chipring { width:16px;height:16px;border-radius:50%;
    background:conic-gradient(#ff4d8d calc(var(--p,0)*1%), #ffffff22 0); }

  .deck { display:flex; flex-direction:column; gap:8px; padding:10px 14px 14px; align-items:center; }
  .deckrow { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; align-items:center; }
  .deckrow .lbl { font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:#a99bb5; margin-right:2px; }
  .maxbox { display:flex; align-items:center; gap:8px; }
  .maxbox input { width:120px; accent-color:#ff4d8d; }
  .small { font-size:12px; color:#a99bb5; }

  #wave { position:fixed; left:0; right:0; bottom:0; height:64px; z-index:2; width:100%; display:block; opacity:.9; }

  /* log drawer */
  #logdrawer { position:fixed; z-index:6; right:0; top:0; height:100%; width:min(420px,90vw);
    background:#0c0810ee; backdrop-filter:blur(12px); border-left:1px solid #ffffff1f; transform:translateX(100%);
    transition:transform .25s ease; padding:16px; overflow:auto; }
  #logdrawer.open { transform:none; }
  #logdrawer h2 { font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:#a99bb5; }
  .log div { font-family:ui-monospace, Menlo, monospace; font-size:12px; padding:3px 0; border-bottom:1px solid #ffffff10; white-space:pre-wrap; }
  .lv-cmd{color:#9ecbff} .lv-safety{color:#ff9e9e} .lv-warn{color:#ffd27f} .lv-info{color:#9a90a6}

  /* funscript modal */
  #fsmodal { position:fixed; inset:0; z-index:7; background:#000a; display:none; align-items:center; justify-content:center; }
  #fsmodal.open { display:flex; }
  .modal { width:min(560px,92vw); background:#140d1a; border:1px solid #ffffff22; border-radius:16px; padding:18px; }
  .modal h3 { margin:0 0 10px; font-size:15px; }
  textarea#fs { width:100%; height:120px; background:#0b0710; color:#f3e9f5; border:1px solid #ffffff22; border-radius:10px;
    padding:10px; font-family:ui-monospace, Menlo, monospace; font-size:12px; resize:vertical; }
  label.opt { font-size:12px; color:#c9bcd2; display:inline-flex; align-items:center; gap:5px; }
  input[type=number]{ background:#0b0710; color:#f3e9f5; border:1px solid #ffffff22; border-radius:6px; padding:4px 6px; }
</style>
</head>
<body>
<canvas id="aurora"></canvas>
<div class="grain"></div>
<div class="wrap">
  <header>
    <span class="brand">claude·f·me</span>
    <span id="mode" class="pill">…</span>
    <span class="pill dot"><span id="conn" class="dot"></span><span id="connlbl"></span></span>
    <span id="active" class="pill act" style="display:none"></span>
    <span id="persona" class="pill act" style="display:none"></span>
    <button id="revealbtn" class="btn ghost" style="display:none" data-i18n="reveal"></button>
    <span id="duetbadge" class="pill act" style="display:none"></span>
    <span id="masters" class="pill act" style="display:none"></span>
    <div class="spacer"></div>
    <button id="lang" class="btn ghost"></button>
    <button id="logbtn" class="btn ghost" data-i18n="log"></button>
    <button id="remote" class="btn" data-i18n="remote"></button>
    <button id="scan" class="btn" data-i18n="scan"></button>
    <button id="stopall" class="btn estop" data-i18n="estop"></button>
  </header>

  <div class="stage">
    <div class="orb-host">
      <div id="rings" class="rings"><div class="ring"></div><div class="ring"></div><div class="ring"></div></div>
      <div id="orb" class="orb">
        <div class="orb-core"></div>
        <div class="orb-glow"></div>
        <div id="orbnum" class="orb-num"><b>0</b><small data-i18n="tapScan"></small></div>
      </div>
    </div>
    <div class="scrub"><input id="scrub" type="range" min="0" max="100" step="1" value="0" /></div>
    <div id="dock" class="dock"></div>
  </div>

  <div class="deck">
    <div class="deckrow">
      <span class="lbl" data-i18n="patterns"></span>
      <button class="chip" data-pat="pulse" data-i18n="pulse"></button>
      <button class="chip" data-pat="wave" data-i18n="wave"></button>
      <button class="chip" data-pat="escalate" data-i18n="escalate"></button>
      <button class="chip" data-pat="tease" data-i18n="tease"></button>
      <button class="chip" data-pat="heartbeat" data-i18n="heartbeat"></button>
      <button class="chip" data-pat="staircase" data-i18n="staircase"></button>
      <button class="chip" data-pat="sos" data-i18n="sos"></button>
      <button class="chip" data-pat="earthquake" data-i18n="earthquake"></button>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="game"></span>
      <button class="chip" data-game="roulette" data-i18n="roulette"></button>
      <button class="chip" data-game="escalation" data-i18n="escalation"></button>
      <button class="chip" data-game="ambient" data-i18n="ambient"></button>
      <button class="chip" data-game="edge" data-i18n="edge"></button>
      <button class="chip" data-game="wheel" data-i18n="wheel"></button>
      <button class="chip" id="surprise" data-i18n="surprise"></button>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="persona"></span>
      <span id="personas"></span>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="scene"></span>
      <span id="scenes"></span>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="muse"></span>
      <span id="muselib"></span>
      <input id="musebrief" type="text" data-i18n-ph="musePh" style="min-width:200px; flex:1; max-width:340px;
        background:#0b0710; color:#f3e9f5; border:1px solid #ffffff22; border-radius:999px; padding:7px 12px; font:inherit;" />
      <button class="chip" id="musego" data-i18n="museGo"></button>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="live"></span>
      <button class="chip" id="biobtn" data-i18n="bio"></button>
      <select id="biomode" style="background:#0b0710; color:#f3e9f5; border:1px solid #ffffff22; border-radius:999px; padding:6px 10px; font:inherit;">
        <option value="follow" data-i18n="bioFollow"></option>
        <option value="edge" data-i18n="bioEdge"></option>
      </select>
      <span id="bpmout" class="small"></span>
      <button class="chip" id="pomobtn" data-i18n="pomo"></button>
      <button class="chip" id="recbtn" data-i18n="rec"></button>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="market"></span>
      <input id="market" type="text" data-i18n-ph="marketPh" style="min-width:180px;
        background:#0b0710; color:#f3e9f5; border:1px solid #ffffff22; border-radius:999px; padding:7px 12px; font:inherit;" />
      <button class="chip" id="marketgo" data-i18n="marketGo"></button>
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="video"></span>
      <button class="chip" id="vidbtn" data-i18n="funscript"></button>
      <button class="chip" id="duetbtn" data-i18n="duet"></button>
      <span class="lbl" data-i18n="audio"></span>
      <button class="chip" id="audmic" data-i18n="useMic"></button>
      <button class="chip" id="audtab" data-i18n="useTab"></button>
      <button class="chip" id="audstop" style="display:none" data-i18n="stopAudio"></button>
      <button class="chip" id="modestop" data-i18n="stopMode"></button>
      <div class="maxbox"><span class="small" data-i18n="safetyMax"></span>
        <input id="max" type="range" min="0" max="1" step="0.01" value="1" /><span id="maxval" class="small">100%</span></div>
    </div>
    <div class="deckrow"><span class="small" data-i18n="keys"></span></div>
  </div>
</div>
<canvas id="wave"></canvas>

<div id="logdrawer"><h2 data-i18n="log"></h2><div id="log" class="log"></div></div>

<div id="fsmodal"><div class="modal">
  <h3 data-i18n="videoTitle"></h3>
  <textarea id="fs" data-i18n-ph="fsPh"></textarea>
  <div class="deckrow" style="margin-top:10px; justify-content:flex-start">
    <label class="opt"><input type="checkbox" id="fsloop" /> <span data-i18n="loop"></span></label>
    <label class="opt"><span data-i18n="speed"></span> <input id="fsspeed" type="number" min="0.1" max="4" step="0.1" value="1" style="width:58px" /></label>
    <label class="opt"><input type="checkbox" id="fsinv" /> <span data-i18n="invert"></span></label>
    <button class="btn ghost" id="fssample" data-i18n="sample"></button>
    <span class="spacer"></span>
    <button class="btn ghost" id="fsclose" data-i18n="close"></button>
    <button class="btn" id="fsplay" data-i18n="play"></button>
  </div>
  <div class="deckrow" style="margin-top:12px; justify-content:flex-start; border-top:1px solid #ffffff14; padding-top:12px">
    <label class="opt"><span data-i18n="pickVideo"></span> <input type="file" id="fsvideo" accept="video/*" /></label>
    <span class="spacer"></span>
    <button class="btn" id="fsvideoplay" data-i18n="vsyncPlay"></button>
  </div>
</div></div>

<div id="vsync" style="position:fixed; inset:0; z-index:8; background:#000d; display:none; align-items:center; justify-content:center; flex-direction:column; gap:10px;">
  <video id="vsyncvid" controls style="max-width:92vw; max-height:78vh; border-radius:12px; box-shadow:0 0 60px #ff5ea655;"></video>
  <button class="btn estop" id="vsyncclose" data-i18n="vsyncClose" style="font-weight:700"></button>
</div>

<div id="duetmodal"><div class="modal">
  <h3 data-i18n="duetTitle"></h3>
  <div class="deckrow" style="justify-content:flex-start; gap:10px">
    <label class="opt" style="flex:1"><span data-i18n="duetRelay"></span>
      <input id="duetrelay" type="text" style="width:100%; margin-top:4px" /></label>
  </div>
  <div class="deckrow" style="justify-content:flex-start; gap:10px; margin-top:8px">
    <label class="opt"><span data-i18n="duetRoom"></span> <input id="duetroom" type="text" style="width:120px" /></label>
    <label class="opt"><span data-i18n="duetMode"></span>
      <select id="duetmode" style="background:#0b0710; color:#f3e9f5; border:1px solid #ffffff22; border-radius:6px; padding:4px 6px">
        <option value="mirror" data-i18n="duetMirror"></option>
        <option value="lead" data-i18n="duetLead"></option>
        <option value="follow" data-i18n="duetFollow"></option>
      </select></label>
  </div>
  <div class="deckrow" style="justify-content:flex-start; margin-top:10px">
    <span id="duetstatus" class="small" data-i18n="duetOffline"></span>
  </div>
  <div class="deckrow" style="margin-top:10px; justify-content:flex-start">
    <button class="btn" id="duettouch" data-i18n="duetTouch" disabled></button>
    <span class="spacer"></span>
    <button class="btn ghost" id="duetclose" data-i18n="close"></button>
    <button class="btn" id="duetconnect" data-i18n="duetConnect"></button>
  </div>
</div></div>

<script>
  var I18N = {
    en: { remote:"👑 Remote", scan:"Scan", estop:"■ STOP", log:"Log",
      connecting:"connecting", connected:"connected", reconnecting:"reconnecting",
      tapScan:"tap SCAN", allTarget:"ALL", motor:"motor", motors:"motors",
      patterns:"Patterns", pulse:"Pulse", wave:"Wave", escalate:"Escalate", tease:"Tease",
      heartbeat:"💓 Heartbeat", staircase:"🪜 Stairs", sos:"📡 SOS", earthquake:"🌋 Quake",
      game:"Game", roulette:"🎲 Roulette", escalation:"📈 Escalation", ambient:"🌊 Ambient", edge:"🔥 Edge", wheel:"🎡 Wheel",
      surprise:"🎰 Surprise",
      video:"Video", funscript:"🎬 Funscript", audio:"Audio", useMic:"🎤 Mic", useTab:"🔊 Tab", stopAudio:"■ Audio",
      stopMode:"■ Stop mode", safetyMax:"max",
      videoTitle:"🎬 Video — funscript", fsPh:'paste funscript JSON e.g. {"actions":[{"at":0,"pos":0},{"at":600,"pos":100}]}',
      sample:"Load sample", loop:"loop", speed:"speed", invert:"invert", play:"▶ Play", close:"Close",
      keys:"keys: 0–9 set level · space stop · S scan",
      mastersOn:"👑 {n} master", mastersOnN:"👑 {n} masters",
      muse:"Muse", musePh:"describe a vibe — e.g. 10-min slow burn", museGo:"✨ Compose",
      museNoKey:"No model key set — ask Claude in chat to compose (or set ANTHROPIC_API_KEY).",
      museErr:"Compose failed: ", needBrief:"Describe a vibe first.",
      persona:"Persona", reveal:"Reveal", blind:"🎭 Blind", scene:"Scene",
      live:"Live", bio:"💓 Heart rate", bioStop:"■ Heart rate", bioFollow:"follow", bioEdge:"auto-edge",
      bioFail:"Bluetooth HR failed: ", bioNoBt:"This browser has no Web Bluetooth — use Chrome/Edge over https or localhost.", bpm:"bpm",
      pomo:"🍅 Focus 25m", pomoStop:"■ Focus", pomoLeft:"🍅 {m}:{s}",
      rec:"⏺ Record", recStop:"⏹ Save", recName:"Name this recording (blank = auto):", recSaved:"💾 saved as ", recShort:"recording too short",
      vsync:"🎞️ With video", vsyncPlay:"▶ Play with video", vsyncClose:"✕ Close video", needVid:"Choose a video file first.", pickVideo:"video file",
      market:"Market", marketPh:"ticker — AAPL / tesla / bitcoin", marketGo:"📈 Feel it", needTicker:"Enter a ticker or company.",
      duet:"💞 Duet", duetTitle:"💞 Duet — long-distance sync", duetRelay:"relay URL", duetRoom:"room code",
      duetMode:"mode", duetMirror:"mirror", duetLead:"I lead", duetFollow:"I follow",
      duetConnect:"Connect", duetLeave:"Leave", duetTouch:"👋 Touch",
      duetWaiting:"waiting for partner…", duetLinked:"partner linked", duetOffline:"not connected",
      duetPeers:"{n} in room", duetBadge:"🔗 Duet",
      needFs:"Paste a funscript JSON first.", audFail:"Audio capture failed: ", langBtn:"中文" },
    zh: { remote:"👑 遥控", scan:"扫描", estop:"■ 停止", log:"日志",
      connecting:"连接中", connected:"已连接", reconnecting:"重连中",
      tapScan:"点扫描", allTarget:"全部", motor:"马达", motors:"马达",
      patterns:"节奏", pulse:"脉冲", wave:"波浪", escalate:"递增", tease:"挑逗",
      heartbeat:"💓 心跳", staircase:"🪜 楼梯", sos:"📡 SOS", earthquake:"🌋 地震",
      game:"游戏", roulette:"🎲 轮盘", escalation:"📈 递增", ambient:"🌊 环境", edge:"🔥 边缘", wheel:"🎡 转盘",
      surprise:"🎰 随机",
      video:"视频", funscript:"🎬 脚本", audio:"音频", useMic:"🎤 麦克风", useTab:"🔊 标签页", stopAudio:"■ 音频",
      stopMode:"■ 停止模式", safetyMax:"上限",
      videoTitle:"🎬 视频 — funscript", fsPh:'粘贴 funscript JSON，例如 {"actions":[{"at":0,"pos":0},{"at":600,"pos":100}]}',
      sample:"载入示例", loop:"循环", speed:"速度", invert:"反向", play:"▶ 播放", close:"关闭",
      keys:"快捷键：0–9 设强度 · 空格 停止 · S 扫描",
      mastersOn:"👑 {n} 位主人", mastersOnN:"👑 {n} 位主人",
      muse:"作曲", musePh:"描述一种感觉 — 例如 10 分钟慢热", museGo:"✨ 作曲",
      museNoKey:"未配置模型 key — 去聊天里让 Claude 作曲（或设置 ANTHROPIC_API_KEY）。",
      museErr:"作曲失败：", needBrief:"请先描述一种感觉。",
      persona:"人格", reveal:"揭晓", blind:"🎭 盲盒", scene:"剧本",
      live:"实时", bio:"💓 心率", bioStop:"■ 心率", bioFollow:"跟随", bioEdge:"自动边缘",
      bioFail:"蓝牙心率连接失败：", bioNoBt:"此浏览器不支持 Web Bluetooth — 请用 Chrome/Edge，且在 https 或 localhost 下。", bpm:"次/分",
      pomo:"🍅 专注 25 分钟", pomoStop:"■ 专注", pomoLeft:"🍅 {m}:{s}",
      rec:"⏺ 录制", recStop:"⏹ 保存", recName:"给这段录制起名（留空自动）：", recSaved:"💾 已存为 ", recShort:"录制太短",
      vsync:"🎞️ 配视频", vsyncPlay:"▶ 配视频播放", vsyncClose:"✕ 关闭视频", needVid:"请先选一个视频文件。", pickVideo:"视频文件",
      market:"市值", marketPh:"代码 — AAPL / 特斯拉 / 比特币", marketGo:"📈 感受它", needTicker:"请输入代码或公司名。",
      duet:"💞 双人", duetTitle:"💞 双人 — 异地同步", duetRelay:"中转地址", duetRoom:"房间码",
      duetMode:"模式", duetMirror:"镜像", duetLead:"我主导", duetFollow:"我跟随",
      duetConnect:"连接", duetLeave:"断开", duetTouch:"👋 触碰",
      duetWaiting:"等待伙伴…", duetLinked:"伙伴已连接", duetOffline:"未连接",
      duetPeers:"房间内 {n} 人", duetBadge:"🔗 双人",
      needFs:"请先粘贴 funscript JSON。", audFail:"音频采集失败：", langBtn:"EN" }
  };
  var qlang = new URLSearchParams(location.search).get("lang");
  if (qlang) qlang = qlang.indexOf("zh") === 0 ? "zh" : "en";
  var lang = qlang || localStorage.getItem("cfm_lang") || ((navigator.language||"").indexOf("zh")===0 ? "zh" : "en");
  if (qlang) localStorage.setItem("cfm_lang", qlang);
  function t(k){ return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }
  function applyI18n(){
    document.querySelectorAll("[data-i18n]").forEach(function(el){ el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){ el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    document.getElementById("lang").textContent = t("langBtn");
    if (typeof renderScenes === "function") renderScenes();
    if (state) render();
  }

  var $ = function(s){ return document.querySelector(s); };
  var ws, state = null, target = "all", held = false, maxHeld = false;
  var lvl = 0, lvlEase = 0; // smoothed display level
  var museScores = [], museLlm = false;
  var PERSONAS = [
    { id:"slowburn", emoji:"🕯️", en:"Slow Burn", zh:"慢炖" },
    { id:"brat", emoji:"😈", en:"Brat", zh:"小恶魔" },
    { id:"metronome", emoji:"🎼", en:"Metronome", zh:"节拍器" },
    { id:"storm", emoji:"⛈️", en:"Storm", zh:"风暴" },
    { id:"oracle", emoji:"🔮", en:"Oracle", zh:"神谕" }
  ];
  // duet state
  var dws=null, duetMode="mirror", partnerLvl=0, duetPeers=0, partnerSeen=0;

  function connect(){
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    ws = new WebSocket(proto + location.host + "/ws");
    ws.onopen = function(){ $("#conn").classList.add("on"); $("#connlbl").textContent = t("connected"); };
    ws.onclose = function(){ $("#conn").classList.remove("on"); $("#connlbl").textContent = t("reconnecting"); setTimeout(connect, 1000); };
    ws.onmessage = function(e){ var m = JSON.parse(e.data);
      if (m.type === "state") { state = m.state; render(); }
      else if (m.type === "muse_list") { museScores = m.scores||[]; museLlm = !!m.llm; renderMuse();
        if (m.recorded){ alert(m.recorded.saved ? (t("recSaved")+m.recorded.saved) : t("recShort")); } }
      else if (m.type === "muse_error") { alert(t("museErr") + m.message); }
    };
  }
  var send = function(o){ try { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); } catch(e){} };

  function targetLevel(){
    if (!state || !state.devices.length) return 0;
    if (target === "all") return state.devices.reduce(function(a,d){ return Math.max(a, d.intensity); }, 0);
    var d = state.devices.filter(function(x){ return x.id === target; })[0];
    return d ? d.intensity : 0;
  }

  function render(){
    if (!state) return;
    var mode = $("#mode"); mode.textContent = state.mode; mode.className = "pill " + (state.mode === "buttplug" ? "bp" : "sim");

    var act = $("#active"), mEl = $("#masters");
    if (state.activeMode){ act.style.display=""; var ic={video:"🎬 ",audio:"🎵 ",muse:"🎼 ",bio:"💓 ",market:"📈 ",game:"🎮 "}; act.textContent = (ic[state.activeMode.type]||"🎮 ") + state.activeMode.label; }
    else act.style.display="none";
    if (state.masters > 0){ mEl.style.display=""; mEl.textContent = (state.masters>1?t("mastersOnN"):t("mastersOn")).replace("{n}", state.masters); } else mEl.style.display="none";

    // persona pill + reveal + picker
    var pEl = $("#persona"), rEl = $("#revealbtn");
    if (state.persona){ pEl.style.display=""; pEl.textContent = state.persona.emoji + " " + state.persona.name + (state.persona.model?" · "+state.persona.model:"");
      rEl.style.display = state.persona.blind ? "" : "none"; }
    else { pEl.style.display="none"; rEl.style.display="none"; }
    renderPersonas();

    // ensure target still valid
    if (target !== "all" && !state.devices.some(function(d){ return d.id===target; })) target = "all";
    lvl = targetLevel();

    var num = $("#orbnum");
    if (!state.devices.length){ num.innerHTML = '<b>—</b><small>'+esc(t("tapScan"))+'</small>'; }
    else { num.innerHTML = '<b>'+Math.round(lvl*100)+'</b><small>%</small>'; }
    if (!held) $("#scrub").value = Math.round(lvl*100);
    if (!maxHeld){ $("#max").value = state.maxIntensity; $("#maxval").textContent = Math.round(state.maxIntensity*100)+"%"; }

    // device dock
    var dock = $("#dock"); dock.innerHTML = "";
    var mk = function(id, label, p, sel){
      var c = document.createElement("div"); c.className = "chip" + (sel?" sel":"");
      c.innerHTML = '<span class="chipring" style="--p:'+Math.round(p*100)+'"></span>' + esc(label);
      c.onclick = function(){ target = id; render(); };
      dock.appendChild(c);
    };
    if (state.devices.length){
      mk("all", t("allTarget"), lvl, target==="all");
      state.devices.forEach(function(d){ mk(d.id, d.name, d.intensity, target===d.id); });
    }

    // log
    var log = $("#log"); log.innerHTML = "";
    state.log.slice().reverse().forEach(function(l){ var div=document.createElement("div"); div.className="lv-"+l.level;
      div.textContent = new Date(l.t).toLocaleTimeString()+"  "+l.msg; log.appendChild(div); });
  }

  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]; }); };

  // ---- aurora background + orb reactor (one RAF loop) ----
  var ac = $("#aurora"), actx = ac.getContext("2d");
  var wc = $("#wave"), wctx = wc.getContext("2d");
  function resize(){ ac.width = innerWidth; ac.height = innerHeight; wc.width = innerWidth; wc.height = 64; }
  addEventListener("resize", resize); resize();
  var blobs = [];
  for (var i=0;i<5;i++) blobs.push({ x:Math.random(), y:Math.random(), s:0.6+Math.random()*0.7, h:300+Math.random()*60, ph:Math.random()*6.28, sp:0.2+Math.random()*0.5 });
  var tms = 0;
  function frame(){
    tms += 0.016;
    lvlEase += (lvl - lvlEase) * 0.12;
    var L = lvlEase;

    // background
    actx.globalCompositeOperation = "source-over";
    actx.fillStyle = "#070509"; actx.fillRect(0,0,ac.width,ac.height);
    actx.globalCompositeOperation = "lighter";
    var W = ac.width, H = ac.height;
    blobs.forEach(function(b){
      var x = (0.5 + Math.cos(tms*b.sp*(0.4+L*1.6) + b.ph)*0.34*b.s) * W;
      var y = (0.5 + Math.sin(tms*b.sp*(0.5+L*1.4) + b.ph*1.3)*0.34*b.s) * H;
      var r = (Math.min(W,H) * (0.22 + L*0.26)) * b.s;
      var g = actx.createRadialGradient(x,y,0,x,y,r);
      var a = (0.05 + L*0.20);
      g.addColorStop(0, "hsla("+b.h+",90%,62%,"+a+")");
      g.addColorStop(1, "hsla("+b.h+",90%,50%,0)");
      actx.fillStyle = g; actx.beginPath(); actx.arc(x,y,r,0,6.2832); actx.fill();
    });

    // duet partner presence — a teal bloom that decays if no recent update
    if (partnerSeen && (Date.now()-partnerSeen) > 1200) partnerLvl *= 0.94;
    if (partnerLvl > 0.01){
      var pr = (Math.min(W,H) * (0.18 + partnerLvl*0.3));
      var pg = actx.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,pr);
      pg.addColorStop(0, "hsla(165,90%,60%,"+(0.05+partnerLvl*0.22)+")");
      pg.addColorStop(1, "hsla(165,90%,50%,0)");
      actx.fillStyle = pg; actx.beginPath(); actx.arc(W*0.5,H*0.5,pr,0,6.2832); actx.fill();
    }

    // orb reactor vars
    document.documentElement.style.setProperty("--lvl", L.toFixed(3));
    var orb = $("#orb"); if (orb) orb.style.transform = "scale(" + (1 + L*0.16).toFixed(3) + ")";
    if (orb) orb.style.filter = "brightness(" + (1 + L*0.5).toFixed(2) + ") saturate(" + (1 + L*0.6).toFixed(2) + ")";
    var rings = $("#rings"); if (rings){ rings.style.opacity = (0.12 + L*0.8).toFixed(2);
      rings.style.setProperty("--rspd", (1.7 - L*1.15).toFixed(2) + "s"); }

    // waveform (real audio if capturing, else synth from level)
    wctx.clearRect(0,0,wc.width,wc.height);
    var bars = 64, bw = wc.width / bars;
    for (var k=0;k<bars;k++){
      var v;
      if (audioData){ v = audioData[Math.floor(k/bars*audioData.length)]/255; }
      else { v = L * (0.35 + 0.65*Math.abs(Math.sin(k*0.4 + tms*3))); }
      var h = Math.max(1, v * 58);
      var grad = wctx.createLinearGradient(0, wc.height-h, 0, wc.height);
      grad.addColorStop(0, "#ff8ec7"); grad.addColorStop(1, "#a06bff");
      wctx.fillStyle = grad; wctx.globalAlpha = 0.35 + 0.65*L + (audioData?0.3:0);
      wctx.fillRect(k*bw+1, wc.height-h, bw-2, h);
    }
    wctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---- controls ----
  var scrub = $("#scrub");
  scrub.addEventListener("input", function(){ held = true; lvl = scrub.value/100; send({ type:"set", id:target, intensity: scrub.value/100 }); if (window.__duetForward) window.__duetForward(scrub.value/100); });
  scrub.addEventListener("pointerup", function(){ held = false; });
  scrub.addEventListener("pointercancel", function(){ held = false; });

  $("#scan").onclick = function(){ send({ type:"scan", ms:4000 }); };
  $("#stopall").onclick = function(){ stopAudio(); send({ type:"stop_all" }); };
  $("#remote").onclick = function(){ window.open("/master","_blank"); };
  $("#lang").onclick = function(){ lang = (lang==="en"?"zh":"en"); localStorage.setItem("cfm_lang", lang); applyI18n(); };
  $("#logbtn").onclick = function(){ $("#logdrawer").classList.toggle("open"); };

  var maxEl = $("#max");
  maxEl.addEventListener("pointerdown", function(){ maxHeld = true; });
  maxEl.addEventListener("pointerup", function(){ maxHeld = false; });
  maxEl.addEventListener("input", function(){ $("#maxval").textContent = Math.round(maxEl.value*100)+"%"; send({ type:"set_max", value: parseFloat(maxEl.value) }); });

  document.querySelectorAll("[data-pat]").forEach(function(b){ b.addEventListener("click", function(){ send({ type:"pattern", target:target, preset:b.getAttribute("data-pat"), loops:2 }); }); });
  document.querySelectorAll("[data-game]").forEach(function(b){ b.addEventListener("click", function(){ send({ type:"start_game", target:target, gameType:b.getAttribute("data-game") }); }); });
  $("#modestop").onclick = function(){ stopAudio(); send({ type:"stop_mode", target:target }); };

  // surprise — random game or pattern
  $("#surprise").onclick = function(){
    var games = ["roulette","ambient","edge","wheel"];
    var pats = ["pulse","wave","escalate","tease","heartbeat","staircase","earthquake"];
    if (Math.random() < 0.5) send({ type:"start_game", target:target, gameType: games[Math.floor(Math.random()*games.length)] });
    else send({ type:"pattern", target:target, preset: pats[Math.floor(Math.random()*pats.length)], loops:3 });
  };

  // funscript modal
  var SAMPLE_FS = JSON.stringify({ actions:[
    {at:0,pos:0},{at:400,pos:90},{at:800,pos:20},{at:1200,pos:100},{at:1700,pos:40},
    {at:2100,pos:95},{at:2600,pos:10},{at:3000,pos:70},{at:3400,pos:0},{at:4000,pos:100},
    {at:4600,pos:30},{at:5200,pos:85},{at:5800,pos:0}
  ]});
  $("#vidbtn").onclick = function(){ $("#fsmodal").classList.add("open"); };
  $("#fsclose").onclick = function(){ $("#fsmodal").classList.remove("open"); };
  $("#fssample").onclick = function(){ $("#fs").value = SAMPLE_FS; };
  $("#fsmodal").addEventListener("click", function(e){ if (e.target === $("#fsmodal")) $("#fsmodal").classList.remove("open"); });
  $("#fsplay").onclick = function(){
    var source = $("#fs").value.trim(); if (!source){ alert(t("needFs")); return; }
    send({ type:"play_video", target:target, source:source, loop:$("#fsloop").checked, speed:parseFloat($("#fsspeed").value)||1, invert:$("#fsinv").checked });
    $("#fsmodal").classList.remove("open");
  };

  // ---- video + funscript sync: the browser plays the video and drives the
  // device from video.currentTime, so pause / seek / speed all stay in sync ----
  var vsRAF=null, vsActs=null, vsUrl=null, vsLast=0;
  function parseFsActions(){
    try {
      var d = JSON.parse($("#fs").value.trim());
      var a = (d.actions||[]).map(function(x){return {at:+x.at, pos:+x.pos};})
        .filter(function(x){return isFinite(x.at)&&isFinite(x.pos);})
        .sort(function(p,q){return p.at-q.at;});
      return a.length?a:null;
    } catch(e){ return null; }
  }
  function sampleActs(a, ms){
    if (ms<=a[0].at) return a[0].pos;
    var last=a[a.length-1]; if (ms>=last.at) return last.pos;
    var lo=0,hi=a.length-1; while(lo<hi){var mm=(lo+hi)>>1; if(a[mm].at<=ms)lo=mm+1; else hi=mm;}
    var b=a[lo],c=a[lo-1],span=b.at-c.at||1,f=(ms-c.at)/span;
    return c.pos+(b.pos-c.pos)*f;
  }
  $("#fsvideoplay").onclick = function(){
    var f = $("#fsvideo").files && $("#fsvideo").files[0];
    if (!f){ alert(t("needVid")); return; }
    vsActs = parseFsActions();
    if (!vsActs){ alert(t("needFs")); return; }
    var inv = $("#fsinv").checked;
    if (vsUrl) URL.revokeObjectURL(vsUrl);
    vsUrl = URL.createObjectURL(f);
    var v = $("#vsyncvid"); v.src = vsUrl;
    $("#fsmodal").classList.remove("open"); $("#vsync").style.display="flex";
    send({ type:"clientmode", on:true, modeType:"video", label:"🎞️ video sync" });
    v.play().catch(function(){});
    (function loop(){
      vsRAF = requestAnimationFrame(loop);
      if (v.paused || v.ended) return;
      var now=(performance&&performance.now)?performance.now():Date.now();
      if (now - vsLast < 50) return; // ~20Hz
      vsLast = now;
      var pos = sampleActs(vsActs, v.currentTime*1000);
      var iv = Math.max(0, Math.min(1, (inv?100-pos:pos)/100));
      lvl = iv; send({ type:"drive", target:target, intensity:iv });
    })();
  };
  function vsyncStop(){
    if (vsRAF) cancelAnimationFrame(vsRAF); vsRAF=null;
    var v=$("#vsyncvid"); try{ v.pause(); }catch(e){} v.removeAttribute("src"); if (v.load) v.load();
    if (vsUrl){ URL.revokeObjectURL(vsUrl); vsUrl=null; }
    $("#vsync").style.display="none";
    send({ type:"clientmode", on:false, target:target });
  }
  $("#vsyncclose").onclick = vsyncStop;
  $("#vsyncvid").addEventListener("pause", function(){ send({ type:"drive", target:target, intensity:0 }); });
  $("#vsyncvid").addEventListener("ended", function(){ send({ type:"drive", target:target, intensity:0 }); });

  // keyboard shortcuts: 0-9 set level, space=stop, s=scan
  addEventListener("keydown", function(e){
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key >= "0" && e.key <= "9"){ var v=(e.key==="0"?0:parseInt(e.key,10)/10); held=true; lvl=v; $("#scrub").value=Math.round(v*100); send({ type:"set", id:target, intensity:v }); if (window.__duetForward) window.__duetForward(v); setTimeout(function(){held=false;},120); }
    else if (e.code === "Space"){ e.preventDefault(); stopAudio(); send({ type:"stop_all" }); }
    else if (e.key === "s" || e.key === "S"){ send({ type:"scan", ms:4000 }); }
  });

  // audio capture
  var audioCtx=null, audioStream=null, audioRAF=null, audioOn=false, lastSend=0, analyser=null, audioData=null, abuf=null;
  function startAudio(kind){
    var req = kind==="tab" ? navigator.mediaDevices.getDisplayMedia({audio:true,video:true}) : navigator.mediaDevices.getUserMedia({audio:true});
    req.then(function(stream){
      audioStream = stream; if (kind==="tab") stream.getVideoTracks().forEach(function(tr){ tr.stop(); });
      audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      var src = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 256; src.connect(analyser);
      audioData = new Uint8Array(analyser.frequencyBinCount);
      abuf = new Float32Array(analyser.fftSize);
      audioOn = true; send({ type:"audio_start", source: kind==="tab"?"tab audio":"mic" });
      $("#audmic").style.display="none"; $("#audtab").style.display="none"; $("#audstop").style.display="";
      (function loop(){
        if (!audioOn) return;
        analyser.getByteFrequencyData(audioData);
        analyser.getFloatTimeDomainData(abuf);
        var sum=0; for (var i=0;i<abuf.length;i++) sum+=abuf[i]*abuf[i];
        var rms=Math.sqrt(sum/abuf.length);
        var v=Math.max(0,Math.min(1, rms*4*2.5));
        var now=(performance&&performance.now)?performance.now():Date.now();
        if (now-lastSend>50){ lastSend=now; send({ type:"drive", target:target, intensity:v }); }
        audioRAF=requestAnimationFrame(loop);
      })();
    }).catch(function(e){ alert(t("audFail")+e.message); });
  }
  function stopAudio(){
    if (!audioOn && !audioStream) return;
    audioOn=false; if (audioRAF) cancelAnimationFrame(audioRAF);
    if (audioStream) audioStream.getTracks().forEach(function(tr){ tr.stop(); });
    if (audioCtx) audioCtx.close();
    audioStream=audioCtx=analyser=null; audioData=null;
    send({ type:"audio_stop" });
    $("#audmic").style.display=""; $("#audtab").style.display=""; $("#audstop").style.display="none";
  }
  $("#audmic").onclick = function(){ startAudio("mic"); };
  $("#audtab").onclick = function(){ startAudio("tab"); };
  $("#audstop").onclick = stopAudio;

  // ---- personas ----
  function renderPersonas(){
    var host = $("#personas"); if (!host) return;
    var activeId = state && state.persona && !state.persona.blind ? state.persona.id : null;
    host.innerHTML = "";
    PERSONAS.forEach(function(p){
      var c = document.createElement("button"); c.className = "chip" + (p.id===activeId?" sel":"");
      c.textContent = p.emoji + " " + (lang==="zh"?p.zh:p.en);
      c.onclick = function(){ send({ type:"set_persona", id:p.id }); };
      host.appendChild(c);
    });
    var b = document.createElement("button"); b.className = "chip" + (state&&state.persona&&state.persona.blind?" sel":"");
    b.textContent = t("blind"); b.onclick = function(){ send({ type:"set_persona", id:"blind" }); };
    host.appendChild(b);
  }
  $("#revealbtn").onclick = function(){ send({ type:"reveal_persona" }); };

  // ---- scenes: one tap = set a persona + play its themed score ----
  var SCENES = [
    { emoji:"🍼", en:"Mommy", zh:"妈咪", persona:"mommy", score:"slow-build" },
    { emoji:"🕯️", en:"Slow Burn", zh:"慢炖", persona:"slowburn", score:"slow-build" },
    { emoji:"🎢", en:"Rollercoaster", zh:"过山车", persona:"brat", score:"rollercoaster" },
    { emoji:"⛈️", en:"Storm", zh:"风暴", persona:"storm", score:"storm" },
    { emoji:"💌", en:"Love note", zh:"情话", persona:"oracle", score:"ily-morse" }
  ];
  function renderScenes(){
    var host = $("#scenes"); if (!host) return; host.innerHTML = "";
    SCENES.forEach(function(sc){
      var c = document.createElement("button"); c.className = "chip";
      c.textContent = sc.emoji + " " + (lang==="zh"?sc.zh:sc.en);
      c.onclick = function(){ send({ type:"set_persona", id:sc.persona }); send({ type:"play_score", name:sc.score, target:target }); };
      host.appendChild(c);
    });
  }

  // ---- muse ----
  function renderMuse(){
    var host = $("#muselib"); if (!host) return;
    host.innerHTML = "";
    museScores.forEach(function(s){
      var c = document.createElement("button"); c.className = "chip";
      var secs = Math.round((s.durationMs||0)/1000);
      c.textContent = "♪ " + s.name + " · " + secs + "s";
      c.title = (s.brief||"") + (s.by?" — "+s.by:"");
      c.onclick = function(){ send({ type:"play_score", name:s.name, target:target }); };
      host.appendChild(c);
    });
  }
  function museCompose(){
    var brief = $("#musebrief").value.trim();
    if (!brief){ alert(t("needBrief")); return; }
    if (!museLlm){ alert(t("museNoKey")); return; }
    send({ type:"muse_compose", brief:brief, target:target });
    $("#musebrief").value = "";
  }
  $("#musego").onclick = museCompose;
  $("#musebrief").addEventListener("keydown", function(e){ if (e.key==="Enter") museCompose(); });

  // ---- duet ----
  $("#duetbtn").onclick = function(){
    if (!$("#duetrelay").value) $("#duetrelay").value = (location.protocol==="https:"?"wss://":"ws://") + location.host + "/relay";
    if (!$("#duetroom").value) $("#duetroom").value = Math.random().toString(36).slice(2,7);
    $("#duetmodal").classList.add("open");
  };
  $("#duetclose").onclick = function(){ $("#duetmodal").classList.remove("open"); };
  $("#duetmodal").addEventListener("click", function(e){ if (e.target === $("#duetmodal")) $("#duetmodal").classList.remove("open"); });
  $("#duetmode").addEventListener("change", function(){ duetMode = $("#duetmode").value; });

  function duetStatus(){
    var s = $("#duetstatus");
    if (!dws || dws.readyState!==1){ s.textContent = t("duetOffline"); $("#duetbadge").style.display="none"; return; }
    var linked = duetPeers > 1;
    s.textContent = (linked? t("duetLinked") : t("duetWaiting")) + " · " + t("duetPeers").replace("{n}", duetPeers);
    $("#duettouch").disabled = !linked;
    $("#duetbadge").style.display=""; $("#duetbadge").textContent = t("duetBadge");
  }
  function duetSend(o){ try { if (dws && dws.readyState===1) dws.send(JSON.stringify(o)); } catch(e){} }
  // called from local controls to forward MY level to the partner
  function duetForward(v){ if (dws && dws.readyState===1 && (duetMode==="lead"||duetMode==="mirror")) duetSend({ k:"level", v:v }); }
  window.__duetForward = duetForward;

  function duetConnect(){
    var url = $("#duetrelay").value.trim(); var room = $("#duetroom").value.trim()||"lobby";
    if (!url) return;
    duetMode = $("#duetmode").value;
    try { dws = new WebSocket(url + (url.indexOf("?")<0?"?":"&") + "room=" + encodeURIComponent(room)); } catch(e){ alert(String(e)); return; }
    dws.onopen = function(){ duetSend({ k:"hello" }); $("#duetconnect").textContent = t("duetLeave"); duetStatus(); };
    dws.onclose = function(){ duetPeers=0; partnerLvl=0; $("#duetconnect").textContent = t("duetConnect"); duetStatus(); };
    dws.onmessage = function(e){
      var m; try { m = JSON.parse(e.data); } catch(_){ return; }
      if (m.type === "peers"){ duetPeers = m.peers; duetStatus(); return; }
      if (m.k === "level"){ partnerLvl = Math.max(0, Math.min(1, +m.v||0)); partnerSeen = Date.now();
        if (duetMode==="follow"||duetMode==="mirror") send({ type:"drive", target:target, intensity:partnerLvl }); }
      else if (m.k === "touch"){ partnerLvl = 0.85; partnerSeen = Date.now();
        if (duetMode==="follow"||duetMode==="mirror") send({ type:"set", id:target, intensity:0.85, durationMs:450 }); }
    };
  }
  $("#duetconnect").onclick = function(){
    if (dws && (dws.readyState===0||dws.readyState===1)){ dws.close(); dws=null; }
    else duetConnect();
  };
  $("#duettouch").onclick = function(){ duetSend({ k:"touch" }); };

  // ---- biofeedback: Web Bluetooth heart-rate → intensity / auto-edge ----
  var bioOn=false, bioDev=null, bioChar=null, hr=0, hrMin=999, hrMax=0, bioTick=null, bioDeny=0;
  function parseHR(dv){ var flags=dv.getUint8(0); return (flags&1) ? dv.getUint16(1,true) : dv.getUint8(1); }
  async function bioStart(){
    if (!navigator.bluetooth){ alert(t("bioNoBt")); return; }
    try {
      bioDev = await navigator.bluetooth.requestDevice({ filters:[{ services:["heart_rate"] }] });
      var server = await bioDev.gatt.connect();
      var svc = await server.getPrimaryService("heart_rate");
      bioChar = await svc.getCharacteristic("heart_rate_measurement");
      await bioChar.startNotifications();
      bioChar.addEventListener("characteristicvaluechanged", function(e){
        hr = parseHR(e.target.value);
        if (hr>30 && hr<240){ hrMin=Math.min(hrMin,hr); hrMax=Math.max(hrMax,hr); }
        $("#bpmout").textContent = hr + " " + t("bpm");
      });
      bioOn=true; bioDeny=0; hrMin=999; hrMax=0;
      send({ type:"bio_start", label:"💓 HR" });
      $("#biobtn").textContent = t("bioStop"); $("#biobtn").classList.add("sel");
      bioTick = setInterval(bioDrive, 150);
    } catch(e){ alert(t("bioFail") + (e&&e.message||e)); }
  }
  function bioDrive(){
    if (!bioOn || hr<=0 || hrMax-hrMin < 4) return; // need a little range first
    var norm = Math.max(0, Math.min(1, (hr - hrMin) / (hrMax - hrMin)));
    var v;
    if ($("#biomode").value === "edge"){
      var now = Date.now();
      if (bioDeny > now){ v = 0; }
      else if (norm > 0.82){ bioDeny = now + 4000; v = 0; } // too close → deny + rest
      else { v = norm; }
    } else { v = norm; } // follow
    send({ type:"drive", target:target, intensity:v });
  }
  function bioStop(){
    if (!bioOn && !bioDev) return;
    bioOn=false; if (bioTick) clearInterval(bioTick);
    try { if (bioChar) bioChar.stopNotifications(); } catch(e){}
    try { if (bioDev && bioDev.gatt.connected) bioDev.gatt.disconnect(); } catch(e){}
    bioDev=bioChar=null; $("#bpmout").textContent="";
    send({ type:"bio_stop", target:target });
    $("#biobtn").textContent = t("bio"); $("#biobtn").classList.remove("sel");
  }
  $("#biobtn").onclick = function(){ bioOn ? bioStop() : bioStart(); };

  // ---- pomodoro: focus timer → reward on completion (dev trigger) ----
  var pomoEnd=0, pomoTick=null;
  function pomoStop(){ if (pomoTick) clearInterval(pomoTick); pomoTick=null; pomoEnd=0; $("#pomobtn").textContent=t("pomo"); $("#pomobtn").classList.remove("sel"); }
  $("#pomobtn").onclick = function(){
    if (pomoTick){ pomoStop(); return; }
    pomoEnd = Date.now() + 25*60*1000; $("#pomobtn").classList.add("sel");
    pomoTick = setInterval(function(){
      var left = Math.max(0, pomoEnd - Date.now());
      if (left <= 0){ pomoStop(); fetch("/dev",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:"event=focus_done"}).catch(function(){}); return; }
      var m=Math.floor(left/60000), s=Math.floor((left%60000)/1000);
      $("#pomobtn").textContent = t("pomoLeft").replace("{m}",m).replace("{s}",(s<10?"0":"")+s);
    }, 500);
  };

  // ---- session recorder ----
  var recOn=false;
  $("#recbtn").onclick = function(){
    if (!recOn){ recOn=true; send({ type:"rec_start" }); $("#recbtn").textContent=t("recStop"); $("#recbtn").classList.add("sel"); }
    else { recOn=false; var name=prompt(t("recName"))||""; send({ type:"rec_stop", name:name }); $("#recbtn").textContent=t("rec"); $("#recbtn").classList.remove("sel"); }
  };

  // ---- market mode: feel a stock/crypto's live move ----
  function marketGo(){
    var sym = $("#market").value.trim();
    if (!sym){ alert(t("needTicker")); return; }
    send({ type:"market_start", symbol:sym, target:target });
  }
  $("#marketgo").onclick = marketGo;
  $("#market").addEventListener("keydown", function(e){ if (e.key==="Enter") marketGo(); });

  applyI18n();
  $("#connlbl").textContent = t("connecting");
  connect();
</script>
</body>
</html>`;
