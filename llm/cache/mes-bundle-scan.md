# MES bundle scan: pickup vs report

Garment bundle QR tickets are scanned in the MES from two entry points that
share `BundleScanPage` (`apps/mes/app/components/BundleScanPage.tsx`):

- `x+/pickup.tsx` → `intent="pickup"` — title "Pickup Bundle Job"
- `x+/report.tsx` → `intent="report"` — title "Report Quantities"

Both are reachable as **home cards** (`x+/_index.tsx`) and **sidebar links**
(`AppSidebar.tsx`). Each scans (or manual-selects a released bundle) and
navigates to `x+/bundle.$bundleWorkOrderId.tsx?intent=<pickup|report>`.

## bundle.$bundleWorkOrderId.tsx — mostly a redirector now

Reporting and pickup happen on the **operation page** via URL overlays, NOT on
this bundle page. The loader reads `intent`, finds the current operation
(`findCurrentOperation`), and **redirects**:

- **intent=report** + open op → `operation(cur.id)?record=complete` → opens the
  record-quantity overlay (`JobOperation/components/ReportQuantityModal.tsx`):
  employee picker (defaults to the assignee) + Finished / Rework / Scrap split;
  action = `x+/report-quantity.tsx`.
- **intent=pickup** + open op **not** assigned to this worker →
  `operation(cur.id)?pickup=confirm` → `ConfirmPickupModal.tsx` (Pick up / Take
  over); action = `x+/pickup-operation.tsx`.
- **intent=pickup** + op **already assigned to this worker** → falls through to
  render this page's `mine` state ("You've already picked up this bundle." +
  report / open-operation buttons).

Pickup does **not** auto-start the clock — `pickup-operation.tsx` /
`assignBundleOperation` only assigns; take-over first ends the previous
assignee's events (`endProductionEventsForJobOperation`). The worker starts
their own production event when they actually begin.

## The landing page (fallback render + mine state)

When not redirected, the page shows an `info` card (quantity, current process,
work center, assignee/Unassigned, produced/target, rework, scrap, status —
assignee resolved from `employees`, work center from `workCenter`) plus a report
history, and one of the states `completed | unassigned | mine | other`:
- `unassigned` → Pick up button; `other` → Take over (names the assignee when
  known). Both POST to this route's action (`intent=pickup|takeover`), which
  assigns and redirects to the operation page.
- `completed` → "no open operation" panel; `mine` → already-picked-up panel.

## Related

- Operation-page overlays: `ReportQuantityModal` (`?record=complete`),
  `ConfirmPickupModal` (`?pickup=confirm`), `MarkReworkFixedModal` (managers move
  rework back to production).
- The pickup/report loaders filter released bundles to non-null `id` so they
  satisfy `ReleasedBundle`.
- `insertScrapQuantity` (operations.service.ts) takes an optional `scrapReasonId`
  (null for these quick floor reports; the ERP scrap form still requires one).
