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

**Expansion on SO/PO Style line save** (create/update): when the submitted Style parent FormData has `variantQuantities` (`{ variantTable }`), expand into **one order line per variant SKU** (`itemId` = child variant). No SO/PO `configuration` column — expand is FormData-only. Helper: `apps/erp/app/modules/items/styleOrderLines.server.ts` (`expandVariantTableToLines`). Writers: `replaceSalesOrderLinesWithStyleVariants` / `replacePurchaseOrderLinesWithStyleVariants`. Unit tests: `styleOrderLines.server.test.ts`.

**Naming — `variantQuantities` vs `configuration`:** Inventory document lines (`warehouseTransferLine`, `stockTransferLine`, `shipmentLine`, `receiptLine`) and production qty/pickup rows store Style/Consumable combo qty grids in JSONB **`variantQuantities`**. Product/UI language: “variant quantities” / “Edit variant quantities”. Reserve **`configuration`** for Part method params (`job.configuration`, method get-method/BOM-BOP). SO/PO Style expand uses FormData `variantQuantities` only (line `configuration` column dropped). Transfers expand parent+grid to per-variant SKU lines the same way as SO/PO.

**Transfer expand guards:** `requireVariantQuantitiesIfAttributeParent` rejects attribute parents (itemVariant children or itemAttributeSelection) submitted with qty and no grid. The attribute-selection probe selects `attributeValueId` (that table has no `id` column). Multi-variant WT/ST expand uses Kysely transactions (`replace*WithStyleVariants` / `insert*WithStyleVariants`). Style on-hand hints use `get_item_quantities_by_tracking_id` (same as transfer stock), not raw ledger. Job shipment Ordered hints load `getJobVariantQuantities` → `jobVariantQuantitiesToTable`.

**Jobs vs SO/PO (intentional split):** Style **jobs** persist planned variant qty in `jobVariantQuantity` and must not leave Style `variantTable` on `job.configuration` (`persistStyleJobVariantQuantities`). SO/PO expand submitted FormData `variantQuantities.variantTable` to variant lines (no persisted line configuration). Job details: `style-sizes-ordering.md` § Jobs / Master WO — `jobVariantQuantity`.

