# Inventory System

## Overview

Carbon's inventory system tracks material and item quantities across different locations and stages of the manufacturing process.

## Key Functions

### get_inventory_quantities

The `get_inventory_quantities` function is a PostgreSQL function that returns inventory information for items at a specific location. It was last updated in migration `20250724195443_update-inventory-quantities-material-properties.sql`.

**Parameters:**
- `company_id`: TEXT - The company identifier
- `location_id`: TEXT - The location identifier

**Returns a table with the following columns:**
- `id`: TEXT - Item ID
- `readableId`: TEXT - Human-readable item ID
- `readableIdWithRevision`: TEXT - Readable ID with revision
- `name`: TEXT - Item name
- `active`: BOOLEAN - Whether the item is active
- `type`: itemType - Item type enum
- `itemTrackingType`: itemTrackingType - Tracking type enum
- `replenishmentSystem`: itemReplenishmentSystem - Replenishment system enum
- `materialSubstanceId`: TEXT - Material substance ID (e.g., steel, aluminum)
- `materialFormId`: TEXT - Material form ID (e.g., sheet, plate, round bar)
- `dimensionId`: TEXT - Material dimension ID
- `dimension`: TEXT - Dimension name
- `finishId`: TEXT - Material finish ID
- `finish`: TEXT - Finish name
- `gradeId`: TEXT - Material grade ID
- `grade`: TEXT - Grade name
- `materialType`: TEXT - Material type name
- `materialTypeId`: TEXT - Material type ID
- `thumbnailPath`: TEXT - Path to thumbnail image
- `unitOfMeasureCode`: TEXT - Unit of measure code
- `quantityOnHand`: NUMERIC - Current inventory quantity
- `quantityOnSalesOrder`: NUMERIC - Quantity committed to sales orders
- `quantityOnPurchaseOrder`: NUMERIC - Quantity on purchase orders
- `quantityOnProductionOrder`: NUMERIC - Quantity on production orders
- `quantityOnProductionDemand`: NUMERIC - Quantity demanded for production

The function aggregates quantities from:
- Item ledger entries (for on-hand inventory)
- Open sales orders (status: Confirmed, To Ship and Invoice, To Ship, To Invoice, In Progress)
- Open purchase orders (status: Planned, To Receive, To Receive and Invoice)
- Open production jobs (status: Planned, Ready, In Progress, Paused)
- Open job material requirements

The function excludes non-inventory items and includes material property information by joining with:
- `material` table for base material information
- `materialDimension` table for dimension names
- `materialFinish` table for finish names
- `materialGrade` table for grade names
- `materialType` table for material type names

## TypeScript Types

The function's TypeScript types are defined in:
- `/packages/database/src/types.ts`
- `/packages/database/supabase/functions/lib/types.ts`

Both files include the complete type definition for the function's arguments and return values in the `Database["public"]["Functions"]` interface.

## Usage

This function is primarily used by:
- Inventory module (`/apps/erp/app/modules/inventory/inventory.service.ts`)
- Items module (`/apps/erp/app/modules/items/items.service.ts`)

It provides a comprehensive view of inventory levels and commitments for materials tracking.

## Style variant SKUs (flexible product attributes)

Style parent items can have child **variant SKUs** via `itemVariant` / `itemAttribute*` tables (migration `20260806132455_item_attributes_and_variants.sql`). Child items hold inventory.

**No configurationParameter dual-write on create:** new Styles sync attribute selections + variants only. Qty editors synthesize a **`valuesKey` combo list** via `getStyleVariantQuantityParameters` (not separate Color/Size matrix columns). Legacy Color×Size `configTable` matrices are still dual-read on expand. Configurable detection unions parameter itemIds with attribute-selection itemIds (`items.configurable.ts`). Details: `style-sizes-ordering.md` § Style qty matrix params.

**Expansion on SO/PO Style line save** (create/update): when the submitted line is a Style parent with `configuration.variantTable`, expand into **one order line per variant SKU** (`itemId` = child variant). Helper: `apps/erp/app/modules/items/styleOrderLines.server.ts` (`expandVariantTableToLines` takes `variantQuantities`, `hasStyleVariantsQuantity`). Writers: `replaceSalesOrderLinesWithStyleVariants` / `replacePurchaseOrderLinesWithStyleVariants` (sales/purchasing services). Forms skip the color×size matrix when editing a Style line with no `configuration` (already a variant SKU). Validators require Style quantity but not configuration JSON. ERP expand matches variants by frozen color/size attribute codes (order-independent) and **fails loud** if a cell has no SKU (`expandVariantsQuantityTable` in `itemAttribute.service.ts`). Unit tests: `styleOrderLines.server.test.ts`.

