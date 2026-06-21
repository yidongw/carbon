# Mobile Table Swipe Menu

## Mobile card rows (`TableCardRow`)
- Used below `md` breakpoint in `apps/erp/app/components/Table/Table.tsx`
- Row actions: swipe left on a card to open the row action menu directly (no visible ⋮ button)
- Card follows the finger during swipe, opens the menu on release, then smoothly snaps back
- Hook: `apps/erp/app/hooks/useSwipeReveal.ts` (`DEFAULT_SWIPE_OPEN_OFFSET = 80`)

## Desktop table row actions
- `RowActionMenu` in sticky right-pinned `Actions` column
- `ActionMenu` (`packages/react/src/ActionMenu.tsx`) suppresses opens when pointer moved >8px (prevents accidental open during horizontal table scroll on touch)

## Related files
- `apps/erp/app/components/Table/components/TableCardRow.tsx`
- `apps/erp/app/components/Table/components/RowActionMenu.tsx`
- `apps/erp/app/components/Table/components/RowActionsContainer.tsx`
- `packages/react/src/ActionMenu.tsx`
