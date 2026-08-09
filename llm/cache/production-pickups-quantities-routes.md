# Production Quantities Routes

## Overview

Top-level route for managing production quantities (生产交货) independently from
job detail pages.

> **Process Pickups removed.** The former process-pickups feature (the
> `/x/production/pickups` + `/x/job/$id/pickups` pages, the "Production Logs" tab
> in the job Bill of Process, the MES "Record Pickup" flow, and all
> `jobOperationPickup` service/validator/type/overlay code) was deleted to match
> upstream `main`. Production quantities / completions are unaffected.

## Routes

### Production Quantities

- **List Route**: `/x/production/quantities`
  - File: `apps/erp/app/routes/x+/production+/quantities.tsx`
  - Shows table of all production quantity reports
  - Queries `productionQuantityReport` table directly with joins to job/employee
  - Table component: `ProductionQuantitiesTable`

- **New Quantity Route**: `/x/production/quantities/new`
  - File: `apps/erp/app/routes/x+/production+/quantities.new.tsx`
  - Drawer form with job selector → operation selector → actor fields → quantity lines editor
  - Uses query params `?jobId=...&jobOperationId=...` to reload form when job/operation changes
  - Form component: `ProductionQuantityForm`
  - Validates via `productionQuantityCreateFormValidator`
  - Action calls `createProductionQuantityReport()` or `createJobOperationSupplierQuantityReport()` based on actorKind

## Path Definitions

In `apps/erp/app/utils/path.ts`:
- `productionQuantities: ${x}/production/quantities`
- `newProductionQuantity: ${x}/production/quantities/new`

## Service Functions Used

- `getJobs()` - fetch job list for selector
- `getJob()` - fetch single job details
- `getJobOperations()` - fetch operations for selected job
- `getJobOperationActorContext()` - get actor defaults for operation
- Direct query to `productionQuantityReport` table for list
- `createProductionQuantityReport()` - create employee quantity report
- `createJobOperationSupplierQuantityReport()` - create supplier quantity report
- `validateActorMatchesOperationSupplierRouting()` - validate supplier routing

## Job quantity report overlays (Style config editor gate)

Job-scoped qty report routes (`apps/erp/app/routes/x+/job+/$jobId.quantities.new.tsx`, `.$id.tsx`) gate the Style config editor on whether `getJobVariantQuantities` returns rows — **not** on raw `job.configuration.variantTable`. Dual-read in `getJobVariantQuantities` covers legacy jobs that still only have a configTable. Details: `style-sizes-ordering.md` § Jobs / Master WO — `jobVariantQuantity`.

## Data Models

### Production Quantity Report
- `productionQuantityCreateFormValidator` from `production.models.ts`
- Fields: `jobOperationId`, `actorKind`, `employeeId?`, `supplierProcessId?`, `operationUnitCost?`, `operationMinimumCost?`, `snapshotPricingEdited?`, `notes?`, `lines` (JSON array)
- Lines use `productionQuantityLineJsonValidator` with fields: `type` (Production/Scrap/Rework), `quantity`, `variantQuantities?`, `scrapReasonId?`

## Style/variants-quantity column rename

`productionQuantity`, `jobOperationPickup`, `jobOperationSupplierPickup`, and
`jobOperationSupplierQuantity` store Style combo qty under **`variantQuantities`**
(not `configuration`). FormData / overlay props for Style qty grids use
`variantQuantities`; Part method flat params still use `job.configuration` /
FormData `configuration`. Overlay reference source uses
`reportedVariantQuantities` (formerly `reportedConfigurations`).

Operation quantity summary stores Style grids as `productionVariantQuantities` / `scrapVariantQuantities` / `reworkVariantQuantities` (not `*Configurations`).
