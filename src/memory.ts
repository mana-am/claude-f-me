import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { logErr } from "./util.js";

/**
 * Local-only memory so claude-f-me gets to *know you* over time:
 *  - free-form notes you (or Claude) choose to remember
 *  - which games / muse scores you reach for, and which personas you vibe with
 *  - "quick-abort" signals: when something was stopped seconds after it started
 *    (a soft dislike signal the driver can learn to avoid)
 *
 * It lives at ~/.claude-f-me/memory.json, never leaves the machine, and can be
 * wiped instantly with forget(). This is sensitive data — treat it that way.
 */
const DATA_DIR = join(homedir(), ".claude-f-me");
const MEMORY_FILE = join(DATA_DIR, "memory.json");

const QUICK_ABORT_MS = 8000;

interface MemoryData {
  notes: string[];
  plays: Record<string, number>; // "game:edge" | "muse:rollercoaster" -> count
  personas: Record<string, number>; // persona id -> count
  quickAborts: Record<string, number>; // "game:edge@brat" -> count
  comfortCeiling: number | null;
  updatedAt: number;
}

const empty = (): MemoryData => ({
  notes: [],
  plays: {},
  personas: {},
  quickAborts: {},
  comfortCeiling: null,
  updatedAt: 0,
});

export class Memory {
  private data: MemoryData = empty();
  private lastPlay: { key: string; persona: string; at: number } | null = null;

  async load(): Promise<void> {
    try {
      const raw = await readFile(MEMORY_FILE, "utf8");
      this.data = { ...empty(), ...JSON.parse(raw) };
    } catch {
      /* no memory yet — fine */
    }
  }

  remember(note: string): void {
    const n = note.trim();
    if (!n) return;
    this.data.notes.push(n);
    if (this.data.notes.length > 200) this.data.notes.shift();
    void this.save();
  }

  /** Called when a game / muse score / video starts. */
  recordPlay(kind: string, name: string, persona: string): void {
    const key = `${kind}:${name}`;
    this.data.plays[key] = (this.data.plays[key] ?? 0) + 1;
    this.data.personas[persona] = (this.data.personas[persona] ?? 0) + 1;
    this.lastPlay = { key, persona, at: Date.now() };
    void this.save();
  }

  /** Called on any stop. If it came right after a play start, log a soft dislike. */
  noteStop(): void {
    const lp = this.lastPlay;
    this.lastPlay = null;
    if (!lp) return;
    if (Date.now() - lp.at < QUICK_ABORT_MS) {
      const k = `${lp.key}@${lp.persona}`;
      this.data.quickAborts[k] = (this.data.quickAborts[k] ?? 0) + 1;
      void this.save();
    }
  }

  setComfortCeiling(v: number): void {
    this.data.comfortCeiling = Math.min(1, Math.max(0, v));
    void this.save();
  }

  /** A compact profile for the recall tool and for persona/muse to consult. */
  recall(): {
    notes: string[];
    favorites: string[];
    personaAffinity: string[];
    dislikes: string[];
    comfortCeiling: number | null;
  } {
    const top = (rec: Record<string, number>, n: number) =>
      Object.entries(rec)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([k, v]) => `${k} ×${v}`);
    return {
      notes: this.data.notes.slice(-20),
      favorites: top(this.data.plays, 5),
      personaAffinity: top(this.data.personas, 3),
      dislikes: top(this.data.quickAborts, 5),
      comfortCeiling: this.data.comfortCeiling,
    };
  }

  async forget(): Promise<void> {
    this.data = empty();
    this.lastPlay = null;
    try {
      await rm(MEMORY_FILE, { force: true });
    } catch {
      /* ignore */
    }
  }

  private async save(): Promise<void> {
    this.data.updatedAt = Date.now();
    try {
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(MEMORY_FILE, JSON.stringify(this.data, null, 2));
    } catch (e) {
      logErr(`memory: save failed ${e}`);
    }
  }
}
