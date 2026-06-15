# GPT Store & skills.sh

## ⚠️ GPT Store — likely blocked by policy

OpenAI's [GPT Store usage policies](https://openai.com/policies/usage-policies) prohibit content
"meant to arouse sexual excitement" and sexually explicit/suggestive material. claude-f-me controls
intimate hardware, so a public GPT built on it will **very likely be rejected or removed**, even
though the simulator itself is safe-for-work.

There is therefore **no GPT Store manifest in this repo**. If you still want to experiment:

- A GPT cannot run a local stdio process or open `localhost:8731`. You would need to expose
  claude-f-me over a **remote MCP transport (HTTP/SSE)** on a public URL and register it as a GPT
  **Action / connector** — a substantial extra build, not just a manifest.
- Keep it **private / unlisted** and only for hardware you own and consent to.
- Read the policy first; don't publish something that will get the account flagged.

Recommendation: treat Claude Code, Codex, Smithery and the MCP registry as the real distribution
channels, and skip the public GPT Store.

## skills.sh

[skills.sh](https://skills.sh) installs Claude Code skills/plugins. The manifest is
[`skills.sh.json`](../../skills.sh.json) at the repo root, describing the plugin, its MCP server and
the `/claude-f-me:*` slash commands.

```bash
npx skills add mana-am/claude-f-me
```

> The skills.sh manifest schema evolves — before publishing, check the current field names against
> <https://skills.sh> and adjust `skills.sh.json` if needed. The Claude Code install path
> (`/plugin marketplace add mana-am/claude-f-me`) works regardless and remains the primary route.
