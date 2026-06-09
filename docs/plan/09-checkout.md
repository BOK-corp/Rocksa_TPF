# Phase 09 — Checkout

## Routes

- `/checkout` — Step 1: Information (contact + shipping address + delivery)
- `/checkout/payment` — Step 2: Payment (Credit Card / Wire Transfer /
  Digital Wallet tabs)
- `/checkout/review` — Step 3: Review (optional, can be folded into payment)

## UI

- Top nav simplified to just the logo + cancel link (per the "Secure Payment"
  screenshot).
- Breadcrumb stepper: Cart › Information › Payment › Review.
- Two-column layout: form on the left, persistent Order Summary card on the
  right.
- Form fields use underlined inputs to match the design.

## Validation

- `validateAddress` and `validateCard` are pure functions in
  `@rocksa/domain`. They return a `Result` discriminated union.
- React Hook Form + Zod for the form layer.

## Payment

- Stripe Elements integration _is out of scope for the first cut_. Instead
  the payment step records intent only and the order is created in
  `pending_payment` status. A `// TODO(stripe)` marks the integration point.

## Acceptance

- Filling step 1 with valid data unlocks step 2.
- Refreshing mid-checkout restores form values from sessionStorage.
- Clicking "Complete Purchase" creates an Order row and routes to
  `/orders/$orderId`.
