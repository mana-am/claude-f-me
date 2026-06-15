import type { DeviceManager } from "./device/manager.js";
import type { ModeController } from "./modes.js";
import type { ScoreKeyframe } from "./score.js";

/**
 * Session recorder — captures whatever the device actually does (manual slider,
 * Duet partner, audio, biofeedback, games, muse) as a Muse score you can save,
 * replay and share. It listens to the manager's "state" event and samples the
 * peak intensity across devices, so it doesn't care which driver produced it.
 *
 * Keyframes are deduped (only meaningful level changes are kept) and capped, and
 * a baseline sample is forced periodically so long holds survive interpolation.
 */
const MAX_KEYFRAMES = 4000;
const MIN_DELTA = 0.02;
const HEARTBEAT_MS = 2000; // force a sample at least this often while recording

export class Recorder {
  private recording = false;
  private startAt = 0;
  private kf: ScoreKeyframe[] = [];
  private lastLevel = -1;
  private lastAt = 0;
  private timer: NodeJS.Timeout | null = null;
  private readonly onState = () => this.sample();

  constructor(private manager: DeviceManager, private modes: ModeController) {}

  isRecording(): boolean {
    return this.recording;
  }

  begin(): { recording: true } {
    if (this.recording) return { recording: true };
    this.recording = true;
    this.startAt = Date.now();
    this.lastLevel = -1;
    this.lastAt = 0;
    this.kf = [];
    this.sample(); // capture t=0
    this.manager.on("state", this.onState);
    this.timer = setInterval(() => this.sample(true), HEARTBEAT_MS);
    this.manager.log_("cmd", "recording session…");
    return { recording: true };
  }

  /** Stop and (if long enough) save to the Muse library. Returns the result. */
  async end(name?: string): Promise<{ saved: string | null; keyframes: number; durationMs: number }> {
    if (!this.recording) return { saved: null, keyframes: 0, durationMs: 0 };
    this.recording = false;
    this.manager.off("state", this.onState);
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.sample(true); // final point
    const kf = this.kf;
    const durationMs = kf.length ? kf[kf.length - 1].at : 0;
    if (kf.length < 2 || durationMs < 1000) {
      this.manager.log_("warn", "recording too short to save");
      return { saved: null, keyframes: kf.length, durationMs };
    }
    const finalName = (name && name.trim()) || `session-${new Date(this.startAt).toISOString().slice(11, 19).replace(/:/g, "")}`;
    await this.modes.saveScore(finalName, { name: finalName, brief: "recorded session", by: "recorder", keyframes: kf });
    return { saved: finalName, keyframes: kf.length, durationMs };
  }

  private peak(): number {
    const d = this.manager.snapshot().devices;
    return d.reduce((a, x) => Math.max(a, x.intensity), 0);
  }

  private sample(force = false): void {
    if (!this.recording) return;
    const level = this.peak();
    const at = Date.now() - this.startAt;
    if (!force && this.lastLevel >= 0 && Math.abs(level - this.lastLevel) < MIN_DELTA) return;
    if (this.kf.length >= MAX_KEYFRAMES) return;
    // collapse duplicate timestamps (multiple state events in the same ms)
    if (this.kf.length && at - this.lastAt < 30 && !force) {
      this.kf[this.kf.length - 1].level = level;
    } else {
      this.kf.push({ at, level });
    }
    this.lastLevel = level;
    this.lastAt = at;
  }
}
