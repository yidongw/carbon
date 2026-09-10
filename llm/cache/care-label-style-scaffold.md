# Care-label Style scaffold (打印水洗唛 / 水洗唛扫码绑定)

## What

`ensureStyleMethodScaffold` (`apps/erp/app/modules/items/styleMethod.service.ts`) inserts system Style BOP ops after Cutting:

1. `打印水洗唛` — `styleStage: "care-label"`, tag `style:care-label-operation`
2. `水洗唛扫码绑定` — `styleStage: "care-label-bind"`, tag `style:care-label-bind-operation`

## When it runs

- Style create / update
- Style page loader (open Style)
- **Job create `insertJob` (item→job) and `upsertJobMethod` (Get Method)** when the resolved method item is a Style — so master/bundle WO create does not copy a stale Cutting+Assembly-only BOP

## Bundle / master copy

`get-method` copies Style BOP onto the job; `splitGarmentJobItems` keeps care-label + bind on **bundles** (not master). Old bundles created before the Style had these ops stay Assembly-only until Get Method (or recreate) after scaffold.

## Note

Mint-on-done (`maybeMintGarmentRfidOnCareLabelDone`) identifies the print op via tags/`styleStage` on `jobOperation`. If remote `get-method` omits those markers, mint will not fire even when the description is present.

## Handheld hardware (floor)

Floor care-label / chip work uses a **UHF RFID handheld PDA** (超高频 U‑RFID 手持读写器), **not** a 1D wedge barcode gun as the primary device:

- Reads **UHF EPC** from the physical chip via RF (batch / bulk inventory reads — many tags in one trigger).
- Bound EPCs are stored on `garmentRfidCode.externalCode` (see bind + `getBundleByGarmentCode` dual lookup by `code` **or** `externalCode`).
- Printed Code128 on the care label is still the human / linear-scanner path; PDA floor flows (bind, count) should assume **bulk EPC lists**, not one-code-at-a-time keyboard wedge.
