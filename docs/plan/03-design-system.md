# Phase 03 — Design Tokens & UI Primitives

Build the visual foundation captured in the Figma screenshots.

## Tokens

Defined in `packages/ui/src/tokens.css` using Tailwind v4's `@theme`:

```css
@theme {
  /* Brand */
  --color-brand-50: #f5f3ff;
  --color-brand-100: #ede9fe;
  --color-brand-200: #ddd6fe;
  --color-brand-500: #7c3aed;
  --color-brand-600: #6d28d9; /* primary action */
  --color-brand-700: #5b21b6;

  /* Surface */
  --color-surface: #ffffff;
  --color-surface-muted: #faf9ff; /* app background lilac */
  --color-surface-soft: #f3f0fb;

  /* Ink */
  --color-ink-900: #0f0f14;
  --color-ink-700: #2d2a3a;
  --color-ink-500: #5b5670;
  --color-ink-400: #8a8499;

  /* Semantics */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  /* Typography */
  --font-display: "Source Serif 4", "Cardo", ui-serif, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Radii */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  /* Shadows */
  --shadow-card: 0 1px 2px rgba(15, 15, 20, 0.04), 0 8px 24px rgba(15, 15, 20, 0.04);
}
```

## Primitives (shadcn-derived, restyled)

Build only what we need now; add more as phases require them.

- `Button` — variants: primary (filled violet), secondary (outline), ghost, link.
- `Input` — underlined variant (used on register), boxed variant (used on cart/checkout).
- `Label`
- `Card` — soft surface, optional header/footer slots.
- `Badge` — In Stock / Low Stock / New Acquisition pill.
- `Tabs` — used on payment method picker.
- `Dialog` — used for product modal route (controlled from router state).
- `Separator`
- `Checkbox`
- `Select` (Radix-based, restyled)
- `Avatar`
- `Skeleton`
- `Toast` (Sonner)

## Acceptance

- Storybook is _not_ required. Instead, a `/_dev/components` route in the web
  app renders every primitive in every variant for manual review.
- Snapshot tests for each primitive's variants.
