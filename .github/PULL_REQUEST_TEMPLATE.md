<!-- Thanks for contributing! Please read CONTRIBUTING.md first. -->

## What & why

<!-- What does this change, and why? -->

## Checklist

- [ ] `npm run build` passes (tsc, no errors)
- [ ] `npm run bundle` passes, and I committed `dist/claude-f-me.mjs` if I touched `src/`
- [ ] MCP **stdout stays clean** (no `console.log` to stdout from server code)
- [ ] Safety guards preserved (max cap · auto-stop · 5-min ceiling · watchdog · emergency_stop/safeword · hardware-off on exit)
- [ ] No telemetry added; memory stays local; API keys never written to disk
- [ ] Anything calling a model stays on-demand and honours `429` backoff
- [ ] README updated (new tools/env/modes added to the tables) — note which `docs/i18n/` locales I touched

## Notes for reviewers

<!-- Anything that needs extra eyes? Tested in simulated or on real hardware? -->
