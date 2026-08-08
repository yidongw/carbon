# Style Sizes Ordering

Apparel **sizes** must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by code (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- Canonical order: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts` (`sortOrder` = array index). Seeded into garment `itemAttributeValue` (Size); system Size rows have `companyId NULL`.
- Size pickers / lists order by `sortOrder`, then code.

When adding a new size read/display, order by `sortOrder`, not code.

## Style pickers = itemAttributeValue ids (catalog only)

**Source:** `getGarmentAttributeValueList` (`itemAttribute.service.ts`) — Color/Size `itemAttributeValue` rows for **catalog localization / samples / color-name maps**. Style **assign UI** uses the generic attribute set editor.

**Style edit (attributes-only):** `ItemAttributeEditor` + `style/$itemId/attributes` → `syncItemVariantsFromSelections`. Qty editor params are a single combo list (`valuesKey` options = cartesian of selected attribute values via `getStyleConfigurationParametersFromAttributes`). Stored job config shape: `{ valuesKey, Quantities, label? }` with `configTablePrimaryKeys: ["Quantities"]`. Legacy Color×Size matrices are still dual-read on expand.

## Consumable Fabric / Trim variants

**Create form** (`ConsumableForm` + `consumable+/new`): loads set form options via `api+/items.attribute-sets-for-type?itemType=Consumable`. Shows set picker when >1 set; MultiSelects per set attribute (`av__<attributeId>`). On save with selections: `syncItemVariantsFromSelections`.

**Edit:** properties sidebar `ConsumableAttributeEditor` → POST `consumable/$itemId/attributes` → `syncItemVariantsFromSelections`.

**Lists:** Styles / Samples / Consumables / Bundle WO tables show **per-attribute columns** from `attributes` JSON (not Color/Size hardcoding). Samples chips group by **product attribute codes only** (Receipt/Shipment system keys stripped in `styleSamples` view).

## Style qty matrix / variants

**Read:** `getConfigurationParameters` for Style synthesizes a `valuesKey` list param (not separate Color/Size matrix columns). Legacy Color×Size `job.configuration` matrices are dual-read into combo rows via `configTableToComboRows` (job qty editor, production qty splitMode, cutting proposal). Legacy `configurationParameter` rows on Styles are ignored.

**Configurable itemIds:** `api+/items.configurable.ts` unions parameter itemIds with attribute-selection itemIds.

Variant SKUs: `valuesKey` = sorted `code|code|…` — see `inventory-system.md` § Style variant SKUs.

**Bundle WO:** view exposes `valuesKey`, `attributeLabel`, `attributeValues` (table no longer has colorCode/sizeCode). Labels come from the variant’s attribute map.

**Jobs / Master WO:** qty stored on backing `job.configuration` JSON. Split Batch / cutting split rows persist `masterWorkOrderSplitRow.valuesKey` (colorCode/sizeCode dual-written for garment 2-attr only).

**MES:** bundle pickup/report/print use `attributeLabel` / `valuesKey` (not colorCode/sizeCode).
