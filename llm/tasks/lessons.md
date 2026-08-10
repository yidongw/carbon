# Lessons

Patterns learned from corrections. Review at the start of each session.

## Bundle jobs must copy the parent Style BOP, not the variant SKU method
- Symptom: Style has Assembly (and Cutting); Master WO processes show Cutting only (expected); Bundle WO processes are empty — Assembly missing everywhere that rolls up from bundles.
- Root cause: `insertBundleWorkOrder` creates the job with `itemId` = variant SKU. Variant SKUs have no make method; get-method failed silently and left zero operations. Cutting delete then had nothing left to keep.
- Rule: when get-method/`insertJob` targets a Style variant SKU, resolve `itemVariant.parentItemId` and copy that Style's method (`methodItemId` / `resolveStyleMethodItemId`). Master still strips non-cutting ops; bundle strips cutting — Assembly belongs on the bundle.

## Rename call-site property names when renaming function args
- Symptom (bug 451530): Master WO create toast failed / qty modal wouldn't open, but the MWO existed.
- Root cause: #278 renamed `replaceJobVariantQuantitiesFromTable`'s arg from `configuration` → `variantQuantities`, but job/MWO/bulk create still passed `configuration:`. Runtime ignored the payload (undefined), wrote no `jobVariantQuantity` rows; the qty overlay loader then returned null when planned rows were empty.
- Rule: when renaming a function parameter, grep every call site for the **old property key** in object literals (TS excess-property checks only help if typecheck runs). Also never gate "can open editor" solely on "rows already exist" if create can leave an empty plan.

## A "word"/wordmark logo SVG may be a full lockup (mark + text), not text-only
- Don't infer an SVG's composition by diffing path `d=` strings. An embedded mark inside a lockup has **different coordinates** than the standalone mark file, so a substring match returns "no mark" even when the mark IS present. Hit this with `apps/docs/public/carbon-word-light.svg`: its first path is the hexagon mark (at different coords than `carbon-mark-light.svg`), followed by 6 letter paths for "carbon". I concluded "text-only", paired it with a separate mark `<img>`, and produced a **double mark** in the header.
- Verify what an SVG actually renders by **viewing/rendering it**, not by reasoning over path data.
- Carbon brand assets in `apps/docs/public/`: `carbon-mark-*` = hexagon only; `carbon-word-*` = full lockup (mark + "carbon" wordmark). `*-light` = dark ink `#101A24` (use on light backgrounds); `*-dark` = light ink `#E6E6E6` (use on dark backgrounds).

## Cancelling a pickingList does NOT cascade `Cancelled` to its lines
- Symptom: a "picked X/Y" rollup over `pickingListLine` summed too high — a
  Cancelled picking list's lines were still `status = 'Pending'` and got counted.
- Root cause: cancelling the LIST leaves each `pickingListLine.status` unchanged.
- Rule: when aggregating `pickingListLine` (picked qty, allocations, availability),
  filter by the PARENT `pickingList.status` (count only `In Progress`/`Completed`),
  not just the line's own status. A line-level `status <> 'Cancelled'` check is
  NOT sufficient. Likely also relevant to `getAvailableTrackedEntities`
  (excludeAllocated) and the `get_picking_list_*` RPCs.

## Verify data-scope bugs against the real DB before guessing
- The local dev DB for `*.picking-list.dev` is Postgres on the port in
  `.env.local` `SUPABASE_DB_URL` (e.g. 56332). `PGPASSWORD=postgres psql -h
  localhost -p <port> -U postgres -d postgres` to inspect rows directly — far
  faster than the browser for confirming a counting/scope discrepancy.
- Inbucket (dev email catcher) web/API is a docker port-mapped 9000 → find with
  `docker ps | grep inbucket` (e.g. localhost:56335). Use it for magic-link login.

## `*.picking-list.dev` is the LOCAL dev server (crbn + portless)

