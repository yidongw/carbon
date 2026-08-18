# Mobile Table Swipe Menu

## Mobile card rows (`TableCardRow`)
- Used below `md` breakpoint in `apps/erp/app/components/Table/Table.tsx`
- Row actions: swipe left on a card to open the row action menu directly (no visible ⋮ button)
- Card follows the finger during swipe, opens the menu on release, then smoothly snaps back
- Hook: `apps/erp/app/hooks/useSwipeReveal.ts` (`DEFAULT_SWIPE_OPEN_OFFSET = 80`)

## Desktop table row actions
- `RowActionMenu` in sticky right-pinned `Actions` column
- `ActionMenu` (`packages/react/src/ActionMenu.tsx`) suppresses opens when pointer moved >8px (prevents accidental open during horizontal table scroll on touch)

## Row virtualization (windowing)
- Shared `Table` (`apps/erp/app/components/Table/Table.tsx`) windows large lists via
  `useVirtualRows` (`apps/erp/app/components/Table/useVirtualRows.ts`), a thin wrapper
  over `@tanstack/react-virtual` (already a dep; also used by TreeView/Gantt/Combobox).
- Gated by `VIRTUALIZATION_THRESHOLD` (50). At/below it the full, un-windowed render
  is kept (identical to pre-virtualization behavior).
- **Rows are measured, not fixed height.** Row height varies a lot (a plain text row
  vs. a thumbnail / multi-size-chip Styles row can be ~44px vs ~157px). Both desktop
  rows and mobile cards attach `virtualizer.measureElement`, so each rendered row is
  measured at its real height — this is what stops scroll jitter. `DESKTOP_ROW_HEIGHT`
  (44) / `MOBILE_CARD_ESTIMATE` (148) are only first-paint seeds.
- **Off-screen estimate = running average.** `useVirtualRows` wraps the virtualizer's
  `measureElement`: it records each measured row's height (keyed by `data-index`,
  O(1) incremental sum) and feeds the live average back via `estimateSize`, so the
  scrollbar length and long scrollbar jumps track the real list instead of the seed.
- **Desktop** (`#table-container`, which IS the vertical scroll element — `overflow-x-auto`
  makes `overflow-y` compute to `auto`): spacer-row technique — leading/trailing
  `<tr aria-hidden>` reserve off-screen height, only the visible slice renders between
  them. A ref is forwarded through the memoized `Row` (`forwardRef`) so the virtualizer
  can measure each `<tr>`. Disabled when `renderExpandedRow` is set (variable-height
  expansion rows) or inline edit mode is active (keyboard nav needs every cell mounted).
- **Mobile** (`.md:hidden` card scroller, ref `mobileScrollRef`): measured `translateY`
  window for variable card heights; card spacing via per-item `pb-3` (not container
  `gap`, so it's included in the measured height). Virtualizes even with expansion
  (measured inside the card).
- Both scroll containers set `[overflow-anchor:none]` so the browser's scroll anchoring
  doesn't fight the virtualizer's own scroll corrections when a measured row resizes
  (e.g. a thumbnail loads in).
- SSR-safe: fixed `initialRect` height (900) → server and first client render emit the
  same window (no hydration mismatch, no full-list first paint).
- Row markup factored into shared `renderDesktopRow` / `renderMobileCard` closures used
  by both the full and windowed paths (no duplication). Added PR #350.

## Related files
- `apps/erp/app/components/Table/useVirtualRows.ts`
- `apps/erp/app/components/Table/components/TableCardRow.tsx`
- `apps/erp/app/components/Table/components/RowActionMenu.tsx`
- `apps/erp/app/components/Table/components/RowActionsContainer.tsx`
- `packages/react/src/ActionMenu.tsx`
