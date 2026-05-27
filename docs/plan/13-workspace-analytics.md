# Phase 13 — Workspace: Analytics & Document Vault

## Analytics (`/workspace/analytics`)

Matches "Performance Analytics":

- "Last 12 Months" pill (date-range picker).
- Four stat cards: Total Portfolio Value, Total Specimens, Average
  Acquisition Cost, Highest Valued Asset (violet card).
- Valuation Trajectory line chart (1Y / 3Y / All toggle).
- Asset Distribution donut/list panel.

Charts: use **Recharts** (small, functional API, plays well with React).

## Document Vault / Reports (`/workspace/reports`)

Matches "Document Vault":

- Three report-generator cards: Financial Valuation, Inventory Audit, Tax
  Compliance — each with description + "Generate Report" CTA.
- Scheduled Runs card with toggle ("Monthly Audit").
- Report Library list with PDF rows: name, date, size, download.

## Server-side

- Report generation is a job dispatched to a queue (out of scope for v1; a
  stub endpoint synchronously returns a fixture PDF).
- Scheduled runs persisted via cron-string in the `reports` table.

## Acceptance

- Chart renders against seeded valuation data.
- Generating a report enqueues a job and adds it to the library list.
