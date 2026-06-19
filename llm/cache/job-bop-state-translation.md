# Job BOP Operation Status Translation

## Overview

Job Bill of Process (BOP) operation statuses are defined in `apps/erp/app/modules/production/production.models.ts` as `jobOperationStatus`:

- Todo, Ready, Waiting, In Progress, Paused, Done, Canceled

## Translation

Operation status labels are translated via `useJobOperationStatusLabel()` in `apps/erp/app/modules/production/ui/Jobs/jobLabels.ts`, following the same pattern as `useJobStatusLabel()` for job-level statuses.

## UI Components

Components that display operation status labels:

- `JobOperationStatus.tsx` — status dropdown on BOP operations (icon button + menu)
- `JobOperationsTable.tsx` — operations table status dropdown
- `ItemCard.tsx` — Kanban card status text (alongside `JobOperationStatus` icon)

## Locale Catalog

Strings live in `packages/locale/locales/{locale}/erp.po`. Most statuses (Ready, In Progress, Paused, Done, Canceled) were already in the catalog; Todo and Waiting were added when operation status labels were wired to Lingui.

## Related

- Job-level status translation: `useJobStatusLabel()` in same file, used by `JobStatus.tsx`
- MES app still renders raw `operation.operationStatus` strings in some places (e.g. `OperationsList.tsx`)
