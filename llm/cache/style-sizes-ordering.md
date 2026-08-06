# Style Sizes Ordering

Apparel **style sizes** (`styleSize` table) must display in apparel order — smallest→largest with `OS` (one size) last — **not** alphabetically by `sizeCode` (which produces `2XL, 3XL, L, M, S, XL, XS, OS`).

## Mechanism

- `styleSize` has a **`sortOrder` INTEGER NOT NULL DEFAULT 100** column (migration `20260717231544_style-size-sort-order.sql`). Standard seeded codes are backfilled `XS=0, S=1, M=2, L=3, XL=4, 2XL=5, 3XL=6, OS=7`. Custom user-created sizes get the default `100`, appending after the standard set.
- Canonical order source of truth: `STYLE_SIZE_CODES` in `packages/database/src/styleReference.ts`. `styleReferenceRows()` emits `sortOrder = array index`; both seed paths (`seedDemoData.ts` raw INSERT, `seedStyleReference` in `items.service.ts` upsert) persist it.
- **Every read path orders by `sortOrder` (then `sizeCode` as tiebreak):**
  - `getStyleSizeList` — feeds the `<StyleSizes>` MultiSelect picker on `/x/style/new`.
  - `getStyleSizes` — sizes admin list default sort.
  - `syncStyleConfigurationParameters` — order of the `size` configurator list-param options.
  - The `styles` view `sizes` json aggregate (`ORDER BY ss."sortOrder", ss."sizeCode"`).

When adding a new size read/display, order by `sortOrder`, not `sizeCode`.

## Variant SKUs (inventory)

Style items get child variant SKUs (`itemVariant` + `itemAttribute*`, migration `20260806132455`). Lookup key is `valuesKey` = `color|size` (e.g. `BK|S`). Parent Style remains on PO/SO lines; receipt/shipment create expands `configuration.configTable` to one line per variant — see `inventory-system.md` § Style variant SKUs.
