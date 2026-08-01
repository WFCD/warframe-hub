# Repo layout

Single-package vinext + React app at the repo root. Shared helpers live under `lib/`.

```
hub/
├── app/                      # App Router routes
├── components/               # UI + *.cy.tsx component tests
├── lib/                      # providers, i18n, shared helpers, locales, fixtures
│   ├── shared/               # CDN helpers, types, worldstate utils
│   ├── locales/              # i18n JSON (Crowdin source)
│   └── fixtures/             # Cypress / test fixtures
├── data/json/                # static geo/fish/trackables JSON
├── public/                   # favicon, PWA assets, theme images
├── styles/                   # hub.scss entry, tokens, layout SCSS
├── scripts/                  # verify-static-deploy + staged component tests
├── cypress/                  # E2E specs, support, fixtures
├── .github/                  # CI, release, templates
├── cypress.config.ts
├── eslint.config.ts
├── commitlint.config.ts
├── lint-staged.config.ts
├── dev.config.ts
├── package.json              # @wfcd/hub (version 0.0.0-dev; semver via tags/Releases)
├── vercel.json               # static export → dist/client
├── crowdin.yml               # l10n → lib/locales
└── README.md
```

## Commands

| Command | What |
|---------|------|
| `npm run dev` | vinext @ http://localhost:8742 |
| `npm run build` | production static export |
| `npm run start` | serve production build on 8742 |
| `npm run lint` | ESLint flat config (`eslint .`) |
| `npm run lint:fix` | ESLint `--fix` |
| `npm run test` | Cypress E2E + component |
| `npm run test:e2e` | E2E only (dev server must be running) |
| `npm run test:component` | Component tests only |
| `npm run vinext:check` | vinext compatibility check |

Env: [`.example.env`](.example.env) (`NEXT_PUBLIC_*`).

## Package

| Path | npm name | Version |
|------|----------|---------|
| repo root | `@wfcd/hub` | **3.x** |

## Linting and formatting

ESLint 10 (flat config) + [@stylistic/eslint-plugin](https://eslint.style/) — stylistic owns formatting (no Prettier).

| Scope | Config |
|-------|--------|
| App, Cypress, JSON, YAML | [`eslint.config.ts`](eslint.config.ts) |

Pre-commit: [`.husky/pre-commit`](.husky/pre-commit) → [`lint-staged.config.ts`](lint-staged.config.ts). Changed `components/**/*.{tsx,scss}` also runs related Cypress component tests via [`scripts/run-staged-component-tests.mjs`](scripts/run-staged-component-tests.mjs).

Commit messages: [commitlint](https://commitlint.js.org/) ([`commitlint.config.ts`](commitlint.config.ts), Conventional Commits) via [`.husky/commit-msg`](.husky/commit-msg), CI PRs, and Release on `dev`.

Shared port: [`dev.config.ts`](dev.config.ts) (vinext + Cypress + CI).
## Testing

| Kind | Spec location | Config |
|------|---------------|--------|
| E2E | `cypress/e2e/**/*.spec.ts` | [`cypress.config.ts`](cypress.config.ts) |
| Component | `components/**/*.cy.tsx` | same; Vite via `cypress.vite.config.ts` |
| Fixtures | `cypress/fixtures/`, `lib/fixtures/` | seeded in `cypress/support/commands.ts` |

## Deploy

[`vercel.json`](vercel.json): `npm run build` → `dist/client`. Semantic-release publishes GitHub Releases + GHCR tags (no `package.json` bump; version is `0.0.0-dev` in-repo).

**PR previews:** Vercel Git integration auto-deploys on push (native Preview check + View Deployment). CI (commitlint, lint, e2e, component) runs in parallel and does not gate the preview.

Production alias gating (Deployment Checks after CI) can be added in the Vercel dashboard once a deploy has run.
