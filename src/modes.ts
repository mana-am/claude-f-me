import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { DeviceManager, PersonaView } from "./device/manager.js";
import { clamp01, delay } from "./util.js";
import {
  normalizeKeyframes,
  sampleScore,
  scoreDuration,
  type Score,
  type ScoreKeyframe,
} from "./score.js";
import { DEFAULT_PERSONA, PERSONAS, getPersona, type Persona } from "./personas.js";
import { composeWithModel, isLlmConfigured } from "./llm.js";

export type GameType = "roulette" | "escalation" | "ambient" | "edge" | "wheel";

const DATA_DIR = join(homedir(), ".claude-f-me");
const MUSE_FILE = join(DATA_DIR, "muse.json");

/**
 * Drives the device in higher-level "modes" on top of the manager:
 *  - video mode: plays a Funscript (ecosystem-standard timeline) in real time.
 *  - muse mode: plays a *score* (level-native keyframes) a model composed from a
 *    natural-language brief — see score.ts / llm.ts.
 *  - game mode: built-in interactive engines (roulette / escalation / …).
 *  - personas: a driver personality that modulates games/events and routes Muse
 *    composition to a chosen model.
 *
 * Only one mode runs at a time. Everything routes through manager.driveStep so
 * the safety cap and watchdog still apply. A bumped token cancels any loop.
 */
export class ModeController {
  private token = 0;
  private actions: ScoreKeyframe[] = []; // loaded funscript, as level-native keyframes
  private library = new Map<string, Score>();
  private persona: Persona = DEFAULT_PERSONA;
  private blind = false;
  private memory: import("./memory.js").Memory | null = null;

  constructor(private manager: DeviceManager) {
    manager.attachMode(this);
    for (const s of BUILTIN_SCORES) this.library.set(s.name!, s);
    void this.loadLibrary();
    this.pushPersona();
  }

  /** Optional local memory: records plays + quick-abort dislike signals. */
  attachMemory(m: import("./memory.js").Memory): void {
    this.memory = m;
  }

  /** Cancel whatever mode is running. */
  stop(): void {
    this.token++;
    this.memory?.noteStop();
    this.manager.setActiveMode(null);
  }

  // ---- personas ----

  listPersonas(): Array<Persona & { active: boolean }> {
    return PERSONAS.map((p) => ({ ...p, active: !this.blind && p.id === this.persona.id }));
  }

  /** Select a persona by id, or "blind" to pick a random hidden one. */
  setPersona(id: string): { id: string; blind: boolean } {
    if (id === "blind" || id === "random") {
      const pick = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
      this.persona = pick;
      this.blind = id === "blind";
      this.manager.log_("cmd", this.blind ? "persona → 🎭 ??? (blind)" : `persona → ${pick.emoji} ${pick.name.en}`);
    } else {
      const p = getPersona(id);
      if (!p) throw new Error(`unknown persona "${id}"`);
      this.persona = p;
      this.blind = false;
      this.manager.log_("cmd", `persona → ${p.emoji} ${p.name.en} — "${p.voice.en}"`);
    }
    this.pushPersona();
    return { id: this.blind ? "blind" : this.persona.id, blind: this.blind };
  }

  /** Reveal a blind persona's identity. */
  reveal(): PersonaView | null {
    if (this.blind) {
      this.blind = false;
      this.manager.log_("cmd", `persona revealed → ${this.persona.emoji} ${this.persona.name.en}`);
      this.pushPersona();
    }
    return this.personaView();
  }

  get activePersona(): Persona {
    return this.persona;
  }

  private personaView(): PersonaView {
    const p = this.persona;
    if (this.blind) {
      return { id: "blind", name: "???", emoji: "🎭", tagline: "a mystery is in control", model: null, blind: true };
    }
    return { id: p.id, name: p.name.en, emoji: p.emoji, tagline: p.tagline.en, model: p.model, blind: false };
  }

  private pushPersona(): void {
    this.manager.setPersonaView(this.personaView());
  }

  // ---- video mode (funscript) ----

