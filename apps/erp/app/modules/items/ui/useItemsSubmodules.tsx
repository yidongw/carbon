import { useLingui } from "@lingui/react/macro";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuAtom,
  LuAxis3D,
  LuBeef,
  LuDessert,
  LuGlassWater,
  LuGroup,
  LuHammer,
  LuLayoutTemplate,
  LuPalette,
  LuPizza,
  LuPuzzle,
  LuRuler,
  LuShapes,
  LuShirt
} from "react-icons/lu";
import { useCompanySettings, usePermissions } from "~/hooks";
import { useSavedViews } from "~/hooks/useSavedViews";
import type { AuthenticatedRouteGroup, Role } from "~/types";
import { path } from "~/utils/path";

export default function useItemsSubmodules(opts?: {
  includeHidden?: boolean;
}) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const companySettings = useCompanySettings();
  const hidden = (companySettings?.hiddenSubmodules ?? []) as string[];
  const { addSavedViewsToRoutes } = useSavedViews();
  const itemsRoutes: AuthenticatedRouteGroup[] = [
    {
      name: t`Manage`,
      routes: [
        {
          name: t`Parts`,
          to: path.to.parts,
          icon: <AiOutlinePartition />,
          table: "part"
        },
        {
          name: t`Materials`,
          to: path.to.materials,
          icon: <LuAtom />,
          table: "material"
        },
        {
          name: t`Tools`,
          to: path.to.tools,
          icon: <LuHammer />,
          table: "tool"
        },
        {
          name: t`Consumables`,
          to: path.to.consumables,
          icon: <LuPizza />,
          table: "consumable"
        },
        {
          name: t`Templates`,
          to: path.to.templates,
          icon: <LuLayoutTemplate />
        },
        {
          name: t`Styles`,
          to: path.to.styles,
          icon: <LuShirt />
        }
      ]
    },
    {
      name: t`Style Properties`,
      routes: [
        {
          name: t`Colors`,
          to: path.to.styleColors,
          icon: <LuPalette />,
          role: "employee"
        },
        {
          name: t`Sizes`,
          to: path.to.styleSizes,
          icon: <LuRuler />,
          role: "employee"
        }
      ]
    },
    {
      name: t`Material Properties`,
      routes: [
        {
          name: t`Dimensions`,
          to: path.to.materialDimensions,
          icon: <LuAxis3D />,
          role: "employee"
        },
        {
          name: t`Finishes`,
          to: path.to.materialFinishes,
          icon: <LuDessert />,
          role: "employee"
        },
        {
          name: t`Grades`,
          to: path.to.materialGrades,
          icon: <LuBeef />,
          role: "employee"
        },
        {
          name: t`Shapes`,
          to: path.to.materialForms,
          icon: <LuShapes />,
          role: "employee"
        },
        {
          name: t`Substances`,
          to: path.to.materialSubstances,
          icon: <LuGlassWater />,
          role: "employee"
        },
        {
          name: t`Types`,
          to: path.to.materialTypes,
          icon: <LuPuzzle />,
          role: "employee"
        }
      ]
    },
    {
      name: t`Configure`,
      routes: [
        {
          name: t`Item Groups`,
          to: path.to.itemPostingGroups,
          role: "employee",
          icon: <LuGroup />
        },
        {
          name: t`Units`,
          to: path.to.uoms,
          role: "employee",
          icon: <LuRuler />
        }
      ]
    }
  ];

  const isVisible = (route: { role?: string; to?: string }) => {
    if (route.role && !permissions.is(route.role as Role)) return false;
    if (!opts?.includeHidden && route.to && hidden.includes(route.to)) {
      return false;
    }
    return true;
  };

  return {
    groups: itemsRoutes
      .map((group) => ({
        ...group,
        routes: group.routes.filter(isVisible).map(addSavedViewsToRoutes)
      }))
      .filter((group) => group.routes.length > 0)
  };
}
