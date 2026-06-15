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
    </div>
    <div class="deckrow">
      <span class="lbl" data-i18n="game"></span>
      <button class="chip" data-game="roulette" data-i18n="roulette"></button>
      <button class="chip" data-game="escalation" data-i18n="escalation"></button>
      <button class="chip" data-game="ambient" data-i18n="ambient"></button>
      <span class="lbl" data-i18n="video"></span>
      <button class="chip" id="vidbtn" data-i18n="funscript"></button>
      <span class="lbl" data-i18n="audio"></span>
      <button class="chip" id="audmic" data-i18n="useMic"></button>
      <button class="chip" id="audtab" data-i18n="useTab"></button>
      <button class="chip" id="audstop" style="display:none" data-i18n="stopAudio"></button>
    </div>
    <div class="deckrow">
      <button class="chip" id="modestop" data-i18n="stopMode"></button>
      <div class="maxbox"><span class="small" data-i18n="safetyMax"></span>
        <input id="max" type="range" min="0" max="1" step="0.01" value="1" /><span id="maxval" class="small">100%</span></div>
    </div>
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
    <span class="spacer"></span>
    <button class="btn ghost" id="fsclose" data-i18n="close"></button>
    <button class="btn" id="fsplay" data-i18n="play"></button>
  </div>
</div></div>

<script>
  var I18N = {
    en: { remote:"👑 Remote", scan:"Scan", estop:"■ STOP", log:"Log",
      connecting:"connecting", connected:"connected", reconnecting:"reconnecting",
      tapScan:"tap SCAN", allTarget:"ALL", motor:"motor", motors:"motors",
      patterns:"Patterns", pulse:"Pulse", wave:"Wave", escalate:"Escalate", tease:"Tease",
      game:"Game", roulette:"🎲 Roulette", escalation:"📈 Escalation", ambient:"🌊 Ambient",
      video:"Video", funscript:"🎬 Funscript", audio:"Audio", useMic:"🎤 Mic", useTab:"🔊 Tab", stopAudio:"■ Audio",
      stopMode:"■ Stop mode", safetyMax:"max",
      videoTitle:"🎬 Video — funscript", fsPh:'paste funscript JSON e.g. {"actions":[{"at":0,"pos":0},{"at":600,"pos":100}]}',
      loop:"loop", speed:"speed", invert:"invert", play:"▶ Play", close:"Close",
      mastersOn:"👑 {n} master", mastersOnN:"👑 {n} masters",
      needFs:"Paste a funscript JSON first.", audFail:"Audio capture failed: ", langBtn:"中文" },
    zh: { remote:"👑 遥控", scan:"扫描", estop:"■ 停止", log:"日志",
      connecting:"连接中", connected:"已连接", reconnecting:"重连中",
      tapScan:"点扫描", allTarget:"全部", motor:"马达", motors:"马达",
      patterns:"节奏", pulse:"脉冲", wave:"波浪", escalate:"递增", tease:"挑逗",
      game:"游戏", roulette:"🎲 轮盘", escalation:"📈 递增", ambient:"🌊 环境",
      video:"视频", funscript:"🎬 脚本", audio:"音频", useMic:"🎤 麦克风", useTab:"🔊 标签页", stopAudio:"■ 音频",
      stopMode:"■ 停止模式", safetyMax:"上限",
      videoTitle:"🎬 视频 — funscript", fsPh:'粘贴 funscript JSON，例如 {"actions":[{"at":0,"pos":0},{"at":600,"pos":100}]}',
      loop:"循环", speed:"速度", invert:"反向", play:"▶ 播放", close:"关闭",
      mastersOn:"👑 {n} 位主人", mastersOnN:"👑 {n} 位主人",
      needFs:"请先粘贴 funscript JSON。", audFail:"音频采集失败：", langBtn:"EN" }
  };
  var lang = localStorage.getItem("cfm_lang") || ((navigator.language||"").indexOf("zh")===0 ? "zh" : "en");
  function t(k){ return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }
  function applyI18n(){
    document.querySelectorAll("[data-i18n]").forEach(function(el){ el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){ el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    document.getElementById("lang").textContent = t("langBtn");
    if (state) render();
  }

  var $ = function(s){ return document.querySelector(s); };
  var ws, state = null, target = "all", held = false, maxHeld = false;
  var lvl = 0, lvlEase = 0; // smoothed display level

  function connect(){
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    ws = new WebSocket(proto + location.host + "/ws");
    ws.onopen = function(){ $("#conn").classList.add("on"); $("#connlbl").textContent = t("connected"); };
    ws.onclose = function(){ $("#conn").classList.remove("on"); $("#connlbl").textContent = t("reconnecting"); setTimeout(connect, 1000); };
    ws.onmessage = function(e){ var m = JSON.parse(e.data); if (m.type === "state") { state = m.state; render(); } };
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
    if (state.activeMode){ act.style.display=""; var g = state.activeMode.type==="video"?"🎬 ":(state.activeMode.type==="audio"?"🎵 ":"🎮 "); act.textContent = g + state.activeMode.label; }
    else act.style.display="none";
    if (state.masters > 0){ mEl.style.display=""; mEl.textContent = (state.masters>1?t("mastersOnN"):t("mastersOn")).replace("{n}", state.masters); } else mEl.style.display="none";

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
  scrub.addEventListener("input", function(){ held = true; lvl = scrub.value/100; send({ type:"set", id:target, intensity: scrub.value/100 }); });
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

  // funscript modal
  $("#vidbtn").onclick = function(){ $("#fsmodal").classList.add("open"); };
  $("#fsclose").onclick = function(){ $("#fsmodal").classList.remove("open"); };
  $("#fsmodal").addEventListener("click", function(e){ if (e.target === $("#fsmodal")) $("#fsmodal").classList.remove("open"); });
  $("#fsplay").onclick = function(){
    var source = $("#fs").value.trim(); if (!source){ alert(t("needFs")); return; }
    send({ type:"play_video", target:target, source:source, loop:$("#fsloop").checked, speed:parseFloat($("#fsspeed").value)||1, invert:$("#fsinv").checked });
    $("#fsmodal").classList.remove("open");
  };

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

  applyI18n();
  $("#connlbl").textContent = t("connecting");
  connect();
</script>
</body>
</html>`;
