# Phase 01 — Repo Bootstrap

Goal: stand up a Bun-based monorepo with the workspace layout described in
`00-overview.md`. No app code yet — just structure and shared configs.

## Deliverables

- Root `package.json` with `workspaces: ["apps/*", "packages/*"]`.
- `bunfig.toml` configured for workspaces and test runner.
- `tsconfig.base.json` with strict mode and path aliases for packages.
- `packages/config` containing:
  - `tsconfig/base.json`
  - `tailwind/preset.css` (placeholder; populated in Phase 03)
  - `oxlint.json` preset (populated in Phase 02)
- Empty packages with `package.json` + `tsconfig.json`:
  - `packages/ui`
  - `packages/db`
  - `packages/auth`
  - `packages/domain`
- `.gitignore`, `.editorconfig`, `.nvmrc` (or `.bun-version`).
- `README.md` updated with quick-start.

## Commands used

```bash
bun init -y                          # at root
bun add -d typescript @types/bun
mkdir -p apps packages/{ui,db,auth,domain,config}
```

## Acceptance

- `bun install` succeeds.
- `bun run typecheck` runs across all packages (no errors on empty stubs).
