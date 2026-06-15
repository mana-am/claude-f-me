---
description: Start the fun — scan if needed, then build up the intensity
---

Using the claude-f-me MCP tools:

1. If `list_devices` shows no devices, call `scan_devices` first.
2. Start a building experience — call `start_game` with type `escalation` (gentle ramp that
   climbs and holds). If the user named a vibe ($ARGUMENTS), pick a fitting mode instead
   (e.g. "tease" → `start_game` type `edge`; "random" → a random `start_game`).

Reply in one short, playful line telling them what you started, and that they can say
**harder**, **softer**, **edge**, **surprise**, or **safeword** at any time.
Match the user's language (中文 if they wrote Chinese).
