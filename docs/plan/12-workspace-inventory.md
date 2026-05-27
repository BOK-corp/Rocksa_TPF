# Phase 12 — Workspace: Overview, Inventory, Acquisitions

## Overview (`/workspace/overview`)

Matches the "Overview" screenshot:

- Three stat cards: Total Acquisitions (1,248, +12 this month), Collection
  Value ($4.2M Estimated), Pending Shipments (7, 2 delayed).
- Active Shipments table: item, origin, status pill, ETA.
- Recent Activity timeline on the right.

## Inventory (`/workspace/inventory`)

Matches "Inventory":

- Filter pill row: All / Igneous / Crystals / ... + Filters button + Sort by.
- Table: specimen (image + name), ID, category, status pill, value, date
  added, with pagination ("Showing 1–3 of 124 specimens").
- "Add New Specimen" primary CTA opens a side sheet form.

## Acquisitions (`/workspace/acquisitions`)

Matches "Acquisitions Tracking":

- Three stat cards: Active Shipments, Pending Clearance, Est. Pipeline Value.
- "Incoming Shipments" table (specimen, origin, status, ETA).
- "Active Origins" card with a world-map and ranked origin list.
- "New Acquisition" CTA opens an intake form.

## Server

- All three pages share the same `/api/inventory` query with different
  filters; pagination is cursor-based.

## Acceptance

- All stat numbers are sourced from real DB aggregates, not hard-coded.
- Status pills are color-tokenized: In Transit (brand), Pending Customs
  (warning), Out for Delivery (success), Customs Hold (danger).
