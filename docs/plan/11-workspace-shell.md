# Phase 11 — Curator Workspace Shell

## Routes under `/workspace`

- `/workspace` — Welcome splash (matches "Welcome to your Workspace": split
  layout, hero image left, feature cards + "Enter Dashboard" CTA right).
- `/workspace/overview`
- `/workspace/inventory`
- `/workspace/acquisitions`
- `/workspace/analytics`
- `/workspace/reports`

## Layout

- Top bar: Rocksa logo, search, cart, bell, help, avatar.
- Left sidebar:
  - Header block "The Collection / Curator's Workspace"
  - Nav items with icon: Igneous, Metamorphic, Sedimentary, Crystals,
    Reports, Analytics (active item gets a violet pill background, the rest
    are ghost).
- Main content area with serif page title, sans subtitle, optional primary
  CTA in the top right.

## Auth gating

- Entire `/workspace/*` is wrapped in `<RequireAuth roles={["curator", "admin"]} />`.
- Buyers landing here are redirected to `/`.

## Acceptance

- Sidebar active state correctly tracks the URL.
- Layout collapses cleanly to a hamburger menu under 768px.
