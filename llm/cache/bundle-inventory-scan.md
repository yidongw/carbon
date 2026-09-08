# Bundle Inventory Scan (scan-based in/out ledger)

The first **reader** of the per-garment RFID code (`garmentRfidCode.code`, minted +
printed as a 1D Code128 care label — see `printing-system.md`). A warehouse worker
scans any ONE garment's barcode; it resolves to that garment's **bundle work order**
and logs one **whole-bundle** IN/OUT movement. Standalone operational ledger ("台账")
— **NOT** wired to the core `itemLedger` (no cost/stock posting). Per-piece movement
and real inventory posting are explicitly deferred (v2).

## Table
`bundleInventoryMovement` (migration `20260907142853_bundle-inventory-movement.sql`):
`id(id('bim'))`, `bundleWorkOrderId` (FK→bundleWorkOrder, cascade), `direction` TEXT
CHECK In/Out, `quantity` INT, `scannedCode` TEXT (the actual piece code scanned),
company + audit + customFields/tags. RLS: SELECT = employee role;
INSERT/UPDATE/DELETE = `inventory_*` (the table first shipped with `production_*`,
switched by follow-up migration `20260907151824_bundle-inventory-movement-inventory-perms.sql`
when the feature moved to the Inventory module). Type hand-added to
`packages/database/src/types.ts` (DB not rebuilt in-branch).

## Service — `apps/erp/app/modules/production/bundleInventoryMovement.service.ts`
- `getBundleByGarmentCode(client, code, companyId)` — the resolver: `garmentRfidCode`
  by (companyId, code) → `bundleWorkOrders` view summary (styleReadableId,
  jobReadableId, quantity, attributeLabel, status). Returns `{scannedCode, bundle}` or
  `data:null` (no error) when not found.
- `recordBundleInventoryMovement(client, {...})` — insert one movement.
- `getBundleInventoryMovements(client, bundleWorkOrderId, companyId)` — per-bundle history.
- `getRecentBundleInventoryMovements(client, companyId, limit)` — scan page recent list.
Re-exported via `~/modules/production` barrel (`index.ts`).

## UI
- **Scan page** `apps/erp/app/routes/x+/inventory+/bundle-inventory.tsx`
  (`path.to.bundleInventoryScan` = `/x/inventory/bundle-inventory`). Lives under the
  **Inventory** module (it's an in/out action), gated `view`/`create: "inventory"`.
  Loader reads
  `?direction=In|Out&code=` → resolves + recent list. `ToggleGroup` In/Out (drives
  searchParams). Autofocused `<Input>` in a `method="get"` `<Form>` (1D gun types code
  + Enter submits → loader lookup); `key={location.key}` remounts it empty each nav.
  Resolved bundle card → `method="post"` `<Form>` (hidden bundleWorkOrderId/direction/
  quantity/scannedCode) → action inserts, `throw redirect(back, flash(success))`,
  refocus. Nav entry "Bundle Scan" (`LuScanBarcode`) under **Inventory/Manage** in
  `useInventorySubmodules.tsx` (alongside Receipts/Shipments/Transfers).
- **Per-bundle history tab** `x+/bundle-work-order+/$bundleWorkOrderId.inventory.tsx`
  (`path.to.bundleWorkOrderInventory(id)`), link added to `BundleWorkOrderHeader`
  links array (after "RFID Codes"). Renders shared
  `BundleInventoryMovementsTable` (Direction badge In=green/Out=yellow, Quantity,
  Scanned Code, Recorded At).

## Bundle Count (扫码按扎盘点 → writes REAL inventory)

Separate from the scan-in/out ledger above: a **physical count** that overwrites
system on-hand. `apps/erp/app/routes/x+/inventory+/bundle-count.tsx`
(`path.to.bundleCount` = `/x/inventory/bundle-count`), nav "Bundle Count"
(`LuClipboardCheck`) under Inventory/Manage. Gated `view`/`create: "inventory"`.

- Single route does everything: loader resolves `?code=` via `getBundleByGarmentCode`
  (extended to also select `itemId, locationId`) for scan lookups (hit by a
  `useFetcher`), else computes a default location (URL → `getUserDefaults` →
  `getLocationsList[0]`). Action handles `intent=review` (fetch `getItemQuantities`
  on-hand per counted item at location) and `intent=commit`.
- Client session (React state, keyed by bundleId, deduped) accumulates scans; a
  garment's whole `quantity` counts toward its variant SKU `itemId` ("按扎"). Tally
  groups by item. `useSubmit` posts review/commit (no reliance on Button name/value).
- **Commit writes real stock** via `insertManualInventoryAdjustment` (from
  `~/modules/inventory`) with `adjustmentType: "Set Quantity"`, `quantity: counted`,
  per item+location → one Positive/Negative Adjmt. `itemLedger` row (the
  `update_item_inventory_from_item_ledger_trigger` recomputes on-hand). No cost
  ledger, no Kysely txn, no rule-eval — deliberately just the SKU adjustment.
- **Safety:** only SCANNED items are overwritten; un-scanned stock is left unchanged
  (no auto-zero) — avoids wiping stock you didn't count. Review shows 账面(system) vs
  实盘(counted) vs diff before commit.
- Location picker: native `<select>` fed by `useLocations()` (from
  `~/components/Form/Location`). Finished garments only (need RFID code).

## Scope / gotchas
- Quantity = the bundle's full `quantity` at confirm time (whole-bundle only; no
  partial). Scanning one piece records the whole bundle.
- No `itemLedger`/cost posting, no per-piece granularity, no location field (v1).
- Scan page gated `view`/`create: "inventory"`, matching RLS. The per-bundle history
  tab stays under the bundle work order (production context) — its SELECT works via
  the employee-role read policy.
