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

**No configurationParameter dual-write on create:** new Styles sync attribute selections + variants only. Qty matrices synthesize Color/Size list params via `getStyleConfigurationParametersFromAttributes` when `getConfigurationParameters` finds no stored rows. Legacy Styles with stored `configurationParameter` still work. Configurable detection unions parameter itemIds with Color/Size attribute selection itemIds (`items.configurable.ts`). Details: `style-sizes-ordering.md` § Style qty matrix params.

**Expansion on SO/PO Style line save** (create/update): when the submitted line is a Style parent with `configuration.configTable`, expand into **one order line per variant SKU** (`itemId` = child variant). Helper: `apps/erp/app/modules/items/styleOrderLines.server.ts` (`expandStyleConfigToVariantLines`, `hasStyleConfigTable`). Writers: `replaceSalesOrderLinesWithStyleVariants` / `replacePurchaseOrderLinesWithStyleVariants` (sales/purchasing services). Forms skip the color×size matrix when editing a Style line with no `configuration` (already a variant SKU). Validators require Style quantity but not configuration JSON.

**Edge receive/ship fallback** (legacy parent+config lines still on the order): `packages/database/supabase/functions/create/index.ts` + `lib/item-variants.ts` (`hasConfigTable`, `expandConfigTableToVariantQuantities`, `resolveVariantItemId`) still expand at receipt/shipment create for PO receipt, SO shipment, SO-line shipment, PO return shipment.

**`valuesKey` format:** `color|size` (e.g. `BK|S`). Size-only falls back to just the size code.

## Inventory list vs variant SKUs (20260806162447)

`get_inventory_quantities` (preview/shared DB also has `breakdown`/`jobBreakdown` from style inventory work):
- Color/size display names resolve via `itemAttributeValue` (not dropped `styleColor`/`styleSize`).
- Variant child SKUs are **excluded** from the inventory list.
- Parent rows **roll up** child qty columns (on-hand, SO/PO/jobs, usage, etc.).
- Detail SKU breakdown remains `getItemVariantQuantities` (Style inventory page).

`consumables` view excludes variant children (`20260806162513`), same pattern as `styles`.

