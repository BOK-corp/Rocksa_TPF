# Phase 10 — Order Confirmation & History

## Pages

### `/orders/$orderId`

Matches "Acquisition Complete":

- Centered card.
- Violet square icon, "Acquisition Confirmed" headline.
- "ORDER REFERENCE — #RK-XXXX-XX" eyebrow.
- Multi-line gratitude copy.
- Purchased item row(s): image, name, description, attribute grid, price.
- "Return to Dashboard" CTA.

### `/orders` (optional, behind workspace)

List of past orders. Status pill + total + date.

## Server-side

- `POST /api/orders` (or RPC equivalent) — creates order, decrements stock
  status to `reserved`, returns the new id.
- Order reference generator is a pure function: `RK-` + 4 random base36 +
  `-` + 2-char date suffix.

## Acceptance

- Order detail is reachable directly via shared URL (with auth).
- Reference matches the displayed pattern.
