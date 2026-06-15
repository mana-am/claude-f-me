# Publishing & distribution

claude-f-me is one codebase distributed through several channels. The **machine-read manifests**
live at the repo root (so each tool can discover them); the **human how-to guides** live here.

| Channel | Manifest (repo root) | Guide | Status |
|---|---|---|---|
| **Claude Code plugin** | [`.claude-plugin/`](../../.claude-plugin) | [main README](../../README.md#-use-it-in-claude-code-codex-or-any-mcp-client) | ✅ ready |
| **Codex / Cursor / Gemini / Copilot / Windsurf** | [`AGENTS.md`](../../AGENTS.md) + [`examples/codex-config.toml`](../../examples/codex-config.toml) | [`AGENTS.md`](../../AGENTS.md) | ✅ ready |
| **MCP official registry** | [`server.json`](../../server.json) | [MCP-REGISTRY.md](./MCP-REGISTRY.md) | ⚠️ needs `npm publish` first |
| **Smithery** | [`smithery.yaml`](../../smithery.yaml) | [SMITHERY.md](./SMITHERY.md) | ⚠️ connect repo on smithery.ai |
| **skills.sh** | [`skills.sh.json`](../../skills.sh.json) | [GPT-STORE.md](./GPT-STORE.md) | ⚠️ verify schema |
| **GPT Store** | — | [GPT-STORE.md](./GPT-STORE.md) | ❌ likely blocked by policy |

> **Common prerequisite for the registries:** several channels (MCP registry, Smithery, skills.sh)
> resolve the package by name. Today the package is installed straight from GitHub
> (`npx -y github:mana-am/claude-f-me`) and is **not on npm**. Publish to npm first if you want the
> registry listings to install cleanly — see [MCP-REGISTRY.md](./MCP-REGISTRY.md#prerequisite-publish-to-npm).
