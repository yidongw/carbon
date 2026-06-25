# Config Table Modals & Responsive Table

## Components

| Component | Path | Role |
|---|---|---|
| `ResponsiveConfigTable` | `apps/erp/app/modules/production/ui/Jobs/ResponsiveConfigTable.tsx` | Generic layout wrapper: horizontal table at `md+`, vertical transpose below `md`; accepts custom column/row types via `renderCell` |
| `ReadOnlyConfigTable` | `configTableShared.tsx` | Read-only config snapshot; hides zero-value columns in vertical mobile view |
| `EditableConfigGrid` | `configTableShared.tsx` | Editable grid with add/delete row; `readOnly` prop hides zero values in vertical view |
| `ConfigParamsTableModal` | `ConfigParamsTableModal.tsx` | Item-level config modal; uses `EditableConfigGrid` |
| `JobConfigQuantities` | `JobConfigQuantities.tsx` | Job-level config overlay; uses `ReadOnlyConfigTable` + `EditableConfigGrid` |
| `ConfigParamsReportedTargetTable` | `ConfigParamsReportedTargetTable.tsx` | BOP grid-icon modal table (reported/pickup/target triplets); uses same responsive transpose as `ResponsiveConfigTable` |

## Responsive Behavior

- **Desktop (`md+`)**: Standard horizontal table with column headers
- **Mobile (`< md`)**: Transposed table — field labels in a sticky left column, values scroll horizontally to the right (one column per data row)
- **Read-only vertical**: Field rows where all values are zero/empty are hidden
- **Edit vertical**: All columns shown; add row / delete row still available below the grid

## Modal Usage

- `ConfigParamsTableModal` / `ConfigParamsTableLocalModal` / `useConfigTableModal()`
- `JobConfigQuantities` overlay (`jobConfigTable`)
- Item read-only overlay (`itemConfigTable`, `confirmMode: "none"`)

## Breakpoint

Uses Tailwind `md:` (768px) — same pattern as ERP list tables (`TableCardRow`).
