# Phase 08 — Cart

## Page

`/cart` — matches "Shopping Cart: Your Selection".

- Full-width top nav with Collections / Custom Design / Investment / Journal
  links + cart & profile icons.
- "Your Cart" display-serif title, item count subtitle.
- Item rows: image, name, attribute grid (carat/cut/clarity/origin), qty
  stepper, line price, remove (×) button.
- Right Summary card: Subtotal, Estimated Shipping (Complimentary), Duties &
  Taxes (Calculated at checkout), Total, "Proceed to Checkout" CTA, secure
  encrypted checkout note.

## State

- Cart lives in Postgres for authed users, in `localStorage` for guests.
- `useCart()` hook in `packages/auth` (or new `packages/cart`) returns
  `{ items, subtotal, total, add, remove, setQty, merge }`.
- On sign-in, guest cart is merged into the user's cart server-side.

## Functional helpers (pure, in `@rocksa/domain`)

```ts
addItem(items, specimen, qty=1): CartItem[]
setQty(items, specimenId, qty): CartItem[]
removeItem(items, specimenId): CartItem[]
subtotal(items): number
```

## Acceptance

- Add to cart from product modal → cart badge updates.
- Cart persists across reloads (guest + authed).
- Sign-in merges guest cart with server cart, dedupes by `specimenId`.
