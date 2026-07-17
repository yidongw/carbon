# Style (款式) feature — garment work orders

Added in PR #194 (branch discord/configure-package-job-splitting-354641). A "Style" is a garment product master.

## Data model

A Style is an **`item` of `type = 'Style'`** (new enum value added in `20260706140833_style-foundation.sql`), plus a companion `style` row and an auto-created `makeMethod`.

Tables (migration `20260706140833_style-foundation.sql`):
- `item` — the actual product row (`type = 'Style'`). Carries name/description/revision/readableId/unitOfMeasureCode/etc.
- `style` — 1:1 companion (`itemId` unique FK → item). Columns: id, itemId, companyId, customFields, tags, audit. RLS gated on `parts_*` permissions.
- `styleColor` — company-scoped (or global when companyId NULL) color library: colorCode, colorName.
- `styleColorAssignment` — M:N style↔color (styleId, styleColorId, companyId).
- Sizes: added in `20260709184512_style-size.sql` (`styleSize`, `styleSizeAssignment`).
- `styles` VIEW (SECURITY_INVOKER) — read model joining latest item revision + colors + itemCost. **In-app reads should use this view.**

On `item` INSERT of type Part/Tool/**Style**, `sync_create_make_method_related_records` auto-inserts a `makeMethod` row.

## Processes / operations attached to a Style

There is **no `styleProcess`/`styleOperation` table.** A style's "processes/工序" are modeled through the standard manufacturing method chain:

`makeMethod` (per item) → `methodOperation` rows (each an ordered step) → each references a `process`.

- `process` table (`20240819115702_work-centers.sql`): id, name, defaultStandardFactor(factor), processType, tags, completeAllOnScan, customFields, companyId. Unique (name, companyId).
- `methodOperation` table (`20240619095417_methods.sql`): id, makeMethodId FK, order(double), operationOrder, workCellTypeId, processId, description, setup/labor/machine times, etc.

### Auto-scaffolded process
`apps/erp/app/modules/items/style.server.ts` → `ensureStyleMethodScaffoldWithDb()` only auto-creates **ONE** process: **"Cutting" / 裁剪** (tagged `STYLE_CUTTING_PROCESS_TAG`) and one seeded cutting `methodOperation` (tags `STYLE_CUTTING_OPERATION_TAG`, `STYLE_SYSTEM_OPERATION_TAG`, customFields `{styleStage:'cutting', styleSystemOwned:true}`). It creates a `process` named 'Cutting' with processType 'Inside', defaultStandardFactor 'Minutes/Piece' if none exists.

Tag constants live in `apps/erp/app/modules/items/items.models.ts` (imported by style.server.ts): `STYLE_CUTTING_PROCESS_TAG`, `STYLE_CUTTING_OPERATION_TAG`, `STYLE_SYSTEM_OPERATION_TAG`, `buildStyleCuttingMethodOperation`.

### Default garment processes 缝制 / 后道 / 包装 (PR #202, branch discord/create-style-with-three-processes-113282)
New styles now also auto-scaffold three default, **user-editable** (non-system) processes after Cutting: **缝制 (Sewing) / 后道 (Finishing) / 包装 (Packing)**, so a fresh style's Bill of Process is 裁剪 → 缝制 → 后道 → 包装.
- Shared constant `STYLE_DEFAULT_PROCESSES` + `buildStyleDefaultMethodOperation` in `styleMethod.service.ts`.
- Client path: `ensureStyleDefaultProcessOperations` (in `styleMethod.service.ts`), called by `ensureStyleMethodScaffold` (used by `items.service.ts` upsertStyle / MCP).
- Raw-SQL path: `seedStyleDefaultProcessOperationsWithDb` (in `style.server.ts`), called by `ensureStyleMethodScaffoldWithDb` (used by the `/x/style/new` route's `upsertStyle`).
- Idempotent: seeds only when the make method has **no user-owned** operations (system/cutting ops don't count), so it never re-adds user-curated processes. Each default is matched by name/aliases against existing `process` rows before creating one.

## Routes & files (apps/erp)

- Create route: `path.to.newStyle = /x/style/new` → `apps/erp/app/routes/x+/style+/new.tsx`
  - action validates `styleValidator`, calls `upsertStyle(client, {...})` (from `~/modules/items/style.server`), then redirects to `path.to.style(itemId)`.
- Style detail layout: `apps/erp/app/routes/x+/style+/$itemId.tsx`, `_layout.tsx`, tabs: `$itemId.details.tsx` (hosts `MakeMethod` + `BillOfProcess` operation editors), `.costing/.planning/.sales/.inventory`.
- Path builders (`apps/erp/app/utils/path.ts`): `style(id)`, `styleDetails(id)`, `styleRoot=/x/style`, `newStyle`.
- Validators: `apps/erp/app/modules/items/style.models.ts` (`styleValidator`, `styleSizeValidator`).
- Service: `apps/erp/app/modules/items/style.server.ts` (`upsertStyle`, `getStyle`, `ensureStyleMethodScaffoldWithDb`, `getStyleColorContext`).
- Form UI: `apps/erp/app/modules/items/ui/Styles/StyleForm.tsx` (+ StylesTable, StyleHeader, StyleProperties, navigation config).

### styleValidator (required fields)
```ts
// style.models.ts
styleValidator = applyStorageAndShelfLifeRefines(
  itemValidator.merge(z.object({
    id: z.string().min(1, "Style ID is required").max(255),
    revision: z.string().min(1, "Revision is required"),
    modelUploadId: zfd.text(z.string().optional()),
    thumbnailPath: zfd.text(z.string().optional()),
    lotSize: zfd.numeric(z.number().min(0).optional()),
    templateId: zfd.text(z.string().optional()),
  })));
```
`itemValidator` (merged) supplies name, description, itemTrackingType, replenishmentSystem, defaultMethodType, unitOfMeasureCode, active, etc. The new.tsx initialValues seed: replenishmentSystem 'Make', defaultMethodType 'Make to Order', itemTrackingType 'Inventory', unitOfMeasureCode 'EA', revision '0'.

new.tsx action also reads `styleColorIds[...]` and `styleSizeIds[...]` form entries.

### methodOperationValidator (adding a process/operation) — items.models.ts:423
Required: `id`, `makeMethodId`, `order`(numeric), `operationOrder`(enum), `operationType`(enum), **`processId` (min 1, "Process is required")**. Optional: workCenterId, description, setup/labor/machine unit+time, supplier/cost/leadtime fields. Inside operations require setup/labor units (refines).

## Create-via-API / seed
- **No dedicated carbon-key API endpoint** for creating a style or its processes. `/x/...` routes require a session (`requirePermissions`), and per MEMORY, hitting `/x` routes with carbon-key executes but 302→/login.
- Programmatic path = the two form-post routes:
  - Style: POST `/x/style/new` (styleValidator fields).
  - Each process/operation: POST `path.to.newMethodOperation = /x/items/methods/operation/new` → `operation.new.tsx` → `upsertMethodOperation` (needs makeMethodId + processId + order + operationOrder + operationType).
- To create a style with 缝制/后道/包装: create the style → resolve/create 3 `process` rows (by name) → insert 3 `methodOperation` rows on the makeMethod with ascending `order`, each with the matching processId. No single "3 processes" bulk mechanism exists yet.
