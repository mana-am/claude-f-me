// Self-contained console UI, embedded as a string so there are no asset-path
// issues after `tsc`. Talks to the same process over ws://<host>/ws.
export const CONSOLE_HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>opendick console</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    background: #0e0f13; color: #e7e9ee;
  }
  header {
    display: flex; align-items: center; gap: 12px; padding: 14px 20px;
    border-bottom: 1px solid #20232c; position: sticky; top: 0; background: #0e0f13e6; backdrop-filter: blur(6px);
  }
  h1 { font-size: 16px; margin: 0; font-weight: 650; letter-spacing: .2px; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 999px; border: 1px solid #2c3040; color: #aab; }
  .badge.sim { color: #7fd1b9; border-color: #1f4a3e; background: #0f231d; }
  .badge.bp  { color: #f0a35e; border-color: #4a3320; background: #231a0f; }
  .badge.dot { display:inline-flex; align-items:center; gap:6px; }
  .dot { width:7px; height:7px; border-radius:50%; background:#56607a; }
  .dot.on { background:#7fd1b9; box-shadow:0 0 8px #7fd1b9; }
  .spacer { flex: 1; }
  button {
    font: inherit; cursor: pointer; border-radius: 9px; border: 1px solid #2c3040;
    background: #171a22; color: #e7e9ee; padding: 8px 14px;
  }
  button:hover { border-color: #3a4055; }
  button.stop { background: #b3261e; border-color: #d6443b; color: #fff; font-weight: 700; }
  button.stop:hover { background: #c92f26; }
  main { padding: 20px; display: grid; gap: 18px; grid-template-columns: 1fr; max-width: 1100px; margin: 0 auto; }
  @media (min-width: 760px){ main { grid-template-columns: 2fr 1fr; } }
  .panel { background: #12141b; border: 1px solid #20232c; border-radius: 14px; padding: 16px; }
  .panel h2 { font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: #8a90a3; margin: 0 0 12px; }
  .devices { display: grid; gap: 14px; }
  .card { background: #161922; border: 1px solid #232735; border-radius: 12px; padding: 14px; overflow: hidden; }
  .card-top { display:flex; align-items:center; gap:10px; margin-bottom: 12px; }
  .motorwrap { width: 54px; height: 54px; display:flex; align-items:center; justify-content:center; flex: none; }
  .motor {
    width: 40px; height: 40px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ff7eb3, #c2185b 70%);
    box-shadow: 0 0 0 0 rgba(255,126,179,.0);
    --amp: 0px; --spd: .2s; --glow: 0;
  }
  .motor.live { animation: buzz var(--spd) linear infinite; box-shadow: 0 0 calc(8px + 22px*var(--glow)) rgba(255,126,179,calc(.25 + .6*var(--glow))); }
  @keyframes buzz {
    0%   { transform: translate(calc(var(--amp)*-1), 0); }
    25%  { transform: translate(var(--amp), calc(var(--amp)*-1)); }
    50%  { transform: translate(calc(var(--amp)*-1), var(--amp)); }
    75%  { transform: translate(var(--amp), 0); }
    100% { transform: translate(calc(var(--amp)*-1), 0); }
  }
  .name { font-weight: 600; }
  .meta { font-size: 12px; color: #8a90a3; }
  .pct { margin-left: auto; font-variant-numeric: tabular-nums; font-weight: 700; font-size: 18px; }
  .bar { height: 8px; border-radius: 999px; background: #232735; overflow: hidden; margin: 10px 0; }
  .bar > i { display:block; height:100%; width:0%; background: linear-gradient(90deg,#ff7eb3,#ff4d8d); transition: width .12s linear; }
  input[type=range] { width: 100%; accent-color: #ff4d8d; }
  .row { display:flex; align-items:center; gap:10px; }
  .small { font-size: 12px; color: #8a90a3; }
  .log { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; max-height: 420px; overflow:auto; display:flex; flex-direction:column-reverse; }
  .log div { padding: 3px 0; border-bottom: 1px solid #1a1d26; white-space: pre-wrap; }
  .lv-cmd { color: #9ecbff; }
  .lv-safety { color: #ff9e9e; }
  .lv-warn { color: #ffd27f; }
  .lv-info { color: #8a90a3; }
  .empty { color:#6b7184; padding: 8px 0; }
  .ctrls { display:flex; gap:8px; align-items:center; margin-top: 10px; flex-wrap: wrap; }
  .maxrow { display:flex; align-items:center; gap:10px; margin-top: 8px; }
  .badge.act { color:#c9a0ff; border-color:#3a2a55; background:#1a1326; }
  .modes { grid-column: 1 / -1; }
  .modegrid { display:grid; gap:18px; grid-template-columns:1fr; }
  @media (min-width: 760px){ .modegrid { grid-template-columns: 1fr 1fr; } }
  .modegrid h3 { font-size:13px; margin:0 0 8px; font-weight:600; }
  textarea#fs {
    width:100%; height:84px; background:#0e1016; color:#e7e9ee; border:1px solid #232735;
    border-radius:8px; padding:8px; font-family: ui-monospace, Menlo, monospace; font-size:12px; resize:vertical;
  }
  label.opt { font-size:12px; color:#aab; display:inline-flex; align-items:center; gap:5px; }
  input[type=number] { background:#0e1016; color:#e7e9ee; border:1px solid #232735; border-radius:6px; padding:4px 6px; }
</style>
</head>
<body>
<header>
  <h1>opendick</h1>
  <span id="mode" class="badge">…</span>
  <span class="badge dot"><span id="conn" class="dot"></span><span id="connlbl">connecting</span></span>
  <span id="active" class="badge act" style="display:none"></span>
  <div class="spacer"></div>
  <button id="scan">Scan</button>
  <button id="stopall" class="stop">■ EMERGENCY STOP</button>
</header>
<main>
  <section class="panel">
    <h2>Devices</h2>
    <div id="devices" class="devices"><div class="empty">No devices yet.</div></div>
    <div class="maxrow">
      <span class="small">Safety max</span>
      <input id="max" type="range" min="0" max="1" step="0.01" value="1" style="max-width:220px" />
      <span id="maxval" class="small">100%</span>
    </div>
  </section>
  <section class="panel">
    <h2>Log</h2>
    <div id="log" class="log"><div class="empty">…</div></div>
  </section>
  <section class="panel modes">
    <h2>Modes</h2>
    <div class="modegrid">
      <div>
        <h3>🎬 Video — funscript</h3>
        <textarea id="fs" placeholder='paste funscript JSON e.g. {"actions":[{"at":0,"pos":0},{"at":600,"pos":100},{"at":1200,"pos":0}]}'></textarea>
        <div class="ctrls">
          <label class="opt"><input type="checkbox" id="fsloop" /> loop</label>
          <label class="opt">speed <input id="fsspeed" type="number" min="0.1" max="4" step="0.1" value="1" style="width:58px" /></label>
          <label class="opt"><input type="checkbox" id="fsinv" /> invert</label>
          <button id="fsplay">▶ Play</button>
        </div>
      </div>
      <div>
        <h3>🎮 Game</h3>
        <div class="ctrls">
          <button data-game="roulette">🎲 Roulette</button>
          <button data-game="escalation">📈 Escalation</button>
          <button data-game="ambient">🌊 Ambient</button>
        </div>
        <div class="maxrow">
          <span class="small">game max</span>
          <input id="gmax" type="range" min="0" max="1" step="0.01" value="1" style="max-width:160px" />
          <span id="gmaxval" class="small">100%</span>
        </div>
      </div>
    </div>
    <div id="modebar" style="display:none; margin-top:12px">
      <div id="modelbl" class="small"></div>
      <div class="bar"><i id="modeprog" style="width:0%; background:linear-gradient(90deg,#a06bff,#c9a0ff)"></i></div>
    </div>
    <div class="ctrls"><button id="modestop" class="stop">■ Stop mode</button></div>
  </section>
</main>
<script>
  const $ = (s) => document.querySelector(s);
  let ws, state = null, sliderHeld = new Set();

  function connect() {
    ws = new WebSocket((location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws");
    ws.onopen = () => { $("#conn").classList.add("on"); $("#connlbl").textContent = "connected"; };
    ws.onclose = () => { $("#conn").classList.remove("on"); $("#connlbl").textContent = "reconnecting"; setTimeout(connect, 1000); };
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.type === "state") { state = m.state; render(); } };
  }
  const send = (o) => { try { ws && ws.readyState === 1 && ws.send(JSON.stringify(o)); } catch {} };

  function render() {
    if (!state) return;
    const mode = $("#mode");
    mode.textContent = state.mode;
    mode.className = "badge " + (state.mode === "buttplug" ? "bp" : "sim");
    const maxEl = $("#max");
    if (!sliderHeld.has("__max")) { maxEl.value = state.maxIntensity; $("#maxval").textContent = Math.round(state.maxIntensity*100)+"%"; }

    const act = $("#active"), mb = $("#modebar");
    if (state.activeMode) {
      act.style.display = "";
      act.textContent = (state.activeMode.type === "video" ? "🎬 " : "🎮 ") + state.activeMode.label;
      if (state.activeMode.durationMs) {
        mb.style.display = "";
        $("#modelbl").textContent = state.activeMode.type + " · " + state.activeMode.label;
        const p = state.activeMode.positionMs != null ? (state.activeMode.positionMs / state.activeMode.durationMs * 100) : 0;
        $("#modeprog").style.width = Math.min(100, p) + "%";
      } else { mb.style.display = "none"; }
    } else { act.style.display = "none"; mb.style.display = "none"; }

    const wrap = $("#devices");
    if (!state.devices.length) { wrap.innerHTML = '<div class="empty">No devices. Hit Scan.</div>'; }
    else {
      wrap.innerHTML = "";
      for (const d of state.devices) wrap.appendChild(card(d));
    }

    const log = $("#log");
    if (!state.log.length) { log.innerHTML = '<div class="empty">No activity yet.</div>'; }
    else {
      log.innerHTML = "";
      for (const l of state.log) {
        const div = document.createElement("div");
        div.className = "lv-" + l.level;
        const ts = new Date(l.t).toLocaleTimeString();
        div.textContent = ts + "  " + l.msg;
        log.appendChild(div);
      }
    }
  }

  function card(d) {
    const el = document.createElement("div");
    el.className = "card";
    const i = d.intensity || 0;
    const live = i > 0.001;
    const amp = (i * 6).toFixed(2) + "px";
    const spd = (0.2 - i * 0.13).toFixed(3) + "s";
    const battery = d.battery == null ? "" : " · 🔋 " + Math.round(d.battery*100) + "%";
    el.innerHTML =
      '<div class="card-top">' +
        '<div class="motorwrap"><div class="motor'+(live?' live':'')+'" style="--amp:'+amp+';--spd:'+spd+';--glow:'+i+'"></div></div>' +
        '<div><div class="name">'+esc(d.name)+'</div>' +
        '<div class="meta">'+d.id+' · '+d.actuators+' motor'+(d.actuators>1?'s':'')+battery+'</div></div>' +
        '<div class="pct">'+Math.round(i*100)+'%</div>' +
      '</div>' +
      '<div class="bar"><i style="width:'+(i*100)+'%"></i></div>';
    const slider = document.createElement("input");
    slider.type = "range"; slider.min = "0"; slider.max = "1"; slider.step = "0.01"; slider.value = String(i);
    slider.addEventListener("pointerdown", () => sliderHeld.add(d.id));
    slider.addEventListener("pointerup", () => sliderHeld.delete(d.id));
    slider.addEventListener("input", () => send({ type: "set", id: d.id, intensity: parseFloat(slider.value) }));
    const ctrls = document.createElement("div");
    ctrls.className = "ctrls";
    ctrls.appendChild(slider);
    const stopBtn = document.createElement("button");
    stopBtn.textContent = "Stop";
    stopBtn.onclick = () => send({ type: "set", id: d.id, intensity: 0 });
    ctrls.appendChild(stopBtn);
    el.appendChild(ctrls);
    return el;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));

  $("#scan").onclick = () => send({ type: "scan", ms: 4000 });
  $("#stopall").onclick = () => send({ type: "stop_all" });
  const maxEl = $("#max");
  maxEl.addEventListener("pointerdown", () => sliderHeld.add("__max"));
  maxEl.addEventListener("pointerup", () => sliderHeld.delete("__max"));
  maxEl.addEventListener("input", () => { $("#maxval").textContent = Math.round(maxEl.value*100)+"%"; send({ type: "set_max", value: parseFloat(maxEl.value) }); });

  // modes
  $("#fsplay").onclick = () => {
    const source = $("#fs").value.trim();
    if (!source) { alert("Paste a funscript JSON first."); return; }
    send({
      type: "play_video", source,
      loop: $("#fsloop").checked,
      speed: parseFloat($("#fsspeed").value) || 1,
      invert: $("#fsinv").checked,
    });
  };
  document.querySelectorAll("[data-game]").forEach((b) => {
    b.addEventListener("click", () => send({
      type: "start_game",
      gameType: b.getAttribute("data-game"),
      intensityMax: parseFloat($("#gmax").value),
    }));
  });
  const gmax = $("#gmax");
  gmax.addEventListener("input", () => { $("#gmaxval").textContent = Math.round(gmax.value*100)+"%"; });
  $("#modestop").onclick = () => send({ type: "stop_mode" });

  connect();
</script>
</body>
</html>`;
