# Phase 15 — Backend (Firebase Auth + Firebase Data Connect / Cloud SQL Postgres)

The app is **client-only**: the SPA talks to Firebase Auth and to a generated
Data Connect SDK that calls our connector operations. The connector runs on
Firebase's Data Connect service, which fronts a real **Cloud SQL Postgres**
instance. There is no separate API server in this repo.

## Why Data Connect

- Real Postgres underneath — schema-managed by Firebase, queryable via
  Cloud SQL.
- Each operation in `dataconnect/connector/default/*.gql` is compiled and
  type-checked at deploy time. The SPA gets a generated, type-safe SDK.
- Operations declare auth requirements inline (`@auth(level: USER)`); the
  service verifies the Firebase ID token on every call.
- Requires the **Blaze (pay-as-you-go) plan** on Firebase.

## Layout

```
dataconnect/
  dataconnect.yaml                # service config + Cloud SQL pointer
  schema/schema.gql               # Postgres tables (Specimen, User, Cart, Order, …)
  connector/default/
    connector.yaml                # SDK generation config (outputs to apps/web/src/dataconnect-generated)
    queries.gql                   # ListSpecimens, GetSpecimen, MyCart, MyOrder
    mutations.gql                 # UpsertSelf, SetCartItem, CreateOrder, …, UpsertSpecimen (seed)

apps/web/src/
  dataconnect-generated/index.ts  # ⚠️  STUB. Overwritten by `firebase deploy --only dataconnect`.
  data/dc-specimens.ts            # React Query wrappers around generated SDK
  data/dc-cart.ts                 # load/save server cart
  data/dc-orders.ts               # createServerOrder

scripts/seed-dataconnect.ts       # POSTs UpsertSpecimen mutations against the connector REST endpoint
```

## First-run setup (production project)

Prereqs: `firebase-tools` ≥ 13.20 (`npm i -g firebase-tools`), Blaze plan,
service account JSON.

```bash
firebase login
firebase use --add               # pick your project
firebase init dataconnect        # accept defaults; will see existing dataconnect/ files

# Provisions Cloud SQL, applies schema, deploys the connector, and regenerates
# apps/web/src/dataconnect-generated/* — replacing the stub.
firebase deploy --only dataconnect

# Seed the catalog (UpsertSpecimen mutations against the deployed connector).
FIREBASE_PROJECT_ID=<your-project-id> \
GOOGLE_APPLICATION_CREDENTIALS=/path/to/admin.json \
bun run seed

# Start the app
bun dev
```

Update `dataconnect/dataconnect.yaml` `instanceId` to match the Cloud SQL
instance Firebase provisions (visible in the console).

## First-run setup (local emulators, no Cloud SQL)

```bash
firebase init emulators           # pick Auth + Data Connect
firebase emulators:start --only dataconnect,auth

# .env
VITE_FIREBASE_PROJECT_ID=rocksa-dev
VITE_FIREBASE_AUTH_EMULATOR=http://localhost:9099

# In another terminal — generate the SDK against the emulator schema
firebase dataconnect:sdk:generate

# Seed
FIREBASE_PROJECT_ID=rocksa-dev DATACONNECT_EMULATOR=http://localhost:9399 \
bun run seed

# Run the app
bun dev
```

Emulator UI: <http://localhost:4000>. Data Connect emulator includes a
GraphQL explorer for the connector operations.

## How the SPA uses it

1. `firebaseAuth.currentUser.getIdToken()` provides the Firebase ID token.
2. The generated SDK attaches the token automatically on every operation.
3. Each call is one HTTPS request to the connector — no client-side schema,
   no n+1, no GraphQL exposure: only the pre-compiled named operations are
   callable.
4. `useSpecimens()`/`useSpecimen()` wrap the generated functions with React
   Query for caching.
5. `CartProvider` loads/saves through `MyCart` + `SetCartItem` + `RemoveCartItem`.
6. `createOrder` issues `CreateOrder` then a fan-out of `AddOrderItem`.

## Schema notes

- `Specimen` is keyed by `slug` (lowercase, URL-safe). The SPA stores the
  slug as the cart item's `specimenId` so the cart writes need only that.
- `User` is keyed by `uid` (Firebase Auth UID). Created on first sign-in via
  `UpsertSelf` — call this from the app once after sign-in (or in a Cloud
  Function trigger).
- Cart's natural key is `(user, specimen)`, enforced by Data Connect.

## Acceptance

- `bun --filter '*' typecheck` passes.
- `bun --filter @rocksa/web build` produces `dist/`.
- `firebase deploy --only dataconnect` succeeds and overwrites
  `apps/web/src/dataconnect-generated/`.
- Visiting `/c/crystals` lists rows from `Specimen` in Cloud SQL Postgres.
- Sign in → cart edits land in the `CartItem` table.
- Place an order → an `Order` row + N `OrderItem` rows are inserted.
