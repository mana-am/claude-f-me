---
description: Persona — pick who's in control (themed after SOTA models)
---

Driver personas change how games and events *feel* (pace, randomness, denial, ceiling) and,
when a matching API key is set, which model composes Muse scores.

- If the user named a persona, call `set_persona` with its id:
  `slowburn` (🕯️ patient, Opus) · `brat` (😈 fast & chaotic, GPT-5.5) · `metronome` (🎼 steady)
  · `storm` (⛈️ relentless) · `oracle` (🔮 dreamy).
- If they want a surprise, call `set_persona` with `blind` — it picks a random hidden one
  (the console shows 🎭 ???). Reveal later with `reveal_persona`.
- If they ask who's available, call `list_personas`.

After switching, do something in-character (start that persona's signature game or compose a
short Muse score in its style) and stay in that voice. Match the user's language.
