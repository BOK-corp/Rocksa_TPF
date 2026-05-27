# Phase 14 — Polish, Accessibility, Performance

## A11y

- Audit with axe-core in tests; every primitive must pass.
- Focus rings tokenized (`--ring`) and visible on all interactive elements.
- Modal route traps focus, restores on close, has a labelled close button.
- Color contrast: brand-600 on white passes AA for large text and UI;
  ink-500 on brand-50 verified.

## Perf

- Route-level code splitting (TanStack Router does this by default with
  file-based routing).
- Tailwind v4's per-route CSS extraction enabled.
- Image strategy: `<img loading="lazy" decoding="async">` everywhere except
  hero. Use `srcset` for product images.

## Misc polish

- Empty states for: empty cart, empty inventory, no acquisitions, no
  reports.
- Loading skeletons for every async surface (already present in Phase 03
  primitives).
- Toasts for: added to cart, signed in, order created, report generated.
- Error boundaries per route with a "Something went wrong" card and a
  reload button.

## Acceptance

- Lighthouse: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95.
- Bundle: initial JS payload under 200 KB gzipped for the storefront landing.