  /** Load a funscript from a JSON string or a file path. */
  async loadFunscript(source: string): Promise<{ actions: number; durationMs: number }> {
    let raw = source.trim();
    if (!raw.startsWith("{")) {
      raw = await readFile(source, "utf8");
    }
    const data = JSON.parse(raw);
    // funscript position 0..100 → score level 0..1, then reuse the shared sampler
    const kf = normalizeKeyframes(
      (data.actions ?? []).map((a: any) => ({ at: Number(a.at), level: Number(a.pos) / 100 }))
    );
    this.actions = kf;
    const durationMs = scoreDuration(kf);
    this.manager.log_("info", `funscript loaded: ${kf.length} actions, ${(durationMs / 1000).toFixed(1)}s`);
    return { actions: kf.length, durationMs };
  }

  /** Play the loaded funscript in real time. Returns immediately; runs async. */
  async playVideo(
    target: string,
    opts: { loop?: boolean; speed?: number; invert?: boolean } = {}
  ): Promise<{ started: boolean; durationMs: number }> {
    if (this.actions.length === 0) throw new Error("no funscript loaded — call load_funscript first");
    const invert = !!opts.invert;
    const label = `funscript ×${normSpeed(opts.speed)}${opts.loop ? " ↻" : ""}${invert ? " inv" : ""}`;
    return this.runTimeline("video", target, this.actions, {
      loop: opts.loop,
      speed: opts.speed,
      label,
      transform: (lvl) => (invert ? 1 - lvl : lvl),
    });
  }

  // ---- muse mode (composed scores) ----

  listScores(): Array<{ name: string; brief?: string; by?: string; durationMs: number; keyframes: number }> {
    return [...this.library.values()].map((s) => ({
      name: s.name!,
      brief: s.brief,
      by: s.by,
      durationMs: scoreDuration(s.keyframes),
      keyframes: s.keyframes.length,
    }));
  }

  getScore(name: string): Score | undefined {
    return this.library.get(name);
  }

  /** Save a composed score to the library (and best-effort to disk). */
  async saveScore(name: string, score: Score): Promise<void> {
    const s: Score = { ...score, name, keyframes: normalizeKeyframes(score.keyframes) };
    this.library.set(name, s);
    await this.persistLibrary();
    this.manager.log_("info", `muse saved "${name}" (${s.keyframes.length} kf)`);
  }

  /** Compose via an external model (console "describe a vibe" box). Throws if no key. */
  async composeViaModel(brief: string, model?: string): Promise<Score> {
    const chosen = model ?? this.persona.model ?? undefined;
    if (!isLlmConfigured()) throw new Error("no LLM key configured — ask Claude in chat to compose, or set ANTHROPIC_API_KEY / OPENAI_API_KEY");
    return composeWithModel(brief, chosen);
  }

  /** Play a score (Muse mode). Returns immediately; runs async. */
  async playScore(
    target: string,
    score: Score,
    opts: { loop?: boolean; speed?: number } = {}
  ): Promise<{ started: boolean; durationMs: number }> {
    const kf = normalizeKeyframes(score.keyframes);
    const label = score.brief || score.name || "muse";
    this.memory?.recordPlay("muse", score.name || label, this.persona.id);
    this.manager.log_("cmd", `muse → "${label}"${score.by ? " · by " + score.by : ""}`);
    return this.runTimeline("muse", target, kf, { loop: opts.loop, speed: opts.speed, label });
  }

  /** Shared real-time keyframe player for video + muse modes. */
  private async runTimeline(
    type: "video" | "muse",
    target: string,
    kf: ScoreKeyframe[],
    opts: { loop?: boolean; speed?: number; label: string; transform?: (lvl: number) => number }
  ): Promise<{ started: boolean; durationMs: number }> {
    const ids = this.manager.resolveTargets(target);
    if (ids.length === 0) throw new Error(`no device matched "${target}"`);
    const speed = normSpeed(opts.speed);
    const loop = !!opts.loop;
    const transform = opts.transform;
    const durationMs = scoreDuration(kf);

    const my = ++this.token;
    void (async () => {
      do {
        const start = Date.now();
        for (;;) {
          if (this.token !== my) return;
          const t = (Date.now() - start) * speed;
          if (t >= durationMs) break;
          let lvl = clamp01(sampleScore(kf, t));
          if (transform) lvl = clamp01(transform(lvl));
          for (const id of ids) await this.manager.driveStep(id, lvl);
          this.manager.setActiveMode({ type, label: opts.label, positionMs: t, durationMs });
          await delay(50);
        }
      } while (loop && this.token === my);
      if (this.token === my) {
        for (const id of ids) await this.manager.driveStep(id, 0);
        this.manager.setActiveMode(null);
      }
    })();

    return { started: true, durationMs };
  }

