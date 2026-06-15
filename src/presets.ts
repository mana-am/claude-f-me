import type { PatternStep } from "./device/types.js";

/** Named vibration patterns shared by the MCP tools, console and master remote. */
export const PRESETS: Record<string, PatternStep[]> = {
  pulse: [
    { intensity: 0.75, ms: 400 },
    { intensity: 0, ms: 300 },
  ],
  wave: [
    { intensity: 0.2, ms: 300 },
    { intensity: 0.5, ms: 300 },
    { intensity: 0.85, ms: 300 },
    { intensity: 0.5, ms: 300 },
  ],
  escalate: [
    { intensity: 0.2, ms: 1000 },
    { intensity: 0.4, ms: 1000 },
    { intensity: 0.6, ms: 1000 },
    { intensity: 0.8, ms: 1000 },
    { intensity: 1.0, ms: 1500 },
  ],
  tease: [
    { intensity: 0.6, ms: 800 },
    { intensity: 0, ms: 1200 },
    { intensity: 0.85, ms: 600 },
    { intensity: 0, ms: 1500 },
  ],
  heartbeat: [
    { intensity: 0.9, ms: 140 },
    { intensity: 0.15, ms: 130 },
    { intensity: 0.85, ms: 140 },
    { intensity: 0, ms: 780 },
  ],
  staircase: [
    { intensity: 0.2, ms: 650 },
    { intensity: 0.4, ms: 650 },
    { intensity: 0.6, ms: 650 },
    { intensity: 0.8, ms: 650 },
    { intensity: 1.0, ms: 900 },
    { intensity: 0, ms: 500 },
  ],
  sos: [
    // · · ·
    { intensity: 0.9, ms: 150 }, { intensity: 0, ms: 130 },
    { intensity: 0.9, ms: 150 }, { intensity: 0, ms: 130 },
    { intensity: 0.9, ms: 150 }, { intensity: 0, ms: 340 },
    // – – –
    { intensity: 0.9, ms: 430 }, { intensity: 0, ms: 130 },
    { intensity: 0.9, ms: 430 }, { intensity: 0, ms: 130 },
    { intensity: 0.9, ms: 430 }, { intensity: 0, ms: 340 },
    // · · ·
    { intensity: 0.9, ms: 150 }, { intensity: 0, ms: 130 },
    { intensity: 0.9, ms: 150 }, { intensity: 0, ms: 130 },
    { intensity: 0.9, ms: 150 }, { intensity: 0, ms: 900 },
  ],
  earthquake: [
    { intensity: 0.5, ms: 90 }, { intensity: 0.95, ms: 90 },
    { intensity: 0.3, ms: 90 }, { intensity: 1.0, ms: 120 },
    { intensity: 0.45, ms: 90 }, { intensity: 0.85, ms: 90 },
    { intensity: 0.2, ms: 120 }, { intensity: 0.7, ms: 90 },
  ],
};

export type PresetName = keyof typeof PRESETS;
