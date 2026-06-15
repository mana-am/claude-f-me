// Focused remote-control page for a "master" controlling the device, served at
// /master. Connects to the same WebSocket as ?role=master so other pages know a
// master is in control. Mobile-friendly and bilingual (EN / 中文).
// Inline script uses string concatenation only (no backticks / ${}).
export const MASTER_HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<title>claude·f·me · master remote</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing:border-box; -webkit-user-select:none; user-select:none; -webkit-tap-highlight-color:transparent; }
  body { margin:0 auto; max-width:560px; padding:18px; font:15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    background:#0c0a10; color:#efe9f5; }
  header { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
  h1 { font-size:17px; margin:0; font-weight:700; }
  .crown { font-size:20px; }
  .spacer { flex:1; }
  .ghost { font:inherit; cursor:pointer; background:#1d1727; color:#efe9f5; border:1px solid #322a40; border-radius:8px; padding:6px 10px; font-size:12px; }
  .sub { color:#9b8fb0; font-size:12px; margin-bottom:18px; }
  .dot { width:8px;height:8px;border-radius:50%;background:#56607a;display:inline-block;margin-right:4px; }
  .dot.on { background:#7fd1b9; box-shadow:0 0 8px #7fd1b9; }
  .card { background:#15111d; border:1px solid #2a2335; border-radius:16px; padding:18px; margin-bottom:16px; }
  .level { text-align:center; }
  .big { font-size:64px; font-weight:800; font-variant-numeric:tabular-nums; line-height:1; letter-spacing:-2px;
    background:linear-gradient(90deg,#c9a0ff,#ff7eb3); -webkit-background-clip:text; background-clip:text; color:transparent; }
  input[type=range]{ -webkit-appearance:none; appearance:none; width:100%; height:38px; background:transparent; margin-top:10px; }
  input[type=range]::-webkit-slider-runnable-track{ height:14px; border-radius:999px; background:linear-gradient(90deg,#a06bff,#ff4d8d); }
  input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:34px;height:34px;border-radius:50%; background:#fff; margin-top:-10px; box-shadow:0 2px 10px rgba(0,0,0,.5); }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  button.b { font:inherit; font-weight:600; cursor:pointer; border-radius:12px; border:1px solid #322a40; background:#1d1727; color:#efe9f5; padding:14px; }
  button.b:active { transform:scale(.97); }
  .buzz { grid-column:1/-1; background:linear-gradient(90deg,#7a3bff,#ff3d7f); border:none; color:#fff; font-size:17px; padding:22px; }
  .stop { width:100%; background:#b3261e; border:none; color:#fff; font-weight:800; font-size:18px; padding:20px; border-radius:14px; cursor:pointer; }
  h2 { font-size:11px; text-transform:uppercase; letter-spacing:.14em; color:#8a7ea0; margin:0 0 10px; }
  .small { color:#9b8fb0; font-size:12px; }
  .maxrow { display:flex; align-items:center; gap:10px; margin-top:6px; }
</style>
</head>
<body>
<header>
  <span class="crown">👑</span><h1 data-i18n="title"></h1>
  <span class="spacer"></span>
  <button id="lang" class="ghost"></button>
</header>
<div class="sub"><span id="dot" class="dot"></span><span id="status"></span> · <span id="devinfo">—</span></div>

<div class="card level">
  <div class="big"><span id="lvl">0</span><span style="font-size:24px">%</span></div>
  <input id="dial" type="range" min="0" max="100" step="1" value="0" />
  <div class="small" data-i18n="dialHint"></div>
</div>

<div class="card">
  <h2 data-i18n="quick"></h2>
  <div class="grid">
    <button class="b buzz" id="buzz" data-i18n="buzz"></button>
    <button class="b" data-pat="pulse" data-i18n="pulse"></button>
    <button class="b" data-pat="wave" data-i18n="wave"></button>
    <button class="b" data-pat="escalate" data-i18n="escalate"></button>
    <button class="b" data-pat="tease" data-i18n="tease"></button>
    <button class="b" data-game="roulette" data-i18n="roulette"></button>
    <button class="b" data-game="ambient" data-i18n="ambient"></button>
  </div>
  <div class="maxrow">
    <span class="small" data-i18n="safetyMax"></span>
    <input id="max" type="range" min="0" max="1" step="0.01" value="1" />
    <span id="maxval" class="small">100%</span>
  </div>
</div>

<button class="stop" id="stop" data-i18n="stopAll"></button>

<script>
  var I18N = {
    en: { title:"master remote", langBtn:"中文", quick:"Quick", dialHint:"drag to set sustained intensity",
      buzz:"⚡ HOLD TO BUZZ", pulse:"Pulse", wave:"Wave", escalate:"Escalate", tease:"Tease",
      roulette:"🎲 Roulette", ambient:"🌊 Ambient", safetyMax:"safety max", stopAll:"■ STOP EVERYTHING",
      inControl:"in control", connecting:"connecting…", reconnecting:"reconnecting…",
      noDev:"no devices — tap a control to scan", devN:"{n} device", devNs:"{n} devices" },
    zh: { title:"主人遥控", langBtn:"EN", quick:"快捷", dialHint:"拖动设置持续强度",
      buzz:"⚡ 按住震动", pulse:"脉冲", wave:"波浪", escalate:"递增", tease:"挑逗",
      roulette:"🎲 轮盘", ambient:"🌊 环境", safetyMax:"安全上限", stopAll:"■ 全部停止",
      inControl:"控制中", connecting:"连接中…", reconnecting:"重连中…",
      noDev:"暂无设备", devN:"{n} 个设备", devNs:"{n} 个设备" }
  };
  var lang = localStorage.getItem("cfm_lang") || ((navigator.language||"").indexOf("zh")===0 ? "zh" : "en");
  function t(k){ return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }
  function applyI18n(){
    document.querySelectorAll("[data-i18n]").forEach(function(el){ el.textContent = t(el.getAttribute("data-i18n")); });
    document.getElementById("lang").textContent = t("langBtn");
    if (lastState) renderInfo(lastState);
    $("#status").textContent = (ws && ws.readyState===1) ? t("inControl") : t("connecting");
  }
  var $ = function(s){ return document.querySelector(s); };
  var ws, held = false, maxHeld = false, lastState = null;

  function connect() {
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    ws = new WebSocket(proto + location.host + "/ws?role=master");
    ws.onopen = function(){ $("#dot").classList.add("on"); $("#status").textContent = t("inControl"); };
    ws.onclose = function(){ $("#dot").classList.remove("on"); $("#status").textContent = t("reconnecting"); setTimeout(connect, 1000); };
    ws.onmessage = function(e){ var m = JSON.parse(e.data); if (m.type === "state") { lastState = m.state; renderInfo(m.state); } };
  }
  var send = function(o){ try { if (ws && ws.readyState===1) ws.send(JSON.stringify(o)); } catch(e){} };

  function renderInfo(s){
    var d = s.devices[0];
    $("#devinfo").textContent = s.devices.length
      ? (s.devices.length>1 ? t("devNs") : t("devN")).replace("{n}", s.devices.length) + " · " + s.mode
      : t("noDev");
    if (d && !held) { var p = Math.round(d.intensity*100); $("#lvl").textContent = p; $("#dial").value = p; }
    if (!maxHeld) { $("#max").value = s.maxIntensity; $("#maxval").textContent = Math.round(s.maxIntensity*100)+"%"; }
  }

  var dial = $("#dial");
  dial.addEventListener("input", function(){ held = true; $("#lvl").textContent = dial.value; send({ type:"set", id:"all", intensity: dial.value/100 }); });
  dial.addEventListener("pointerup", function(){ held = false; });
  dial.addEventListener("pointercancel", function(){ held = false; });

  var buzz = $("#buzz");
  var startBuzz = function(e){ e.preventDefault(); send({ type:"set", id:"all", intensity:1 }); };
  var endBuzz = function(){ send({ type:"set", id:"all", intensity:0 }); };
  buzz.addEventListener("pointerdown", startBuzz);
  buzz.addEventListener("pointerup", endBuzz);
  buzz.addEventListener("pointerleave", endBuzz);
  buzz.addEventListener("pointercancel", endBuzz);

  document.querySelectorAll("[data-pat]").forEach(function(b){
    b.addEventListener("click", function(){ send({ type:"pattern", preset:b.getAttribute("data-pat"), loops:3 }); }); });
  document.querySelectorAll("[data-game]").forEach(function(b){
    b.addEventListener("click", function(){ send({ type:"start_game", gameType:b.getAttribute("data-game") }); }); });

  var max = $("#max");
  max.addEventListener("pointerdown", function(){ maxHeld = true; });
  max.addEventListener("pointerup", function(){ maxHeld = false; });
  max.addEventListener("input", function(){ $("#maxval").textContent = Math.round(max.value*100)+"%"; send({ type:"set_max", value: parseFloat(max.value) }); });

  $("#stop").addEventListener("click", function(){ dial.value = 0; $("#lvl").textContent = "0"; send({ type:"stop_all" }); });
  $("#lang").addEventListener("click", function(){ lang = (lang === "en" ? "zh" : "en"); localStorage.setItem("cfm_lang", lang); applyI18n(); });

  applyI18n();
  $("#status").textContent = t("connecting");
  connect();
</script>
</body>
</html>`;
