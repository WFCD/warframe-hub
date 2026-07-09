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
├── eslint.cypress.cjs
├── commitlint.config.cjs
├── .lintstagedrc.cjs
├── package.json              # @wfcd/hub 3.x
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
| `npm run lint` | ESLint (app) |
| `npm run lint:cypress` | ESLint for cypress/ + config YAML |
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

ESLint 8 + [@stylistic/eslint-plugin](https://eslint.style/) v2 — not Prettier.

| Scope | Config |
|-------|--------|
| App source | [`.eslintrc.cjs`](.eslintrc.cjs) |
| `cypress/**`, `cypress.config.ts`, `crowdin.yml`, `.releaserc.yaml` | [`eslint.cypress.cjs`](eslint.cypress.cjs) |

Pre-commit: [`.husky/pre-commit`](.husky/pre-commit) → [`.lintstagedrc.cjs`](.lintstagedrc.cjs). Changed `components/**/*.{tsx,scss}` also runs related Cypress component tests via [`scripts/run-staged-component-tests.mjs`](scripts/run-staged-component-tests.mjs).

Commit messages: [commitlint](https://commitlint.js.org/) ([`commitlint.config.cjs`](commitlint.config.cjs), Conventional Commits) via [`.husky/commit-msg`](.husky/commit-msg), CI PRs, and Release on `dev`.

## Testing

| Kind | Spec location | Config |
|------|---------------|--------|
| E2E | `cypress/e2e/**/*.spec.ts` | [`cypress.config.ts`](cypress.config.ts) |
| Component | `components/**/*.cy.tsx` | same; Vite via `cypress.vite.config.ts` |
| Fixtures | `cypress/fixtures/`, `lib/fixtures/` | seeded in `cypress/support/commands.ts` |

## Deploy

[`vercel.json`](vercel.json): `npm run build` → `dist/client`. Semantic-release bumps root `package.json` on `dev`.

**PR previews:** Vercel Git preview builds are skipped (`ignoreCommand` → [`scripts/vercel-ignore-build.mjs`](scripts/vercel-ignore-build.mjs)). After commitlint, lint, e2e, and component jobs pass, CI job **Preview** runs `vercel build` + `vercel deploy --prebuilt` and comments the URL on the PR.

GitHub config: secret `VERCEL_TOKEN`; variables `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Production alias gating (Deployment Checks after CI) can be added in the Vercel dashboard once a deploy has run.
