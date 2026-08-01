# Warframe Hub

[![Vercel](https://vercelbadge.vercel.app/api/wfcd/warframe-hub)](https://vercel.com/wfcd/warframe-hub)
[![Actions](https://github.com/WFCD/warframe-hub/actions/workflows/ci.yaml/badge.svg)](https://github.com/WFCD/warframe-hub/actions/workflows/ci.yaml)
[![Release](https://github.com/WFCD/warframe-hub/actions/workflows/release.yml/badge.svg)](https://github.com/WFCD/warframe-hub/actions/workflows/release.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/WFCD/warframe-hub/badge)](https://scorecard.dev/viewer/?uri=github.com/WFCD/warframe-hub)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/13925/badge)](https://www.bestpractices.dev/projects/13925)
[![Supported by the Warframe Community Developers](https://img.shields.io/badge/Warframe_Comm_Devs-supported-blue.svg?color=2E96EF&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOTgiIGhlaWdodD0iMTczIiB2aWV3Qm94PSIwIDAgMjk4IDE3MyI%2BPHBhdGggZD0iTTE4NSA2N2MxNSA4IDI4IDE2IDMxIDE5czIzIDE4LTcgNjBjMCAwIDM1LTMxIDI2LTc5LTE0LTctNjItMzYtNzAtNDUtNC01LTEwLTEyLTE1LTIyLTUgMTAtOSAxNC0xNSAyMi0xMyAxMy01OCAzOC03MiA0NS05IDQ4IDI2IDc5IDI2IDc5LTMwLTQyLTEwLTU3LTctNjBsMzEtMTkgMzYtMjIgMzYgMjJ6TTU1IDE3M2wtMTctM2MtOC0xOS0yMC00NC0yNC01MC01LTctNy0xMS0xNC0xNWwxOC0yYzE2LTMgMjItNyAzMi0xMyAxIDYgMCA5IDIgMTQtNiA0LTIxIDEwLTI0IDE2IDMgMTQgNSAyNyAyNyA1M3ptMTYtMTFsLTktMi0xNC0yOWEzMCAzMCAwIDAgMC04LThoN2wxMy00IDQgN2MtMyAyLTcgMy04IDZhODYgODYgMCAwIDAgMTUgMzB6bTE3MiAxMWwxNy0zYzgtMTkgMjAtNDQgMjQtNTAgNS03IDctMTEgMTQtMTVsLTE4LTJjLTE2LTMtMjItNy0zMi0xMy0xIDYgMCA5LTIgMTQgNiA0IDIxIDEwIDI0IDE2LTMgMTQtNSAyNy0yNyA1M3ptLTE2LTExbDktMi0xNC0yOWEzMCAzMCAwIDAgMSA4LThoLTdsLTEzLTQtNCA3YzMgMiA3IDMgOCA2YTg2IDg2IDAgMCAxLTE1IDMwem0tNzktNDBsLTYtNmMtMSAzLTMgNi02IDdsNSA1YTUgNSAwIDAgMSAyIDB6bS0xMy0yYTQgNCAwIDAgMSAxLTJsMi0yYTQgNCAwIDAgMSAyLTFsNC0xNy0xNy0xMC04IDcgMTMgOC0yIDctNyAyLTgtMTItOCA4IDEwIDE3em0xMiAxMWE1IDUgMCAwIDAtNC0yIDQgNCAwIDAgMC0zIDFsLTMwIDI3YTUgNSAwIDAgMCAwIDdsNCA0YTYgNiAwIDAgMCA0IDIgNSA1IDAgMCAwIDMtMWwyNy0zMWMyLTIgMS01LTEtN3ptMzkgMjZsLTMwLTI4LTYgNmE1IDUgMCAwIDEgMCAzbDI2IDI5YTEgMSAwIDAgMCAxIDBsNS0yIDItMmMxLTIgMy01IDItNnptNS00NWEyIDIgMCAwIDAtNCAwbC0xIDEtMi00YzEtMy01LTktNS05LTEzLTE0LTIzLTE0LTI3LTEzLTIgMS0yIDEgMCAyIDE0IDIgMTUgMTAgMTMgMTNhNCA0IDAgMCAwLTEgMyAzIDMgMCAwIDAgMSAxbC0yMSAyMmE3IDcgMCAwIDEgNCAyIDggOCAwIDAgMSAyIDNsMjAtMjFhNyA3IDAgMCAwIDEgMSA0IDQgMCAwIDAgNCAwYzEtMSA2IDMgNyA0aC0xYTMgMyAwIDAgMCAwIDQgMiAyIDAgMCAwIDQgMGw2LTZhMyAzIDAgMCAwIDAtM3oiIGZpbGw9IiMyZTk2ZWYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg%3D%3D)](https://github.com/WFCD/banner/blob/master/PROJECTS.md)
[![Discord](https://img.shields.io/discord/256087517353213954.svg?logo=discord)](https://discord.gg/jGZxH9f)

Warframe Hub is a community web app for [Warframe](https://www.warframe.com/) players. It helps Tenno spend their time well in-game by:

- Providing timely worldstate information so you can plan when and where to play
- Giving in-depth item, drop, and searchable game data when you need to dig deeper

**Live site:** [https://hub.warframestat.us](https://hub.warframestat.us) (also deployed via [Vercel](https://vercel.com/wfcd/warframe-hub))

Project docs and community norms:

- [Documentation index](docs/README.md)
- [Contributing](.github/CONTRIBUTING.md) — pull requests, coding standards, tests
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](docs/SECURITY.md) — how to report vulnerabilities
- [Architecture](docs/ARCHITECTURE.md) — high-level design
- [External interface](docs/INTERFACE.md) — routes, config, client storage
- [Roadmap](docs/ROADMAP.md) — near-term direction
- [Repo layout](docs/LAYOUT.md) — where code lives

## Quick start

```bash
git clone https://github.com/WFCD/warframe-hub.git
cd warframe-hub
npm install
npm run dev          # http://localhost:8742
```

Production build locally:

```bash
npm run build
npm start            # http://localhost:8742
```

Requires [Node.js 24 LTS (Krypton)](https://nodejs.org/en/) (see `.nvmrc`). Copy [`.example.env`](.example.env) if you need `NEXT_PUBLIC_*` values.

## Obtain, feedback, and contribute

| Goal | How |
|------|-----|
| **Use** the hub | Open [https://hub.warframestat.us](https://hub.warframestat.us), or run/self-host from this repo (below) |
| **Report bugs / ask for features** | [GitHub Issues](https://github.com/WFCD/warframe-hub/issues) (templates for bugs, features, questions). English preferred. |
| **Discuss** | [GitHub Issues / Pull Requests](https://github.com/WFCD/warframe-hub) (searchable, URL-addressable) or [WFCD Discord](https://discord.gg/jGZxH9f) |
| **Contribute code** | Fork → branch → **pull request** into `dev`. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) |

Security issues: email **[security@warframestat.us](mailto:security@warframestat.us)** — do **not** file a public issue. Details in [docs/SECURITY.md](docs/SECURITY.md).

## Using the hub

After opening the live site or a local instance:

1. **Timers / worldstate (home)** — alerts, fissures, invasions, sorties, cycles, and other time-sensitive events so you can plan sessions.
2. **Codex** (`/codex`) — searchable item data (`q`, `types`, `categories`, `page` query params; see [docs/INTERFACE.md](docs/INTERFACE.md)).
3. **Open-world helpers** — maps and fish tools under `/poe`, `/vallis`, and `/deimos`.
4. **Other tools** — synthesis (`/synthesis`), riven data (`/riven/data`), and related pages from the nav.

Preferences (platform, locale, panel layout, trackables) stay in the browser. The hub reads public Warframe worldstate/item APIs; it does not log into your Warframe account. Full route/config reference: [docs/INTERFACE.md](docs/INTERFACE.md).

### Security expectations (users)

- Treat the site as **read-only game information**. Do not enter Warframe passwords or account credentials here — the hub never asks for them.
- Self-hosting: only set secrets you intend (e.g. Sentry DSN); do not expose admin tokens in client-visible `NEXT_PUBLIC_*` env vars.
- Report suspected vulnerabilities privately per [docs/SECURITY.md](docs/SECURITY.md).

## Prerequisites

- [Node.js 24 LTS (Krypton)](https://nodejs.org/en/) (see `.nvmrc`)
- npm (ships with Node.js)

## Dependencies

Most software dependencies are managed by npm and install with the project.

Warframe Hub needs network access to parse Warframe worldstate. It uses the WorldState API from [Warframe Stat.us](https://docs.warframestat.us/) ([API](https://api.warframestat.us)).

## Installation

```bash
npm i
npm run build
npm start
```

The site is available at http://localhost:8742

## Self-hosting (Docker)

Official site stays on **Vercel**. Images publish to **GHCR** on each semantic-release (`ghcr.io/wfcd/warframe-hub`). Semver lives on **git tags / GitHub Releases / GHCR tags** — root `package.json` stays `0.0.0-dev`.

For self-host (e.g. behind [SWAG](https://github.com/linuxserver/docker-swag)):

```bash
docker pull ghcr.io/wfcd/warframe-hub:latest
docker run --rm -p 8742:8742 -e NEXT_PUBLIC_DSN=https://public_key@o0.ingest.sentry.io/0 ghcr.io/wfcd/warframe-hub:latest
# → http://localhost:8742
```

Verify keyless Cosign signature (after a signed release):

```bash
cosign verify \
  --certificate-identity-regexp 'https://github.com/WFCD/warframe-hub/.github/workflows/release.yml@refs/heads/dev' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/wfcd/warframe-hub:latest
```

Verify SPDX SBOM attestation:

```bash
cosign verify-attestation \
  --type spdxjson \
  --certificate-identity-regexp 'https://github.com/WFCD/warframe-hub/.github/workflows/release.yml@refs/heads/dev' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/wfcd/warframe-hub:latest
```

Or copy the sample compose and adapt (join your SWAG network; proxy to `http://hub:8742`):

```bash
cp docker-compose.sample.yml docker-compose.yml
docker compose up -d
```

Local image build (optional):

```bash
docker build -t warframe-hub .
```

`NEXT_PUBLIC_DSN` is injected at **container start** via `docker/entrypoint.sh` (writes `dist/client/runtime-env.js`). Browsers load it as `/runtime-env.js` (not baked into the image). Clients still call `api.warframestat.us` / `cdn.warframestat.us` directly — the hub process does not proxy those.

## Development

See **[docs/LAYOUT.md](docs/LAYOUT.md)** for what lives where, **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** for local tooling, and **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for design overview.

Stack: **vinext + React + TypeScript** at the repo root (port **8742**).

```bash
npm install
npm run dev          # vinext @ http://localhost:8742
npm run build        # production static export
```

Env: [`.example.env`](.example.env) (`NEXT_PUBLIC_*`).

## Releases and changelog

Human-readable release notes are published on **[GitHub Releases](https://github.com/WFCD/warframe-hub/releases)** (generated by semantic-release from Conventional Commits — not raw `git log`). Upgrade by pulling a newer GHCR tag or deploying the tagged commit.

When a release fixes a **publicly known** run-time vulnerability in **this project** that already had a CVE (or similar) at release time, that ID is listed in the release notes per [docs/RELEASES.md](docs/RELEASES.md). (If none have applied yet, that Best Practices item is N/A.)

## Testing

CI runs on GitHub Actions (lint, property tests, Cypress e2e/component). Vercel preview deploys run from the Git integration.

Latest CI: [Actions → CI](https://github.com/WFCD/warframe-hub/actions/workflows/ci.yaml) (or the badge above).

### Local tooling

#### Linting

```bash
npm run lint
npm run lint:fix
```

#### Tests

```bash
npm run test:property   # fast-check / node:test (no browser)
npm test                # property + Cypress e2e + component (dev/server as required)
```

Cypress needs a running app (`npm run dev` or `npm start`) for e2e. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) and [docs/TESTING.md](docs/TESTING.md).

## License

Distributed under the [Apache License 2.0](LICENSE). Plain-English summary: [tldrlegal Apache-2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)).

## Small note

Like most projects, Warframe Hub is purely out of passion, love, and dedication to the Warframe Community and open source software in general. This is not our full-time job, and probably will never be. No donations will be encouraged because once a person starts to receive payments for a passion project, is it still a passion?
