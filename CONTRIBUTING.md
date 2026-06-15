# Contributing to claude-f-me

Thanks for wanting to help — PRs, bug reports and ideas are all welcome. This is adult,
consent-first software, so a few things matter more here than in a typical project. Please read
the short list below before opening a PR.

## Ground rules

- **18+.** Contributors and users must be of legal age. Keep examples and copy SFW-ish in tone —
  playful is fine, explicit content in the repo is not.
- **Safety is not optional.** Any change that touches device control must preserve every guard:
  the global max-intensity cap, per-command auto-stop, the 5-minute hard ceiling, the continuous-
  driver watchdog, `emergency_stop` / safeword, and hardware-off on exit. If your change could let
  the motor run unbounded, it won't be merged.
- **Privacy first.** Don't add telemetry, analytics, or anything that transmits usage data. Memory
  stays local; API keys stay in the environment and never touch disk.
- **Respect model/agent rate limits.** Anything calling Claude/Codex/OpenAI must stay on-demand —
  no polling or loops — and honour backoff (`Retry-After`) on `429`. claude-f-me must never be the
  reason someone hits a usage limit.

## Dev setup

```bash
git clone https://github.com/mana-am/claude-f-me
cd claude-f-me
npm install
npm run dev        # MCP + console in watch mode (tsx) — no hardware needed
```

Everything runs against the built-in **simulator** by default (`CFM_MODE=simulated`), so you can
build and test with zero hardware.

## Before you open a PR

```bash
npm run build      # must pass: type-check + emit dist/ (tsc, no errors)
npm run bundle     # must pass: produces the self-contained dist/claude-f-me.mjs
```

- **The MCP stdout must stay clean.** The server speaks JSON-RPC over stdout — all logging goes to
  stderr. Never `console.log` to stdout from server code. Quick check: `node dist/claude-f-me.mjs`
  should print nothing to stdout on startup.
- **Commit the bundle** (`dist/claude-f-me.mjs`) when you change `src/` — the plugin ships it.
- **Keep the README in sync.** New tools/env vars/modes go in the relevant tables. The English
  `README.md` is canonical; localized copies live in `docs/i18n/`. You don't have to translate all
  six languages yourself — note in the PR which ones you touched and we'll help with the rest.

## Adding a feature

- **A new MCP tool** → register it in `src/mcp.ts` and add a row to the “MCP tools” table.
- **A new pattern** → add it to `src/presets.ts` and the pattern list.
- **A new persona** → add it to `src/personas.ts`.
- **A new env var** → document it in the “Configuration” table.

If you're adding anything user-facing, prefer a short demo line in the “try this in chat” block too.

## Reporting bugs

Open an issue with: what you did, what you expected, what happened, your Node version and OS, and
whether you were in `simulated` or `buttplug` mode. For a security or privacy issue, see
[SECURITY.md](./SECURITY.md) instead of filing a public issue.

## License

By contributing you agree your contributions are licensed under the [MIT License](./LICENSE).
