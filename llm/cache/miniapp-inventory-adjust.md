# Miniapp add / remove inventory (MES AdjustInventory parity)

## MES web
- Modal `AdjustInventory` on home/sidebar → `POST /x/adjustment`
- Fields: item (excludes Batch/Serial), quantity ≥ 1, storage unit (optional, prefills from pickMethod)
- Service: `insertManualInventoryAdjustment` → `itemLedger` insert

## Miniapp APIs
- `GET /api/miniapp/items?adjustment=1` — excludes Batch/Serial
- `GET /api/miniapp/storage-units?itemId=` — bins for MES location + default
- `POST /api/miniapp/inventory-adjustment` — `{ itemId, quantity, storageUnitId?, entryType }`

## Miniapp UI
- `/pages/inventory/adjust?mode=add|remove` + `adjust.config.ts` (`navigationStyle: 'custom'`)
- `FN_ROUTE.addInventory` / `removeInventory` on workstation + functions
- Client: `miniapp/src/services/inventory.ts`
