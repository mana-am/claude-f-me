import { EventEmitter } from "node:events";
import type { DeviceBackend, DeviceInfo, PatternStep } from "./types.js";
import { clamp01, delay, logErr } from "../util.js";

/**
 * Hard safety ceiling: even with no duration given, a device will never be left
 * running longer than this from a single command. An AI making a call and then
 * "forgetting" to stop must not be able to run hardware indefinitely.
 */
const SAFETY_MAX_ON_MS = 5 * 60 * 1000;

/**
 * Continuous drivers (patterns, video, game) feed intensity rapidly. If their
 * loop dies, this watchdog stops the device shortly after the feed stops.
 */
const DRIVE_WATCHDOG_MS = 4000;

export interface LogEntry {
  t: number;
  level: "info" | "cmd" | "safety" | "warn";
  msg: string;
}

export interface ActiveMode {
  type: "video" | "game" | "audio" | "muse";
  label: string;
  positionMs?: number;
  durationMs?: number;
}

/** Current driver "personality" surfaced to the console (blind mode hides the id). */
export interface PersonaView {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  model: string | null;
  blind: boolean;
}

export interface DeviceStateView extends DeviceInfo {
  intensity: number;
}

export interface Snapshot {
  mode: string;
  maxIntensity: number;
  consoleUrl: string;
  activeMode: ActiveMode | null;
  persona: PersonaView | null;
  masters: number;
  devices: DeviceStateView[];
  log: LogEntry[];
}

export interface ManagerOptions {
  maxIntensity?: number;
  consoleUrl?: string;
}

interface Cancellable {
  stop(): void;
}

/**
 * Single source of truth for device state. Adds, on top of any backend:
 *  - a clamped global safety max-intensity cap
 *  - per-device auto-stop ("deadman") timers + a watchdog for continuous drivers
 *  - cancellable patterns
 *  - an attached "mode" (video/game) that emergency-stop also cancels
 *  - a command log
 *  - a "state" event for the console to subscribe to
 */
export class DeviceManager extends EventEmitter {
  maxIntensity: number;
  private consoleUrl: string;
  private intensities = new Map<string, number>();
  private autoStop = new Map<string, NodeJS.Timeout>();
  private patternToken = new Map<string, number>();
  private log: LogEntry[] = [];
  private activeMode: ActiveMode | null = null;
  private mode: Cancellable | null = null;
  private persona: PersonaView | null = null;
  private masters = 0;

  constructor(private backend: DeviceBackend, opts: ManagerOptions = {}) {
    super();
    this.maxIntensity = clamp01(opts.maxIntensity ?? 1);
    this.consoleUrl = opts.consoleUrl ?? "";
    this.backend.onChange(() => this.emitState());
  }

  /** Lets emergency/stop cancel a running video/game mode too. */
  attachMode(mode: Cancellable): void {
    this.mode = mode;
  }

  setActiveMode(m: ActiveMode | null): void {
    this.activeMode = m;
    this.emitState();
  }

  /** The ModeController pushes the current driver persona here for the console. */
  setPersonaView(p: PersonaView | null): void {
    this.persona = p;
    this.emitState();
  }

  /** Number of connected "master" remote-control clients. */
  setMasterCount(n: number): void {
    const next = Math.max(0, n);
    if (next === this.masters) return;
    const rose = next > this.masters;
    this.masters = next;
    this.addLog("info", `${next} master remote(s) connected`);
    if (rose) this.addLog("safety", "a master is now in control");
    this.emitState();
  }

  async connect(): Promise<void> {
    await this.backend.connect();
    this.addLog("info", `backend connected (${this.backend.mode})`);
    this.emitState();
  }

  async scan(ms: number): Promise<void> {
    this.addLog("info", `scanning for ${ms}ms…`);
    await this.backend.scan(ms);
    this.addLog("info", `scan done — ${this.backend.list().length} device(s)`);
    this.emitState();
  }

  async vibrate(target: string, intensity: number, durationMs?: number): Promise<void> {
    const ids = this.resolveTargets(target);
    if (ids.length === 0) {
      this.addLog("warn", `vibrate: no device matched "${target}"`);
      return;
    }
    const capped = Math.min(clamp01(intensity), this.maxIntensity);
    for (const id of ids) {
      this.cancelPattern(id);
      await this.backend.setIntensity(id, capped);
      this.intensities.set(id, capped);
      this.armAutoStop(id, durationMs);
    }
    this.addLog(
      "cmd",
      `vibrate ${target} → ${pct(capped)}${durationMs ? ` for ${durationMs}ms` : ""}`
    );
    this.emitState();
  }

  /**
   * Low-noise continuous setter used by patterns and modes. Does not log per
   * step; arms a short watchdog so a dead driver can't leave hardware running.
   */
  async driveStep(id: string, intensity: number): Promise<void> {
    const v = Math.min(clamp01(intensity), this.maxIntensity);
    await this.backend.setIntensity(id, v);
    this.intensities.set(id, v);
    this.armWatchdog(id, v);
    this.emitState();
  }