  // ---- game mode ----

  /** Start a built-in game engine. Returns immediately; runs async. Persona modulates feel. */
  async startGame(
    target: string,
    type: GameType,
    opts: { intensityMax?: number; durationMs?: number } = {}
  ): Promise<{ started: boolean; type: GameType }> {
    const ids = this.manager.resolveTargets(target);
    if (ids.length === 0) throw new Error(`no device matched "${target}"`);
    const p = this.persona;
    const max = clamp01(Math.min(opts.intensityMax ?? 1, p.ceiling));
    const endAt = opts.durationMs && opts.durationMs > 0 ? Date.now() + opts.durationMs : Infinity;
    // pace<0.5 ⇒ slower (>1), pace>0.5 ⇒ faster (<1)
    const pace = (ms: number) => Math.max(40, ms * (1.4 - p.pace));
    const rand = (span: number) => Math.random() * span * (0.4 + p.randomness);

    const my = ++this.token;
    this.memory?.recordPlay("game", type, this.persona.id);
    this.manager.log_("cmd", `game → ${type} · ${this.blind ? "🎭 ???" : p.emoji + " " + p.name.en}${opts.durationMs ? ` (${opts.durationMs}ms)` : ""}`);
    this.manager.setActiveMode({ type: "game", label: this.blind ? `🎭 ${type}` : `${p.emoji} ${type}` });

    const drive = async (v: number) => {
      for (const id of ids) await this.manager.driveStep(id, v);
    };

    void (async () => {
      if (type === "roulette") {
        while (this.token === my && Date.now() < endAt) {
          await delay(pace(600) + rand(2400)); // suspense gap
          if (this.token !== my) break;
          const lvl = 0.3 + Math.random() * 0.7 * max;
          await drive(Math.min(lvl, max));
          await delay(pace(200) + rand(900)); // burst
          await drive(0);
        }
      } else if (type === "escalation") {
        let lvl = 0.1;
        const stepHold = pace(2500);
        while (this.token === my && Date.now() < endAt && lvl < max) {
          await drive(lvl);
          await delay(stepHold);
          lvl += 0.1;
        }
        while (this.token === my && Date.now() < endAt) {
          await drive(max); // hold at max until stopped
          await delay(500);
        }
      } else if (type === "edge") {
        // ramp toward a peak that creeps higher, hold on the brink, then deny.
        // persona.denial stretches the denial rest; brat denies less, slowburn more.
        let peak = 0.55;
        const denyRest = 1500 + p.denial * 4000;
        while (this.token === my && Date.now() < endAt) {
          for (let v = 0.2; v <= peak && this.token === my; v += 0.08) {
            await drive(Math.min(v, max));
            await delay(pace(420));
          }
          await drive(Math.min(peak, max)); // hold on the brink
          await delay(pace(1600));
          await drive(0); // denial
          await delay(denyRest + rand(2500));
          peak = Math.min(0.98, peak + 0.1);
        }
      } else if (type === "wheel") {
        while (this.token === my && Date.now() < endAt) {
          let wait = pace(45);
          while (wait < pace(320) && this.token === my) {
            await drive(Math.random() * max);
            await delay(wait);
            wait *= 1.18; // decelerate
          }
          const landed = (0.4 + Math.random() * 0.6) * max;
          await drive(Math.min(landed, max));
          await delay(3000 + rand(2500)); // hold on the result
          await drive(0);
          await delay(500);
        }
      } else {
        // ambient: gentle organic waves; randomness adds a faster overtone.
        const t0 = Date.now();
        while (this.token === my && Date.now() < endAt) {
          const t = (Date.now() - t0) / 1000;
          const v = (0.45 + 0.35 * Math.sin(t * 0.7) + (0.1 + 0.2 * p.randomness) * Math.sin(t * 2.3)) * max;
          await drive(clamp01(v));
          await delay(80);
        }
      }
      if (this.token === my) {
        await drive(0);
        this.manager.setActiveMode(null);
      }
    })();

    return { started: true, type };
  }