**Naming — `variantQuantities` vs `configuration`:** Inventory document lines (`warehouseTransferLine`, `stockTransferLine`, `shipmentLine`, `receiptLine`) store Style/Consumable combo qty grids in JSONB column **`variantQuantities`** (migrations `20260805154407` create + `20260808175003` rename from `configuration` if needed). Product/UI language: “variant quantities” / “Edit variant quantities”. Reserve **`configuration`** for Part method params (`job.configuration`, method get-method/BOM-BOP) and for SO/PO line `configuration` until those are renamed. Shared variants-quantity modal still speaks `configuration` in its open/confirm payload; inventory maps that into `variantQuantities`. Transfers expand parent+grid to per-variant SKU lines the same way as SO/PO. Views `shipmentLines` / `receiptLines` / `stockTransferLines` (`SELECT *` from base tables) expose `variantQuantities` — generated types must match.

**Transfer expand guards:** `requireVariantQuantitiesIfAttributeParent` rejects attribute parents (itemVariant children or itemAttributeSelection) submitted with qty and no grid. Multi-variant WT/ST expand uses Kysely transactions (`replace*WithStyleVariants` / `insert*WithStyleVariants`). Style on-hand hints use `get_item_quantities_by_tracking_id` (same as transfer stock), not raw ledger. Job shipment Ordered hints load `getJobVariantQuantities` → `jobVariantQuantitiesToTable`.

**Jobs vs SO/PO (intentional split):** Style **jobs** persist planned variant qty in `jobVariantQuantity` and must not leave Style `variantTable` on `job.configuration` (`persistStyleJobConfiguration`). SO/PO still expand submitted `configuration.variantTable` to variant lines — that order-line path is intentionally out of scope for the job jvq work. Job details: `style-sizes-ordering.md` § Jobs / Master WO — `jobVariantQuantity`.

**Quote → SO conversion** (`packages/database/supabase/functions/convert/index.ts`): Style quote lines with a config table expand to per-variant SO lines with cent-exact add-on/shipping splits. Expanded lines use `salesOrderLineType: "Style"` (same as ERP expand). Shared helpers live in `lib/item-variants.ts` (`hasVariantsQuantity`, `expandVariantsQuantityTable`).

**Edge receive/ship fallback** (legacy parent+config lines still on the order): `packages/database/supabase/functions/create/index.ts` also imports `lib/item-variants.ts` and expands at receipt/shipment create — **fail loud** (no silent parent fallback) when a cell has no matching variant.

**Deploy:** `convert` and `create` need `--import-map supabase/functions/deno.json` (relative imports into `lib/`) or hosted Supabase will not resolve `item-variants.ts`.

**`valuesKey` format:** `color|size` (e.g. `BK|S`). Size-only falls back to just the size code. Edge/ERP expand prefer attribute combo keys over positional `valuesKey` strings.

## Inventory list vs variant SKUs (20260806162447 + 20260807092217)

`get_inventory_quantities` (preview/shared DB also has `breakdown`/`jobBreakdown` from style inventory work):
- Color/size display names resolve via `itemAttributeValue` (not dropped `styleColor`/`styleSize`).
- Variant child SKUs are **excluded** from the inventory list.
- Parent rows **add** parent ledger + variant rollup (not COALESCE-replace — `20260807092217`); child ledgers included in Style breakdown so headline matches breakdown.
- Detail SKU breakdown remains `getItemVariantQuantities` (Style inventory page).

### Harden migrations (already on shared preview DB)

Do not re-apply / “fix” these on the shared preview DB — they are already present:

- `20260807092217` — parent inventory rollup **adds** parent ledger + variant stock (not COALESCE-replace).
- `20260807093041` — `salesOrders.orderTotal` plain `SUM` of line amounts; jobs aggregated separately (avoids `SUM(DISTINCT)` undercounting equal-amount variant lines).
- `20260807091544` — `itemAttributeSetAttribute` / `itemAttributeSetAssignment` write RLS no longer allows `companyId IS NULL` (tenants cannot mutate shared system rows).

`consumables` view excludes variant children (`20260806162513`), same pattern as `styles`.

SKU breakdown for variant children uses `get_inventory_quantities_for_items` (`20260806163128`) because the list RPC excludes child SKUs.
