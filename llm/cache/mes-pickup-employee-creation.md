# Pickup employee creation (ERP)

## Flow
- Pickup recording uses `PickupForm` (drawer/overlay) with `ProductionActorFields` for employee/supplier selection
- Routes: `apps/erp/app/routes/x+/job+/$jobId.pickups.new.tsx`, overlay via `overlay.to.newJobPickup()`
- Overlay registry: `apps/erp/app/components/Overlay/overlay.registry.tsx` → `newJobPickup`

## Create employee from pickup
- **Fixed (PR #85):** `ProductionActorFields` opens `CreateEmployeeModal` with `type="modal"` inline (same pattern as `SupplierProcessForm`)
- Do **not** `navigate(path.to.newEmployee)` from pickup — that leaves the user on the employee page after creation
- Modal action: `apps/erp/app/routes/x+/people+/employees.new.tsx` returns `{ success, userId }` when `type=modal` in form data
- On success, `applySelection(encodeActorSelection("employee", userId))` auto-selects the new employee

## Related files
- `apps/erp/app/modules/production/ui/Jobs/ProductionActorFields.tsx`
- `apps/erp/app/modules/production/ui/Jobs/PickupForm.tsx`
- `apps/erp/app/modules/users/ui/Employees/CreateEmployeeModal.tsx`
- `apps/mes/app/components/JobOperation/components/PickupModal.tsx` (MES — uses current user, no employee picker)
