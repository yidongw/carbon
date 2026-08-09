# Style Sizes Ordering

Apparel **sizes** must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by code (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- Canonical order: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts` (`sortOrder` = array index). Seeded into garment `itemAttributeValue` (Size); system Size rows have `companyId NULL`.
- Size pickers / lists order by `sortOrder`, then code.

When adding a new size read/display, order by `sortOrder`, not code.

## Style pickers = itemAttributeValue ids (catalog only)

**Source:** `getGarmentAttributeValueList` (`itemAttribute.service.ts`) — Color/Size `itemAttributeValue` rows for **catalog localization / samples / color-name maps**. Style **assign UI** uses the generic attribute set editor.

**Style edit (attributes-only):** `ItemAttributeEditor` + `style/$itemId/attributes` → `syncItemVariantsFromSelections`. Qty editor params are a single combo list (`valuesKey` options = cartesian of selected attribute values via `getStyleVariantQuantityParameters`). Editor submit shape for Style qty is still `{ valuesKey, Quantities, label? }`, but **jobs persist that table into `jobVariantQuantity`** (via `persistStyleJobConfiguration` / `replaceJobVariantQuantities`), not as `job.configuration.variantTable`. Legacy Color×Size matrices are dual-read on expand when jvq is empty.

## Consumable Fabric / Trim variants

**Create form** (`ConsumableForm` + `consumable+/new`): loads set form options via `api+/items.attribute-sets-for-type?itemType=Consumable`. Shows set picker when >1 set; MultiSelects per set attribute (`av__<attributeId>`). On save with selections: `syncItemVariantsFromSelections`.

**Edit:** properties sidebar `ConsumableAttributeEditor` → POST `consumable/$itemId/attributes` → `syncItemVariantsFromSelections`.

**Lists:** Styles / Samples / Consumables / Bundle WO tables show **per-attribute columns** from `attributes` JSON (not Color/Size hardcoding). Samples chips group by **product attribute codes only** (Receipt/Shipment system keys stripped in `styleSamples` view).

## Style qty matrix / variants

**Read:** `getConfigurationParameters` for Style synthesizes a `valuesKey` list param (not separate Color/Size matrix columns). Legacy Color×Size `job.configuration` matrices are dual-read into combo rows via `variantsQuantityToComboRows` (job qty editor, production qty splitMode, cutting proposal). Legacy `configurationParameter` rows on Styles are ignored.

**Configurable itemIds (qty grid):** `api+/items.configurable.ts` returns attribute-selection itemIds only. Legacy `configurationParameter` items use `?for=methods` (Make Method tools). Job/MWO Quantity no longer opens from old Part config params or `requiresConfiguration`.

Variant SKUs: `valuesKey` = sorted `code|code|…` — see `inventory-system.md` § Style variant SKUs.

**Bundle WO:** view exposes `valuesKey`, `attributeLabel`, `attributeValues` (table no longer has colorCode/sizeCode). Labels come from the variant’s attribute map.

**Jobs / Master WO — `jobVariantQuantity`:** Style planned qty lives in `jobVariantQuantity(jobId, variantItemId, quantity)`, not in `job.configuration.variantTable`.

- **Write (`replaceJobVariantQuantities`):** Kysely transaction via `getDatabaseClient()` (bypasses RLS; auth at the route): delete existing jvq rows for the job → insert new rows → sync `job.quantity` → optional `jobConfigurationHistory` → optional clear `job.configuration`. Service: `apps/erp/app/modules/production/jobVariantQuantity.service.ts`.
- **Read (`getJobVariantQuantities`):** dual-read — if no jvq rows, expand legacy non-empty `job.configuration.variantTable` via `expandVariantsQuantityTable`.
- **Style writers must not store variantTable on `job.configuration`:** `$jobId.configure.tsx` and `job+/update.tsx` route Style variantTable through `persistStyleJobConfiguration` (writes jvq + clears Style qty JSON from `job.configuration`). Part flat method params still use `jobConfigurationUpdateFields`.
- **`job.configuration`:** Part method params only (flat JSON). Create-job Part Configure wizard restored. Qty grid = attribute selections only.
- **Qty report loaders** (`$jobId.quantities.new` / `.$id`): gate the config editor on `getJobVariantQuantities` length, not raw `variantTable`.
- **RLS:** `jobVariantQuantity` DELETE policy uses `production_update` (migration `20260808144712_job-variant-quantity-rls-update-delete.sql`; also fixed in original create migration `20260808060640_job-variant-quantity.sql` for fresh installs). Both drop + RLS migrations `NOTIFY pgrst, 'reload schema'`.
- **`masterWorkOrderSplitRow`:** `colorCode` / `sizeCode` columns dropped (`2026080808143927_drop_master_split_row_color_size.sql`); generated types cleaned.
- **Out of scope (intentional):** SO/PO still expand Style `configuration.variantTable` to per-variant order lines — see `inventory-system.md`.

**MES:** bundle pickup/report/print use `attributeLabel` / `valuesKey` (not colorCode/sizeCode).
