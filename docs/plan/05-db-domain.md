# Phase 05 — Database & Domain Models

## Stack

- Postgres (local dev via Docker compose; prod via any managed Postgres).
- Drizzle ORM + drizzle-kit for migrations.
- `packages/db` exports the schema, a typed client, and migration scripts.
- `packages/domain` holds framework-agnostic types and pure functions.

## Schema (first cut)

```ts
// packages/db/src/schema.ts
users           (id, firebaseUid unique, email, fullName, role, createdAt)
specimens       (id, slug unique, name, category, subcategory, description,
                 priceCents, compareAtCents, stockStatus, originCountry,
                 imageUrl, createdAt)
specimenAttrs   (specimenId, key, value)     -- carat, cut, clarity, hardness, ...
collections     (id, name, slug)             -- "Trending Now", curated rails
collectionItems (collectionId, specimenId, position)
carts           (id, userId, createdAt, updatedAt)
cartItems       (cartId, specimenId, qty)
orders          (id, userId, reference, status, subtotalCents, shippingCents,
                 totalCents, createdAt)
orderItems      (orderId, specimenId, qty, unitPriceCents, snapshotJson)
addresses       (id, userId, country, firstName, lastName, line1, line2, city,
                 postal, phone, kind)        -- kind = 'shipping'|'billing'
shipments       (id, orderId, origin, status, eta)
reports         (id, kind, title, generatedAt, fileUrl)
auditLog        (id, actorId, action, target, payloadJson, createdAt)
```

## Pure domain helpers (`packages/domain`)

- `formatPrice(cents, currency)` → string
- `cartSubtotal(items)` → cents
- `cartTotal(subtotal, shipping, taxes)` → cents
- `orderReference()` → `RK-XXXX-YY`
- `validateEmail`, `validatePassword`, `validatePostal(country)`
- Discriminated unions for `StockStatus`, `OrderStatus`, `ShipmentStatus`.

## Scripts

```bash
bun --filter @rocksa/db generate   # drizzle-kit generate
bun --filter @rocksa/db migrate    # drizzle-kit migrate
bun --filter @rocksa/db seed       # seed script with demo specimens
```

## Acceptance

- `docker compose up -d db` brings up Postgres.
- Migrations run cleanly.
- Seed loads ~30 demo specimens across all four categories.
- Domain helpers covered by unit tests.
