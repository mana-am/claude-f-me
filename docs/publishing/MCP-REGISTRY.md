# Publish to the official MCP Registry

The [official MCP Registry](https://registry.modelcontextprotocol.io) is the canonical index of
MCP servers. The manifest is [`server.json`](../../server.json) at the repo root.

## Prerequisite: publish to npm

The registry resolves packages from a real package registry (npm / PyPI / NuGet / OCI). It does
**not** support `github:` installs. claude-f-me is currently run via `npx -y github:mana-am/claude-f-me`
and is **not yet on npm**, so you must publish it first:

1. Make sure the build output is current and committed:
   ```bash
   npm run build && npm run bundle
   ```
2. Add the registry ownership field to `package.json` (already added by this change):
   ```jsonc
   "mcpName": "io.github.mana-am/claude-f-me"
   ```
   The registry checks this field to confirm the npm package and the `server.json` name belong
   together.
3. Publish:
   ```bash
   npm publish --access public
   ```

Keep the three versions in lockstep: `package.json` → `server.json` (`version` **and**
`packages[0].version`) → the published npm tag.

## Publish the server.json

Install the publisher CLI and authenticate (GitHub login proves ownership of the
`io.github.mana-am/*` namespace):

```bash
# install the MCP publisher CLI (see registry docs for the latest install command)
mcp-publisher login github
mcp-publisher publish        # reads ./server.json
```

## Validate before publishing

```bash
# the schema is referenced in server.json ($schema); validate with any JSON-Schema tool, e.g.
npx -y @modelcontextprotocol/registry-validate server.json   # if available
```

## Notes

- `name` uses reverse-DNS of the GitHub org: **`io.github.mana-am/claude-f-me`**.
- Transport is **stdio**; all config is optional env vars with safe defaults (see `server.json`).
- Re-run `mcp-publisher publish` on every release after bumping the versions.

Reference: <https://github.com/modelcontextprotocol/registry>