  /**
   * Narrative game hook: a one-shot reaction Claude can fire while running a
   * text adventure ("you opened the chest → reward"). Persona tints magnitude.
   */
  async gameEvent(
    target: string,
    kind: "reward" | "penalty" | "tease" | "pulse",
    magnitude = 0.7
  ): Promise<{ ok: true }> {
    const p = this.persona;
    const m = clamp01(magnitude);
    const cap = (v: number) => Math.min(v, p.ceiling);
    const map: Record<string, { intensity: number; ms: number }> = {
      reward: { intensity: cap(0.5 + 0.5 * m), ms: 1500 * (1.4 - p.pace) },
      penalty: { intensity: cap(Math.min(1, 0.8 + 0.2 * m)), ms: 500 },
      tease: { intensity: cap(0.3 + 0.3 * m), ms: (2500 + p.denial * 2000) * (1.4 - p.pace) },
      pulse: { intensity: cap(m), ms: 300 },
    };
    const e = map[kind] ?? map.pulse;
    await this.manager.vibrate(target, e.intensity, Math.round(e.ms));
    this.manager.log_("cmd", `game_event ${kind} (${Math.round(m * 100)}%)`);
    return { ok: true };
  }

  // ---- market mode (feel the market) ----

  /**
   * Poll a ticker and play a vibration melody from its live move — bigger move,
   * stronger buzz; green = rising arpeggio, red = falling. Token-cancellable like
   * the other modes, so stop / emergency_stop kill it and the safety cap applies.
   */
  async startMarket(
    target: string,
    symbolInput: string,
    opts: { intervalMs?: number; durationMs?: number; intensityMax?: number } = {}
  ): Promise<{ started: boolean; symbol: string }> {
    const { fetchQuote, marketMelody, resolveSymbol } = await import("./market.js");
    const ids = this.manager.resolveTargets(target);
    if (ids.length === 0) throw new Error(`no device matched "${target}"`);
    const symbol = resolveSymbol(symbolInput);
    const ceiling = clamp01(Math.min(opts.intensityMax ?? 1, this.persona.ceiling));
    const interval = Math.max(5000, opts.intervalMs ?? 15000); // be kind to the data source
    const endAt = opts.durationMs && opts.durationMs > 0 ? Date.now() + opts.durationMs : Infinity;

    const my = ++this.token;
    this.manager.log_("cmd", `market → ${symbol}`);
    this.manager.setActiveMode({ type: "market", label: `📈 ${symbol}` });
    this.memory?.recordPlay("market", symbol, this.persona.id);

    const drive = async (v: number) => {
      for (const id of ids) await this.manager.driveStep(id, v);
    };

    void (async () => {
      while (this.token === my && Date.now() < endAt) {
        let label = `📈 ${symbol}`;
        try {
          const q = await fetchQuote(symbol);
          if (this.token !== my) break;
          const arrow = q.changePct >= 0 ? "▲" : "▼";
          label = `📈 ${q.symbol} ${arrow}${Math.abs(q.changePct).toFixed(2)}% · ${q.price}`;
          this.manager.setActiveMode({ type: "market", label });
          for (const step of marketMelody(q, ceiling)) {
            if (this.token !== my) break;
            await drive(step.intensity);
            await delay(step.ms);
          }
        } catch (e) {
          this.manager.log_("warn", `market: ${symbol} fetch failed (${e})`);
          await drive(0);
        }
        // idle until the next poll, staying cancellable
        const until = Date.now() + interval;
        while (this.token === my && Date.now() < until && Date.now() < endAt) await delay(250);
      }
      if (this.token === my) {
        await drive(0);
        this.manager.setActiveMode(null);
      }
    })();

    return { started: true, symbol };
  }

