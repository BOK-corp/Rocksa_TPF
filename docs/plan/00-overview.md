# Rocksa — Build Plan Overview

Rocksa is a luxury gemstone & mineral ecommerce app. The product positions
specimens as curated, investment-grade pieces — visual language is editorial
(display serif headings, generous whitespace, deep-violet brand accent on a
soft lilac surface).

## Product surfaces

Two parallel experiences share one app:

1. **Storefront** (public + authenticated buyer)
   - Landing / hero
   - Category browse (Igneous, Metamorphic, Sedimentary, Crystals)
   - Product detail (opens as a modal route over the listing)
   - Cart
   - Checkout (Information → Payment → Review)
   - Order confirmation
   - Auth: Login, Register, Reset password

2. **Curator Workspace** (authenticated, role: curator/admin)
   - Welcome / workspace splash
   - Dashboard Overview
   - Inventory management
   - Acquisitions tracking (incoming shipments)
   - Performance Analytics
   - Document Vault (reports)

## Stack

| Concern       | Choice                                        |
| ------------- | --------------------------------------------- |
| Runtime       | Bun                                           |
| Bundler / dev | Vite                                          |
| Framework     | React 19 + TypeScript                         |
| Routing       | TanStack Router (file-based)                  |
| Styling       | TailwindCSS v4 (CSS-first config)             |
| UI primitives | shadcn-style, customized for Rocksa tokens    |
| DB            | PostgreSQL                                    |
| ORM           | Drizzle ORM + drizzle-kit                     |
| Auth          | Firebase Auth (Email/Password + Google/Apple) |
| Tests         | Vitest + Testing Library                      |
| Lint / Format | Oxlint + oxfmt                                |
| CI            | GitHub Actions                                |
| Monorepo      | Bun workspaces, TanStack-style layout         |

## Repo layout

```
apps/
  web/                  # The React SPA
packages/
  ui/                   # Shared UI primitives (Button, Input, Card, ...)
  db/                   # Drizzle schema + client + migrations
  auth/                 # Firebase auth helpers, hooks, guards
  config/               # Shared tsconfig / tailwind preset / oxlint preset
  domain/               # Pure types & functional helpers (cart math, etc.)
docs/
  plan/                 # This planning folder
.github/workflows/      # CI
```

## Engineering style

- **Functional first.** Prefer pure functions over classes. Components are
  function components; side effects live in hooks. Cart math, formatting,
  validation, etc. are pure helpers in `packages/domain`.
- **Files are small and named for what they expose.** Co-locate component +
  hook + test when tightly coupled.
- **One source of truth for design tokens** in `packages/ui/src/tokens.css`
  using Tailwind v4's `@theme` directive.

## Phased delivery

Each phase has a `NN-*.md` file with goals, deliverables, and a checklist.
Phases are designed to be merged independently.

- [01 — Repo bootstrap](./01-repo-bootstrap.md)
- [02 — Tooling: tests, lint, format, CI](./02-tooling.md)
- [03 — Design tokens & UI primitives](./03-design-system.md)
- [04 — App shell + TanStack Router](./04-app-shell.md)
- [05 — Database & domain models (Drizzle + Postgres)](./05-db-domain.md)
- [06 — Firebase Auth](./06-auth.md)
- [07 — Storefront: catalog & product modal route](./07-storefront-catalog.md)
- [08 — Cart](./08-cart.md)
- [09 — Checkout flow](./09-checkout.md)
- [10 — Order confirmation & history](./10-orders.md)
- [11 — Curator workspace shell](./11-workspace-shell.md)
- [12 — Workspace: inventory & acquisitions](./12-workspace-inventory.md)
- [13 — Workspace: analytics & document vault](./13-workspace-analytics.md)
- [14 — Polish, accessibility, perf pass](./14-polish.md)
