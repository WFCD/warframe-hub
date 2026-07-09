# Repo layout

Monorepo: shared tooling at the root, app code under `apps/`, shared TS under `packages/`. **No app source at repo root.**

```
hub/
├── apps/
│   ├── next/                 # vinext + React + TS (primary) — port 8742
│   │   ├── app/              # routes (App Router)
│   │   ├── components/       # UI + *.cy.tsx component tests
│   │   ├── lib/              # providers, i18n, timers, test helpers
│   │   ├── data/json/        # static geo/fish/trackables JSON
│   │   ├── public/           # favicon, PWA assets, theme images
│   │   ├── styles/           # hub.scss entry, tokens, layout SCSS
│   │   ├── scripts/          # build/verify helpers
│   │   └── .eslintrc.cjs     # ESLint + @stylistic (app source)
│   └── legacy/               # Nuxt 2 (deprecated) — port 3000
├── packages/
│   └── shared/               # @wfcd/shared — types, CDN helpers, locales, fixtures
├── cypress/                  # E2E specs, support, fixtures (targets next app)
├── scripts/                  # root helpers (e.g. staged component tests)
├── .github/                  # CI, release, templates
├── cypress.config.ts         # E2E + component Cypress config
├── eslint.cypress.cjs        # ESLint for cypress/, crowdin.yml, .releaserc.yaml
├── .lintstagedrc.cjs         # husky pre-commit path rules
├── package.json              # workspace orchestration + husky/lint-staged
├── vercel.json               # deploys apps/next static export
├── crowdin.yml               # l10n → packages/shared/locales
└── README.md
```

## Commands (from root)

| Command | What |
|---------|------|
| `npm run dev` | vinext @ http://localhost:8742 |
| `npm run build` | production static export (`apps/next`) |
| `npm run start` | serve production build on 8742 |
| `npm run dev:legacy` | Nuxt @ http://localhost:3000 |
| `npm run lint` | ESLint: next app + cypress/config YAML + legacy + shared |
| `npm run lint:fix` | Same, with `--fix` |
| `npm run test` | Cypress E2E + component (dev server must be running for E2E) |
| `npm run test:e2e` | E2E only |
| `npm run test:component` | Component tests only |
| `npm run vinext:check` | vinext compatibility check |

`npm install` at root runs `postinstall` → installs **both** `apps/next` and `apps/legacy` (`install:apps`). Only `packages/shared` is an npm workspace member.

## Env files

| File | Vars |
|------|------|
| [`apps/next/.example.env`](apps/next/.example.env) | `NEXT_PUBLIC_*` |
| [`apps/legacy/.example.env`](apps/legacy/.example.env) | `VUE_APP_*` |

## Packages

| Path | npm name | Version | Role |
|------|----------|---------|------|
| `apps/next` | `@wfcd/hub` | **3.x** | Primary app (deployed) |
| `apps/legacy` | `@wfcd/hub` | **2.5.10** | Frozen Nuxt line |
| `packages/shared` | `@wfcd/shared` | 2.5.10 | Workspace dep of next (`file:../../packages/shared`) |
| root | `@wfcd/hub-monorepo` | 2.5.10 | Orchestration only |

## Linting and formatting

