# Product

## Register

product

## Users
People controlling intimate Buttplug/Intiface hardware (or the built-in simulator) through a real-time web console, usually solo and often on a phone, sometimes via a separate `/master` remote where a second person is in control. They are mid-session: hands may be busy, attention is partial, and the interface must stay legible and reactive in a dim room.

## Product Purpose
A self-contained, reactive control console for the `claude-f-me` plugin. It turns device state into a live, glanceable visualization (orb reactor, aurora field, waveform) and exposes patterns, games, personas, scenes, biofeedback, audio/video sync, and long-distance duet — all over a single WebSocket. Success is control that feels immediate, safe (visible E-STOP and safety-max at all times), and pleasurable to look at without getting in the way.

## Brand Personality
Sensual, playful, alive. Neon-noir intimacy: deep near-black ground, hot-pink-to-violet light, breathing motion. Confident and a little theatrical, never clinical or corporate. Three words: intimate, reactive, electric.

## Anti-references
Clinical medical-device UI. Generic SaaS dashboards (cards-in-a-grid, navy-and-gradient hero metrics). Anything that reads as a settings page rather than a living instrument.

## Design Principles
- **The instrument is alive.** Visualization is the product, not decoration — but it must never out-shout the controls layered on top of it.
- **Safety is always one tap away.** E-STOP and safety-max stay visible and unmistakable in every state.
- **Glanceable under partial attention.** Legible in a dim room, on a phone, with hands busy. Contrast and target sizes are non-negotiable.
- **Reactive, not chatty.** Motion conveys live state (level, partner presence, audio); it is never gratuitous choreography.
- **One coherent vocabulary.** `.btn` for chrome, `.chip` for actions, one accent ramp — consistent across every tab and modal.

## Accessibility & Inclusion
Dark theme is intrinsic to the use context (dim rooms, intimate setting). Body text and controls must hit WCAG AA (≥4.5:1; ≥3:1 for large/bold). Every interactive element needs a visible keyboard focus state. All motion must have a `prefers-reduced-motion` fallback. Operable by keyboard (0–9 level, space stop, S scan already exist).
