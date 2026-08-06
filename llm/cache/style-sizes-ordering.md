# Style Sizes Ordering

Apparel **sizes** must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by code (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- Canonical order: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts` (`sortOrder` = array index). Seeded into both `styleSize` and garment `itemAttributeValue` (Size).
- `styleSize.sortOrder` INTEGER NOT NULL DEFAULT 100 (migration `20260717231544`); standard backfill `XS=0…OS=7`; custom sizes default `100`.
- Size pickers / lists order by `sortOrder`, then code.

When adding a new size read/display, order by `sortOrder`, not code.

## Style pickers = itemAttributeValue ids

**Source:** `getGarmentAttributeValueList` (`itemAttribute.service.ts`) — Color/Size `itemAttributeValue` rows (`companyId` match or catalog `NULL`), ordered by `sortOrder`, `code`. **Dedupes by code**, preferring company-scoped over system (`companyId IS NULL`). Returns `{ id, colorCode|sizeCode, …, sortOrder }` where **`id` is `itemAttributeValue.id`**.

**Wrappers:** `getStyleColorList` / `getStyleSizeList` call `getGarmentAttributeValueList` (same `itemAttributeValue` source; not the admin tables).

**Consumers:**
- `<StyleColors>` / `<StyleSizes>` → `api+/items.style-colors` / `items.style-sizes`
- `AddStyleOptionButton` / Styles table fetchers
- Bundle work order color names via `getStyleColorList`

**Writes:** Form fields `styleColorIds` / `styleSizeIds` carry those value ids. `syncStyleAttributeSelections` inserts `itemAttributeSelection` from the ids directly (validates `attributeId`; **no** `styleColor`/`styleSize` lookup).

**Samples:** `createStyleSamples` resolves color codes from `itemAttributeValue` by id (`iat_color`).

## Dual-write (legacy tables ↔ itemAttributeValue)

- `seedStyleReference` upserts Size **and** Color `itemAttributeValue` rows (plus `styleSize` / `styleColor`).
- `upsertStyleColor` / `upsertStyleSize` dual-write matching `itemAttributeValue` rows.

## Styles view (migration `20260806150151`)

`styles.colors` / `styles.sizes` json: **`id` = `itemAttributeValue.id`**, plus code/name fields; ordered by `iav.sortOrder`, `iav.code`. (Earlier `20260806145305` still joined catalog by code; `20260806150151` switched ids to attribute values.)

## Admin styleColor / styleSize

Tables still exist for CRUD UI. Assignment tables `styleColorAssignment` / `styleSizeAssignment` dropped (`20260806145747`).

## Style qty matrix / variants

**New Styles** write attribute selections + variant SKUs (`syncStyleVariantsFromAssignments`) only — no `syncStyleConfigurationParameters`.

**Read:** `getConfigurationParameters` uses stored rows when present; else `getStyleConfigurationParametersFromAttributes` (Size `sortOrder=0`, Color `sortOrder=1`). Size options ordered by `itemAttributeValue.sortOrder`.

**Configurable itemIds:** `api+/items.configurable.ts` unions `configurationParameter.itemId` with Color/Size `itemAttributeSelection.itemId`.

Variant SKUs: `valuesKey` = `color|size` — see `inventory-system.md` § Style variant SKUs.
