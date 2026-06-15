// Builds the static GitHub Pages demo: the real console HTML (from the compiled
// CONSOLE_HTML) with an in-browser mock backend injected, so it runs with zero
// server and zero hardware. Output: site/index.html
//
//   npm run build      # tsc -> dist/consoleHtml.js (required first)
//   npm run build:demo
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { CONSOLE_HTML } from "../dist/consoleHtml.js";

const mock = await readFile(new URL("./demo-mock.js", import.meta.url), "utf8");

// The console calls `new WebSocket(...)` from its <body> script; inject the shim
// into <head> so window.WebSocket is replaced before that runs.
const inject = `<script>\n${mock}\n</script>\n`;
if (!CONSOLE_HTML.includes("</head>")) throw new Error("could not find </head> to inject the demo mock");
let html = CONSOLE_HTML.replace("</head>", inject + "</head>");

// nudge the document title so the tab reads as a demo
html = html.replace(/<title>[^<]*<\/title>/i, "<title>claude·f·me — live demo</title>");

await mkdir("site", { recursive: true });
await writeFile("site/index.html", html);
await writeFile("site/.nojekyll", ""); // serve files verbatim, no Jekyll
console.error(`wrote site/index.html (${(html.length / 1024).toFixed(0)} KB)`);
