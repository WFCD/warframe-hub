# Security Policy

## Supported Versions

Only the current `dev` deployment is supported (production on Vercel; self-host images on GHCR from release tags).

| Branch / line | Supported |
| ------------- | --------- |
| `dev` (current release) | Yes |
| `hub-legacy` | No |

## Scope

**In scope:** vulnerabilities in this repository’s application code, build/release pipelines, published container images (`ghcr.io/wfcd/warframe-hub`), and first-party configuration that ships with the project.

**Security requirements (what users can expect):**

- The hub is a **read-only information UI**. It does not require Warframe account login and must not request Warframe passwords or session tokens.
- Data shown comes from **public** third-party APIs/CDNs (Warframe Stat.us and related). Availability and correctness of that upstream data are outside this project’s control; integration bugs in this repo remain in scope.
- Self-hosted deployments should treat `NEXT_PUBLIC_*` values as visible to browsers; do not place private credentials there.
- Signed container releases and SBOMs (when published) support supply-chain verification; see the README Cosign examples.

**Out of scope:**

- Third-party services the hub consumes (for example Warframe Stat.us APIs/CDN), unless a concrete issue is in how this project integrates with them
- Issues that require physical access, compromised end-user devices, or social engineering of maintainers/users
- Denial-of-service against public production infrastructure without a clear, actionable defect in this codebase
- Reports against unsupported branches (`hub-legacy`) or unofficial forks/images

## Reporting a Vulnerability

Email **[security@warframestat.us](mailto:security@warframestat.us)** with a description of the issue, affected version or commit if known, and steps to reproduce.

Please do **not** open a public GitHub issue for security reports.

## Response Timeline

We aim to acknowledge reports within **one week**. After acknowledgment we will assess severity, work on a fix or mitigation when appropriate, and coordinate disclosure. Complex issues may take longer; we will keep you informed when we can.
