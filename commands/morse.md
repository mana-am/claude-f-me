---
description: Morse — feel a secret message buzzed in Morse code
argument-hint: [message]
---

Encode the user's message ($ARGUMENTS — or ask for one short phrase if empty) into Morse code and
play it on the body with the `compose` tool. This is the literal "I love you in Morse" idea.

Build the `keyframes` ([{at, level}], `at` in ms strictly increasing, `level` 0..1):
- **dot** = a short buzz (~120 ms at level ~0.6), **dash** = a long buzz (~360 ms at ~0.8).
- gap between symbols ~120 ms at 0, between letters ~360 ms at 0, between words ~840 ms at 0.
- Always return to `level: 0` between symbols so the rhythm is readable on the body.
- Put the decoded message in the `brief` field (e.g. `"morse: i love you"`) so it shows in the console.

Keep messages short and sweet. Don't reveal the dot/dash table unless asked — let them *feel* it.
Tell them to watch http://localhost:8731, and they can say **harder**, **softer** or **safeword**.
Match the user's language (中文 if they wrote Chinese).
