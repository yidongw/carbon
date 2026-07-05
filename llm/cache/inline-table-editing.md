# Inline table editing (InlineEditor)

Toolkit that makes list-view table cells directly editable (single click opens the
editor, click-away dismisses), mirroring the detail-page "Properties" editors.

## Toolkit — `apps/erp/app/components/InlineEditor/`
- `editableCell<Row>(config)` → a TanStack `cell` renderer. Kinds:
  - `"picker"` — Combobox; `options: {value,label}[]`, `value:(r)=>id`, optional
    `renderInline:(v)=><Avatar/>`, `fallbackLabel:(r)=>r.someName`, `clearable`.
  - `"enum"` — SelectBase with fixed `options` (same shape as picker).
  - `"text"` — Input; shows a `+` add affordance when empty.
  - `"date"` — Popover + `Calendar` with a draft/confirm footer (Clear |
    Cancel/Save); `renderInline:(v)=>formatDate(v)`. Date-only by default; pass
    `withTime:true` to add a `TimePicker` and store a full ISO datetime (used by
    Maintenance planned/actual times). Mirrors the pickups `EditableCreatedAtCell`.
  - `"boolean"` — Switch.
  - config also takes `field` (server column) and `update` (EntityUpdateConfig).
- `EntityUpdateConfig = { action: path.to.bulkUpdateX, idKey: "ids" | "items" }`.
  Items module uses `idKey:"items"`; everyone else `"ids"`.
- `TagsCell` — reuses CreatableMultiSelect, submits to `path.to.tags`. The id it
  sends depends on the table: **item sub-tables** (part/tool/material/consumable/
  service/fixture) have no separate `readableId` column — their PK `id` IS the
  readable string, so submit `row.readableId`. **Every other entity** (customer,
  supplier, job, procedure, …) has a UUID `id` PK, so submit `row.id` — even when
  the view also exposes a `readableId` display column (customer/supplier do; using
  it silently no-ops the `.in("id", …)` write). See `READABLE_ID_TABLES`.
- `useEntityUpdate` → `onUpdate(id, field, value)` posts FormData to the action.

## Key rules
- **Never show a raw id.** Picker default render is
  `options.find(o=>o.value===v)?.label ?? fallbackLabel?.(r)` else empty. When the
  display name isn't derivable from a store-avatar (customer/supplier/employee),
  expose a `<thing>Name` column on the source view and pass `fallbackLabel`.
  This also avoids memoized-cell staleness from self-fetching option hooks
  (useLocations/useShippingMethod/usePaymentTerm/useCurrencyCodes).
- Store-backed options are safe per-row: `useCustomers`, `useSuppliers`,
  `usePeople` (from `~/stores`) with `CustomerAvatar`/`SupplierAvatar`/`EmployeeAvatar`.
- The shared `Table`/`Row`/`Cell` were fixed to pass `cellRenderer`/`columns` as
  memo-compared props so async option lists reach memoized cells.
- Assignee cells use `<Assignee id table="<tableLiteral>" value variant="button" size="sm"/>`.
- Template to copy: `sales/ui/Quotes/QuotesTable.tsx` and
  `sales/ui/SalesOrder/SalesOrdersTable.tsx` (the latter shows the view-name pattern).
- **Do NOT make the primary name/title column editable when it is the row's only
  Hyperlink to the detail page** (procedures/training/quality documents — their
  `name` IS the link, unlike Quotes/PO which have a separate id column). Keep the
  Hyperlink; edit the other columns instead.

## Bulk-update actions (one per module) — `routes/x+/<module>+/update.tsx`
Uniform contract: `getAll("ids"|"items")`, `field`, `value`; switch on `field`.
**Gotcha:** some fields live on child tables, not the header table:
- salesOrder: `shippingMethodId`→`salesOrderShipment`, `paymentTermId`→`salesOrderPayment`
  (both keyed `id = salesOrder.id`).
