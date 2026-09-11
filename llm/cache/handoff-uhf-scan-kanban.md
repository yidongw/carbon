# Handoff: RFID / UHF scan inventory + kanban discussion

**Prior Discord session worktree:** `discord/greet-the-assistant-099402`  
**Prior PR:** https://github.com/yidongw/carbon/pull/430  
**Agent transcript id:** `c355cd91-260b-427d-8aec-b6b32f6f3d6e`  
(path: `agent-transcripts/c355cd91-260b-427d-8aec-b6b32f6f3d6e.jsonl` under the Cursor project)

Next agent: read this file + `llm/cache/bundle-inventory-scan.md` + `llm/cache/care-label-style-scaffold.md` + `llm/cache/kanban-system.md` before coding.

---

## Goal of prior chat

Garment floor uses **超高频 U‑RFID 手持 PDA** (bulk EPC reads). Ship care-label mint/bind + **Style 扫码盘点**, then discuss wiring the same scan style into **补货卡**.

---

## Shipped on PR #430 (do not re-implement)

### Care-label Style scaffold
- Ops after Cutting: `打印水洗唛` + `水洗唛扫码绑定`
- Mint system `garmentRfidCode` on print Done; bind UHF EPC → `externalCode`
- Dual lookup: `code` OR `externalCode`

### 扫码盘点 (Style location inventory detail)
- Button **扫码盘点** beside **库存调整** on `InventoryStorageUnits` (Style only)
- **Do not change** manual inventory adjustment (storage unit stays optional there)
- **存储单元必选**; 位置 = page `pickMethod.locationId` (no location picker in modal)
- Unique EPC = 1 piece → tally by **variant SKU** via bundle `itemId` (NOT parsing color/size from EPC)
- Resolve: `resolveGarmentPiecesByScannedCodes` → `tallyStyleScanCount` → commit
- Commit: `insertManualInventoryAdjustment` Set Quantity at location+storageUnit
- Unscanned Style SKUs **in that bin** → **0** (whole-bin semantics)
- Foreign/unknown EPCs flagged, not posted
- Route: `path.to.inventoryItemScanCount` → `quantities/$itemId.scan-count.tsx`
- UI: `ScanCountModal.tsx`

### Other #430 notes
- Removed Bundle Scan/Count from inventory sidebar
- Overlay `crypto.randomUUID` → nanoid for HTTP preview
- Care-label print: Code128 drawn on canvas (bwip dynamic import was flaky)
- Preview must checkout **feature branch**; wrong commit = missing 扫码盘点 button

---

## Product decisions locked

| Topic | Decision |
|-------|----------|
| Floor hardware | UHF PDA bulk EPC, not 1D-wedge-only UX |
| 库位 vs 存储单元 | 位置 = Location (仓库); 存储单元 = bin/rack |
| 扫码盘点 | storage unit **required**; adjustment unchanged |
| SKU identity | Inherit from **bundle's variant itemId**, not decode from tag |
| 清零 | Only for 扫码盘点 whole-bin: unscanned family SKUs in that unit → 0 |

---

## 补货卡 discussion (NOT built yet — likely this PR’s work)

### What 补货卡 is today
- Per **variant SKU** + fixed reorder qty + location/storage unit
- QR on card: Create / Start / Complete → Make job or Buy PO
- Scans the **card**, not garments; qty is fixed on the card

### User mental model
- “给某一个款式补库存” → more precisely **one SKU** (e.g. `444-BK-L`) at a bin, fixed batch

### Proposed hybrid (user-approved direction, not implemented)
1. Scan **补货卡** QR → know which SKU / bin / target qty  
2. UHF scan **care-label EPCs** → confirm actual piece count  
3. Confirm → post by **scanned count** (receive/complete), not blindly card qty  

**Best attachment point:** Make complete / Buy receipt **acceptance**, not the Create trigger.  
Open product choice: Make only, Buy only, or both.

### Do not
- Replace kanban Create with “scan a pile of EPCs”
- Conflate 扫码盘点 (stock truth) with 补货卡 (pull supply) without an explicit bridge

---

## 库存转移 Scan Pick (locked — shipped on this branch)

User confirmed (库存转移 / Stock Transfer **Pick**):

- **成衣必须**用水洗唛 UHF 扫码确认数量（不能一键 Pick 跳过）
- **必须扫满**计划件数才能过账（不允许部分拣先过账）
- 判定成衣：行 SKU 属于 **Style/款式**（`itemVariant` + parent `type === "Style"`）
- 非成衣：保持现有一键 Pick；序列号/批次：现有 scan 路由
- 路由：`path.to.stockTransferGarmentPick` → `$id.garment-pick.$lineId.tsx`
- 过账：`post-stock-transfer` type `inventory`（Transfer），不是 Set Quantity

---

## Key paths

- `apps/erp/app/modules/inventory/ui/Inventory/ScanCountModal.tsx`
- `apps/erp/app/modules/inventory/ui/Inventory/InventoryStorageUnits.tsx`
- `apps/erp/app/routes/x+/inventory+/quantities+/$itemId.scan-count.tsx`
- `apps/erp/app/modules/production/scanInventoryCount.ts`
- `apps/erp/app/modules/production/bundleInventoryMovement.service.ts` (`resolveGarmentPiecesByScannedCodes`)
- `apps/erp/app/modules/production/careLabelBind.ts` (`normalizeScannedExternalCodes`)
- Kanban: `llm/cache/kanban-system.md`, `KanbanForm.tsx`, `api+/kanban.$id.tsx`

---

## Suggested next steps for this PR

1. Implement **库存转移** Style-line **扫码 Pick** (must fill qty; non-Style one-click Pick unchanged) — highest clarity from user
2. Then 补货卡 / 仓库调拨收货扫码（另议）
3. Reuse EPC helpers from #430 (rebase/merge after #430 lands)

---

## Preview ops

- ERP preview pattern: `http://43.133.217.62:<4400+pr>` (430 → `:4430`)  
- Redeploy: `/home/ubuntu/preview/manage-preview.sh start <pr> <branch>`  
- Always verify preview worktree `git log -1` matches feature branch  
