# Phase 02 — Tooling: tests, lint, format, CI

## Deliverables

- **Vitest** at the root with a workspace config so each package/app runs
  under one command. JSDOM env for the web app.
- **Testing Library** for React (`@testing-library/react`, `jest-dom`).
- **Oxlint** with a shared config in `packages/config/oxlint.json`. Tightened
  rules: no-floating-promises, no-unused-vars, react-hooks.
- **oxfmt** for formatting. Editor config + a `bun fmt` script.
- **GitHub Actions** workflow `.github/workflows/ci.yml`:
  - Job 1: install + typecheck
  - Job 2: oxlint + oxfmt --check
  - Job 3: vitest
  - Job 4: build `apps/web`
- Husky-free pre-push: use `lefthook` only if needed; otherwise rely on CI.

## Scripts (root package.json)

```jsonc
{
  "scripts": {
    "dev": "bun --filter ./apps/web dev",
    "build": "bun --filter '*' build",
    "typecheck": "bun --filter '*' typecheck",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "oxlint .",
    "fmt": "oxfmt .",
    "fmt:check": "oxfmt --check .",
  },
}
```

## Acceptance

- A trivial passing test exists under `apps/web` and `packages/domain`.
- CI is green on the first push.
