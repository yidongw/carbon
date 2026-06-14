# Lessons

Patterns learned from corrections. Review at the start of each session.

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

## Supabase PKCE: `persistSession: false` silently ignores the custom storage adapter

- In `@supabase/auth-js`, when `persistSession: false`, the client ignores any `storage` option and uses its own internal `memoryStorage` instead. This affects BOTH writes AND reads.
- In the PKCE magic-link flow, `exchangePkceCode` pre-seeds a `Map` with the code verifier and passes it as `storage`. With `persistSession: false`, the Map is ignored and `exchangeCodeForSession` reads from empty internal storage → sends empty `code_verifier` → Supabase rejects with "expired or already used".
- The same bug affected `sendMagicLink` (fixed in `9e646783c` by removing `persistSession: false`). `exchangePkceCode` was missed.
- Rule: **never set `persistSession: false` when providing a custom storage adapter** to a Supabase PKCE client. The default (`persistSession: true`) is required for Supabase to actually use the adapter.

## Bash fallbacks when tools are missing

- `pandoc` is not on the user's machine. For `.docx` extraction, use the `anthropic-skills:docx` skill's `unpack.py` (needs `defusedxml`; install via `mise x python@3.14.2 -- pip install defusedxml`) or an equivalent Python/JS extraction, rather than assuming pandoc is available.
