# Phase 04 — App Shell + TanStack Router

## Deliverables

- `apps/web` scaffolded with `bun create vite` (react-ts template), then
  TanStack Router added via the official Vite plugin with file-based routes.
- Tailwind v4 wired (`@tailwindcss/vite`) consuming tokens from `packages/ui`.
- Root layout with:
  - Top nav (logo, search, cart, notifications, profile)
  - Slot for sidebar layouts (used by workspace and category pages)
  - `<Outlet />`
- Modal routing pattern:
  - Each product detail is a sibling route segment `/c/$category/p/$slug`.
  - When opened from a listing, the previous location is preserved via
    router state so the listing stays behind a `<Dialog>`.
  - Direct visits render the product page full-screen instead of as a modal.
- 404 + error boundaries.

## File-based routes (initial)

```
src/routes/
  __root.tsx
  index.tsx                      # storefront landing
  c/$category/index.tsx          # category listing
  c/$category/p/$slug.tsx        # product detail (modal-aware)
  cart.tsx
  checkout/
    index.tsx                    # information step
    payment.tsx
    review.tsx
  orders/
    $orderId.tsx                 # confirmation page
  auth/
    login.tsx
    register.tsx
    reset.tsx
  workspace/
    __layout.tsx                 # sidebar + topbar
    index.tsx                    # welcome
    overview.tsx
    inventory.tsx
    acquisitions.tsx
    analytics.tsx
    reports.tsx
  _dev/
    components.tsx
```

## Acceptance

- `bun dev` serves the app on :5173, hot reload works.
- Navigating from category → product opens as modal; deep-link to the same
  URL renders full-screen.
