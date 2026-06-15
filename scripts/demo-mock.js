/* claude-f-me — static DEMO backend (no server, no hardware).
 * Shims window.WebSocket for the /ws control channel so the real console UI runs
 * against an in-browser simulator. The orb / aurora / waveform react exactly as
 * they would live. Real Buttplug, the Duet relay and /dev + /event are inert here
 * — this is the "zero hardware" preview, deployed to GitHub Pages. */
(function () {
  var RealWS = window.WebSocket;
  var clients = [];

  var PERSONAS = {
    metronome: { emoji: "🎼", name: "Metronome", model: null },
    slowburn: { emoji: "🕯️", name: "Slow Burn", model: "claude-opus" },
    brat: { emoji: "😈", name: "Brat", model: "gpt-5.5" },
    storm: { emoji: "⛈️", name: "Storm", model: null },
    oracle: { emoji: "🔮", name: "Oracle", model: null },
    mommy: { emoji: "🍼", name: "Mommy", model: "claude-opus" },
  };
  var personaIds = Object.keys(PERSONAS);

  var state = {
    devices: [],
    mode: "simulated",
    activeMode: null,
    masters: 0,
    maxIntensity: 1,
    persona: assign({ id: "metronome", blind: false }, PERSONAS.metronome),
    log: [],
  };
  var blindActual = null;

  function assign(a, b) { for (var k in b) a[k] = b[k]; return a; }
  function clampMax(v) { return Math.max(0, Math.min(state.maxIntensity, v)); }
  function log(level, msg) { state.log.push({ t: Date.now(), level: level, msg: msg }); if (state.log.length > 40) state.log.shift(); }
  function emit() { var s = JSON.stringify({ type: "state", state: state }); clients.forEach(function (c) { c._recv(s); }); }
  function emitRaw(o) { var s = JSON.stringify(o); clients.forEach(function (c) { c._recv(s); }); }
  function setAll(v) { v = clampMax(v); state.devices.forEach(function (d) { d.intensity = v; }); }
  function ensureDevices() { if (!state.devices.length) state.devices = [{ id: "sim-1", name: "Simulated Vibe", intensity: 0 }, { id: "sim-2", name: "Simulated Dual Motor", intensity: 0 }]; }

  // ---- one timeline driver (patterns, muse scores, games) ----
  var timer = null, token = 0;
  function stopTimeline() { token++; if (timer) { clearTimeout(timer); clearInterval(timer); timer = null; } state.activeMode = null; }
  function runSteps(label, steps, loops) {
    stopTimeline();
    state.activeMode = { label: label };
    var my = ++token, i = 0, l = 0;
    (function step() {
      if (my !== token) return;
      if (i >= steps.length) { l++; if (l >= loops) { setAll(0); stopTimeline(); emit(); return; } i = 0; }
      var s = steps[i++]; setAll(s.v); emit();
      timer = setTimeout(step, s.ms);
    })();
  }
  function preset(name) {
    var P = {
      pulse: [{ v: .8, ms: 200 }, { v: 0, ms: 200 }],
      wave: [{ v: .2, ms: 160 }, { v: .5, ms: 160 }, { v: .8, ms: 160 }, { v: .5, ms: 160 }],
      escalate: [{ v: .2, ms: 600 }, { v: .4, ms: 600 }, { v: .6, ms: 600 }, { v: .8, ms: 600 }, { v: 1, ms: 900 }],
      tease: [{ v: .7, ms: 500 }, { v: 0, ms: 700 }],
      heartbeat: [{ v: .9, ms: 130 }, { v: 0, ms: 130 }, { v: .9, ms: 130 }, { v: 0, ms: 680 }],
      staircase: [{ v: .25, ms: 500 }, { v: .5, ms: 500 }, { v: .75, ms: 500 }, { v: 1, ms: 500 }, { v: 0, ms: 300 }],
      sos: [{ v: .8, ms: 140 }, { v: 0, ms: 120 }, { v: .8, ms: 140 }, { v: 0, ms: 120 }, { v: .8, ms: 140 }, { v: 0, ms: 300 }, { v: .8, ms: 360 }, { v: 0, ms: 120 }, { v: .8, ms: 360 }, { v: 0, ms: 120 }, { v: .8, ms: 360 }, { v: 0, ms: 320 }],
      earthquake: [{ v: .5, ms: 80 }, { v: 1, ms: 80 }, { v: .3, ms: 80 }, { v: .9, ms: 80 }, { v: .6, ms: 80 }, { v: 1, ms: 80 }],
    };
    return P[name] || P.pulse;
  }
  function startGame(type) {
    stopTimeline();
    var labels = { roulette: "🎲 roulette", escalation: "📈 escalation", ambient: "🌊 ambient", edge: "🔥 edge", wheel: "🎡 wheel" };
    state.activeMode = { label: labels[type] || type };
    var my = ++token;
    if (type === "ambient") { var ph = 0; timer = setInterval(function () { if (my !== token) return; ph += 0.05; setAll(0.4 + 0.34 * Math.sin(ph)); emit(); }, 120); }
    else if (type === "escalation") { var v = 0; timer = setInterval(function () { if (my !== token) return; v = Math.min(1, v + 0.02); setAll(v); emit(); }, 150); }
    else if (type === "roulette") { timer = setInterval(function () { if (my !== token) return; setAll(Math.random() < 0.45 ? 0.3 + Math.random() * 0.7 : 0); emit(); }, 480); }
    else if (type === "edge") { var e = 0, peak = 0.6, up = true; timer = setInterval(function () { if (my !== token) return; if (up) { e += 0.06; if (e >= peak) up = false; } else { e -= 0.25; if (e <= 0) { e = 0; up = true; peak = Math.min(1, peak + 0.08); } } setAll(e); emit(); }, 120); }
    else if (type === "wheel") { var spins = 0; timer = setInterval(function () { if (my !== token) return; spins++; if (spins < 26) setAll(Math.random()); else { setAll(0.4 + Math.random() * 0.6); clearInterval(timer); timer = null; } emit(); }, 90); }
  }

  function handle(o) {
    switch (o.type) {
      case "set": stopTimeline(); setAll(o.intensity); log("cmd", "set " + Math.round(o.intensity * 100) + "%"); emit(); break;
      case "drive": setAll(o.intensity); emit(); break;
      case "scan": ensureDevices(); log("info", "scanned — 2 simulated devices"); emit(); break;
      case "stop_all": stopTimeline(); setAll(0); log("cmd", "stop all"); emit(); break;
      case "stop_mode": stopTimeline(); setAll(0); emit(); break;
      case "set_max": state.maxIntensity = o.value; state.devices.forEach(function (d) { d.intensity = Math.min(d.intensity, o.value); }); log("cmd", "max " + Math.round(o.value * 100) + "%"); emit(); break;
      case "pattern": log("cmd", "pattern " + o.preset); runSteps("🥁 " + o.preset, preset(o.preset), o.loops || 2); break;
      case "start_game": log("cmd", "game " + o.gameType); startGame(o.gameType); break;
      case "set_persona":
        if (o.id === "blind") { blindActual = personaIds[Math.floor(Math.random() * personaIds.length)]; state.persona = { id: "blind", emoji: "🎭", name: "???", model: null, blind: true }; log("cmd", "persona → blind"); }
        else { var p = PERSONAS[o.id]; if (p) { state.persona = assign({ id: o.id, blind: false }, p); blindActual = null; log("cmd", "persona → " + p.name); } }
        emit(); break;
      case "reveal_persona":
        if (blindActual) { var pr = PERSONAS[blindActual]; state.persona = assign({ id: blindActual, blind: false }, pr); blindActual = null; log("cmd", "revealed → " + pr.name); emit(); }
        break;
      case "muse_compose": log("cmd", "muse: " + (o.brief || "")); runSteps("🎼 " + (o.brief || "muse"), [{ v: .15, ms: 700 }, { v: .35, ms: 700 }, { v: .2, ms: 500 }, { v: .5, ms: 800 }, { v: .7, ms: 900 }, { v: .4, ms: 600 }, { v: .85, ms: 1000 }, { v: 1, ms: 1200 }, { v: 0, ms: 600 }], o.loop ? 3 : 1); break;
      case "play_score": log("cmd", "muse play " + (o.name || "")); runSteps("🎼 " + (o.name || "score"), preset("escalate"), 2); break;
      case "audio_start": state.activeMode = { label: "🎵 audio" }; emit(); break;
      case "audio_stop": stopTimeline(); emit(); break;
      case "play_video": state.activeMode = { label: "🎬 video" }; emit(); break;
      case "clientmode": state.activeMode = o.on ? { label: o.label || "client" } : null; emit(); break;
    }
  }
  function pushMuseList() { emitRaw({ type: "muse_list", scores: [{ name: "Slow Tide", brief: "a 3-minute slow build" }, { name: "Thunderstorm", brief: "chaotic bursts" }, { name: "Morse · i love you", brief: "a message in code" }], llm: false }); }

  function MockWS(url) {
    var self = this;
    this.url = String(url); this.readyState = 0;
    this.onopen = this.onclose = this.onmessage = this.onerror = null;
    if (/\/ws(\?|$)/.test(this.url)) {
      clients.push(this);
      setTimeout(function () { self.readyState = 1; if (self.onopen) self.onopen({}); ensureDevices(); emit(); pushMuseList(); }, 60);
    } else {
      // duet relay & other sockets aren't available in the static demo
      setTimeout(function () { self.readyState = 3; if (self.onclose) self.onclose({}); }, 60);
    }
  }
  MockWS.prototype.send = function (data) { try { handle(JSON.parse(data)); } catch (e) {} };
  MockWS.prototype.close = function () { this.readyState = 3; var i = clients.indexOf(this); if (i >= 0) clients.splice(i, 1); if (this.onclose) this.onclose({}); };
  MockWS.prototype.addEventListener = function (ev, fn) { this["on" + ev] = fn; };
  MockWS.prototype._recv = function (s) { if (this.onmessage) this.onmessage({ data: s }); };
  MockWS.CONNECTING = 0; MockWS.OPEN = 1; MockWS.CLOSING = 2; MockWS.CLOSED = 3;
  window.WebSocket = MockWS;

  // server-only HTTP endpoints are no-ops in the static demo
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (u) {
    if (typeof u === "string" && /\/(dev|event|read|relay|upload)/.test(u)) return Promise.resolve(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    return realFetch ? realFetch.apply(null, arguments) : Promise.reject(new Error("offline"));
  };

  // a small "demo" ribbon + a "How to use" modal (Claude Code / Codex setup)
  function banner() {
    if (document.getElementById("cfm-demo-ribbon")) return;
    var d = document.createElement("div");
    d.id = "cfm-demo-ribbon";
    d.style.cssText = "position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:9999;font:600 12px/1.4 system-ui,-apple-system,sans-serif;color:#ffd6e8;background:rgba(40,12,28,.82);border:1px solid #ff4d8d55;border-radius:999px;padding:6px 14px;backdrop-filter:blur(8px);box-shadow:0 4px 24px #000a;white-space:nowrap;";
    d.innerHTML = 'DEMO · simulated, no hardware — <a id="cfm-howto-open" href="#" style="color:#ff8fb8;text-decoration:underline;cursor:pointer;">▶ How to use →</a>';
    document.body.appendChild(d);

    var m = document.createElement("div");
    m.id = "cfm-howto";
    m.style.cssText = "position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;background:rgba(4,3,6,.72);backdrop-filter:blur(6px);padding:18px;";
    m.innerHTML =
      '<div style="max-width:560px;width:100%;max-height:86vh;overflow:auto;background:#120a12;border:1px solid #ff4d8d44;border-radius:18px;padding:22px 24px;box-shadow:0 20px 80px #000c;font:14px/1.55 system-ui,-apple-system,sans-serif;color:#f2e8ee;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">' +
      '<h2 style="margin:0;font-size:18px;color:#ff8fb8;">Use it in Claude Code or Codex</h2>' +
      '<button id="cfm-howto-x" style="background:none;border:none;color:#b9a6b2;font-size:22px;cursor:pointer;line-height:1;">×</button></div>' +
      '<p style="color:#c9bcc6;margin:.6em 0 1em;">It\'s an <b>MCP server</b> — any MCP-capable agent drives it just by chatting. No hardware needed; this very page is the simulator.</p>' +
      '<p style="margin:.2em 0;"><b>🟣 Claude Code</b> — install as a plugin:</p>' +
      '<pre style="background:#0a060a;border:1px solid #ffffff14;border-radius:10px;padding:11px 13px;overflow:auto;font:12.5px/1.5 ui-monospace,Menlo,monospace;color:#ffd6e8;">/plugin marketplace add mana-am/claude-f-me\n/plugin install claude-f-me@claude-f-me</pre>' +
      '<p style="color:#c9bcc6;margin:.5em 0 1em;">Then talk: <code>scan for devices</code> · <code>start an edge game</code>, or <code>/claude-f-me:fuck</code>.</p>' +
      '<p style="margin:.2em 0;"><b>🟢 Codex / any MCP client</b> — build, then register the server:</p>' +
      '<pre style="background:#0a060a;border:1px solid #ffffff14;border-radius:10px;padding:11px 13px;overflow:auto;font:12.5px/1.5 ui-monospace,Menlo,monospace;color:#ffd6e8;">git clone https://github.com/mana-am/claude-f-me\ncd claude-f-me &amp;&amp; npm install &amp;&amp; npm run build\n\n# ~/.codex/config.toml\n[mcp_servers.claude-f-me]\ncommand = "node"\nargs = ["/abs/path/claude-f-me/dist/claude-f-me.mjs"]\nenv = { CFM_MODE = "simulated" }</pre>' +
      '<p style="margin:1em 0 0;"><a href="https://github.com/mana-am/claude-f-me" style="color:#ff8fb8;font-weight:600;">Full docs & install →</a></p>' +
      "</div>";
    document.body.appendChild(m);

    function show(e) { if (e) e.preventDefault(); m.style.display = "flex"; }
    function hide() { m.style.display = "none"; }
    document.getElementById("cfm-howto-open").addEventListener("click", show);
    document.getElementById("cfm-howto-x").addEventListener("click", hide);
    m.addEventListener("click", function (e) { if (e.target === m) hide(); });
    addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner); else banner();
})();
