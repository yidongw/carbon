# Master Work Orders

Master WOs are Style cutting plans. Each has a **backing job** (`masterWorkOrder.jobId`). Inventory is received on **bundle (child) jobs**, not the master.

## Do not complete / receive master backing jobs

Master backing jobs must **not** go through JobCompleteModal / receive-to-inventory.

- **Helper:** `isMasterWorkOrderJob(client, jobId)` in `apps/erp/app/modules/production/masterWorkOrder.service.ts` — true when a `masterWorkOrder` row references the job.
- **List UI:** `MasterWorkOrdersTable` passes `disableComplete` to `JobStatusMenu` (hides Complete + skips modal).
- **Job detail:** `$jobId` loader sets `isMasterWorkOrder`; `JobHeader` hides Complete and does not mount `JobCompleteModal` when true.
- **Action guard:** `x+/job+/$jobId.complete.tsx` rejects masters (flash + redirect) if POSTed anyway.
- **Modal defense:** if `JobCompleteModal` loads a master job, it shows an explanation and Close only (no receive form).

## Receive modal (non-master jobs)

- Title uses the item readable ID (`itemReadableIdWithRevision` / `readableIdWithRevision`), not `job.jobId`: `Receive ${itemReadableId} to Inventory`.
- Quantity preview / default `quantityComplete` uses `job.productionQuantity` (falls back to `job.quantity`).
