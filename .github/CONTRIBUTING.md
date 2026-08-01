# Contributing to Warframe Hub

Thanks for helping improve the hub. By participating you agree to follow the [Code of Conduct](../CODE_OF_CONDUCT.md).

## How we accept changes

1. **Find or open an issue** on [GitHub Issues](https://github.com/WFCD/warframe-hub/issues) (bug, feature, or question templates).
2. **Fork** the repository and create a branch from `dev`.
3. Make your changes, with tests where practical.
4. Open a **pull request** into `dev`. Fill out the PR template.
5. Wait for CI (lint, property tests, Cypress) and review. Maintainers merge via the protected `dev` ruleset.

We use **pull requests** for all code changes to `dev` — direct pushes to the default branch are not the contribution path.

Discussion: GitHub Issues / PR threads, or [WFCD Discord](https://discord.gg/jGZxH9f).

## Development setup

```bash
git clone https://github.com/YOUR_USER/warframe-hub.git
cd warframe-hub
npm install
npm run dev    # http://localhost:8742
```

Requires Node.js 24 (see `.nvmrc`). Optional env: copy [`.example.env`](../.example.env).

More layout detail: [docs/LAYOUT.md](../docs/LAYOUT.md). Local tooling: [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md). Architecture: [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## Requirements for acceptable contributions

| Area | Expectation |
|------|-------------|
| **Language** | TypeScript / React as used in the tree; match nearby style |
| **Lint** | `npm run lint` clean ([`eslint.config.ts`](../eslint.config.ts)). Prefer fixing rather than disabling rules; if you must disable, explain in the PR |
| **Commits** | [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject` — e.g. `feat(codex): add filter`, `fix(timers): hydrate panels`. Enforced by husky + commitlint in CI |
| **Tests** | Add or update Cypress component/e2e and/or `*.property.test.ts` when changing behavior. `npm run test:property` is cheap; run relevant Cypress specs for UI |
| **i18n** | User-visible strings go through i18n (`lib/locales`); don’t hard-code English-only UI copy for new features |
| **Scope** | Keep PRs focused; large drive-bys are harder to review |
| **Security** | Never commit secrets. Vulnerability reports go to [docs/SECURITY.md](../docs/SECURITY.md), not public issues |

### Useful commands

```bash
npm run lint
npm run lint:fix
npm run test:property
npm run test:component
npm run test:e2e      # needs dev/server running
npm run typecheck
```

## License

Contributions are under the same [Apache License 2.0](../LICENSE) as the project.
