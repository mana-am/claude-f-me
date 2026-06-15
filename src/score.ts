/**
 * A "score" is a Muse-native haptic timeline: keyframes of intensity over time.
 * Unlike a Funscript (position 0..100 of a stroker), a score speaks the device's
 * own language directly — level 0..1 at absolute times in ms — and is meant to be
 * *composed* by a model from a natural-language brief, then played back smoothly.
 */
export interface ScoreKeyframe {
  /** absolute time in ms from the start of the score */
  at: number;
  /** intensity 0..1 */
  level: number;
}

export interface Score {
  /** library key / short name */
  name?: string;
  /** the natural-language brief this was composed from (shown in the console) */
  brief?: string;
  /** the model that composed it, if any (e.g. "claude-opus-4-8") */
  by?: string;
  keyframes: ScoreKeyframe[];
}

/**
 * Sanitise raw keyframes into a sorted, finite, in-range, time-monotonic list.
 * Throws if nothing usable remains. Shared by the MCP `compose` tool, the LLM
 * bridge and the saved library so every path enforces the same shape.
 */
export function normalizeKeyframes(raw: unknown): ScoreKeyframe[] {
  const arr = Array.isArray(raw) ? raw : [];
  const kf = arr
    .map((a: any) => ({ at: Number(a?.at), level: Number(a?.level) }))
    .filter((k) => Number.isFinite(k.at) && Number.isFinite(k.level) && k.at >= 0)
    .map((k) => ({ at: k.at, level: Math.min(1, Math.max(0, k.level)) }))
    .sort((a, b) => a.at - b.at);
  if (kf.length === 0) throw new Error("score has no usable keyframes");
  return kf;
}

/** Total length of a score in ms (time of the last keyframe). */
export function scoreDuration(kf: ScoreKeyframe[]): number {
  return kf.length ? kf[kf.length - 1].at : 0;
}

/**
 * Linear-interpolate the score's level (0..1) at time t (ms).
 * Same binary-search shape as the funscript sampler in modes.ts, but level-native.
 */
export function sampleScore(kf: ScoreKeyframe[], t: number): number {
  if (kf.length === 0) return 0;
  if (t <= kf[0].at) return kf[0].level;
  const last = kf[kf.length - 1];
  if (t >= last.at) return last.level;
  let lo = 0;
  let hi = kf.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (kf[mid].at <= t) lo = mid + 1;
    else hi = mid;
  }
  const b = kf[lo];
  const a = kf[lo - 1];
  const span = b.at - a.at || 1;
  const f = (t - a.at) / span;
  return a.level + (b.level - a.level) * f;
}
