# Master Work Orders

Master WOs are Style cutting plans. Each has a **backing job** (`masterWorkOrder.jobId`). Inventory is received on **bundle (child) jobs**, not the master.

## Do not complete / receive master backing jobs

Master backing jobs must **not** go through JobCompleteModal / receive-to-inventory.

- **Helper:** `isMasterWorkOrderJob(client, jobId)` in `apps/erp/app/modules/production/masterWorkOrder.service.ts` — true when a `masterWorkOrder` row references the job.
- **List UI:** `MasterWorkOrdersTable` passes `disableComplete` to `JobStatusMenu` (hides Complete + skips modal).
- **Job detail:** `$jobId` loader sets `isMasterWorkOrder`; `JobHeader` hides Complete and does not mount `JobCompleteModal` when true.
- **Action guard:** `x+/job+/$jobId.complete.tsx` rejects masters (flash + redirect) if POSTed anyway.
- **Modal defense:** if `JobCompleteModal` loads a master job, it shows an explanation and Close only (no receive form).
- **Auto-complete status only:** when every sibling bundle job is `Completed` and cut qty covers the master target, `auto_complete_master_work_order` flips the master job to `Completed` with **no** ledger/receipt.

## Bundle MES completion → inventory (yes)

Reporting the **last** operation on a bundle to Done in MES (`report-quantity` → `finishJobOperation`) runs `sync_finish_job_operation` → `complete_job_to_inventory`. That posts inventory for the bundle job's **variant SKU** `itemId` (not the Style parent). Requires the bundle to actually have downstream ops (Style BOP copied via `resolveStyleMethodItemId`); an empty BOP never finishes and never receives.

## Receive modal (non-master jobs)

- Title uses the item readable ID (`itemReadableIdWithRevision` / `readableIdWithRevision`), not `job.jobId`: `Receive ${itemReadableId} to Inventory`.
- Quantity preview / default `quantityComplete` uses `job.productionQuantity` (falls back to `job.quantity`).

## Split rows / Style qty source

- Master backing-job Style planned qty uses `jobVariantQuantity` (same as other Style jobs) — see `style-sizes-ordering.md`.
- `masterWorkOrderSplitRow.colorCode` / `sizeCode` columns are **dropped** (`2026080808143927_drop_master_split_row_color_size.sql` + `NOTIFY pgrst, 'reload schema'`); generated DB/edge types no longer include them. Attribute identity comes from variant `valuesKey` / attribute maps, not color/size columns on the split row.
- `masterWorkOrder.colorSize` JSONB is **dropped** (`20260809011753_drop_obsolete_size_color_props.sql`); create inserts without it.

## Style variant jobs must copy parent Style BOP

Bundle (and any other) jobs keyed by variant SKU have no make method. `insertJob` / `upsertJobMethod` / `get-method` resolve `itemVariant.parentItemId` (`resolveStyleMethodItemId`). After Get Method on an existing master/bundle backing job, `applyGarmentJobOperationFilter` re-strips by routing every op/material to one "home" (`classifyGarmentJobItems`, PR #367): **master = cutting + upstream prep** (cutting, plus any fabric-prep op/material produced before cutting consumes it — e.g. a nested sub-assembly 印染/dyeing op re-sequenced ahead of cutting); **bundle = downstream** (sewing/finishing; cutting dropped). So the master job is **not** "cutting only" — it can carry pre-cut prep operations, which run before cutting.

## Cutting op detection on the master job

Because nested prep (dyeing) can be re-sequenced ahead of cutting, "the cutting op" is the **style-tagged** op (`isStyleCuttingOperation`), else the first **root-method** op — nested sub-assembly ops are excluded so a prep op can't masquerade as cutting. Shared by `getMasterCuttingOperationId`, `getMasterProcessBreakdown`, and `getMasterCuttingProgress` (all filter out `jobMakeMethod.parentMaterialId != null` ops).
