# Testing

| Kind | Spec location | How to run |
|------|---------------|------------|
| Property | `lib/**/*.property.test.ts`, `components/**/*.property.test.ts` | `npm run test:property` |
| E2E | `cypress/e2e/**/*.spec.ts` | `npm run test:e2e` (app must be running) |
| Component | `components/**/*.cy.tsx` | `npm run test:component` |
| All of the above | — | `npm test` |

## Property tests

[fast-check](https://fast-check.dev/) + Node’s built-in test runner (`jiti` loads TypeScript). No browser. Also runs in CI and on pre-commit when `lib/` or `components/` sources change.

```bash
npm run test:property
```

## Cypress

Config: [`cypress.config.ts`](../cypress.config.ts); component bundling via `cypress.vite.config.ts`.

Fixtures: `cypress/fixtures/`, `lib/fixtures/` (seeded in `cypress/support/commands.ts`).

```bash
npm run dev    # or npm start
npm run test:e2e
npm run test:component
```

CI uploads screenshots/videos on e2e/component failure. Property jobs have no artifacts beyond logs.