**Primary app (`apps/next`) and repo-root Cypress/config YAML use ESLint + [@stylistic/eslint-plugin](https://eslint.style/) v2 — not Prettier.** Stylistic rules mirror the old Prettier defaults (single quotes, semicolons, 120-ish line behavior via rule set, etc.).

| Scope | Config | Formatter / linter |
|-------|--------|------------------|
| `apps/next/**` | [`apps/next/.eslintrc.cjs`](apps/next/.eslintrc.cjs) | ESLint 8 + @stylistic + TS/React/a11y + jsonc + yml |
| `cypress/**`, `cypress.config.ts`, `crowdin.yml`, `.releaserc.yaml` | [`eslint.cypress.cjs`](eslint.cypress.cjs) | ESLint 8 + @stylistic + Cypress TS rules (plugins resolved from `apps/next/node_modules`) |
| `packages/shared/**` | [`packages/shared/.eslintrc.cjs`](packages/shared/.eslintrc.cjs) | ESLint 8 + **Prettier** (`eslint-plugin-prettier`) |
| `apps/legacy/**` | [`apps/legacy/.eslintrc.cjs`](apps/legacy/.eslintrc.cjs) | ESLint 8 + Nuxt/Vue + **Prettier** |
| Pre-commit (non-`apps/next` paths) | [`.lintstagedrc.cjs`](.lintstagedrc.cjs) catch-all `*` rule | **Prettier** (`root` devDependency) |

Pre-commit ([`.husky/pre-commit`](.husky/pre-commit) → [`.lintstagedrc.cjs`](.lintstagedrc.cjs)) runs ESLint `--fix` on staged next/cypress/shared/legacy files; changed `apps/next/components/**/*.{tsx,scss}` also triggers related Cypress component tests via [`scripts/run-staged-component-tests.mjs`](scripts/run-staged-component-tests.mjs).

Commit messages are validated with [commitlint](https://commitlint.js.org/) ([`commitlint.config.cjs`](commitlint.config.cjs), `@commitlint/config-conventional`) via [`.husky/commit-msg`](.husky/commit-msg) locally and in CI ([`.github/workflows/ci.yaml`](.github/workflows/ci.yaml) on pull requests, [`.github/workflows/release.yml`](.github/workflows/release.yml) on pushes to `dev`). Format: `type(scope): subject` (e.g. `feat(timers): add arbitration panel`, `fix: correct synthesis pagination`). Matches [semantic-release](.releaserc.yaml) / Conventional Commits.

### Why CommonJS config files?

| File | Reason |
|------|--------|
| `.lintstagedrc.cjs` | lint-staged needs a JS module with functions; ESM config is awkward at repo root without `"type": "module"` |
| `eslint.cypress.cjs` | `require.resolve(..., { paths: [apps/next/node_modules] })` to reuse next’s ESLint plugin installs from repo root |
| `apps/*/.eslintrc.cjs` | Legacy ESLint “eslintrc” format (`.cjs` because configs use `module.exports`) |

### ESLint version (8.x today)

All packages pin **ESLint ^8.57.1**. `@stylistic/eslint-plugin` is on **v2** (ESLint 8–compatible). ESLint **9+/10** uses flat config (`eslint.config.js`) and would require upgrading @stylistic to v4+, typescript-eslint majors, and migrating every `.eslintrc.cjs` — planned as part of repo flattening / legacy removal, not done yet.

`.prettierrc.json` remains at root for **legacy**, **shared**, and lint-staged’s non-next catch-all only — not for `apps/next` source.

## Tooling config map

| File | Scope |
|------|-------|
| [`.eslintignore`](.eslintignore) | Shared ignore list (referenced by `apps/next` lint via `../../.eslintignore`) |
| [`.prettierrc.json`](.prettierrc.json) | Prettier — legacy, shared, lint-staged catch-all |
| [`.lintstagedrc.cjs`](.lintstagedrc.cjs) | husky pre-commit; per-path ESLint / Prettier / component tests |
| [`commitlint.config.cjs`](commitlint.config.cjs) | Conventional Commits (commit-msg + CI) |
| [`.releaserc.yaml`](.releaserc.yaml) | semantic-release → bumps `apps/next/package.json` |
| [`apps/next/styles/hub.scss`](apps/next/styles/hub.scss) | Single style entry: tokens, globals, theme SCSS |
| [`cypress/tsconfig.json`](cypress/tsconfig.json) | TS paths for Cypress (`@wfcd/shared`, etc.) |

There is **no** root `.eslintrc.cjs` — root Cypress/config linting uses `eslint.cypress.cjs` via `npm run lint:cypress`.

## Dependencies by location

| Location | Owns |
|----------|------|
| root `package.json` | husky, lint-staged, prettier; `postinstall` → both apps |
| `apps/next` | vinext, React, ESLint + @stylistic, Cypress, Tailwind, Sass |
| `apps/legacy` | Nuxt 2, Vue ESLint, LESS/postcss |
| `packages/shared` | shared TS, dayjs, json5; ESLint + Prettier |

## Testing layout

| Kind | Spec location | Config |
|------|---------------|--------|
| E2E | `cypress/e2e/**/*.spec.ts` | [`cypress.config.ts`](cypress.config.ts) |
| Component | `apps/next/components/**/*.cy.tsx` | same; Vite via `apps/next/cypress.vite.config.ts` |
| Fixtures | `cypress/fixtures/`, `packages/shared/fixtures/` | seeded in `cypress/support/commands.ts` |

Screenshots/videos: `apps/next/cypress/screenshots|videos` (gitignored).

## Deploy

[`vercel.json`](vercel.json): `npm run build --prefix apps/next` → `apps/next/dist/client`.

## History

Nuxt source (`pages/`, `components/`, `nuxt.config.js`, …) used to live at repo root; it now lives under `apps/legacy/` while the React rewrite lives in `apps/next/`.

**Upcoming:** remove `apps/legacy`, hoist `apps/next` to repo root, inline `packages/shared` into `lib/` — see flatten plan.
