# Phase 07 — Storefront: Catalog & Product Modal Route

## Pages

### Landing (`/`)

Matches the "Html → Body-2" screenshot:

- Top nav: logo, search input, cart/notif/help icons, Sign In CTA (or avatar
  when authed).
- Left sidebar with category tree: Igneous / Metamorphic / Sedimentary /
  Crystals. Highlighted active state with violet pill.
- Hero card with a featured specimen, "NEW ACQUISITION" badge, headline in
  display serif, body copy, "Explore Collection" CTA.
- Right rail: Curator's Notes and Investment Grade cards.
- "Trending Now" horizontal product rail with arrow paginators.

### Category listing (`/c/$category`)

Matches the "Crystals" screenshot:

- Same sidebar.
- Title in display serif, count subtitle, "Sort By" select.
- Filter sidebar: sub-category checkboxes, Color select, Clarity select, Price
  range min/max.
- 3-column responsive grid of product cards.

### Product detail (`/c/$category/p/$slug`)

Matches the "Deep Blue Sapphire" modal screenshot. Modal-aware:

- When entered from a listing, renders inside `<Dialog>` over the listing
  page (router preserves the listing route in background).
- When entered cold (refresh / shared link), renders full-page.
- Big image gallery left, metadata right: SKU pill, stock pill, name, price,
  compare-at strikethrough, description, "Add to Collection" + Share buttons,
  collapsible Gemological Report, Curator's Note.

## Functional notes

- Listing data fetched via TanStack Router loaders → React Query.
- Filter state lives in URL search params so it survives refresh and is
  shareable.
- Sub-category & price filters are pure functions over the loaded result —
  no extra round-trip for trivial filters (server only applies the heavy ones).

## Acceptance

- Open product from listing → modal opens, URL updates, listing visible behind.
- Press ESC → modal closes, URL returns to listing, scroll position preserved.
- Share the URL → opens full-page with a "Back to category" link.
