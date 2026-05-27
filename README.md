# Rocksa

A luxury gemstone & mineral marketplace, built on Firebase Auth + **Firebase Data Connect** (Cloud SQL Postgres) with a typed, generated SDK.

## Stack

Bun · React 19 · TanStack Router · Tailwind v4 · Firebase Auth · Firebase Data Connect (Cloud SQL Postgres) · Vitest · Oxlint/oxfmt.

See [`docs/plan/00-overview.md`](./docs/plan/00-overview.md) for the full plan, or [`docs/plan/15-backend.md`](./docs/plan/15-backend.md) for the Data Connect wiring.

## Quick start

```bash
bun install
cp .env.example .env       # fill VITE_FIREBASE_* and FIREBASE_PROJECT_ID
bun dev                    # http://localhost:5173 — runs against stub SDK
```

The web app ships with a **stub** generated SDK at `apps/web/src/dataconnect-generated/` so the UI works against the local seed array without any backend.

## Deploy Data Connect (provisions Cloud SQL + replaces the stub)

```bash
npm i -g firebase-tools
firebase login
firebase use --add
firebase init dataconnect              # recognises existing dataconnect/
firebase deploy --only dataconnect     # creates Cloud SQL, applies schema, regenerates SDK

# Seed the catalog
FIREBASE_PROJECT_ID=<id> GOOGLE_APPLICATION_CREDENTIALS=/path/to/admin.json bun run seed
```

Or work fully offline with the emulator — see [docs/plan/15-backend.md](./docs/plan/15-backend.md#first-run-setup-local-emulators-no-cloud-sql).

## Scripts

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `bun dev`           | Run the web app                       |
| `bun run build`     | Build every workspace package         |
| `bun run typecheck` | Type-check every package              |
| `bun test`          | Run Vitest                            |
| `bun run lint`      | Oxlint                                |
| `bun run fmt`       | oxfmt                                 |
| `bun run seed`      | Seed specimens via Data Connect       |

## Layout

```
apps/web                    # React SPA — uses generated Data Connect SDK
packages/ui                 # Shadcn-derived primitives, Rocksa tokens
packages/auth               # Firebase Auth init + AuthProvider
packages/domain             # Pure types and functional helpers
dataconnect/                # Postgres schema (GraphQL SDL) + connector ops
scripts/seed-dataconnect.ts # Catalog seed via UpsertSpecimen mutations
firebase.json               # Emulator + deploy config
docs/plan                   # Phased build plan
```
