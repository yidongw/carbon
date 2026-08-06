# Style Sizes Ordering

Apparel **style sizes** (`styleSize` table) must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by `sizeCode` (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- `styleSize` has a **`sortOrder` INTEGER NOT NULL DEFAULT 100** column (migration `20260717231544_style-size-sort-order.sql`). Standard seeded codes are backfilled `XS=0, S=1, M=2, L=3, XL=4, 2XL=5, 3XL=6, OS=7`. Custom user-created sizes get the default `100`, appending after the standard set.
- Canonical order source of truth: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts`. `styleReferenceRows()` emits `sortOrder = array index`; both seed paths (`seedDemoData.ts` raw INSERT, `seedStyleReference` in `items.service.ts` upsert) persist it.
- **Every read path orders by `sortOrder` (then `sizeCode` as tiebreak):**
  - `getStyleSizeList` — feeds the `<StyleSizes>` MultiSelect picker on `/x/style/new`.
  - `getStyleSizes` — sizes admin list default sort.
  - `getStyleConfigurationParametersFromAttributes` — synthesized `size` list options (from `itemAttributeValue.sortOrder`).
  - Deprecated `syncStyleConfigurationParameters` — legacy repair still orders `size` options by `styleSize.sortOrder`.
  - The `styles` view `sizes` json aggregate (`ORDER BY ss."sortOrder", ss."sizeCode"`).

When adding a new size read/display, order by `sortOrder`, not `sizeCode`.

## Styles view / write path (attribute selections)

Migration `20260806145305_styles_from_attribute_selections.sql` rewrote the `styles` view so `colors` / `sizes` / `colorCodes` / `colorNames` / `sizeCodes` come from `itemAttributeSelection` + `itemAttributeValue`, joined to `styleColor` / `styleSize` **by code** (`companyId` match **or** `companyId IS NULL` catalog rows). Unchanged by the later drop migration.

**Writes (`style.server.ts`):** `upsertStyle` / `addStyleColorsAndSizes` sync via `itemAttributeSelection` + `syncStyleVariantsFromAssignments` (create: sync only; add: merge catalog ids from `getStyleCatalogIdsFromSelections`, then sync).

**Dropped tables:** `styleColorAssignment` / `styleSizeAssignment` removed in `20260806145747_drop_style_color_size_assignments.sql`; types regenerated without them.

## Style qty matrix params (no configurationParameter dual-write)

**New Styles** write attribute selections + variant SKUs (`syncStyleVariantsFromAssignments`) only. They do **not** call `syncStyleConfigurationParameters` — no `configurationParameter` rows, no `itemReplenishment.requiresConfiguration` flip.

**Read path:** `getConfigurationParameters` returns stored `configurationParameter` rows when present (legacy Styles). If empty, falls back to `getStyleConfigurationParametersFromAttributes` (Color/Size from `itemAttributeSelection`; Size `sortOrder=0` primary columns, Color `sortOrder=1` row descriptor).

**Configurable itemIds:** `api+/items.configurable.ts` unions `configurationParameter.itemId` with Color/Size `itemAttributeSelection.itemId` (does not rely on `requiresConfiguration`).

**Legacy:** Styles that already have stored `configurationParameter` rows keep working. `syncStyleConfigurationParameters` remains `@deprecated` for one-off repair only.

## Variant SKUs (inventory)

Style items get child variant SKUs (`itemVariant` + `itemAttribute*`, migration `20260806132455`). Lookup key is `valuesKey` = `color|size` (e.g. `BK|S`). On SO/PO Style line save, parent + `configuration.configTable` expands to one order line per variant SKU; edge receive/ship expand remains fallback for legacy parent+config lines — see `inventory-system.md` § Style variant SKUs.
