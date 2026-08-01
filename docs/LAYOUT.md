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
├── docs/                     # project documentation (this folder)
├── cypress/                  # E2E specs, support, fixtures
├── .github/                  # CI, release, templates, contributing
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

## Package

| Path | npm name | Version |
|------|----------|---------|
| repo root | `@wfcd/hub` | `0.0.0-dev` in-repo; semver via git tags / Releases / GHCR |

See also: [Development](DEVELOPMENT.md), [Testing](TESTING.md), [CI](CI.md), [Architecture](ARCHITECTURE.md).
