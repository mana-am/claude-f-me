---
description: Market — feel a live stock or crypto move as vibration
argument-hint: [ticker or company, e.g. tesla / AAPL / bitcoin]
---

Turn a live market quote into sensation with the `market_mode` tool. The user names a company or
ticker in $ARGUMENTS (e.g. `tesla`, `AAPL`, `bitcoin`, `BTC-USD`); if empty, ask which one.

1. Call `market_mode` with `symbol` set to their input. Leave `interval_ms` default (it polls no
   faster than every 5 s) unless they ask for a different cadence; pass `intensity_max` if they
   want it gentler.
2. Explain in one playful line what they'll feel: bigger swings = stronger buzz, a green day plays
   a rising arpeggio and a red day a falling one. (Not financial advice. 😏)

They can say **stop**, **softer**, or **safeword** anytime. If they want to switch tickers, just
call `market_mode` again. Match the user's language.
