import { readFile } from "node:fs/promises";
import type { DeviceManager } from "./device/manager.js";
import { clamp01, delay } from "./util.js";

interface FunscriptAction {
  at: number; // ms
  pos: number; // 0..100
}

export type GameType = "roulette" | "escalation" | "ambient";

/**
 * Drives the device in higher-level "modes" on top of the manager:
 *  - video mode: plays a Funscript (the ecosystem-standard timeline format)
 *    in real time, mapping position 0..100 → intensity 0..1.
 *  - game mode: built-in interactive engines (roulette / escalation / ambient).
 *
 * Only one mode runs at a time. Everything routes through manager.driveStep,
 * so the safety cap and watchdog still apply. A bumped token cancels any loop.
 */
export class ModeController {
  private token = 0;
  private actions: FunscriptAction[] = [];

  constructor(private manager: DeviceManager) {
    manager.attachMode(this);
  }

  /** Cancel whatever mode is running. */
  stop(): void {
    this.token++;
    this.manager.setActiveMode(null);
  }

  /** Load a funscript from a JSON string or a file path. */
  async loadFunscript(source: string): Promise<{ actions: number; durationMs: number }> {
    let raw = source.trim();
    if (!raw.startsWith("{")) {
      raw = await readFile(source, "utf8");
    }
    const data = JSON.parse(raw);
    const actions: FunscriptAction[] = (data.actions ?? [])
      .map((a: any) => ({ at: Number(a.at), pos: Number(a.pos) }))
      .filter((a: FunscriptAction) => Number.isFinite(a.at) && Number.isFinite(a.pos))
      .sort((a: FunscriptAction, b: FunscriptAction) => a.at - b.at);
    if (actions.length === 0) throw new Error("funscript has no usable actions");
    this.actions = actions;
    const durationMs = actions[actions.length - 1].at;
    this.manager.log_("info", `funscript loaded: ${actions.length} actions, ${(durationMs / 1000).toFixed(1)}s`);
    return { actions: actions.length, durationMs };
  }

  /** Play the loaded funscript in real time. Returns immediately; runs async. */
  async playVideo(
    target: string,
    opts: { loop?: boolean; speed?: number; invert?: boolean } = {}
  ): Promise<{ started: boolean; durationMs: number }> {
    if (this.actions.length === 0) throw new Error("no funscript loaded — call load_funscript first");
    const speed = opts.speed && opts.speed > 0 ? opts.speed : 1;
    const loop = !!opts.loop;
    const invert = !!opts.invert;
    const ids = this.manager.resolveTargets(target);
    if (ids.length === 0) throw new Error(`no device matched "${target}"`);

    const my = ++this.token;
    const acts = this.actions;
    const durationMs = acts[acts.length - 1].at;
    const label = `funscript ×${speed}${loop ? " ↻" : ""}${invert ? " inv" : ""}`;
    this.manager.log_("cmd", `video mode → ${label}`);

    void (async () => {
      do {
        const start = Date.now();
        for (;;) {
          if (this.token !== my) return;
          const t = (Date.now() - start) * speed;
          if (t >= durationMs) break;
          const pos = sampleFunscript(acts, t);
          const intensity = clamp01((invert ? 100 - pos : pos) / 100);
          for (const id of ids) await this.manager.driveStep(id, intensity);
          this.manager.setActiveMode({ type: "video", label, positionMs: t, durationMs });
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

  /** Start a built-in game engine. Returns immediately; runs async. */
  async startGame(
    target: string,
    type: GameType,
    opts: { intensityMax?: number; durationMs?: number } = {}
  ): Promise<{ started: boolean; type: GameType }> {
    const ids = this.manager.resolveTargets(target);
    if (ids.length === 0) throw new Error(`no device matched "${target}"`);
    const max = clamp01(opts.intensityMax ?? 1);
    const endAt = opts.durationMs && opts.durationMs > 0 ? Date.now() + opts.durationMs : Infinity;

    const my = ++this.token;
    this.manager.log_("cmd", `game mode → ${type}${opts.durationMs ? ` (${opts.durationMs}ms)` : ""}`);
    this.manager.setActiveMode({ type: "game", label: type });

    const drive = async (v: number) => {
      for (const id of ids) await this.manager.driveStep(id, v);
    };

    void (async () => {
      if (type === "roulette") {
        while (this.token === my && Date.now() < endAt) {
          await delay(600 + Math.random() * 2400); // suspense gap
          if (this.token !== my) break;
          const lvl = 0.3 + Math.random() * 0.7 * max;
          await drive(Math.min(lvl, max));
          await delay(200 + Math.random() * 900); // burst
          await drive(0);
        }
      } else if (type === "escalation") {
        let lvl = 0.1;
        while (this.token === my && Date.now() < endAt && lvl < max) {
          await drive(lvl);
          await delay(2500);
          lvl += 0.1;
        }
        while (this.token === my && Date.now() < endAt) {
          await drive(max); // hold at max until stopped
          await delay(500);
        }
      } else {
        // ambient: gentle organic waves
        const t0 = Date.now();
        while (this.token === my && Date.now() < endAt) {
          const t = (Date.now() - t0) / 1000;
          const v = (0.45 + 0.35 * Math.sin(t * 0.7) + 0.15 * Math.sin(t * 2.3)) * max;
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
   * text adventure ("you opened the chest → reward"). Does not take over a mode.
   */
  async gameEvent(
    target: string,
    kind: "reward" | "penalty" | "tease" | "pulse",
    magnitude = 0.7
  ): Promise<{ ok: true }> {
    const m = clamp01(magnitude);
    const map: Record<string, { intensity: number; ms: number }> = {
      reward: { intensity: 0.5 + 0.5 * m, ms: 1500 },
      penalty: { intensity: Math.min(1, 0.8 + 0.2 * m), ms: 500 },
      tease: { intensity: 0.3 + 0.3 * m, ms: 2500 },
      pulse: { intensity: m, ms: 300 },
    };
    const e = map[kind] ?? map.pulse;
    await this.manager.vibrate(target, e.intensity, e.ms);
    this.manager.log_("cmd", `game_event ${kind} (${Math.round(m * 100)}%)`);
    return { ok: true };
  }
}

/** Linear-interpolate funscript position (0..100) at time t (ms). */
function sampleFunscript(acts: FunscriptAction[], t: number): number {
  if (t <= acts[0].at) return acts[0].pos;
  const last = acts[acts.length - 1];
  if (t >= last.at) return last.pos;
  // binary search for the segment [i, i+1] containing t
  let lo = 0;
  let hi = acts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (acts[mid].at <= t) lo = mid + 1;
    else hi = mid;
  }
  const b = acts[lo];
  const a = acts[lo - 1];
  const span = b.at - a.at || 1;
  const f = (t - a.at) / span;
  return a.pos + (b.pos - a.pos) * f;
}
