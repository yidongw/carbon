# Style Sizes Ordering

Apparel **sizes** must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by code (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- Canonical order: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts` (`sortOrder` = array index). Seeded into garment `itemAttributeValue` (Size); legacy `styleSize` still present until dropped.
- Size pickers / lists order by `sortOrder`, then code.

When adding a new size read/display, order by `sortOrder`, not code.

## Style pickers = itemAttributeValue ids

**Source:** `getGarmentAttributeValueList` (`itemAttribute.service.ts`) — Color/Size `itemAttributeValue` rows (`companyId` match or catalog `NULL`), ordered by `sortOrder`, `code`. **Dedupes by code**, preferring company-scoped over system (`companyId IS NULL`). Returns `{ id, colorCode|sizeCode, …, sortOrder }` where **`id` is `itemAttributeValue.id`**.

**Wrappers:** `getStyleColorList` / `getStyleSizeList` call `getGarmentAttributeValueList`.

**Consumers:**
- `<StyleColors>` / `<StyleSizes>` → `api+/items.style-colors` / `items.style-sizes`
- `AddStyleOptionButton` / Styles table fetchers
- Bundle work order color names via `getStyleColorList`
- Samples size options via `getStyleSizeList`

**Writes:** Form fields `styleColorIds` / `styleSizeIds` carry those value ids. `syncStyleAttributeSelections` inserts `itemAttributeSelection` from the ids directly (validates `attributeId`; **no** `styleColor`/`styleSize` lookup).

**Samples:** `createStyleSamples` resolves color codes from `itemAttributeValue` by id (`iat_color`).

## Admin Colors / Sizes = itemAttributeValue

`/items/colors` and `/items/sizes` CRUD (`getStyleColor(s)` / `getStyleSize(s)` / `upsertStyleColor` / `upsertStyleSize` / `delete*`) read/write **company-scoped** `itemAttributeValue` for Color/Size (`iat_color` / `iat_size`), mapping `code`/`name` ↔ form fields `colorCode`/`colorName` (and size equivalents). Delete blocked when `itemAttributeSelection` references the value.

`seedStyleReference` upserts company Color **and** Size `itemAttributeValue` only (no `styleColor`/`styleSize` dual-write).

Backfill: `20260806154243` copies remaining company `styleSize` rows into `itemAttributeValue` (earlier migrate skipped codes that already had system values).

Legacy `styleColor` / `styleSize` tables may still exist; assignment tables dropped (`20260806145747`). `syncStyleConfigurationParameters` removed — qty matrices use `getStyleConfigurationParametersFromAttributes`.

## Styles view (migration `20260806150151`)

`styles.colors` / `styles.sizes` json: **`id` = `itemAttributeValue.id`**, plus code/name fields; ordered by `iav.sortOrder`, `iav.code`.

## Style qty matrix / variants

**New Styles** write attribute selections + variant SKUs (`syncStyleVariantsFromAssignments`) only.

**Read:** `getConfigurationParameters` uses stored rows when present; else `getStyleConfigurationParametersFromAttributes` (Size `sortOrder=0`, Color `sortOrder=1`). Size options ordered by `itemAttributeValue.sortOrder`.

**Configurable itemIds:** `api+/items.configurable.ts` unions `configurationParameter.itemId` with Color/Size `itemAttributeSelection.itemId`.

Variant SKUs: `valuesKey` = `color|size` — see `inventory-system.md` § Style variant SKUs.
