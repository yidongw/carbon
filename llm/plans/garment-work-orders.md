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

### ⬜ Phase 2 — Master Work Order: schema + creation (DRY)
- New `masterWorkOrder` table (own migration), backed 1:1 by a Style parent job
  internally, but a first-class object in its own right. Reuse `id('mwo')`, RLS
  `production_*` pattern, audit columns — copy an existing table migration.
- Create a master work order when an apparel/Style parent flow starts. Reuse the
  existing job-creation service path rather than duplicating it.
- Regenerate types (`pnpm db:build`).
- **UI test target:** a master row exists in the DB after starting a Style flow.

### ⬜ Phase 3 — Master Work Order: dedicated UI under Production
- New routes nested under Production (e.g. `x+/production+/work-orders...`),
  list + detail. Reuse the existing list/table and detail-shell components and
  the `useProductionSubmodules` nav pattern (add a "Work Orders" entry).
- Master detail shows cutting-oriented info + color/size summary; edits inline.
- **UI test target:** Production ▸ Work Orders lists masters; a master opens its
  own detail (not a job page).

### ⬜ Phase 4 — Bundle Work Order: schema + generation (DRY)
- New `bundleWorkOrder` table (own migration): `masterWorkOrderId`, bundle
  identity (color/size/number/sequence), 1:1 child job backing.
- Generate bundle work orders when split/bundle generation happens. Reconsider
  whether to revive any of the backed-up bundle/split logic or model it fresh.
- **UI test target:** generating bundles yields bundle work orders under a master.

### ⬜ Phase 5 — Bundle Work Order: dedicated detail + process reporting (DRY)
- Bundle detail route under Production; navigable from its master.
- Downstream operations + **Process Reports** (Production/Rework/Scrap) rendered
  and **filed inline** here, reusing `productionQuantityReport` infrastructure and
  the existing report form/table components (renamed to apparel terminology on
  these surfaces only — no relabeling of job pages).
- **UI test target:** file a process report on a bundle op; it shows on the bundle
  detail and rolls up correctly.

### ⬜ Phase 6 — End-to-end verification
- `pnpm db:build`, targeted service tests, `pnpm typecheck`.
- Browser flow (`/login` + `/test`): open master → cutting → generate bundles →
  open bundle work orders → report downstream processes.

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
