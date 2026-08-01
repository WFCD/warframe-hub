# Development

Local setup and day-to-day contributor tooling. Quick start also lives in the root [README](../README.md).

## Commands

| Command | What |
|---------|------|
| `npm run dev` | vinext @ http://localhost:8742 |
| `npm run build` | production static export |
| `npm run start` | serve production build on 8742 |
| `npm run lint` | ESLint flat config (`eslint .`) |
| `npm run lint:fix` | ESLint `--fix` |
| `npm run test` | property + Cypress e2e + component |
| `npm run test:property` | fast-check property tests (`node:test`) |
| `npm run test:e2e` | E2E only (dev server must be running) |
| `npm run test:component` | Component tests only |
| `npm run vinext:check` | vinext compatibility check |
| `npm run typecheck` | `tsc --noEmit` |

Env: [`.example.env`](../.example.env) (`NEXT_PUBLIC_*`).

Shared port: [`dev.config.ts`](../dev.config.ts) (vinext + Cypress + CI).

## Linting and formatting

ESLint 10 (flat config) + [@stylistic/eslint-plugin](https://eslint.style/) — stylistic owns formatting (no Prettier).

| Scope | Config |
|-------|--------|
| App, Cypress, JSON, YAML | [`eslint.config.ts`](../eslint.config.ts) |

Pre-commit: [`.husky/pre-commit`](../.husky/pre-commit) → [`lint-staged.config.ts`](../lint-staged.config.ts).

- Staged `lib/` / `components/` `*.ts(x)` → `npm run test:property`
- Changed `components/**/*.{tsx,scss}` → related Cypress component tests via [`scripts/run-staged-component-tests.mjs`](../scripts/run-staged-component-tests.mjs)

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) via [commitlint](https://commitlint.js.org/) ([`commitlint.config.ts`](../commitlint.config.ts)):

- Local: [`.husky/commit-msg`](../.husky/commit-msg)
- CI: PR commitlint job + Release workflow on `dev`

Examples: `feat(codex): add filter`, `fix(timers): hydrate panels`, `ci: bump actions`.

See [Contributing](../.github/CONTRIBUTING.md) for PR expectations.
