# Use claude-f-me with any MCP client

claude-f-me is a standard **MCP server**, so it works with any MCP-capable agent — not just
Claude Code. The easiest path everywhere is `npx` (needs Node ≥ 18; nothing to clone):

```
npx -y github:mana-am/claude-f-me
```

| Client | How |
|---|---|
| **Claude Code** | `/plugin marketplace add mana-am/claude-f-me` then `/plugin install claude-f-me@claude-f-me` (one-click, includes slash commands) |
| **Codex CLI** | copy [`codex-config.toml`](./codex-config.toml) into `~/.codex/config.toml` |
| **Claude Desktop** | merge [`mcp.json`](./mcp.json) into `claude_desktop_config.json` → `mcpServers` |
| **Cursor** | merge [`mcp.json`](./mcp.json) into `.cursor/mcp.json` (or Settings → MCP) |
| **Cline / Roo** | merge [`mcp.json`](./mcp.json) into the Cline MCP settings |
| **Windsurf** | merge [`mcp.json`](./mcp.json) into `~/.codeium/windsurf/mcp_config.json` |
| **Anything else** | run `npx -y github:mana-am/claude-f-me` over stdio, or `node /path/to/dist/claude-f-me.mjs` |

Once connected, just chat: `scan for devices` · `vibrate at 40% for 3s` · `start an edge game` ·
`compose a 5-minute slow build`. The live console opens at **http://localhost:8731**.

**Env vars** (all optional): `CFM_MODE` (`simulated` default · `buttplug` for real hardware),
`CFM_CONSOLE_PORT` (default `8731`), `CFM_MAX_INTENSITY`, `CFM_INTIFACE_URL`. Full list in the
[main README](../README.md#configuration).

> No hardware? The built-in **simulator** runs everything. For real toys, install
> [Intiface Central](https://intiface.com) and set `CFM_MODE=buttplug`.
