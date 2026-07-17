# MES Report Approvals page (报工审批)

## Overview

MES page where managers approve/disapprove reported production quantities that
are awaiting payroll (pending). Added in PR #204.

- **Route**: `/x/production-reports`
  - File: `apps/mes/app/routes/x+/production-reports.tsx`
  - `path.to.productionReports` (`apps/mes/app/utils/path.ts`)
  - Sidebar entry "Report Approvals" (`LuBadgeCheck`) in `AppSidebar.tsx`
    (`OperationsNav`, after Jobs).

## Access

- Loader calls `requirePermissions(request, {})` for `companyId`, then a
  try/catch `requirePermissions(request, { update: "production" })` to derive
  `canApprove`. Workers see the list read-only (no Actions column); the action
  rejects them (requirePermissions throws → redirect to login).

## Data / services (`apps/mes/app/services/operations.service.ts`)

- `getPendingProductionQuantities(client, companyId)` — reads `productionQuantity`
  where `type = 'Production'`, `paymentYear IS NULL`, `invalidatedAt IS NULL`,
  embedding `jobOperation!inner(... process, job → item)`. Uses `(client as any)`.
- `approveProductionQuantity(client, {id, companyId, year, month, userId})` —
  stamps `paymentYear/paymentMonth` (guarded by paymentYear/invalidatedAt null).
- `invalidateProductionQuantity(client, {id, companyId, userId, quantity?})` —
  sets `invalidatedAt/invalidatedBy`; optional `quantity` corrects the recorded
  figure (the quantity trigger keeps the operation total in sync).

## UI behavior

- **Filter** = ERP-style: `Filter` + `SearchFilter` from `~/components/Filter`,
  columns Employee (`employeeId`) + Process (`process`). Filtering is
  **client-side** in the component (parses `search` + `filter` URL params);
  employee names come from `usePeople()`.
- **Approve / Disapprove** each open a confirmation `Modal` (`ApprovalModal`),
  not inline actions. Quantity is plain text in the table (no editable input).
- The **Disapprove** modal holds the only quantity field: the manager can correct
  the recorded quantity, then it invalidates via `invalidateProductionQuantity`.
- Action `intent` values: `"approve"` and `"disapprove"`.

Note: MES app diverges from the source feature branch — `_index.tsx` just
redirects to operations (no home cards), and there is no ERP MES-settings
section-toggle file, so only the sidebar was wired.
