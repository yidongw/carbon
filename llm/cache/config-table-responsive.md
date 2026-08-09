# Config Table Modals & Responsive Table


## Naming (2026 rename)

- UI: `VariantsQuantityModal`, `JobVariantsQuantity`, `VariantChips` / Variant Display.
- Wire key: `variantTable` (dual-read legacy `configTable`).
- Overlay success payload: flat `{ ok, variantTable, total, splitRows? }` with dual-read of legacy `{ ok, configuration: { variantTable }, total }`.
- Helpers: `VariantQuantityParameterInput`, `getItemIdsWithVariantQuantityGrid`, `computeVariantTableRemaining`, `getOverlaySuccessVariantTable`.

## Components

| Component | Path | Role |
|---|---|---|
| `ResponsiveVariantsQuantityTable` | `apps/erp/app/modules/production/ui/Jobs/ResponsiveVariantsQuantityTable.tsx` | Generic layout wrapper: horizontal table at `md+`, vertical transpose below `md`; accepts custom column/row types via `renderCell` |
| `ReadOnlyVariantsQuantityTable` | `variantsQuantityShared.tsx` | Read-only config snapshot; hides zero-value columns in vertical mobile view |
| `EditableVariantsQuantityGrid` | `variantsQuantityShared.tsx` | Editable grid with add/delete row; `readOnly` prop hides zero values in vertical view |
| `VariantsQuantityModal` | `VariantsQuantityModal.tsx` | Item-level config modal; uses `EditableVariantsQuantityGrid` |
| `JobVariantsQuantity` | `JobVariantsQuantity.tsx` | Job-level config overlay; uses `ReadOnlyVariantsQuantityTable` + `EditableVariantsQuantityGrid` |
| `VariantsQuantityReportedTargetTable` | `VariantsQuantityReportedTargetTable.tsx` | BOP grid-icon modal table (reported/pickup/target triplets); uses same responsive transpose as `ResponsiveVariantsQuantityTable` |

## Responsive Behavior

- **Desktop (`md+`)**: Standard horizontal table with column headers
- **Mobile (`< md`)**: Transposed table — field labels in a sticky left column, values scroll horizontally to the right (one column per data row)
- **Read-only vertical**: Field rows where all values are zero/empty are hidden
- **Edit vertical**: All columns shown; add row / delete row still available below the grid

## Modal Usage

- `VariantsQuantityModal` / `VariantsQuantityLocalModal` / `useVariantsQuantityModal()`
- `JobVariantsQuantity` overlay (`jobVariantsQuantity`)
- Item read-only overlay (`itemVariantsQuantity`, `confirmMode: "none"`)

## Breakpoint

Uses Tailwind `md:` (768px) — same pattern as ERP list tables (`TableCardRow`).
