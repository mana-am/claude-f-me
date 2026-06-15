// Records a short GIF of the live "Pulse Core" console reacting to the device.
// Uses system Chrome via puppeteer-core (no bundled Chromium) + ffmpeg.
//
//   1. start the console:  CFM_MODE=simulated CFM_CONSOLE_PORT=8731 node dist/index.js &
//   2. node scripts/record-demo.mjs
//
// Output: docs/pulse-core.gif  (plus transient frames in /tmp).
import { launch } from "puppeteer-core";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const URL = process.env.CFM_DEMO_URL || "http://localhost:8731";
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = process.env.CFM_DEMO_OUT || "docs/pulse-core.gif";
const FRAMES = Number(process.env.CFM_DEMO_FRAMES || 56);
const FPS = Number(process.env.CFM_DEMO_FPS || 12);
const OUTW = Number(process.env.CFM_DEMO_WIDTH || 600);
const COLORS = Number(process.env.CFM_DEMO_COLORS || 64);
const W = 900, H = 720;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (body) =>
  fetch(`${URL}/event`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => {});

const dir = await mkdtemp(join(tmpdir(), "cfm-demo-"));
const browser = await launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb"],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 2 },
});

try {
  const page = await browser.newPage();
  await page.goto(`${URL}?lang=en`, { waitUntil: "networkidle2", timeout: 20000 });
  await sleep(900);

  // Drive a lively-but-on-brand sequence through the server; the orb + aurora
  // react over the WebSocket exactly as a user would see.
  await ev("action=scan");
  await sleep(700);

  // a scripted timeline that runs alongside frame capture (fire-and-forget)
  (async () => {
    await ev("action=pattern&name=escalate&loops=2");
    await sleep(1700);
    await ev("action=pattern&name=heartbeat&loops=6");
    await sleep(2200);
    await ev("action=game&type=wheel");
    await sleep(1600);
    await ev("action=pattern&name=earthquake&loops=2");
  })();

  const pad = (n) => String(n).padStart(4, "0");
  for (let i = 0; i < FRAMES; i++) {
    await page.screenshot({ path: join(dir, `f${pad(i)}.png`) });
    await sleep(40);
  }
  await ev("action=stop");

  // frames -> high-quality looping gif via a generated palette
  const palette = join(dir, "pal.png");
  execFileSync("ffmpeg", [
    "-y", "-framerate", String(FPS), "-i", join(dir, "f%04d.png"),
    "-vf", `scale=${OUTW}:-1:flags=lanczos,palettegen=max_colors=${COLORS}:stats_mode=diff`, palette,
  ], { stdio: "ignore" });
  execFileSync("ffmpeg", [
    "-y", "-framerate", String(FPS), "-i", join(dir, "f%04d.png"), "-i", palette,
    "-lavfi", `scale=${OUTW}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop", "0", OUT,
  ], { stdio: "ignore" });

  console.error(`wrote ${OUT}`);
} finally {
  await browser.close();
  await rm(dir, { recursive: true, force: true });
}
