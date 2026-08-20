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
  LuPizza,
  LuPuzzle,
  LuRuler,
  LuScanBarcode,
  LuShapes,
  LuShirt
} from "react-icons/lu";
import { useCompanySettings, usePermissions } from "~/hooks";
import { useSavedViews } from "~/hooks/useSavedViews";
import type { AuthenticatedRouteGroup, Role } from "~/types";
import { path } from "~/utils/path";

export default function useItemsSubmodules(opts?: { includeHidden?: boolean }) {
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
          name: t`Styles`,
          to: path.to.styles,
          icon: <LuShirt />,
          table: "style"
        },
        {
          name: t`Samples`,
          to: path.to.samples,
          icon: <LuScanBarcode />
        },
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
        }
      ]
    },
    {
      name: t`Item Attributes`,
      routes: [
        {
          name: t`Attributes`,
          to: path.to.itemAttributes,
          icon: <LuShapes />,
          role: "employee",
          table: "itemAttribute"
        },
        {
          name: t`Attribute Sets`,
          to: path.to.itemAttributeSets,
          icon: <LuGroup />,
          role: "employee",
          table: "itemAttributeSet"
        },
        {
          name: t`Item Attribute Sets`,
          to: path.to.itemAttributeSetAssignments,
          icon: <LuPuzzle />,
          role: "employee",
          table: "itemAttributeSetAssignment"
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