  async stop(target: string): Promise<void> {
    this.mode?.stop();
    const ids = this.resolveTargets(target);
    for (const id of ids) {
      this.cancelPattern(id);
      this.clearAuto(id);
      await this.backend.setIntensity(id, 0);
      this.intensities.set(id, 0);
    }
    this.addLog("cmd", `stop ${target}`);
    this.emitState();
  }

  async stopAll(): Promise<void> {
    this.mode?.stop();
    for (const d of this.backend.list()) {
      this.cancelPattern(d.id);
      this.clearAuto(d.id);
      await this.backend.setIntensity(d.id, 0);
      this.intensities.set(d.id, 0);
    }
    this.activeMode = null;
    this.addLog("safety", "EMERGENCY STOP — all devices off");
    this.emitState();
  }

  async pattern(target: string, steps: PatternStep[], loops = 1): Promise<void> {
    const ids = this.resolveTargets(target);
    if (ids.length === 0) {
      this.addLog("warn", `pattern: no device matched "${target}"`);
      return;
    }
    this.addLog("cmd", `pattern ${target} (${steps.length} steps ×${loops})`);
    for (const id of ids) void this.runPattern(id, steps, loops);
  }

  setMaxIntensity(value: number): void {
    this.maxIntensity = clamp01(value);
    for (const [id, cur] of this.intensities) {
      if (cur > this.maxIntensity) {
        void this.backend.setIntensity(id, this.maxIntensity);
        this.intensities.set(id, this.maxIntensity);
      }
    }
    this.addLog("safety", `max intensity cap → ${pct(this.maxIntensity)}`);
    this.emitState();
  }

  /** Public so modes can expand a target into concrete device ids. */
  resolveTargets(target: string): string[] {
    const all = this.backend.list().map((d) => d.id);
    if (!target || target === "all" || target === "*") return all;
    return all.includes(target) ? [target] : [];
  }

  snapshot(): Snapshot {
    return {
      mode: this.backend.mode,
      maxIntensity: this.maxIntensity,
      consoleUrl: this.consoleUrl,
      activeMode: this.activeMode,
      persona: this.persona,
      masters: this.masters,
      devices: this.backend.list().map((d) => ({
        ...d,
        intensity: this.intensities.get(d.id) ?? 0,
      })),
      log: this.log.slice(-60),
    };
  }

  log_(level: LogEntry["level"], msg: string): void {
    this.addLog(level, msg);
    this.emitState();
  }

  // ---- internals ----

  private async runPattern(id: string, steps: PatternStep[], loops: number): Promise<void> {
    const token = (this.patternToken.get(id) ?? 0) + 1;
    this.patternToken.set(id, token);
    this.clearAuto(id);
    for (let l = 0; l < loops; l++) {
      for (const step of steps) {
        if (this.patternToken.get(id) !== token) return; // cancelled
        await this.driveStep(id, step.intensity);
        await delay(step.ms);
      }
    }
    if (this.patternToken.get(id) === token) {
      await this.backend.setIntensity(id, 0);
      this.intensities.set(id, 0);
      this.clearAuto(id);
      this.emitState();
    }
  }

  private cancelPattern(id: string): void {
    this.patternToken.set(id, (this.patternToken.get(id) ?? 0) + 1);
  }

  private armAutoStop(id: string, durationMs?: number): void {
    this.clearAuto(id);
    if ((this.intensities.get(id) ?? 0) <= 0) return;
    const ms = durationMs && durationMs > 0 ? Math.min(durationMs, SAFETY_MAX_ON_MS) : SAFETY_MAX_ON_MS;
    const reason = durationMs && durationMs > 0 ? `${ms}ms elapsed` : `safety cap ${SAFETY_MAX_ON_MS}ms`;
    const to = setTimeout(() => {
      void this.backend.setIntensity(id, 0).catch(() => {});
      this.intensities.set(id, 0);
      this.addLog("safety", `auto-stop ${id} (${reason})`);
      this.emitState();
    }, ms);
    this.autoStop.set(id, to);
  }

  private armWatchdog(id: string, intensity: number): void {
    this.clearAuto(id);
    if (intensity <= 0) return;
    const to = setTimeout(() => {
      void this.backend.setIntensity(id, 0).catch(() => {});
      this.intensities.set(id, 0);
      this.addLog("safety", `watchdog stop ${id} (driver stopped feeding)`);
      this.emitState();
    }, DRIVE_WATCHDOG_MS);
    this.autoStop.set(id, to);
  }

  private clearAuto(id: string): void {
    const t = this.autoStop.get(id);
    if (t) clearTimeout(t);
    this.autoStop.delete(id);
  }

  private addLog(level: LogEntry["level"], msg: string): void {
    this.log.push({ t: Date.now(), level, msg });
    if (this.log.length > 200) this.log.shift();
    logErr(`[${level}] ${msg}`);
  }

  private emitState(): void {
    this.emit("state");
  }
}

const pct = (v: number): string => `${Math.round(v * 100)}%`;
