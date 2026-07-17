import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { Heading, useRouteData } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { IconType } from "react-icons";
import {
  LuActivity,
  LuBadgeCheck,
  LuBanknote,
  LuCalendarDays,
  LuCirclePlay,
  LuClipboardList,
  LuHistory,
  LuPackageCheck,
  LuWrench
} from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { AdjustInventory } from "~/components/AdjustInventory";
import { EndShift } from "~/components/EndShift";
import { HomeCardBody, homeCardClass } from "~/components/HomeCard";
import { MesTopbar } from "~/components/MesTopbar";
import { useUser } from "~/hooks";
import { getJobOperationsAssignedToEmployee } from "~/services/operations.service";
import { path } from "~/utils/path";

type HomeSection = {
  key: string;
  title: string;
  description: string;
  to: string;
  icon: IconType;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  const assigned = await getJobOperationsAssignedToEmployee(
    serviceRole,
    userId,
    companyId
  );

  return { counts: { assigned: assigned.data?.length ?? 0 } };
}

export default function MesIndexRoute() {
  const { t } = useLingui();
  const user = useUser();
  const { counts } = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    hiddenMesSections?: string[];
    activeEvents?: number;
    activeMaintenanceCount?: number;
  }>(path.to.authenticatedRoot);
  const hiddenMesSections = routeData?.hiddenMesSections ?? [];

  // Counts shown on the right of the cards (like the sidebar badges).
  const sectionCounts: Record<string, number | undefined> = {
    assigned: counts.assigned,
    active: routeData?.activeEvents,
    maintenance: routeData?.activeMaintenanceCount
  };

  const sections: HomeSection[] = [
    {
      key: "schedule",
      title: t`Schedule`,
      description: t`Work scheduled at your work centers`,
      to: path.to.operations,
      icon: LuCalendarDays
    },
    {
      key: "assigned",
      title: t`Assigned`,
      description: t`Operations assigned to you`,
      to: path.to.assigned,
      icon: LuClipboardList
    },
    {
      key: "active",
      title: t`Active`,
      description: t`Operations you are currently working on`,
      to: path.to.active,
      icon: LuActivity
    },
    {
      key: "recent",
      title: t`Recent`,
      description: t`Recently completed work`,
      to: path.to.recent,
      icon: LuHistory
    },
    {
      key: "jobs",
      title: t`Jobs`,
      description: t`Browse released jobs on the floor`,
      to: path.to.jobs,
      icon: LuCirclePlay
    },
    {
      key: "reportApprovals",
      title: t`Report Approvals`,
      description: t`Review and approve production reports`,
      to: path.to.productionReports,
      icon: LuBadgeCheck
    },
    {
      key: "salary",
      title: t`My Salary`,
      description: t`Review your earnings and payment history`,
      to: path.to.salary,
      icon: LuBanknote
    },
    {
      key: "maintenance",
      title: t`Maintenance`,
      description: t`Maintenance dispatches`,
      to: path.to.maintenance,
      icon: LuWrench
    },
    {
      key: "picking",
      title: t`Picking`,
      description: t`Picking lists to fulfill`,
      to: path.to.picking,
      icon: LuPackageCheck
    }
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <MesTopbar />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto bg-muted">
        <Heading size="h3">
          {t`Welcome`}
          {user?.firstName ? `, ${user.firstName}` : ""}
        </Heading>
        <hr className="h-px my-6 bg-black/10 border-0 dark:bg-white/10" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4 md:gap-6 mb-8">
          {sections
            .filter((section) => !hiddenMesSections.includes(section.key))
            .map((section) => (
              <HomeCard
                key={section.key}
                section={section}
                count={sectionCounts[section.key]}
              />
            ))}
          {!hiddenMesSections.includes("addInventory") && (
            <AdjustInventory add variant="card" />
          )}
          {!hiddenMesSections.includes("removeInventory") && (
            <AdjustInventory add={false} variant="card" />
          )}
          {!hiddenMesSections.includes("endOperations") && (
            <EndShift variant="card" />
          )}
        </div>
      </div>
    </div>
  );
}

const HomeCard = ({
  section,
  count
}: {
  section: HomeSection;
  count?: number;
}) => (
  <Link to={section.to} prefetch="intent" className={homeCardClass}>
    <HomeCardBody
      icon={section.icon}
      title={section.title}
      description={section.description}
    />
    {count !== undefined && (
      <span className="ml-auto shrink-0 pl-2 text-xl font-semibold tabular-nums text-muted-foreground">
        {count}
      </span>
    )}
  </Link>
);
