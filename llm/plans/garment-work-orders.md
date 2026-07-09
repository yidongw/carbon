# Garment Work Orders — Rebuild Plan & Progress

## What this branch is now

The original branch (`discord/configure-package-job-splitting-354641`, 33 commits)
mixed a good **Style** foundation with a rejected **garment Work Order** model
that relabeled the `job` page and a coupled bundle/split-batch layer. On
instruction, this branch (`discord/garment-work-orders`) was **reset all the way
back to `origin/dev`** and is being rebuilt as clean, curated, phased commits.

- Original tip preserved as tag **`backup/garment-pre-reset`** (recoverable).
- **Kept:** the Style item type + Style/Style-Color pages (reusable).
- **Dropped from the branch (still in the backup tag):** garment Work Order
  (badge, `garmentWorkOrder.service`, `masterWorkOrder`/`bundleWorkOrder` tables,
  `parentJobId`, job-page relabel) and the bundle/splitBatch execution layer —
  the user flagged it as likely wrong; it will be reconsidered during the
  redesign.
- **Dropped drift:** `billing.tsx`, `expire-annual-plans`, `supabase.yml` CI,
  split-batch overlay, `shared.server` assignedAt.

## Guiding principles

- **DRY / reuse first.** Before writing anything new, reuse what the repo already
  provides — the registry-overlay pattern (`overlay.registry.tsx` / `overlay.ts`),
  existing `job` / `jobOperation` / `productionQuantityReport` execution
  infrastructure, `packages/react` + `apps/erp/app/components` UI primitives,
  the `useItemsSubmodules` / `useProductionSubmodules` nav pattern, and existing
  table/detail shells. Grep before building.
- **Work Orders are their own objects in the UI.** Master/Bundle Work Orders must
  have their **own** list/detail/reporting surfaces and must **not** appear as a
  relabeled `job` page. Job may be reused as an internal execution backend only.
- **Full inline editing.** The Work Order surfaces own their edits/reporting
  directly (not "read-only + bounce to the job page").
- **Home:** Work Orders live **nested under Production**. **ERP only** for now
  (no MES this pass).

## Target end state (unchanged intent)

- `Master Work Order` — apparel parent: total qty, cutting, BOM consumption,
  bundle generation, color/size plan summary. Its own list + detail surfaces.
- `Bundle Work Order` — apparel child of a master: downstream process execution,
  process reporting (`Production` / `Rework` / `Scrap`), rework/scrap, line
  execution, bundle identity (color/size/number). Its own detail surface.
- Navigate master → its bundle work orders directly. Cutting stays on the master;
  downstream execution stays on the bundle.

---

## Phases & Progress

Legend: ✅ done · 🔄 in progress · ⬜ not started

### ✅ Phase 0 — Reset & curate branch
Reset to `origin/dev`; removed garment WO + bundle/split + drift; kept the Style
foundation. Backup tag `backup/garment-pre-reset` holds the old tip.

### ✅ Phase 1 — Style foundation (committed, UI-tested)
The reusable base the Work Orders build on. Committed on top of `dev` **through
the pre-commit hooks (no `--no-verify`)** — Biome, Lingui `.po` extraction, and
MCP tool-metadata regeneration all ran:

1. Add style-foundation database migrations
   — `style`, `styleColor`, `styleColorAssignment` tables, `styles` view,
   `sync_create_make_method_related_records`; seeds 20 standard colors; reloads
   PostgREST. (Bundle/splitBatch tables intentionally omitted.)
2. Support Style as a make item type across modules — Style added to
   item/line-type enums + validators (items, shared, invoicing, purchasing,
   outsideProcessingPricing) and to item/planning/pick-method forms; PO & invoice
   line editors/headers handle the Style line type.
3. Add Styles and Style Colors services and models — `style.server`,
   `styleMethod.service` (cutting-first BOP), `style.models`,
   `getStyle(s)`/`getStyleColor(s)` in `items.service`; `deleteMethodOperation`
   guards the style cutting op.
4. Add Styles and Style Colors UI and routes — Styles list/detail
   (`x/style/*`, Items ▸ Styles), Style Colors management (Items ▸ Colors),
   StyleColors multi-select, item-properties color selection, path helpers + nav.

**Fixes found during UI testing:**
5. Revert optimistic BoP reorder when the server rejects it — dragging the
   system Style cutting operation off first was rejected server-side but the
   optimistic order never rolled back; it now snaps back. Fixes all rejected
   reorders, not just styles.
6. Keep multi-select trigger at input height when it has selections — the Colors
   picker grew taller than sibling inputs once chips were selected; now uses a
   min-height matching its empty state.

Also fixed: the untranslated `Style ID` / `Colors` labels (they showed Lingui
hash IDs) — the `.po` catalogs now carry the Style strings via the Lingui
extraction that runs in the pre-commit hook.

**⚠️ Required before merging (CI typecheck):** run `pnpm db:types` after applying
the migrations to **regenerate `packages/database/src/types.ts`**. It was left at
the `dev` baseline on purpose (the original branch never had Style types in
`types.ts` — it only hand-patched the garment-WO types), so the Style tables are
typed only after regeneration (in progress against a local Supabase).

**How to test Phase 1 in the UI** (after `pnpm db:build` + dev server):
1. **Style Colors:** go to **Items ▸ Colors**. You should see 20 seeded standard
   colors. Create a new color (code + name), edit it, delete it.
