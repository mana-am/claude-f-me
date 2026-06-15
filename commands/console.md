---
description: Open the opendick web console in your browser
allowed-tools: Bash
---

Call the `list_devices` tool from the opendick MCP server and read its `consoleUrl`.
Then run `open <consoleUrl>` to launch it in the default browser, and print the URL
to the user as a clickable markdown link. If `open` is unavailable, just print the link.
