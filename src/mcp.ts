import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import type { DeviceManager } from "./device/manager.js";
import type { PatternStep } from "./device/types.js";
import type { ModeController } from "./modes.js";

const PRESETS: Record<string, PatternStep[]> = {
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
};

const text = (obj: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
});

export async function startMcp(manager: DeviceManager, modes: ModeController): Promise<void> {
  const server = new McpServer({ name: "opendick", version: "0.1.0" });

  server.registerTool(
    "list_devices",
    {
      title: "List devices",
      description:
        "List connected devices with their current vibration intensity (0..1), battery, the active backend mode (simulated|buttplug), the safety max-intensity cap, and the console URL.",
      inputSchema: {},
    },
    async () => text(manager.snapshot())
  );

  server.registerTool(
    "scan_devices",
    {
      title: "Scan for devices",
      description:
        "Scan for nearby/available devices for the given duration, then return the updated device list.",
      inputSchema: {
        duration_ms: z
          .number()
          .int()
          .min(500)
          .max(30000)
          .optional()
          .describe("scan duration in ms (default 4000)"),
      },
    },
    async ({ duration_ms }) => {
      await manager.scan(duration_ms ?? 4000);
      return text(manager.snapshot());
    }
  );

  server.registerTool(
    "vibrate",
    {
      title: "Vibrate",
      description:
        "Set vibration intensity on a device. intensity is 0..1 (0=off, 1=max). target is a device id or 'all' (default). Optionally auto-stop after duration_ms. The value is clamped to the safety max cap. Calling again replaces the current value.",
      inputSchema: {
        intensity: z.number().min(0).max(1).describe("0..1 (0=off, 1=max)"),
        target: z.string().optional().describe("device id or 'all' (default)"),
        duration_ms: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe("auto-stop after this many ms (recommended)"),
      },
    },
    async ({ intensity, target, duration_ms }) => {
      await manager.vibrate(target ?? "all", intensity, duration_ms);
      return text(manager.snapshot());
    }
  );

  server.registerTool(
    "pattern",
    {
      title: "Run a pattern",
      description:
        "Run a sequence of intensity steps on a device. Provide a named preset (pulse|wave|escalate|tease) OR explicit steps. loops repeats the whole sequence (the device stops when it finishes). Stop or vibrate cancels a running pattern.",
      inputSchema: {
        target: z.string().optional().describe("device id or 'all' (default)"),
        preset: z.enum(["pulse", "wave", "escalate", "tease"]).optional(),
        steps: z
          .array(
            z.object({
              intensity: z.number().min(0).max(1),
              ms: z.number().int().min(50).max(60000),
            })
          )
          .optional()
          .describe("explicit steps; overrides preset"),
        loops: z.number().int().min(1).max(50).optional().describe("repeat count (default 1)"),
      },
    },
    async ({ target, preset, steps, loops }) => {
      const seq = steps && steps.length > 0 ? steps : PRESETS[preset ?? "pulse"];
      await manager.pattern(target ?? "all", seq, loops ?? 1);
      return text({ started: true, target: target ?? "all", steps: seq.length, loops: loops ?? 1 });
    }
  );

  server.registerTool(
    "stop",
    {
      title: "Stop",
      description:
        "Stop a device (intensity 0) and cancel any running pattern. target is a device id or 'all' (default).",
      inputSchema: { target: z.string().optional().describe("device id or 'all' (default)") },
    },
    async ({ target }) => {
      await manager.stop(target ?? "all");
      return text(manager.snapshot());
    }
  );

  server.registerTool(
    "emergency_stop",
    {
      title: "Emergency stop",
      description: "Immediately stop ALL devices and cancel ALL patterns. Use when anything feels wrong.",
      inputSchema: {},
    },
    async () => {
      await manager.stopAll();
      return text({ stopped: true });
    }
  );

  server.registerTool(
    "set_max_intensity",
    {
      title: "Set safety max intensity",
      description:
        "Set the global safety cap (0..1). All current and future intensities are clamped to this value. Lower it to keep things gentle.",
      inputSchema: { value: z.number().min(0).max(1).describe("0..1") },
    },
    async ({ value }) => {
      manager.setMaxIntensity(value);
      return text({ maxIntensity: manager.maxIntensity });
    }
  );

  // ---- video mode (funscript) ----

  server.registerTool(
    "load_funscript",
    {
      title: "Load a funscript (video mode)",
      description:
        "Load a Funscript timeline so it can be played in video mode. `source` is either the funscript JSON itself (a string starting with '{') or a path to a .funscript/.json file. Returns the action count and duration.",
      inputSchema: {
        source: z.string().describe("funscript JSON string, or a file path to a .funscript"),
      },
    },
    async ({ source }) => text(await modes.loadFunscript(source))
  );

  server.registerTool(
    "play_video",
    {
      title: "Play loaded funscript",
      description:
        "Play the currently loaded funscript in real time, mapping position 0..100 to intensity 0..1 (clamped to the safety cap). Use load_funscript first. Cancels any other running mode.",
      inputSchema: {
        target: z.string().optional().describe("device id or 'all' (default)"),
        loop: z.boolean().optional().describe("repeat when it ends (default false)"),
        speed: z.number().min(0.1).max(4).optional().describe("playback speed (default 1)"),
        invert: z.boolean().optional().describe("invert position (default false)"),
      },
    },
    async ({ target, loop, speed, invert }) =>
      text(await modes.playVideo(target ?? "all", { loop, speed, invert }))
  );

  // ---- game mode ----

  server.registerTool(
    "start_game",
    {
      title: "Start a game mode",
      description:
        "Start a built-in interactive game engine. roulette = random bursts at random intervals; escalation = ramps up and holds at max until stopped; ambient = gentle organic waves. Cancels any other running mode.",
      inputSchema: {
        type: z.enum(["roulette", "escalation", "ambient"]),
        target: z.string().optional().describe("device id or 'all' (default)"),
        intensity_max: z.number().min(0).max(1).optional().describe("ceiling for this game (default 1)"),
        duration_ms: z.number().int().min(1000).optional().describe("auto-end after this long"),
      },
    },
    async ({ type, target, intensity_max, duration_ms }) =>
      text(await modes.startGame(target ?? "all", type, { intensityMax: intensity_max, durationMs: duration_ms }))
  );

  server.registerTool(
    "game_event",
    {
      title: "Fire a game event",
      description:
        "One-shot reaction for a narrative game you (the assistant) are running: reward / penalty / tease / pulse. magnitude 0..1 scales it. Good for text adventures — e.g. 'you found treasure' → reward.",
      inputSchema: {
        kind: z.enum(["reward", "penalty", "tease", "pulse"]),
        target: z.string().optional().describe("device id or 'all' (default)"),
        magnitude: z.number().min(0).max(1).optional().describe("0..1 (default 0.7)"),
      },
    },
    async ({ kind, target, magnitude }) => text(await modes.gameEvent(target ?? "all", kind, magnitude))
  );

  server.registerTool(
    "stop_mode",
    {
      title: "Stop the active mode",
      description: "Stop any running video or game mode and turn the device off.",
      inputSchema: { target: z.string().optional() },
    },
    async ({ target }) => {
      modes.stop();
      await manager.stop(target ?? "all");
      return text(manager.snapshot());
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
