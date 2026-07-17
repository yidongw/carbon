import type { Company } from "@carbon/auth";
import { useRouteData } from "@carbon/react";
import type { Location } from "~/services/types";
import type { PinnedInUser } from "~/types";
import { path } from "~/utils/path";
import { UserNav } from "./AppSidebar";

type LayoutData = {
  company: Company;
  companies: Company[];
  consoleEnabled?: boolean;
  consoleMode: boolean;
  location: string;
  locations: Location[];
  pinnedInUser: PinnedInUser | null;
};

/**
 * The user/profile menu for the MES top bar. Self-contained — it reads the
 * authenticated layout's data via useRouteData, so pages can drop it into
 * their header without threading the props through.
 */
export function TopbarProfile() {
  const data = useRouteData<LayoutData>(path.to.authenticatedRoot);
  if (!data?.company) return null;
  return (
    <UserNav
      variant="topbar"
      company={data.company}
      companies={data.companies}
      consoleEnabled={data.consoleEnabled}
      consoleMode={data.consoleMode}
      location={data.location}
      locations={data.locations}
      pinnedInUser={data.pinnedInUser}
    />
  );
}
