# MES home screen & section visibility

## Home + sidebar sections
The MES app exposes the same set of "sections" in two places, kept in the same
order:

- **Home cards**: `apps/mes/app/routes/x+/_index.tsx` (`sections: HomeSection[]`,
  each with a stable `key`). Rendered in a responsive card grid.
- **Sidebar**: `apps/mes/app/components/AppSidebar.tsx` → `OperationsNav`
  (`links`, each with a matching `key`).

Canonical section keys (order): `pickup, report, schedule, assigned, active,
recent, jobs, salary, maintenance, picking`. Keep the two lists in sync.

The card look is shared via `apps/mes/app/components/HomeCard.tsx`
(`homeCardClass` + `<HomeCardBody icon title description />`). The home route's
`HomeCard` (a `Link`) and the tool triggers all use it.

## Tools on the home screen
The sidebar Tools also appear as home cards: `AdjustInventory` (add / !add),
`EndShift`, `Suggestion`. Each takes `variant?: "sidebar" | "card"` (default
`"sidebar"`). In `"card"` mode the component renders a `homeCardClass` button
(for Suggestion, that button is the `PopoverTrigger asChild`) instead of the
`SidebarMenuButton`, reusing the exact same modal/popover. The home route
appends `<AdjustInventory add variant="card" />` etc. into the same grid.
These tools are always shown (not part of `hiddenMesSections`).

The home container uses `flex flex-1 flex-col ... overflow-y-auto bg-muted`
(NOT `h-full`). It is a flex child of the `SidebarProvider` row (`flex
min-h-svh`), so `flex-1` + default `align-items: stretch` fills the viewport
height. `h-full` (height:100%) collapses to content height under a
`min-h-svh`-only parent, leaving a white gap below the cards — do not use it.

## Per-company section visibility (ERP-controlled)
Admins hide MES sections from **ERP → Settings → MES**
(`apps/erp/app/routes/x+/settings+/mes.tsx`, path `path.to.mesSettings`,
registered in `useSettingsSubmodules.tsx` under the Modules group).

- Stored in `companySettings.hiddenMesSections` TEXT[] (migration
  `20260716193847_company-hidden-mes-sections.sql`; mirrors `hiddenSubmodules`).
  Stores the **hidden** section keys; default `'{}'` = all shown.
- Service: `updateHiddenMesSectionsSetting` in `settings.service.ts`
  (barrel-exported). `getCompanySettings` uses `select("*")` so no change there.
- MES reads it in `apps/mes/app/routes/x+/_layout.tsx` loader (added to the
  `companySettings` select + returned as `hiddenMesSections`). Passed as a prop
  to `AppSidebar` (sidebar filters `links`); the home route reads it via
  `useRouteData(path.to.authenticatedRoot)` and filters `sections`.

The settings toggle UI is self-contained in the route (the shared
`SubmoduleVisibility` component is shaped for ERP route groups, not MES keys).

The Tools are ALSO toggleable via `hiddenMesSections` (keys `addInventory`,
`removeInventory`, `endOperations`, `suggestion`): the ERP settings list
includes them, the home route wraps each tool card in a
`!hiddenMesSections.includes(key)` check, and `ToolsNav` (in AppSidebar) takes
`hiddenMesSections` and hides each tool + its group when empty.
