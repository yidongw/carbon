# Production Pickups and Quantities Routes

## Overview

Two new top-level routes for managing production pickups (生产取料) and production quantities (生产交货) independently from job detail pages.

## Routes

### Production Pickups

- **List Route**: `/x/production/pickups`
  - File: `apps/erp/app/routes/x+/production+/pickups.tsx`
  - Shows table of all job operation pickups
  - Uses `getJobOperationPickups()` service function
  - Table component: `PickupsTable` from `~/modules/production/ui/Pickups`

- **New Pickup Route**: `/x/production/pickups/new`
  - File: `apps/erp/app/routes/x+/production+/pickups.new.tsx`
  - Drawer form with job selector → operation selector → actor fields → quantity
  - Uses query params `?jobId=...&jobOperationId=...` to reload form when job/operation changes
  - Form component: `PickupForm` from `~/modules/production/ui/Pickups`
  - Validates via `jobOperationPickupValidator`
  - Action calls `upsertJobOperationPickup()` or `upsertJobOperationSupplierPickup()` based on actorKind

### Production Quantities

- **List Route**: `/x/production/quantities`
  - File: `apps/erp/app/routes/x+/production+/quantities.tsx`
  - Shows table of all production quantity reports
  - Queries `productionQuantityReport` table directly with joins to job/employee
  - Table component: `ProductionQuantitiesTable` from `~/modules/production/ui/ProductionQuantities`

- **New Quantity Route**: `/x/production/quantities/new`
  - File: `apps/erp/app/routes/x+/production+/quantities.new.tsx`
  - Drawer form with job selector → operation selector → actor fields → quantity lines editor
  - Uses query params `?jobId=...&jobOperationId=...` to reload form when job/operation changes
  - Form component: `ProductionQuantityForm` from `~/modules/production/ui/ProductionQuantities`
  - Validates via `productionQuantityCreateFormValidator`
  - Action calls `createProductionQuantityReport()` or `createJobOperationSupplierQuantityReport()` based on actorKind

## Components

### Pickups

- **PickupsTable** (`apps/erp/app/modules/production/ui/Pickups/PickupsTable.tsx`)
  - Displays job, operation, employee, quantity, notes, createdAt
  - "New Pickup" button opens drawer form

- **PickupForm** (`apps/erp/app/modules/production/ui/Pickups/PickupForm.tsx`)
  - Job selector (loads operations when selected)
  - Operation selector (disabled until job selected)
  - ProductionActorFields (employee vs supplier)
  - Quantity input (supports config table if item has configuration parameters)
  - Notes textarea
  - When job changes, updates `?jobId=...` URL param to trigger loader reload

### Production Quantities

- **ProductionQuantitiesTable** (`apps/erp/app/modules/production/ui/ProductionQuantities/ProductionQuantitiesTable.tsx`)
  - Displays job, operation, employee, quantity, notes, createdAt
  - "New Production Quantity" button opens drawer form

- **ProductionQuantityForm** (`apps/erp/app/modules/production/ui/ProductionQuantities/ProductionQuantityForm.tsx`)
  - Job selector (loads operations when selected)
  - Operation selector (disabled until job selected)
  - ProductionActorFields (employee vs supplier)
  - SupplierSubcontractPricingFields (shown when actorKind=supplier)
  - ProductionQuantityLinesEditor (supports Production/Scrap/Rework lines)
  - Notes textarea
  - When job changes, updates `?jobId=...` URL param to trigger loader reload

## Path Definitions

Added to `apps/erp/app/utils/path.ts`:
- `pickups: ${x}/production/pickups`
- `newPickup: ${x}/production/pickups/new`
- `productionQuantities: ${x}/production/quantities`
- `newProductionQuantity: ${x}/production/quantities/new`

## Form Flow

Both forms follow the same pattern:
1. User opens form (shows all jobs in dropdown)
2. User selects a job
3. Form updates URL `?jobId=XXX` and reloads
4. Loader fetches operations for that job
5. User selects an operation
6. Form shows actor fields, quantity inputs, and notes
7. User fills and submits
8. Action validates and creates pickup/quantity record
9. Redirects back to list view

## Service Functions Used

### Pickups
- `getJobs()` - fetch job list for selector
- `getJob()` - fetch single job details
- `getJobOperations()` - fetch operations for selected job
- `getJobOperationActorContext()` - get actor defaults for operation
- `getJobOperationPickups()` - fetch all pickups for table
- `upsertJobOperationPickup()` - create/update employee pickup
- `upsertJobOperationSupplierPickup()` - create/update supplier pickup
- `validateActorMatchesOperationSupplierRouting()` - validate supplier routing

### Production Quantities
- `getJobs()` - fetch job list for selector
- `getJob()` - fetch single job details
- `getJobOperations()` - fetch operations for selected job
- `getJobOperationActorContext()` - get actor defaults for operation
- Direct query to `productionQuantityReport` table for list
- `createProductionQuantityReport()` - create employee quantity report
- `createJobOperationSupplierQuantityReport()` - create supplier quantity report
- `validateActorMatchesOperationSupplierRouting()` - validate supplier routing

## Data Models

### Job Operation Pickup
- `jobOperationPickupValidator` from `production.models.ts`
- Fields: `id?`, `jobOperationId`, `actorKind`, `employeeId?`, `supplierProcessId?`, `quantity`, `configuration?`, `notes?`

### Production Quantity Report
- `productionQuantityCreateFormValidator` from `production.models.ts`
- Fields: `jobOperationId`, `actorKind`, `employeeId?`, `supplierProcessId?`, `operationUnitCost?`, `operationMinimumCost?`, `snapshotPricingEdited?`, `notes?`, `lines` (JSON array)
- Lines use `productionQuantityLineJsonValidator` with fields: `type` (Production/Scrap/Rework), `quantity`, `configuration?`, `scrapReasonId?`
