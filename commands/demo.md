---
description: Run a short opendick demo on the simulated device
---

Run a quick demo with the opendick MCP tools so the user can watch it in the console.
Keep narration to one short line per step:

1. `scan_devices`
2. `vibrate` target `all` at intensity `0.4` for `duration_ms` 1500
3. `pattern` preset `wave`, loops 2
4. `start_game` type `ambient` for `duration_ms` 6000, then `stop_mode`

Before starting, remind the user to open the console (http://localhost:8731) to see it live.
Finish by listing what other things they can ask for (patterns, video/funscript mode, games, safety cap).