  // ---- library persistence (best-effort) ----

  private async loadLibrary(): Promise<void> {
    try {
      const raw = await readFile(MUSE_FILE, "utf8");
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        for (const s of arr) {
          if (s?.name && Array.isArray(s.keyframes)) {
            this.library.set(s.name, { ...s, keyframes: normalizeKeyframes(s.keyframes) });
          }
        }
      }
    } catch {
      /* no saved library yet — fine */
    }
  }

  private async persistLibrary(): Promise<void> {
    try {
      await mkdir(DATA_DIR, { recursive: true });
      // only persist user-saved scores, not the built-ins
      const builtinNames = new Set(BUILTIN_SCORES.map((s) => s.name));
      const saved = [...this.library.values()].filter((s) => !builtinNames.has(s.name));
      await writeFile(MUSE_FILE, JSON.stringify(saved, null, 2));
    } catch {
      /* persistence is best-effort */
    }
  }
}

const normSpeed = (s?: number): number => (s && s > 0 ? s : 1);

/** A few starter scores so Muse has something to play before any model composes. */
const BUILTIN_SCORES: Score[] = [
  {
    name: "slow-build",
    brief: "a long, patient build to a single release",
    keyframes: [
      { at: 0, level: 0 },
      { at: 20000, level: 0.25 },
      { at: 45000, level: 0.4 },
      { at: 70000, level: 0.35 },
      { at: 95000, level: 0.6 },
      { at: 110000, level: 0.55 },
      { at: 125000, level: 0.85 },
      { at: 132000, level: 1 },
      { at: 138000, level: 0 },
    ],
  },
  {
    name: "rollercoaster",
    brief: "climbs, plunges, climbs higher — never lets you settle",
    keyframes: [
      { at: 0, level: 0.1 },
      { at: 6000, level: 0.7 },
      { at: 8000, level: 0.2 },
      { at: 14000, level: 0.85 },
      { at: 16000, level: 0.15 },
      { at: 22000, level: 1 },
      { at: 24500, level: 0.3 },
      { at: 30000, level: 0.95 },
      { at: 33000, level: 0 },
    ],
  },
  {
    name: "storm",
    brief: "distant rumbles building into relentless waves",
    keyframes: [
      { at: 0, level: 0.05 },
      { at: 8000, level: 0.3 },
      { at: 9000, level: 0.6 },
      { at: 10000, level: 0.2 },
      { at: 18000, level: 0.5 },
      { at: 19000, level: 0.9 },
      { at: 20000, level: 0.4 },
      { at: 28000, level: 0.7 },
      { at: 34000, level: 1 },
      { at: 44000, level: 1 },
      { at: 47000, level: 0.1 },
    ],
  },
  {
    name: "ily-morse",
    brief: 'pulses "I love you" in morse, then a warm hold',
    keyframes: [
      // I = · ·
      { at: 0, level: 0 }, { at: 100, level: 0.9 }, { at: 250, level: 0 },
      { at: 400, level: 0.9 }, { at: 550, level: 0 },
      // L = · – · ·
      { at: 900, level: 0.9 }, { at: 1050, level: 0 },
      { at: 1200, level: 0.9 }, { at: 1600, level: 0 },
      { at: 1750, level: 0.9 }, { at: 1900, level: 0 },
      { at: 2050, level: 0.9 }, { at: 2200, level: 0 },
      // Y = – · – –
      { at: 2600, level: 0.9 }, { at: 3000, level: 0 },
      { at: 3150, level: 0.9 }, { at: 3300, level: 0 },
      { at: 3450, level: 0.9 }, { at: 3850, level: 0 },
      { at: 4000, level: 0.9 }, { at: 4400, level: 0 },
      // warm hold
      { at: 5200, level: 0.6 }, { at: 8000, level: 0.7 }, { at: 9000, level: 0 },
    ],
  },
];
