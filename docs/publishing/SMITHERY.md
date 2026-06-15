# Publish to Smithery

[Smithery](https://smithery.ai) is an MCP server marketplace. The manifest is
[`smithery.yaml`](../../smithery.yaml) at the repo root.

## How it's set up

claude-f-me is a **stdio** server that Smithery launches with `npx` straight from GitHub — nothing
to clone, Node ≥ 18 required. `smithery.yaml` declares:

- `startCommand.type: stdio`
- a `configSchema` (mode, console port, max-intensity safety cap, Intiface URL) — all optional with
  safe defaults
- a `commandFunction` that maps that config to `CFM_*` env vars and runs
  `npx -y github:mana-am/claude-f-me`

## Steps

1. Sign in at <https://smithery.ai> with GitHub.
2. **Add Server / Connect repository** → pick `mana-am/claude-f-me`.
3. Smithery reads `smithery.yaml` from the default branch and builds the listing.
4. Use the in-page **playground** to confirm tools enumerate and the simulator responds.
5. Publish.

## Notes & gotchas

- Smithery scans tools by launching the server. Because the default `CFM_MODE` is `simulated`, it
  connects with **no hardware** — good for a clean scan.
- If you later publish to npm (see [MCP-REGISTRY.md](./MCP-REGISTRY.md)), you can switch the
  `commandFunction` from `github:mana-am/claude-f-me` to the bare `claude-f-me` package for faster
  cold starts.
- Keep the `configSchema` defaults conservative — Smithery surfaces them as the suggested config,
  and this drives a physical device.

Reference: <https://smithery.ai/docs/config#smitheryyaml>
