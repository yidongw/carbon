# MES top nav bar & profile menu

The user/profile menu lives in a **top bar on the right**, ERP-style — it is
NO LONGER in the sidebar footer.

- `UserNav` (`apps/mes/app/components/AppSidebar.tsx`) takes
  `variant?: "sidebar" | "topbar"`. `"topbar"` renders an avatar-only trigger
  with the same dropdown (account/company/location/dark-mode/console/sign-out).
- `TopbarProfile` (`components/TopbarProfile.tsx`) wraps `UserNav variant="topbar"`
  and reads the layout data itself via `useRouteData(path.to.authenticatedRoot)`,
  so any header can drop it in with no props.
- `MesTopbar` (`components/MesTopbar.tsx`) is the shared bar: `SidebarTrigger` +
  optional title/children on the left, `TopbarProfile` on the right, same
  `--header-height` as the per-page headers. Used on pages that had no header:
  home (`x+/_index.tsx`), `BundleScanPage` (pickup/report), `bundle.$…`.

Pages that already had their own `<header>` (operations, jobs, active,
assigned, recent, salary, maintenance, picking._index, job.$, dispatch.$,
picking.$, JobOperation) now render `<TopbarProfile />` on the right of that
header.

**Important:** there is intentionally NO global layout-level top bar. Many MES
pages size content with hardcoded `h-[calc(100dvh-var(--header-height)*N)]`
(Kanban ColumnCard, JobOperation, several list routes). A layout bar would
shift everything down and break those calcs, so the profile is added inside
each existing header instead (zero height-math change). See
[[project_demo_banner_hardcoded_heights]].