2. **Styles:** go to **Items ▸ Styles**. Create a new Style item; open its detail
   (`/x/style/:id`) — Details / Planning / Costing / Inventory / Sales tabs load.
3. **Colors on an item:** open an item's **Properties** and confirm the style
   color multi-select works.
4. **Style as a line type:** on a Purchase Order / Invoice line, confirm "Style"
   is selectable and the line editor handles it without error.

**Known pre-existing (not caused by this work):** `x/job/$jobId.make.$methodId.tsx`
has a `productionQuantityReport` typecheck error that is present on `dev` too.

### 🔄 Phase 2 — Master Work Order: schema + creation service (backend committed)
Committed (`Add Master Work Order schema and creation service`):
- `masterWorkOrder` table (`id('mwo')`, `jobId` unique FK, `colorSize`, audit),
  RLS `production_*` — mirrors the style table boilerplate.
- `masterWorkOrders` list view = `masterWorkOrder` ⋈ `job` ⋈ `item`, so the list
  UI reuses the same view + generic-query-filter pattern as `jobs`.
- `masterWorkOrder.service.ts`: `insertMasterWorkOrder` (reuses `insertJob` to
  create the backing job, then wraps it), `getMasterWorkOrders` / `getMasterWorkOrder`.

**✅ Types regenerated + typecheck clean.** Built the local DB and generated types
without `crbn`: connected as the `supabase_admin` superuser to patch the stale
`storage.buckets`/`storage.objects` columns, ran `supabase migration up` (all ~800
migrations applied, validating both new migrations), generated types, and
**surgically merged** the new `style`/`styleColor`/`styleColorAssignment`/
`masterWorkOrder` tables + `styles`/`masterWorkOrders` views + `Style` enum values
onto dev's committed `types.ts` (a full regen diverges ~5k lines and breaks
unrelated dev code). Fixed two latent bugs the fresh types exposed (upsertStyle
writing non-existent `style.colorName/colorCode`; a style-create diagnostic that
narrowed to `never`). `pnpm typecheck` for erp is clean apart from **2 pre-existing
dev errors** (`x/job/$jobId.details.tsx`, `make.$methodId.tsx` — byte-identical to
`dev`).

### 🔄 Phase 3 — Master Work Order UI under Production (list + create done)
Committed (`Add Master Work Order list + create UI under Production`), typecheck
clean:
- **Production ▸ Master Work Orders** list page (`x+/production+/master-work-orders.tsx`)
  reading the `masterWorkOrders` view via the generic query filters + a
  `MasterWorkOrdersTable` (Style, Name, Job, Quantity, Status).
- **New Master Work Order** registry-drawer overlay
  (`master-work-orders.new.tsx` + `MasterWorkOrderForm`): pick a Style item +
  quantity → `insertMasterWorkOrder` (reuses `insertJob`). Follows the
  tag/pickup overlay convention; the job page is untouched.
- `path.to.masterWorkOrders/masterWorkOrder(id)/newMasterWorkOrder`, overlay
  builder + registry entry, and the Production nav entry (LuShirt icon).
- **UI test:** Production ▸ Master Work Orders → New → pick a Style + qty → Save →
  the new row appears in the list.

### ✅ Phase 3b — Master Work Order detail page
Dedicated `/x/master-work-order/:id` surface (its own page, not the job page):
style / quantity / status / due date + a Bundle Work Orders section. List rows
link to it.

### ✅ Phase 4 — Bundle Work Orders under a Master
- `bundleWorkOrder` table + `bundleWorkOrders` view (child of a master, backed by
  a child job with `parentJobId` = the master's job) + PostgREST reload.
- `insertBundleWorkOrder` (reuses `insertJob`), `getBundleWorkOrders`/`getBundleWorkOrder`.
- Master detail lists its bundles + a **New Bundle** overlay (color/size/quantity,
  auto-numbered `<jobId>-NN`).
- Dedicated `/x/bundle-work-order/:id` detail page (identity + Process Reports
  placeholder).
- Types regenerated + surgically merged; typecheck clean.
- **UI test:** open a master → New Bundle → color/size/qty → Save → the bundle
  appears under the master and opens on its own detail page.

**Deployed to preview:** migrations applied to the hosted preview DB + PostgREST
reloaded — `masterWorkOrders`/`bundleWorkOrders` REST both return 200. (Previews
don't auto-apply migrations — see the preview-DB note.)

### ⬜ Phase 5 — Live Process Reports on the Bundle detail (next)
Bundles are backed by real child jobs, so process reporting **already functions**
through the existing production surfaces (`/x/production/quantities`, the job's
operations). Remaining work is to **surface** those reports (Production / Rework /
Scrap) inline on the bundle detail and allow filing them there, reusing
`getProductionQuantitiesByOperation` / `productionQuantityReport` — apparel
terminology on these surfaces only, no job-page relabeling.

### ⬜ Phase 6 — End-to-end verification
- Full browser flow: create master → add bundles → report downstream on a bundle.

---

## Working agreement for this branch

- Implement **one phase at a time**; after each phase: **stop**, report what was
  done and how to test it in the UI, and update this progress log. Do not roll
  into the next phase without a go-ahead.
- Keep it DRY — reuse existing repo infrastructure and components.

## Definition of Done

- `job` is never presented as the apparel work-order object.
- Master + Bundle Work Orders have their own list/detail/reporting surfaces under
  Production, with inline editing.
- Navigate master ↔ bundles directly; cutting on master, downstream on bundle.
- Process reporting works through the new surfaces.
- Full browser flow verified end-to-end.
