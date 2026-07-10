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
  LuShapes
} from "react-icons/lu";
import { usePermissions } from "~/hooks";
import { useSavedViews } from "~/hooks/useSavedViews";
import type { AuthenticatedRouteGroup } from "~/types";
import { path } from "~/utils/path";

export default function useItemsSubmodules() {
  const { t } = useLingui();
  const permissions = usePermissions();
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
          icon: <LuPalette />
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

  return {
    groups: itemsRoutes
      .filter((group) => {
        const filteredRoutes = group.routes.filter((route) => {
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
