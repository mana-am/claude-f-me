# Security & privacy policy

claude-f-me controls intimate hardware on a real body and is built privacy-first. Security and
safety reports are taken seriously.

## Reporting a vulnerability

**Please do not open a public issue for security or privacy problems.** Instead, report privately:

- Use GitHub's **[Report a vulnerability](https://github.com/mana-am/claude-f-me/security/advisories/new)**
  (Security → Advisories) on this repository, or
- Contact the maintainer ([@SimonAKing](https://github.com/SimonAKing)) directly.

Please include: a description, steps to reproduce, affected version/commit, and the potential
impact. We'll acknowledge as soon as we can and keep you updated on a fix.

## What's in scope

Things we especially want to hear about:

- **A way to bypass a safety guard** — exceeding the global max-intensity cap, defeating the
  per-command auto-stop or the 5-minute hard ceiling, disabling the continuous-driver watchdog, or
  making `emergency_stop` / safeword fail to stop the motor.
- **Privacy leaks** — anything that transmits memory, API keys, or usage data off the machine; keys
  ending up on disk; or unexpected outbound network traffic.
- **Unauthorized control** — driving a device past an allow-list (Telegram/Discord/WeChat), missing
  secret checks on `/dev` or `/event`, relay/Duet or master-remote access without consent, or
  injection through the WeChat signature handshake.
- **MCP issues** — anything that breaks JSON-RPC integrity or lets a tool call escape its bounds.

## Hardening notes for users

- Keep the repo **private** unless you intend it public; only share `/master` and relay links with
  people the wearer trusts.
- Always set the allow-lists (`CFM_*_ALLOW`) for any chat bridge, and a secret (`CFM_DEV_SECRET` /
  `CFM_EVENT_SECRET`) before exposing `/dev` or `/event` beyond localhost.
- Prefer a tunnel with HTTPS over exposing the port directly, and take it down when you're done.
- The safety cap and the wearer's own STOP always win — keep an emergency stop within reach.

## Supported versions

This is a young project; security fixes land on `main`. Please test against the latest commit
before reporting.
