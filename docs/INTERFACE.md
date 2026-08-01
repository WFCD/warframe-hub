# External interface

Reference for inputs and outputs of Warframe Hub as shipped software (OpenSSF **documentation_interface**). This is a **browser web application**, not a library or first-party REST API.

Base URL (production): `https://hub.warframestat.us`  
Local default: `http://localhost:8742`

## User-facing HTTP routes (URL interface)

| Path | Purpose | Notable URL / UI inputs | Output |
|------|---------|-------------------------|--------|
| `/` | Worldstate timers / planning home | Browser prefs (platform, locale, panel order, trackables) | Rendered timer panels and cycle chrome |
| `/codex` | Searchable item / game data | Query: `q`, `types`, `categories`, `page` (see below) | Filtered/paginated item UI |
| `/poe/map` | Plains of Eidolon map | Map toggles from prefs/maps state | Interactive map UI |
| `/poe/fish` | PoE fish table | Table sort/filter in UI | Fish reference table |
| `/vallis/map` | Orb Vallis map | Map toggles | Interactive map UI |
| `/vallis/fish` | Vallis fish table | Table sort/filter | Fish reference table |
| `/deimos/map` | Deimos / Cambion map | Map toggles | Interactive map UI |
| `/deimos/fish` | Deimos fish table | Table sort/filter | Fish reference table |
| `/ow/fish/howto` | Open-world fishing howto | — | Static howto content |
| `/synthesis` | Synthesis targets | — | Synthesis reference UI |
| `/riven/data` | Riven data browser | In-page filter text | Riven/weapon reference UI |

Unmatched paths render the app’s not-found experience.

### Codex query string (`/codex`)

| Param | Meaning | Example |
|-------|---------|---------|
| `q` | Text filter | `?q=prime` |
| `types` | Comma-separated type filters | `?types=Warframe,Weapon` |
| `categories` | Comma-separated category filters | `?categories=Primary` |
| `page` | 1-based page index (omitted if `1`) | `?page=2` |

Codex query state may also be mirrored in `localStorage` under `hub.v1.codex.query` for persistence between visits.

## Configuration inputs

| Name | Where set | Effect |
|------|-----------|--------|
| `NEXT_PUBLIC_DSN` | Vercel/project env, or Docker/runtime via `docker/entrypoint.sh` → `/runtime-env.js` | Optional Sentry DSN for client error reporting |
| `NEXT_PUBLIC_PERSIST` | Build/env (see `.example.env`) | Whether prefs/cache persistence is enabled |
| `NEXT_PUBLIC_INTERVAL` | Build/env | Worldstate polling interval (ms) |

Docker entrypoint writes only `NEXT_PUBLIC_DSN` into `window.__HUB_RUNTIME_ENV__` at container start (not baked into the image layers). Treat all `NEXT_PUBLIC_*` values as **visible to browsers**.

## Client-side stored state (outputs / inputs on next load)

When persistence is enabled, the browser may store keys prefixed with `hub.v1.`, including:

| Key pattern | Role |
|-------------|------|
| `hub.v1.prefs` | Platform, locale, theme, panel display/order, trackables, etc. |
| `hub.v1.ws.<platform>` | Cached worldstate snapshot |
| `hub.v1.cache.*` | Cached reference payloads (e.g. codex items, rivens, synthesis) |
| `hub.v1.codex.query` | Last codex filter UI state |

There is **no** hub-operated user account database and **no** Warframe login API.

## Upstream data the client reads (not offered by this project)

The browser calls public Warframe Stat.us HTTPS endpoints (and related CDN URLs), for example:

- `https://api.warframestat.us/…` — worldstate and related JSON
- `https://cdn.warframestat.us/…` — images and static assets

Those services define their own APIs ([docs.warframestat.us](https://docs.warframestat.us/)). Hub **consumes** them; it does not re-expose a documented server-side proxy API.

## What this project does not expose

- No public authenticated REST/GraphQL API for third-party integrators
- No CLI with flags (beyond standard `npm` / Docker entrypoint above)
- No npm library API for embedding (the published artifact for self-host is the **container image** / static web assets, not an importable package surface)

## Related docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — trust boundaries and data flow
- [SECURITY.md](SECURITY.md) — security expectations and reporting
- [CI.md](CI.md) — how releases and images are produced
