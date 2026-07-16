import { useLingui } from "@lingui/react/macro";
import {
  LuChartLine,
  LuCirclePlay,
  LuLayoutDashboard,
  LuListChecks,
  LuPackageCheck,
  LuPackageOpen,
  LuScissors,
  LuShieldCheck,
  LuSquareChartGantt,
  LuSquareKanban,
  LuTrash
} from "react-icons/lu";
import { useCompanySettings, usePermissions } from "~/hooks";
import { useSavedViews } from "~/hooks/useSavedViews";
import type { AuthenticatedRouteGroup, Role } from "~/types";
import { path } from "~/utils/path";

export default function useProductionSubmodules(opts?: {
  includeHidden?: boolean;
}) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const companySettings = useCompanySettings();
  const hidden = (companySettings?.hiddenSubmodules ?? []) as string[];

  const productionRoutes: AuthenticatedRouteGroup[] = [
    {
      name: t`Dashboard`,
      routes: [
        {
          name: t`Dashboard`,
          to: path.to.productionDashboard,
          icon: <LuLayoutDashboard />
        }
      ]
    },
    {
      name: t`Manage`,
      routes: [
        {
          name: t`Jobs`,
          to: path.to.jobs,
          icon: <LuCirclePlay />,
          table: "job"
        },
        {
          name: t`Master Work Orders`,
          to: path.to.masterWorkOrders,
          icon: <LuScissors />,
          role: "employee"
        },
        {
          name: t`Bundle Work Orders`,
          to: path.to.bundleWorkOrders,
          icon: <LuPackageOpen />,
          role: "employee"
        },
        {
          name: t`Procedures`,
          to: path.to.procedures,
          icon: <LuListChecks />,
          table: "procedure",
          role: "employee"
        },
        {
          name: t`Process Completions`,
          to: path.to.productionQuantities,
          icon: <LuPackageCheck />,
          role: "employee"
        }
      ]
    },
    {
      name: t`Plan`,
      routes: [
        {
          name: t`Planning`,
          to: path.to.productionPlanning,
          icon: <LuSquareChartGantt />,
          table: "production-planning"
        },
        {
          name: t`Projections`,
          to: path.to.demandProjections,
          icon: <LuChartLine />,
          table: "demand-projection"
        },
        {
          name: t`Schedule`,
          to: path.to.scheduleDates,
          icon: <LuSquareKanban />
        }
      ]
    },
    {
      name: t`Configure`,
      routes: [
        {
          name: t`Assignment Rules`,
          to: path.to.jobRules,
          role: "employee",
          icon: <LuShieldCheck />
        },
        {
          name: t`Scrap Reasons`,
          to: path.to.scrapReasons,
          role: "employee",
          icon: <LuTrash />
        }
      ]
    }
  ];
  const { addSavedViewsToRoutes } = useSavedViews();

  const isVisible = (route: { role?: string; to?: string }) => {
    if (route.role && !permissions.is(route.role as Role)) return false;
    if (!opts?.includeHidden && route.to && hidden.includes(route.to)) {
      return false;
    }
    return true;
  };

  return {
    groups: productionRoutes
      .map((group) => ({
        ...group,
        routes: group.routes.filter(isVisible).map(addSavedViewsToRoutes)
      }))
      .filter((group) => group.routes.length > 0)
  };
}
