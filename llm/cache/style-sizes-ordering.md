# Style Sizes Ordering

Apparel **sizes** must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by code (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- Canonical order: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts` (`sortOrder` = array index). Seeded into garment `itemAttributeValue` (Size); system Size rows have `companyId NULL`.
- Size pickers / lists order by `sortOrder`, then code.

When adding a new size read/display, order by `sortOrder`, not code.

## Style pickers = itemAttributeValue ids (catalog only)

**Source:** `getGarmentAttributeValueList` (`itemAttribute.service.ts`) — Color/Size `itemAttributeValue` rows for **catalog localization / samples / color-name maps**. Style **assign UI** no longer uses these wrappers.

**Style edit (attributes-only):** `ItemAttributeEditor` + `style/$itemId/attributes` → `syncItemVariantsFromSelections`. Config params synthesized from the item’s attribute set + selections (`getStyleConfigurationParametersFromAttributes`); expand matches `valuesKey`.

**Still Color/Size-shaped leftovers (shrinking):**
- Bundle WO DB columns `colorCode`/`sizeCode` still exist (nullable) but inserts write null; labels use child item.
- Migration `20260807204827_styles_and_inventory_attributes_generic.sql` replaces `styles.colors/sizes` with `attributes` JSON and inventory RPCs without `iat_color`/`iat_size` joins — apply on preview/prod DB.
- Samples create form is attribute-selection based.



## Consumable Fabric / Trim variants

**Create form** (`ConsumableForm` + `consumable+/new`): loads set form options via `api+/items.attribute-sets-for-type?itemType=Consumable` (page + modal). Shows set picker when >1 set; MultiSelects per set attribute (`av__<attributeId>`). On save with selections: `syncItemVariantsFromSelections` → `itemAttributeSelection` + child variant SKUs (`syncItemVariants`). Generic helpers also: `getAttributeSetFormOptionsForItemType`, `getAttributeValueOptions`, `syncItemAttributeSelections`.

**Edit:** properties sidebar `ConsumableAttributeEditor` → POST `consumable/$itemId/attributes` → `syncItemVariantsFromSelections`. Loader: `getItemAttributeSelectionsForItem`.

**Variant lifecycle:** `syncItemVariants` soft-deactivates (`item.active=false`) SKUs whose `valuesKey` is no longer selected; reactivates when selections grow again. `resolveVariantByValuesKey(parent, valuesKey)` resolves any set order (Style `resolveVariantItemId` wraps color|size).

**Lists:** `consumables` view excludes variant children (`20260806162513`). Inventory RPC excludes children and rolls qty onto parents (`20260806162447`). SKU breakdown uses `get_inventory_quantities_for_items` (`20260806163128`) via `getItemVariantQuantities` (Style + Consumable inventory tabs).

## Styles view (migration `20260806150151`)

`styles.colors` / `styles.sizes` json: **`id` = `itemAttributeValue.id`**, plus code/name fields; ordered by `iav.sortOrder`, `iav.code`.

## Style qty matrix / variants

**New Styles** write attribute selections + variant SKUs (`syncStyleVariantsFromAssignments`) only.

**Read:** `getConfigurationParameters` for Style items **always** synthesizes Color/Size list params via `getStyleConfigurationParametersFromAttributes` (Size `sortOrder=0`, Color `sortOrder=1`). Legacy `configurationParameter` rows on Styles are ignored (dual-read retired).

**Configurable itemIds:** `api+/items.configurable.ts` unions `configurationParameter.itemId` with Color/Size `itemAttributeSelection.itemId`.

Variant SKUs: `valuesKey` = `color|size` — see `inventory-system.md` § Style variant SKUs.

**Bundle WO:** still stores `colorCode`/`sizeCode` for display labels (not dropped yet; UI still matrix-oriented).

**Jobs / Master WO:** qty matrix is stored on the **backing `job.configuration`** JSON (`configTable` + `configTablePrimaryKeys`), not in `configurationParameter`. Master WO has no separate config column — it uses `masterWorkOrder.jobId` → that job’s configuration. Grid columns come from synthesized Style params (attributes); cell quantities are saved via job configure / config-table overlay (`jobConfigurationUpdateFields`).
