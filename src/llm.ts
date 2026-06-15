import { normalizeKeyframes, scoreDuration, type Score, type ScoreKeyframe } from "./score.js";
import { logErr } from "./util.js";

/**
 * Optional bridge that lets an *external* SOTA model compose a Muse score from a
 * natural-language brief — so the web console (which can't talk to the Claude
 * that hosts the MCP server) can still say "describe a vibe" and have a model
 * write the haptic timeline. This is what makes "结合 opus / gpt5.5" literal:
 * pick a persona backed by a model id, and that model writes what you feel.
 *
 * Provider is chosen from the model id + whatever API keys are in the env:
 *   - Anthropic (claude-*)  : ANTHROPIC_API_KEY or CFM_LLM_API_KEY
 *   - OpenAI-compatible     : OPENAI_API_KEY (+ optional CFM_OPENAI_BASE_URL)
 *
 * With no key configured, isLlmConfigured() is false and the console degrades to
 * "ask Claude in chat to compose". Zero new dependencies — uses global fetch.
 */

const ANTHROPIC_KEY = () => process.env.CFM_LLM_API_KEY || process.env.ANTHROPIC_API_KEY || "";
const OPENAI_KEY = () => process.env.OPENAI_API_KEY || "";
const OPENAI_BASE = () => process.env.CFM_OPENAI_BASE_URL || "https://api.openai.com/v1";

const DEFAULT_ANTHROPIC_MODEL = "claude-opus-4-8";
const DEFAULT_OPENAI_MODEL = "gpt-5.5";

export function isLlmConfigured(): boolean {
  return !!(ANTHROPIC_KEY() || OPENAI_KEY());
}

type Provider = "anthropic" | "openai";

/** Decide which provider serves a given (optional) model id. */
function pickProvider(model?: string): { provider: Provider; model: string } | null {
  const m = (model || "").trim().toLowerCase();
  if (m.startsWith("claude") || m.startsWith("anthropic")) {
    if (ANTHROPIC_KEY()) return { provider: "anthropic", model: model! };
  }
  if (m.startsWith("gpt") || m.startsWith("o1") || m.startsWith("o3") || m.startsWith("openai")) {
    if (OPENAI_KEY()) return { provider: "openai", model: model! };
  }
  // no usable explicit model → fall back to whatever key exists
  if (ANTHROPIC_KEY()) return { provider: "anthropic", model: DEFAULT_ANTHROPIC_MODEL };
  if (OPENAI_KEY()) return { provider: "openai", model: DEFAULT_OPENAI_MODEL };
  return null;
}

const SYSTEM = [
  "You are a haptic composer for a single-motor vibration device.",
  "Turn the user's brief into a smooth timeline of keyframes.",
  "Rules: respond with ONLY JSON, shape {\"keyframes\":[{\"at\":<ms>,\"level\":<0..1>}, ...]}.",
  "`at` is milliseconds from the start, strictly increasing, starting at 0.",
  "`level` is intensity 0..1. Use ramps (many keyframes) for builds, plateaus to hold,",
  "drops to 0 for denial/rest, and a release near the end. 8–40 keyframes is plenty.",
  "Honour any duration in the brief; otherwise aim for 60–180s. No prose, no markdown.",
].join(" ");

/** Compose a Score from a brief using an external model. Throws if unconfigured. */
export async function composeWithModel(brief: string, model?: string): Promise<Score> {
  const pick = pickProvider(model);
  if (!pick) throw new Error("no LLM API key configured (set ANTHROPIC_API_KEY or OPENAI_API_KEY)");
  const prompt = "Brief: " + brief.trim();
  const raw =
    pick.provider === "anthropic"
      ? await callAnthropic(pick.model, prompt)
      : await callOpenAI(pick.model, prompt);
  const keyframes = parseKeyframes(raw);
  const score: Score = { brief: brief.trim(), by: pick.model, keyframes };
  logErr(`[muse] ${pick.provider}/${pick.model} composed ${keyframes.length} kf / ${(scoreDuration(keyframes) / 1000).toFixed(0)}s`);
  return score;
}

function parseKeyframes(raw: string): ScoreKeyframe[] {
  let txt = raw.trim();
  // tolerate ```json fences or stray prose around the object
  const start = txt.indexOf("{");
  const end = txt.lastIndexOf("}");
  if (start >= 0 && end > start) txt = txt.slice(start, end + 1);
  const obj = JSON.parse(txt);
  return normalizeKeyframes(obj.keyframes ?? obj.actions ?? obj);
}

async function callAnthropic(model: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY(),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text().catch(() => "")}`);
  const data: any = await res.json();
  const block = (data.content || []).find((b: any) => b.type === "text");
  return block?.text ?? "";
}

async function callOpenAI(model: string, prompt: string): Promise<string> {
  const res = await fetch(OPENAI_BASE() + "/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + OPENAI_KEY() },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text().catch(() => "")}`);
  const data: any = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
