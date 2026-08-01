# Continuous integration and delivery

## Pull requests (`dev`)

Workflow: [`.github/workflows/ci.yaml`](../.github/workflows/ci.yaml)

| Job | Purpose |
|-----|---------|
| Commit messages | commitlint vs base…head |
| Lint | `npm run lint` |
| Property | `npm run test:property` |
| E2E | Cypress (Chrome) |
| Component | Cypress component |

Also on PRs (separate workflows): Dependency Review, CodeQL (as configured).

**Vercel previews:** Git integration deploys on push (Preview check). CI does not gate the preview deploy.

## Release (`dev` pushes)

Workflow: [`.github/workflows/release.yml`](../.github/workflows/release.yml)

1. commitlint, lint, property, Cypress (same gates as CI)
2. `npx --no-install semantic-release` → GitHub Release + GHCR image tags
3. On new release: Syft SBOM, Cosign sign/attest, provenance on the Release, Trivy SARIF

`package.json` version stays `0.0.0-dev`; semver is git tags / Releases / GHCR.

## Scorecard and supply chain

- [`.github/workflows/scorecard.yml`](../.github/workflows/scorecard.yml) — schedule, after successful Release, branch-protection changes, and **workflow_dispatch** (always analyzes tip of `dev`)
- Dependabot: [`.github/dependabot.yml`](../.github/dependabot.yml) (npm, GitHub Actions, Docker)
- Cosign verify examples: root [README](../README.md)

## Deploy targets

| Target | How |
|--------|-----|
| Production web | Vercel from `dev` ([`vercel.json`](../vercel.json): `npm run build` → `dist/client`) |
| Self-host | `ghcr.io/wfcd/warframe-hub` tags from Release (see README Docker section) |

Production alias gating (Deployment Checks after CI) can be enabled in the Vercel dashboard if desired.