**Item planning (PR #326):** `itemPlanning` is per `itemId`. Style/attribute **planning** uses a mix grid like demand projections: cells are weights; on save `scalePlanningQuantityFieldsForVariant` / `scaleVariantQuantitiesToTotal` (in `styleOrderLines.ts`, not `.server` — `items.service` is client-bundled) splits safety stock, reorder point, reorder qty, and max inventory onto child SKUs (example: 30 at 1:2 → 10 + 20). Routes call `upsertItemPlanningWithMix` in `itemPlanning.server.ts`. Mix JSON is stored on the parent row as `customFields.variantMix` (not a DB column) and rehydrated by `getItemPlanningWithMix`; if that key is missing, mix is reconstructed from child stock-target quantities. Policy, accumulation period, and lot size (order multiple / min / max) copy as-is. Mix is required when the parent has `itemVariant` children. Parent `itemPlanning` update + child fan-out run in one Kysely transaction (`copyItemPlanningToVariantChildren`). The Style **Planning tab** sets those reorder params; it does not create jobs. MRP planned production is on `/x/production/planning`. Style/attribute **parents appear as a family row** (`get_production_planning` rolls child SKU demand, supply, and on-hand onto the parent). **Variant child SKUs are excluded from the list** (`20260815123417_production_planning_hide_variant_children.sql` is the live production-planning body; do not collapse earlier rollup migrations). `get_purchasing_planning` and `get_production_projections` use the same hide + rollup (`20260815284731_planning_hide_variant_children.sql`). Make is one job on the parent mix grid. The production-planning **Make drawer** quantity control for those parents is `ItemVariantsQuantityInput` (table icon → `useVariantsQuantityModal`), not a number stepper. Make creates **one job on the Style parent** and writes `jobVariantQuantity` via `persistStyleJobVariantQuantities`; new jobs without a saved grid are prefilled from parent `customFields.variantMix` scaled to the order qty (`resolveOrderVariantQuantities` / `scalePlanningMixToTotal`). Existing Draft/Planned jobs keep their saved mix (or plain qty) unless the user opens the grid. The drawer also lists Draft/Planned jobs on child SKUs (legacy); those stay on the SKU `itemId` and do not get parent mix persisted. If mix persist fails after `insertJob`, the job is still recorded for recalculate so it is not an invisible Planned order. The item Planning projections chart (`api/items.$id.$locationId.forecast`) rolls up child SKU demand/supply so the parent is not an empty “Failed to load demand”.

**Style price overrides:** Item type switcher on `PriceOverrideForm` includes Style; **create stores one override on the parent**. `resolvePrice` also looks up the parent item and matches quantity breaks against the **sum of sibling variant SKU quantities** (`familyQuantity`), not each SKU alone (example: break at 100, S=60 + M=50 → both get the 100-rung price). Helper: `apps/erp/app/modules/sales/sales.priceOverride.ts`. Sales order line pricing posts `familyQuantity` when the line item is a variant SKU.

**Quote → SO conversion** (`packages/database/supabase/functions/convert/index.ts`): Style quote lines with a config table expand to per-variant SO lines with cent-exact add-on/shipping splits. Expanded lines use `salesOrderLineType: "Style"` (same as ERP expand). Shared helpers live in `lib/item-variants.ts` (`hasVariantsQuantity`, `expandVariantsQuantityTable`).

**Edge receive/ship fallback** (legacy parent+config lines still on the order): `packages/database/supabase/functions/create/index.ts` also imports `lib/item-variants.ts` and expands at receipt/shipment create — **fail loud** (no silent parent fallback) when a cell has no matching variant.

**Deploy:** `convert` and `create` need `--import-map supabase/functions/deno.json` (relative imports into `lib/`) or hosted Supabase will not resolve `item-variants.ts`.

**`valuesKey` format:** `color|size` (e.g. `BK|S`). Size-only falls back to just the size code. Edge/ERP expand prefer attribute combo keys over positional `valuesKey` strings.

**Attribute set/value immutability after create (PR #293):** `syncItemVariantsFromSelections` (single choke point for both create + edit item-level, in `itemAttribute.service.ts`) enforces guards when `isCreate` is falsy: (1) can't change an already-assigned `item.attributeSetId`; (2) an item created with a null set can't gain one; (3) assigned `itemAttributeSelection` values are additive-only (no removal — removal would archive the variant SKU and orphan production/purchase/sales). The create callers (`upsertStyle`, consumable `new` route) pass `isCreate: true` to set the baseline. `ItemAttributeEditor` mirrors this: set is read-only, no value-remove ✕, renders nothing for a set-less item. Catalog-level set-attribute membership editing (`upsertItemAttributeSet`) is NOT yet guarded. Tests: `itemAttributeImmutability.test.ts`.

**Attribute footprint frozen; value-per-attribute required on create (PR #295):** (1) On create, `syncItemVariantsFromSelections` (`isCreate: true`) rejects unless every attribute of the chosen set has ≥1 selected value ("Select at least one value for every attribute in the set."); the consumable `new` route now rolls back the created item on this error (style already rolled back). (2) `syncItemVariants` freezes each item to the attributes it actually has values for (`activeAttrs = setAttrs.filter(has values)`) instead of requiring every *current* set attribute — so an attribute added to a set *after* an item was created no longer archives that item's existing variants. `ItemAttributeEditor` mirrors this by rendering only `selectedSet.attributes` whose id is in the item's own `selections` (`itemAttributes` memo), so a later-added set attribute never shows up or gains a value on existing items. `getStyleVariantQuantityParameters` already excluded value-less attributes. (3) The attribute set itself is OPTIONAL (an item can be created without one); only once a set is chosen are its values required *inline like any other form field* (not a disabled Save button): `AttributeSelectionValidator` (in `modules/items/ui/`, must render INSIDE `ValidatedForm`) registers a submit-time validator via `useAdditionalValidatorsContext` that returns field errors keyed by the rendered names (`attributeSetId` / `av__<attributeId>`) using shared logic in `attributeSelectionValidation.ts`; `ValidatedForm` merges these into fieldErrors, shows the inline message, blocks submit, and focuses the field. Rendered by `StyleForm`, `PartForm`, `ToolForm` (via `ItemAttributeSelects itemType=...`, create-only via `!isEditing`), `MaterialForm` (create-only form, unconditional), and `ConsumableForm` (its own inline picker). ALL user-creatable item types (Part, Material, Tool, Consumable, Style) now honor attribute sets + generate variant SKUs on create; the picker renders nothing when the type has no assigned set. Service/Fixture/Sample have no create UI. Post-create, the detail-page `ItemAttributeEditor` (view + additive edit of selections) is wired into ALL of Style, Consumable, Part, Material, Tool properties sidebars: each `$itemId.tsx` loader loads `getItemAttributeSelectionsForItem` (returns `attributeSetId`/`attributeSelections`), and each type has a `$itemId.attributes.tsx` action route (path builders `partAttributes`/`materialAttributes`/`toolAttributes`/`consumableAttributes`/`styleAttributes`) that runs `syncItemVariantsFromSelections` on save; the editor renders nothing when the item has no set. The inline "value required" message is translated via the `t` macro in `AttributeSelectionValidator` (passed as `AttributeSelectionState.missingValueMessage`), catalog msgid "Select at least one value for this attribute." (en/zh). The `part`/`material`/`tool` `new.tsx` routes read `attributeSetId` from formData (not their validators), call `validateAttributeSelectionForCreate` pre-insert, then `syncItemVariantsFromSelections({isCreate:true})` after create with item rollback on sync error (Style syncs inside `upsertStyle`; Consumable syncs in its route). NOTE: `useAdditionalValidatorsContext()` only works for components rendered as CHILDREN of `ValidatedForm` — calling it in the component that renders the form returns null. Both `new.tsx` routes also call `validateAttributeSelectionForCreate` (in `itemAttribute.service.ts`) pre-insert and return the same field-scoped `validationError` as a JS-off/direct-post backstop, so no partial item is ever written.

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

**SO/PO note:** `salesOrderLine.configuration` / `purchaseOrderLine.configuration` were dropped. Style qty grid is FormData-only → expand to child SKU lines; no JSONB plan column on SO/PO lines.
