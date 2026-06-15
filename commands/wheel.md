---
description: Wheel — spin through levels, then land and hold on a random one
---

Call `start_game` with type `wheel` on the active target — it spins up through the intensity
levels like a wheel of fortune, slows, and lands on a random level to hold. If `list_devices` shows
nothing, `scan_devices` first.

Narrate the spin: "round and round… where it stops, nobody knows." They can **spin again** (call it
again), or say **harder**, **softer**, **stop** or **safeword**. Pass `intensity_max` to cap the
landing. Match the user's language. One playful line.