- The domains `erp.picking-list.dev`, `mes.picking-list.dev`, `api.picking-list.dev`, and `mail.picking-list.dev` (Inbucket) are **not** a remote/preview deployment. They are the **local** dev server that the `crbn` dev CLI spins up for the branch and exposes via **portless** (which maps the branch's local dev processes to those domains).
- Consequence: the site reflects the **current working tree** with HMR. Uncommitted local edits are live there after a reload — **do NOT commit/push to "deploy" for testing**. Just reload the page. (Respect the no-auto-commit rule for everything else.)
- The local dev DB is already migrated/seeded by `crbn up`, so feature migrations are applied there (but still don't rebuild the DB yourself — wait for the user).
- Auth on these domains uses the real magic-link flow: submit the email at `erp.<...>.dev/login`, fetch the link from Inbucket at `mail.<...>.dev` (API: `GET /api/v1/mailbox/<mailbox>` then `/<mailbox>/<id>`), visit the `api.<...>.dev/verify?...` URL (decode `&amp;` → `&`).

## Postgres NUMERIC comes back as a STRING in edge functions — coerce before `+`

- In the Deno/Kysely edge functions (e.g. `post-picking`, `post-stock-transfer`), a NUMERIC column read via `selectAll()` is a **string**, so `(line.quantityPicked ?? 0) + quantity` does **string concatenation** (`"0.0000" + 4 = "0.00004"`), which then rounds to `0.0000` when written back to `NUMERIC(12,4)` — silently losing the value. Symptom: the action "succeeds" and side effects (ledger moves, status) happen, but the quantity column stays ~0 so the UI looks unchanged ("button does nothing"). Always `Number(...)` numeric columns before arithmetic. Subtraction (`-`) coerces and is safe; only `+` concatenates.
- Local Supabase `functions serve` hot-reloads edited edge functions, but can take ~5–10s — re-test after a short wait before concluding the code didn't change.

## Picking list: inclusion + source are relative to the operation's work center

- A job material needs picking **unless it is already staged at the operation's OWN work center lineside**. Decide this by **actual on-hand at the op's work-center lineside bin**, NOT by where `jobMaterial.storageUnitId` points. That field is the recorded *source* shelf; comparing its `get_effective_work_center_id` to the op's `workCenterId` answers the wrong question and misses parts that are line-stocked at the op's WC while the jobMaterial still points at the warehouse/another line (real miss: PL000015, Assembly 2, P000000001 had 9 on-hand at A2 but was still added). Correct rule: resolve the op's lineside bin (default first, else oldest — mirrors `get_or_create_work_center_lineside`), sum its `itemLedger` on-hand, and skip when `lineside_on_hand >= quantityToIssue`. Fixed in both `get_picking_schedule` (SQL, LATERAL join) and `generatePickingList` (`getItemOnHandByStorageUnit`). Open follow-up: partial-stock still picks the full qty, not just the shortfall.
- A pick's **source** must be a WAREHOUSE (non-lineside) bin resolved by on-hand — never another work center's lineside bin (don't "rob" another line; matches SAP/Epicor). If no warehouse stock exists, the line is generated with a null source and shows a yellow `⚠ NO STOCK` badge + tooltip in the source column — but **Pick stays enabled**: a kitter can pick material the system shows no stock for (counts are often wrong), and on-hand simply goes negative at the source until reconciled. Only the lineside destination is required server-side; a null source is allowed. See `resolveWarehouseSource` and `llm/research/picking-list-source-resolution.md`.

## MES uses `size="lg"`, ERP uses `size="md"`

- Sized components (`Button`, `NumberControlled`/form inputs, `ItemThumbnail`, modal buttons, etc.) follow an app-level size convention: in **MES** (`apps/mes`, shop-floor touch UI) **always** use `size="lg"`; in **ERP** (`apps/erp`, desktop) **default to** `size="md"`.
- When converging UI that exists in both apps (e.g. the picking-list line components / `ShortPickModal`), do **not** copy sizes verbatim — the MES copy gets `lg` on every sized control, the ERP copy gets `md`.
- A **shared** component in `@carbon/react` used by both apps must **not hard-code** a size — expose a `size?: "md" | "lg"` prop (default `"md"`) and apply it to every inner input/button, so ERP renders default and MES passes `size="lg"`. (Done for `TrackedEntityPicker`.)

## Never wrap `<Enumerable>` in a `<Badge>`

- `Enumerable` already renders its value as a styled chip/badge. Wrapping it (`<Badge><Enumerable .../></Badge>`) double-wraps and looks wrong. Use `<Enumerable value={...} />` directly (e.g. in a `CardDescription` or inline). If you just need a plain badge for non-enumerable text, use `<Badge>` alone.

## Visually validate overlay conversions before presenting them

- Converting a self-wrapped `ModalCard` form into a registry overlay is not complete when it merely renders. Inspect the actual overlay in the browser before presenting it.
- Use `ModalHeader` as the real layout container; do not wrap it in a separate horizontal stack and place sibling controls outside it. Reserve room for the host-provided close button.
- Keep `Hidden` form fields outside CSS grid containers. Carbon's hidden field wrapper can still participate in grid auto-placement and shift visible controls, creating unexplained blank cells.

## No parentheses around numbers in the UI

- Don't wrap counts/numbers in parentheses in UI labels (e.g. `Generate Picking List (3)` or `2/5 (40%)`). The user dislikes this style. Show the number plainly or with a separator instead: `Generate Picking List 3`, `2/5 · 40%`. (Note: some existing components like KanbansTable use `(n)` — don't copy that pattern into new UI.)

## Flat-route parent must render `<Outlet/>`

- In the dot-style flat routes (`apps/*/app/routes/x+/`), a file like `picking.tsx` becomes the **parent layout** of `picking.$pickingListId.tsx`. If `picking.tsx` renders page content (a dashboard) with **no `<Outlet/>`**, the child route silently never renders — navigating to `/x/picking/<id>` shows the parent's content instead. Fix: make `picking.tsx` a pure layout (`<Outlet/>`) and move the index content to `picking._index.tsx`. (Hit this on the MES picking execution route.)

## `issue` edge function: "Set Quantity" reverses consumption cleanly

- To un-issue / reverse a job-material consumption, call `issue` `partToOperation` with `adjustmentType: "Set Quantity"` and `quantity = targetIssued`. "Set Quantity" issues the **delta** (`target - quantityIssued`) and writes the **opposite-signed** Consumption ledger entry, so the same call handles pick (increase) and unpick (decrease/reverse) symmetrically. "Positive Adjmt." is NOT a reversal (it still increments quantityIssued). Used in picking's `setPickingListLineQuantity`.

## RLS Policies

- **NEVER** use the old `has_role('employee', "companyId") AND has_company_permission(...)` RLS pattern. It is deprecated.
- **ALWAYS** use the new pattern with `get_companies_with_employee_permission()` helper function and standardized policy names ("SELECT", "INSERT", "UPDATE", "DELETE").
- Reference migration: `20250201181148_rls-refactor.sql`
- Correct pattern:
  ```sql
  CREATE POLICY "SELECT" ON "public"."tableName"
  FOR SELECT USING (
    "companyId" = ANY (
      (SELECT get_companies_with_employee_permission('module_view'))::text[]
    )
  );
  ```
## Event-system interceptors (Carbon-specific)

- Carbon uses `attach_event_trigger(table_name, BEFORE[], AFTER[])` defined in `20260116215036_event_system_impl.sql` / `20260410030406_event-system-after-interceptors.sql`, not plain Postgres triggers. Each call **DROPs and re-CREATEs** the event trigger — so when adding interceptors to a table that already has some registered, the new call must include every existing interceptor plus the new ones, otherwise the old ones silently detach. Grep `attach_event_trigger('<table>'` across migrations to find the latest registration and merge arrays.
- Interceptor functions take `(p_table TEXT, p_operation TEXT, p_new JSONB, p_old JSONB) RETURNS VOID`. Short-circuit early on operations that don't apply (`IF p_operation <> 'UPDATE' THEN RETURN; END IF;`). `RAISE EXCEPTION` to block; `RETURN` silently to skip.

## Identifiers over free text

- When a field names another record ("the operation that triggers shelf life"), store it as a foreign-key ID (`processId`) rather than a string description. Typo-proof, rename-safe, and the DB enforces existence. The first cut of shelf-life matched against `jobOperation.description` — the user flagged it as a caveat; switching to `processId` removed the fragility without changing the UX (a combobox lets the user create/pick a process by name).

## "Presence of a row = feature enabled"

- When a feature is opt-in per item (or per company, per whatever), don't encode the opt-in state as a `mode = 'NotManaged'` value on the parent table. Use a side table keyed by the parent's id; absence of a row = not enabled. Cleaner queries (no `WHERE mode <> 'NotManaged'` plumbing), narrower parent table, CHECKs on the side table can be tighter (no need to permit NULL fields for the "not enabled" case).
- Applied to `itemShelfLife` — started on `item` with a 3-value enum and two conditional fields; refactored to a side table with a 2-value enum where absence means the third case.

## Upsert helpers must not clobber on partial submits

- A single server action can receive form data from multiple different forms (different UIs posting to the same `$id.details.tsx`). If the upsert helper treats `undefined` as "clear the row", any form that doesn't include the field silently deletes data. Rule:
  - `undefined` -> no-op (form didn't opine, leave it alone)
  - explicit sentinel like `'NotManaged'` -> clear (user explicitly opted out)
  - real value -> upsert
- The Zod validator's `.default("SomeValue")` can defeat this: a missing form field gets the default, which is then passed as an explicit value to the helper. Mark the field `.optional()` instead and gate defaults on the form's `initialValues`.

## `.merge()` breaks after `.refine()`

- Zod's `.refine()` returns a `ZodEffects`, which is no longer a `ZodObject` — so downstream `.merge(...)` calls fail with a type error. When a base object needs to be shared across several validators AND have refines, keep the raw `z.object()` exported for merging and apply the refines in a helper applied to each merged child validator. See `applyStorageAndShelfLifeRefines` in `items.models.ts`.

## Supabase upsert with `onConflict` clobbers audit fields

- `.upsert({ createdBy, updatedBy, ... }, { onConflict: "itemId" })` sets both `createdBy` and `updatedBy` via `ON CONFLICT DO UPDATE SET ... = EXCLUDED....`, which overwrites `createdBy` on every update. When audit semantics matter, do an explicit `SELECT ... maybeSingle()` + branch on existence: `INSERT` sets `createdBy`, `UPDATE` sets `updatedBy`/`updatedAt`. `upsertItemShelfLife` follows this pattern.

## ERP app has no vitest infrastructure

- `apps/erp` has no vitest config and no tests. Adding unit tests for validators there requires setting up vitest + mocking the supabase client — not a 5-minute job. If a task says "add validator tests", the estimate should include test-infrastructure setup unless `packages/*` (which does have vitest) is the right home for the pure function.

## Use `accountId` not `accountNumber`

- The codebase has migrated from `accountNumber` to `accountId` for GL account references. The old `accountNumber`-based foreign keys in the DB schema (e.g., on `purchaseOrderLine`, `purchaseInvoiceLine`) are from older migrations — current code uses `accountId`. Always use `accountId` when referencing GL accounts.

## Do not commit without being asked

- Never create git commits unless the user explicitly asks to commit. Stage and commit only on request. The user wants to review changes before committing.

## Flex/grid + overflow scroll containers need an inline-size cap

- A scroll container (`overflow-x-auto`) nested in a `min-width:auto` flex/grid ancestor chain will **expand to its content width instead of scrolling** — the wide content blows out the `grid-cols-[auto_1fr]` track / flex column rather than triggering the scrollbar. The ERP shared `Table` (`apps/erp/app/components/Table/Table.tsx`) hit this when commit `0a1bfd0a0` dropped `contain: strict` from `#table-container`: `strict` includes inline-size containment which had been capping the width. Fix is `[contain:inline-size]` on the scroll container (caps width without the paint-clipping of `strict`/`size`, and leaves block-axis/vertical scroll untouched). Generic CSS alternative: `min-w-0` on every flex/grid ancestor, or `grid-cols-[auto_minmax(0,1fr)]`.
- Verified by isolating the exact DOM chain in a standalone HTML file and measuring `scrollWidth > clientWidth` per variant, then applying the rule to the live table DOM via `agent-browser eval`.

## React.memo comparators must include every prop that affects render output

- ERP shared `Table` body rows AND cells are BOTH wrapped in `memo` with custom comparators — `Row.tsx` (`MemoizedRow`) and `Cell.tsx` (`MemoizedCell`). Pinned-column `left` offsets are computed by `getPinnedStyles`, a `useCallback` keyed on `[columnPinning.left, columnSizeMap]`. `columnSizeMap` starts empty and is filled by a measurement `useEffect` *after* first paint. The `<Td>` in `Cell.tsx` is what actually applies `getPinnedStyles`. If either comparator omits `getPinnedStyles`, the subtree keeps its first-render styles (all pinned cells at `left:0`) — so pinned body cells stack on top of the checkbox/Select column. Headers (not memoized) update fine, which is the tell: header pinned `left` ≠ body pinned `left`.
- Fix required adding `prev.getPinnedStyles === next.getPinnedStyles` to BOTH comparators. Fixing only `Row` is insufficient: even when the row re-renders and passes the fresh function down, the memoized `Cell` ignores it. (I shipped the Row-only fix first and the bug was unchanged — always trace the prop to the component that consumes it, and check every `memo` between the state and the DOM.) Safe because the callback's identity is stable except when pinning/sizes actually change (the `setColumnSizeMap` updater diff-guards, returning the previous map when widths are unchanged) — no extra re-renders in steady state.
- Both this bug and the horizontal-scroll bug above were introduced by the same commit `0a1bfd0a0` ("feat: salary records…"), which rewrote the Table component. Its *old* row comparator was effectively broken (`next.selectedCell?.row === prev.row.index` is almost always false → rows re-rendered constantly), which accidentally masked the stale-`getPinnedStyles` latent bug. "Fixing" the memo exposed it. When a perf/memoization fix surfaces a visual regression, suspect a missing dependency in the comparator, not the fix itself.

## Read the bug report literally; multiple dev servers per worktree

- "not scrollable" defaulted me to vertical scroll; the user meant **horizontal** ("horizontal scroll bro"). Confirm the axis before investigating.
- This machine runs several Carbon worktrees, each with its own ERP dev server on a different port (`carbon/login` on :3000, `carbon/ui-fix` on :52046 per `.env.local` `PORT_ERP`). Before browser-testing a worktree edit, confirm which port serves *this* worktree (`lsof -p <pid>` → cwd), or HMR won't reflect your changes. Dev-bypass login: enter `DEV_BYPASS_EMAIL` on the login form (only works if the dev server was started after that env var was set, else it falls back to OTP via Inbucket on `PORT_INBUCKET`).

## Bash fallbacks when tools are missing

- `pandoc` is not on the user's machine. For `.docx` extraction, use the `anthropic-skills:docx` skill's `unpack.py` (needs `defusedxml`; install via `mise x python@3.14.2 -- pip install defusedxml`) or an equivalent Python/JS extraction, rather than assuming pandoc is available.

## Verify which component a callsite actually renders before calling it "broken"

- When auditing a shared component's callsites, confirm the JSX tag resolves to
  the import you think it does. A name like `<StorageUnit>` can be a *local*
  function in the same file (ShipmentLines defines its own `StorageUnit` over
  `useStorageUnits` + `Combobox`), not the shared shim. I wrongly concluded the
  shim was "broken" and edited the callsite, breaking the type (`storageUnit`
  was a `string` there, not `ListItem`).
- Rule: before claiming a callsite is broken or changing its `onChange` shape,
  grep the file for a local `function <Name>` / `const <Name> =` shadowing the
  import, and check the actual prop/callback types at that callsite.

## Setting up an unfamiliar framework: read its llms.txt first

- When scaffolding/configuring a tool I don't have current knowledge of (e.g. Fumadocs), fetch its
  `llms.txt` / `llms-full.txt` and the specific setup pages for *authoritative, current* file contents
  before relying on memory or fighting an interactive `create-*` CLI. I burned time PTY-scripting
  `create-fumadocs-app` past its prompts and got shallow WebFetch results; the user pointed me to
  `fumadocs.dev/llms.txt`, which gave the exact verbatim setup and unblocked a clean hand-build.
- Corollary: don't over-invest in automating an interactive CLI. If two attempts at non-interactive
  flags / PTY-driving don't work, pivot to hand-creating files from the docs.

## Always smoke-test docs/UI in dark mode specifically

- A docs build can pass and look perfect in light mode while content is *invisible* in dark mode. Cause
  here: `@tailwindcss/typography`'s `.prose` (pulled in by `packages/config/tailwind/theme.css`) applies
  fixed gray colors that collide with another `.prose` consumer (Fumadocs) and don't adapt to `.dark`.
  Fix = point `--tw-prose-*` at theme tokens. Lesson: verify both themes, not just the default.

## The cache can be stale — verify feature EXISTENCE against code, never assert absence from cache alone

- `llm/cache/` is curated and usually right, but it lags the code. It told me (via subagents) that
  **Kits don't exist** and that **"backflushing" isn't Carbon terminology** — both **wrong**. Code proves
  it: `kit BOOLEAN` on items with a Subassembly/Kit toggle in `BillOfMaterial.tsx`; `backflush_job_materials()`
  RPC + a "Backflush" section in the BoM + a `Backflush` locale string. The user had to correct me twice.
- Rule: before telling the user a feature/term **doesn't exist**, grep the real source of truth —
  `packages/database/supabase/migrations/*.sql` (enum/`CREATE TYPE`/column names), `packages/locale/locales/en/erp.po`
  (UI strings), and the relevant `apps/*/app/modules/**` models/components. Cache is a *starting* point for
  existence claims, not the *authority*. A subagent that only read the cache will confidently repeat its gaps.
- Also: don't trust a single agent's "X isn't real" conclusion. The agent claimed "8D" wasn't a Carbon term;
  code shows it IS (a configurable Issue **workflow** — `IssueWorkflowForm.tsx` names "an 8D workflow"), over the
  `nonConformance` model whose required actions are `Containment`/`Corrective`/`Preventive`/`Verification`/`Communication`.
- Corollary for docs: I had **fabricated** a finite-capacity "Capacity" planning section; scheduling is actually
  infinite-capacity Kanban (work-center columns + date columns, drag gated by process, not capacity). Don't invent
  plausible-sounding mechanics — verify each claimed behavior against code, then write only what's real.

## Carbon manufacturing facts (code-verified, for the docs guide)

- `methodType` CURRENT values are `Make to Order` / `Purchase to Order` / `Pull from Inventory` — the column
  literally stores these (`mes/operations.service.ts` filters `methodType = "Make to Order"`; `en/erp.po` has these
  msgids; `MethodIcon` in `Icons.tsx` switches on them). The 2023 `parts.sql` enum (`Make`/`Buy`/`Pick`) was RENAMED
  — do NOT use the short forms in docs/UI. (Bit me: I shipped guide copy saying "Make, Buy, Pick" by reading the
  oldest migration. See [[feedback_timestamped_migrations_read_newest]].) Lives on the **item**; BoM material rows
  mirror it read-only (cascades to Draft methods).
- `itemReplenishmentSystem`: `Buy` / `Make` / `Buy and Make` — a SEPARATE axis from `methodType` (decides planning queue).
- `itemReorderingPolicy`: `Manual Reorder` / `Demand-Based Reorder` / `Fixed Reorder Quantity` / `Maximum Quantity`,
  with `reorderPoint`, `reorderQuantity`, `minimumOrderQuantity`/`maximumOrderQuantity`, `maximumInventoryQuantity`,
  `lotSize`, `demandAccumulationPeriod` (migration `20230330024716_parts.sql`, planning cols in `20260324120000_*`).
- **Kit vs Subassembly**: a Make-to-Order BoM item toggles between `Subassembly` (own job + routing) and `Kit`
  (components issued together into the parent job, no separate build; `isKitComponent` on MES, `issue` fn filters `kit=true`).
- **Get Method**: jobs get a copied `jobMakeMethod` (not a live link to the part's `makeMethod`); push-up via
  `production_upsertMakeMethodFromJobMethod`. Method `status`: `Draft`/`Active`/`Archived`, only Draft mutable.
- **Schedule** = Kanban (`Kanban.tsx` work-center columns / `DateKanban.tsx` date columns), infinite capacity,
  `/x/scheduling/gantt` is mock-only. **Outside operations** (`operationType` `Inside`/`Outside`) raise an
  "Outside Processing" PO via `supplierProcess`. MES Controls = `Setup`/`Labor`/`Machine` toggles (`productionEvent`),
  `Issue Material`, `Log Completed/Scrap/Rework`, `Finish` (no "Close Out" button in live code).

## Method-less `curl` sent POST here — always test GET endpoints with `-X GET`

- Spent a long debugging loop on a "405 Method Not Allowed" from a Next route that exported `{ GET }`
  correctly. Root cause was NOT the route: in this environment a plain `curl "<url>"` (no `-X`) was hitting
  the server as **POST** (dev log showed `POST /api/search ... 405`), even with **no `~/.curlrc`**. The route's
  GET worked the whole time — `curl -X GET` returned 200. I wrongly blamed stale `.next` chunks and restarted
  the dev server chasing a ghost.
- Rule: when smoke-testing an HTTP GET endpoint via Bash curl, **always pass `-X GET` explicitly** and confirm
  the dev server's own request log shows the method you intended before concluding the handler is broken. A fast
  405 (no recompile time) = method mismatch, not a dead module; a module-eval throw shows as **500**, not 405.

## Fumadocs search: use the canonical `export const { GET }`, cap on the client, parse `<mark>` from content

- Server route: always `export const { GET } = createSearchAPI('advanced', { language, indexes })` (or
  `createFromSource`). Do NOT hand-roll `export async function GET`. `initAdvancedSearch` is only for non-Next
  backends (Express/Elysia) where you call `.search()` yourself. The client `fetchClient` uses **GET**.
- Multi-surface search = one combined `indexes` array, each entry `tag`ged; the `tag` query param filters. There
  is **no server-side result limit** in fumadocs — cap on the client (results come back grouped by page).
- Result `content` from the fetch client carries **literal `<mark>…</mark>`** highlight tags (entity-escaped to
  `&lt;mark&gt;` inside shiki HTML, raw `<mark>` in plain result text). `contentWithHighlights` is NOT populated —
  split `content` on `/(<mark>|<\/mark>)/` and style the marked parts yourself.
- The index builds at module load from `source.getPages()`; after renaming a content dir (`content/guide` →
  `content/guides`) or changing `defineDocs({ dir })`, run `pnpm exec fumadocs-mdx` to regenerate `.source`, and
  the search index only reflects it after the dev server rebuilds the route.

## An "empty picker" is usually a filter prop, not a broken flow

- PO lines showed no Styles because `PurchaseOrderLineForm` passed `replenishmentSystem="Buy"` to `<Item>` and
  styles are replenished by `Make`. `Item`'s filter is a plain `.filter()` over the `useItems` store — check the
  props being passed *before* suspecting the store, the query, or the selection flow.
- When a picker looks empty locally, first switch its type filter to "All Items". If that's empty too, the client
  item store never hydrated (`RealtimeDataProvider` fetches `item` with the browser client) and the environment
  is the problem, not the filter. The store caches to localforage under the `items` key, so seeding that key and
  reloading is a fast way to exercise filter logic without a full DB.
- Relaxing one filter branch must not relax the others: after skipping the Buy filter for `Style`, verify a
  `Make` *Part* is still hidden.

## Verifying in a worktree without `crbn up`

- A bare `react-router dev` in a worktree misses env that `crbn` injects: copy both the primary worktree's `.env`
  (has `SESSION_SECRET`) and `.env.local` (ports, Supabase keys) and `set -a; . ./.env; . ./.env.local` before
  starting, since vite's `envDir` is the app dir, not the repo root.
- `DEV_BYPASS_EMAIL` only works for a user that exists and is active in the DB *and* the account must belong to
  the company that owns the record under test — query `userToCompany` first rather than guessing.

## Style quantity grid icon: don't gate on `requiresConfiguration`

- Style items can have `configurationParameter` rows (color/size) while
  `itemReplenishment.requiresConfiguration` is still `false` (seen on local
  "Test T-Shirt"). Gating `QuantityWithConfigTable`'s grid adornment on
  `requiresConfiguration` / `useConfigurableItems()` hid the icon even after
  selecting a Style.
- For PO/SO Style lines, show the grid trigger when `itemType === "Style"` and
  an `itemId` is set. Job/Part forms can keep the store/API hydrate pattern.
- Rebuilding `purchaseOrderLines` after adding a column must match the local
  schema: `LEFT JOIN "fixedAsset"` fails if that table isn't migrated yet — don't
  DROP the view until the CREATE succeeds.

## Controlled form inputs that bypass their hidden input never clear validation errors

- `Select`/`SelectControlled` (`packages/form/src/components/`) render a `type="hidden"` input that carries
  `getInputProps()`, but the actual value change goes through `useControlField`'s setter. That setter updates the
  store and marks the field touched — it never calls `validate()`/`clearError()`. So after a failed submit the
  field error (e.g. "Method is required") stays on screen even once the user picks a valid option, and only
  disappears on the next submit. Fix: call `validate()` from the component's own change handler, which is the
  existing convention (`TimePicker`, `DatePicker`, `NumberControlled` all do this).
- `useField().validate()` = `smartValidate({ alwaysIncludeErrorsFromFields: [name] })`, which awaits the pending
  controlled-value update and only surfaces *new* errors for touched/submitted fields, so calling it on change is
  safe — it will not spray unrelated errors across a pristine form.
- Zod base-parse failures short-circuit `.refine()`s: an empty enum value on one field can hide every refinement
  error (e.g. "Part is required" never rendered until the method enum parsed).

## Postgres freezes `SELECT tbl.*` in views — adding a column needs the view recreated

- Adding a column to `salesOrderLine` does NOT make it appear in the `salesOrderLines` view even though the view
  is written `SELECT sl.*`: `*` is expanded to a fixed column list at creation. Anything reading through the view
  (`getSalesOrderLine` selects `*` from the view) silently gets `undefined` for the new column, which then looks
  like an app bug (config total 0 → quantity zeroed, Save disabled).
- Convention here is `DROP VIEW IF EXISTS` + recreate with the **latest committed** definition (187 migrations do
  this). Always dump the current definition (`pg_get_viewdef`) before copying an older migration's body, or the
  recreate silently drops columns a newer migration added.
- The local dev DB in a worktree can diverge from the repo's migration history (e.g. it had `colorCode`/`sizeCode`
  on the SO line view and no `fixedAsset` table at all). Verify against the DB you're actually testing on before
  concluding the code is wrong.

## SO line create: missing `sortOrder` looks like a generic "Failed to create"

- `upsertSalesOrderLine` always inserts `sortOrder`. If the local DB never applied
  `20260513120001_line-item-sort-order.sql`, PostgREST returns PGRST204 ("Could not
  find the 'sortOrder' column") and the overlay only shows "Failed to create sales
  order line". Reproduce with a direct REST insert of the same payload before
  blaming Style/configuration logic.
- Also null out empty optional text fields (`storageUnitId`, `promisedDate`, …) on
  insert — `""` fails FK/date checks even when zfd usually strips them.
- Surface the PostgREST `error.message` in the overlay `{ ok: false, error }` payload
  so the toast carries the real reason next time.

## Enter in inputs implicitly submits ValidatedForm overlays

- Browser default: Enter while focused on a text/number input submits the form via the Save button. After picking an item, focus often lands on Quantity — one more Enter looks like "auto-save on pick".
- cmdk already `preventDefault`s Enter inside Command, so combobox Enter-to-pick should not submit the parent form.
- Do NOT add a form-level submit "arm gate" — fix the real click-through instead.

## Overlay ModalContent clips; form body must scroll

- Registry modal shells use `configParamsModalContentClassName` (`max-h-[92vh] overflow-hidden flex-col`). Content taller than the viewport is clipped unless an inner region scrolls.
- Pattern (same as PO line overlay): form/Tabs `flex max-h-[85vh] flex-col`, header/footer `shrink-0`, body `min-h-0 flex-1 overflow-y-auto`. Do not rely on `max-h-full` alone — parent `max-height` does not always give children a definite percentage height.

## Style SO lines: grid is mandatory (match PO)

- Gate the quantity grid on `isStyleLine && itemId`, NOT `requiresConfiguration` / `useConfigurableItems()` (async race left Save open with qty 1).
- Server refine: Style + itemId requires `saleQuantity > 0` and non-empty `configuration`.
- Edit action: only spread `configuration` when updating (PO pattern) — never pass bare `undefined` through `sanitize` (becomes NULL and wipes the grid).
- Type change to Style zeros quantity; item pick never keeps the previous item's Method (`?? ""` not `?? d.methodType`).

## Combobox option click can ghost-click Save under the portal

- Symptom: pick an item (e.g. BEARING-6205 / Style 111333), method fills, modal saves/closes — no Enter pressed. There is NO separate autosave API; it's the footer Submit.
- Cause: selecting closes the portaled list mid-gesture; the leftover click lands on Save. Method preload made the form valid, so that accidental Save succeeded (empty Method used to fail validation — looked like "Method made it save").
- Fix: `suppressDocumentPointerEventsUntilGestureEnds()` (Radix DismissableLayer pattern) before `setOpen(false)` in Combobox/Creatable/GroupedCreatable + CommandItem `onMouseDown` preventDefault + flushSync disable Save while price resolves. Never submit-arm gates.


## Style transfer modal: pass inventory as `buildReferenceContext`

- Opening `useConfigTableModal` with only `itemId` + `configuration` shows the
  color×size grid but **no** per-cell hints and **no** max enforcement.
- Production reporting gets hints via `buildReferenceContext` → `referenceByRowIndex`
  (plan remaining). Transfers need the same channel with **on-hand by color×size**
  from `itemLedger` (`getStyleOnHandByColorSize` / `api/inventory/style-on-hand`).
- Matrix mode historically only yellow-highlighted mismatches; hard-block Confirm
  when any cell exceeds its reference (inventory or plan).

## Language switch “broken” on production login
- Symptom: changing language on the production ERP login page appears to do nothing / isn’t possible.
- Cause: language picker lives only in the post-login avatar menu; login has no switcher even though `/api/locale` is public and catalogs work. Production `DEFAULT_LANGUAGE=zh` amplifies this.
- Rule: if a preference endpoint is documented for public pages, keep a public UI (or remove the claim). Verify the actual surface the user hits (`/` → login) has the control.

## Post-login language switch no-op = dual-scope `locale` cookie
- Symptom: AvatarMenu language switch reloads but UI stays on the old language (often after login / on Vercel where `DOMAIN` is set).
- Cause: Domain-scoped `locale` from `/api/locale` shadowed by an older host-only `locale`; Cookie header sends host-only first; `cookie.parse` keeps first.
- Same class as session `carbon` cookie / `cookieDomainMigrationMiddleware`. Preference cookies need the same stale-scope expiry on write.
- Quick check: DevTools → Application → Cookies → two `locale` rows (one with Domain, one without).
