import type { GameType } from "./modes.js";
import type { PresetName } from "./presets.js";

/**
 * A persona is a *driver personality* — it shapes HOW intents are rendered, not
 * what they are. Selecting one changes the feel of games, narrative events and
 * (when a matching API key is present) which model composes your Muse scores.
 * Personas are themed after SOTA-model archetypes so "结合各种模型" is tangible:
 * the slow, patient Opus burn vs. the fast, chaotic brat.
 */
export interface Persona {
  id: string;
  emoji: string;
  name: { en: string; zh: string };
  tagline: { en: string; zh: string };
  /** model id this persona routes Muse composition to (null = local only) */
  model: string | null;
  /** 0..1 — higher = faster, shorter gaps */
  pace: number;
  /** 0..1 — chaos / unpredictability */
  randomness: number;
  /** 0..1 — tease-and-deny tendency */
  denial: number;
  /** multiplies the intensity ceiling (≤1 gentler, can exceed toward 1) */
  ceiling: number;
  ramp: "slow" | "linear" | "snap";
  signatureGame?: GameType;
  signaturePreset?: PresetName;
  voice: { en: string; zh: string };
}

export const PERSONAS: Persona[] = [
  {
    id: "slowburn",
    emoji: "🕯️",
    name: { en: "The Slow Burn", zh: "慢炖" },
    tagline: { en: "patient, deliberate, merciless about waiting", zh: "耐心、克制、把你吊在边缘" },
    model: "claude-opus-4-8",
    pace: 0.25,
    randomness: 0.15,
    denial: 0.8,
    ceiling: 0.9,
    ramp: "slow",
    signatureGame: "edge",
    signaturePreset: "tease",
    voice: { en: "We have all the time in the world.", zh: "别急，我们有的是时间。" },
  },
  {
    id: "brat",
    emoji: "😈",
    name: { en: "The Brat", zh: "小恶魔" },
    tagline: { en: "fast, jumpy, never plays fair", zh: "又急又跳，从不讲道理" },
    model: "gpt-5.5",
    pace: 0.9,
    randomness: 0.85,
    denial: 0.4,
    ceiling: 1,
    ramp: "snap",
    signatureGame: "wheel",
    signaturePreset: "earthquake",
    voice: { en: "Try to keep up.", zh: "跟得上吗？" },
  },
  {
    id: "metronome",
    emoji: "🎼",
    name: { en: "The Metronome", zh: "节拍器" },
    tagline: { en: "steady, predictable, hypnotic", zh: "稳定、可预期、催眠" },
    model: null,
    pace: 0.5,
    randomness: 0.05,
    denial: 0.2,
    ceiling: 0.85,
    ramp: "linear",
    signatureGame: "ambient",
    signaturePreset: "heartbeat",
    voice: { en: "Breathe with me.", zh: "跟着我的节奏呼吸。" },
  },
  {
    id: "storm",
    emoji: "⛈️",
    name: { en: "The Storm", zh: "风暴" },
    tagline: { en: "relentless escalation, no mercy", zh: "一路递增，毫不留情" },
    model: null,
    pace: 0.75,
    randomness: 0.5,
    denial: 0.1,
    ceiling: 1,
    ramp: "linear",
    signatureGame: "escalation",
    signaturePreset: "escalate",
    voice: { en: "There's no stopping this now.", zh: "已经停不下来了。" },
  },
  {
    id: "oracle",
    emoji: "🔮",
    name: { en: "The Oracle", zh: "神谕" },
    tagline: { en: "dreamy, organic, never the same twice", zh: "梦幻、有机、每次都不一样" },
    model: "claude-opus-4-8",
    pace: 0.4,
    randomness: 0.7,
    denial: 0.35,
    ceiling: 0.9,
    ramp: "slow",
    signatureGame: "ambient",
    signaturePreset: "wave",
    voice: { en: "Let go. Let me decide.", zh: "放手，交给我。" },
  },
];

export const DEFAULT_PERSONA = PERSONAS.find((p) => p.id === "metronome")!;

export function getPersona(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
