# Architecture

High-level design of Warframe Hub for contributors and reviewers.

## What it is

A **browser web application** that shows Warframe worldstate timers and reference data (items, maps, fish, etc.). Players use it to plan play sessions and look up game information. It does **not** automate the game client or hold Warframe account credentials.

## Major pieces

```text
┌─────────────┐     HTTPS      ┌──────────────────────┐
│  Browser UI │ ◄────────────► │ api.warframestat.us   │
│  (vinext /  │                │ cdn.warframestat.us   │
│   React)    │                └──────────────────────┘
└──────┬──────┘
       │ static assets
       ▼
┌──────────────────┐
│ Hosting          │  Production: Vercel static export
│                  │  Self-host: GHCR Node image (optional)
└──────────────────┘
```

| Layer | Role |
|-------|------|
| **`app/`** | Routes (App Router): home timers, codex, open-world maps/fish, synthesis, rivens |
| **`components/`** | UI panels, chrome, shared widgets (+ colocated Cypress component tests) |
| **`lib/`** | Providers (prefs, worldstate, cache), i18n, notifications, pure helpers |
| **`data/json/`** | Static datasets (geo, fish, trackables) shipped with the app |
| **CI / release** | GitHub Actions: lint, property tests, Cypress, CodeQL; semantic-release → GitHub Release + GHCR; Cosign sign/attest |

## Data flow

1. Client loads the SPA/static export.
2. Worldstate and item searches are fetched from **public** Warframe Stat.us HTTP APIs in the browser (or via documented CDN URLs).
3. User preferences (platform, locale, panel order, trackables) persist in **browser storage** (and related IndexedDB helpers), not on a hub-operated user database.
4. Optional Sentry DSN (`NEXT_PUBLIC_DSN` / runtime inject for Docker) reports client errors when configured.

## Trust and security boundaries

- **Trusted input:** first-party React code and static JSON in this repo.
- **Untrusted / external:** worldstate and CDN JSON from third parties — treat as data to render, not as executable trust.
- **Secrets:** no Warframe login; avoid putting private tokens in `NEXT_PUBLIC_*`. Vulnerability handling: [SECURITY.md](SECURITY.md).

## Related docs

- [Documentation index](README.md)
- [INTERFACE.md](INTERFACE.md) — external routes and config
- [RELEASES.md](RELEASES.md) — release notes and CVE-fix policy
- [README.md](../README.md) — quick start, user overview
- [LAYOUT.md](LAYOUT.md) — directory map
- [DEVELOPMENT.md](DEVELOPMENT.md) — local tooling
- [TESTING.md](TESTING.md) — test suites
- [CI.md](CI.md) — pipelines and deploy
- [CONTRIBUTING.md](../.github/CONTRIBUTING.md) — how to change the code
