# Job BOP Operation Status Translation

## Overview

Display labels for enums and constants in `apps/erp/app/modules/production/production.models.ts` are translated via hooks in `apps/erp/app/modules/production/productionLabels.ts`.

## Translated enums

| Constant | Hook |
|----------|------|
| `jobStatus` | `useJobStatusLabel()` |
| `jobOperationStatus` | `useJobOperationStatusLabel()` |
| `deadlineTypes` | `useDeadlineTypeLabel()` |
| `procedureStatus` | `useProcedureStatusLabel()` |
| `maintenanceDispatchPriority` | `useMaintenanceDispatchPriorityLabel()` |
| `maintenanceDispatchStatus` | `useMaintenanceDispatchStatusLabel()` |
| `maintenanceFrequency` | `useMaintenanceFrequencyLabel()` |
| `maintenanceSeverity` | `useMaintenanceSeverityLabel()` |
| `maintenanceSource` | `useMaintenanceSourceLabel()` |
| `oeeImpact` | `useOeeImpactLabel()` |
| `KPIs` | `useKpiLabel()`, `useKpiEmptyMessage()` |

`jobLabels.ts` re-exports job/deadline/operation hooks for backward compatibility.

## UI Components

Operation status labels:
- `JobOperationStatus.tsx`, `JobOperationsTable.tsx`, `ItemCard.tsx`

Procedure status:
- `ProcedureStatus.tsx`

Maintenance enums (resources module, same values as production.models):
- `MaintenanceStatus.tsx`, `MaintenancePriority.tsx`, `MaintenanceSource.tsx`, `MaintenanceSeverity.tsx`, `MaintenanceOeeImpact.tsx`
- `MaintenanceSchedulesTable.tsx`, `MaintenanceScheduleForm.tsx`, `MaintenanceDispatchForm.tsx`, `MaintenanceDispatchesTable.tsx`

## Related

- Production quantity/event labels: `productionQuantityLabels.ts` (`Production`, `Rework`, `Scrap`, `Inside`, `Outside`, etc.)
- Job-level status badge: `JobStatus.tsx` uses `useJobStatusLabel()`
- Production dashboard KPI labels are translated inline (same strings as `useKpiLabel()`)