- purchaseOrder: `locationId`/`shippingMethodId`/`deliveryDate`→`purchaseOrderDelivery`,
  `paymentTermId`→`purchaseOrderPayment`, `receiptPromisedDate`→`purchaseOrderLine`.
Writing these to the header table throws "Could not find the '<col>' column ... in
the schema cache".

## Wired tables (as of PR #162)
Items: Parts, Tools, Consumables, Materials (Materials' substance/shape/grade/
dimension/finish/type columns are read-only — inline editing there was reverted
because the dependent/creatable pickers + id-regeneration confirm didn't work
reliably in-table; use the material detail page to change attributes). Sales:
Quotes, Sales Orders,
Sales RFQ. Purchasing: Purchase Orders, Purchasing RFQ, Supplier Quotes.
Invoicing: Sales Invoices, Purchase Invoices (incl. paymentTerm + location).
Production: Jobs (incl. location), Procedures. Quality: Issues, Quality Documents.
Resources: Training, Maintenance (workCenter/failure-mode pickers, enums,
plannedStartTime via withTime). Items: Templates (description).

**All 20 detail-page property-panel entities are now wired** — this was the
stated goal ("wire every property in the Details tab back to its table").

Master-data entities (no property panel; a NEW bulk-update action was created
per module): **People/Employees** (the `EmployeesTable` in `modules/people/ui/People`
at `/x/people/employees` — renamed from PeopleTable. NOT the `PermissionsTable` in
`modules/users/ui/Employees` at `/x/people/permissions`, renamed from the old
EmployeesTable, which stays read-only:
firstName/lastName, employeeType, location. These fan out — firstName/lastName →
`user`, employeeTypeId → `employee`, locationId → `employeeJob` — all keyed by
user id; `Person` = `{...employee}` so `Person.id` is the user id; fullName is a
generated column. Action `people+/employees.update.tsx` / `bulkUpdateEmployee`),
**Customers** (sales), **Suppliers** (purchasing), **Work Centers**
(resources: description, location, department), **Processes** (resources:
processType, defaultStandardFactor, completeAllOnScan), **Gauges** (quality:
manufacturer, gaugeType, gaugeRole, location, model/serial number). **Do NOT
inline-toggle `active`** on work centers / processes, or `gaugeStatus` on gauges
— they have guarded activate/deactivate flows; leave to the context menu. Gauge
calibration status/dates are calibration-workflow managed (read-only).
**Contractors & Partners intentionally skipped**: their views lack a clean `id`
(contractor keys on supplierContactId, partner on supplierLocationId+abilityId),
so editableCell's `row.id` submit would no-op. Recipe: add a
`routes/x+/<entity>+/update.tsx` action (uniform field/value/ids switch, one
`.from("<table>").update(...)`), add a `bulkUpdate<Entity>` builder in path.ts,
then wire the table. Keep the name/avatar column as the detail Hyperlink.
Status can be an enum (supplier: supplierStatus) or an FK picker (customer:
customerStatusId, value from the row's `status` name).

View migrations added display-name columns: `salesOrders`
(shipping/location/paymentTermName), `purchaseOrders`
(shipping/payment/locationName), `materials` (attribute ids), `jobs`
(locationName), `salesInvoices` (location/paymentTermName), `purchaseInvoices`
(locationName).

## Still deferred / not covered
- A few individual fields on wired tables: currencyCode everywhere; procedure
  processId; issue locationId / nonConformanceTypeId / item / supplier (need name
  columns or a stable option source).
- **Master-data / config list tables have NO bulk-update action** (Customers,
  Suppliers, People, WorkCenters, Gauges, Receipts, Shipments, and the many
  small config tables). They have no detail "Properties" panel either, so they
  fall outside the original goal. Wiring them would each need a NEW module
  bulk-update action route first.
- Planning grids (production/purchasing) and line-item sub-tables
  (receipt/shipment/stock-transfer lines) have actions but a different,
  detail-page context — not wired.
