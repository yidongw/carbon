import { useLingui } from "@lingui/react/macro";
import {
  LuChartLine,
  LuCirclePlay,
  LuClipboardCheck,
  LuLayoutDashboard,
  LuListChecks,
  LuShieldCheck,
  LuSquareChartGantt,
  LuSquareKanban,
  LuTrash
} from "react-icons/lu";
import { usePermissions } from "~/hooks";
import { useSavedViews } from "~/hooks/useSavedViews";
import type { AuthenticatedRouteGroup } from "~/types";
import { path } from "~/utils/path";

export default function useProductionSubmodules() {
  const { t } = useLingui();
  const permissions = usePermissions();

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
          name: t`Procedures`,
          to: path.to.procedures,
          icon: <LuListChecks />,
          table: "procedure",
          role: "employee"
        },
        {
          name: t`Quantity Review`,
          to: `${path.to.quantityReview}?filter=${encodeURIComponent("approvalStatus:eq:Pending")}`,
          icon: <LuClipboardCheck />,
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

  return {
    groups: productionRoutes
      .filter((group) => {
        const filteredRoutes = group.routes.filter((route) => {
          if (route.to.startsWith(path.to.quantityReview)) {
            return permissions.can("view", "people");
          }
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        });

        return filteredRoutes.length > 0;
      })
      .map((group) => ({
        ...group,
        routes: group.routes
          .filter((route) => {
            if (route.to.startsWith(path.to.quantityReview)) {
              return permissions.can("view", "people");
            }
            if (route.role) {
              return permissions.is(route.role);
            } else {
              return true;
            }
          })
          .map(addSavedViewsToRoutes)
      }))
  };
}
