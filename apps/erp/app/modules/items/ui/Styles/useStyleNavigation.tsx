import { useLingui } from "@lingui/react/macro";
import {
  LuBox,
  LuChartLine,
  LuFileText,
  LuReceipt,
  LuTags
} from "react-icons/lu";
import { useParams } from "react-router";
import { usePermissions, useRouteData } from "~/hooks";
import type { Role } from "~/types";
import { path } from "~/utils/path";
import { getStyleNavigationKeys } from "./styleNavigationConfig";

export function useStyleNavigation() {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { itemId } = useParams();
  if (!itemId) throw new Error("itemId not found");

  const routeData = useRouteData<{
    styleSummary: {
      itemTrackingType: string | null;
    };
  }>(path.to.style(itemId));

  const navigationKeys = getStyleNavigationKeys({
    itemTrackingType: routeData?.styleSummary?.itemTrackingType
  });

  const items: Record<
    ReturnType<typeof getStyleNavigationKeys>[number],
    {
      name: string;
      to: string;
      icon: typeof LuFileText;
      shortcut: string;
      role?: Role[];
      permission?: string;
    }
  > = {
    details: {
      name: t`Details`,
      to: path.to.styleDetails(itemId),
      icon: LuFileText,
      shortcut: "Command+Shift+d"
    },
    accounting: {
      name: t`Accounting`,
      to: path.to.styleCosting(itemId),
      role: ["employee"],
      permission: "purchasing",
      icon: LuTags,
      shortcut: "Command+Shift+a"
    },
    planning: {
      name: t`Planning`,
      to: path.to.stylePlanning(itemId),
      role: ["employee"],
      icon: LuChartLine,
      shortcut: "Command+Shift+p"
    },
    inventory: {
      name: t`Inventory`,
      to: path.to.styleInventory(itemId),
      role: ["employee", "supplier"],
      icon: LuBox,
      shortcut: "Command+Shift+i"
    },
    sales: {
      name: t`Sales`,
      to: path.to.styleSales(itemId),
      role: ["employee", "customer"],
      icon: LuReceipt,
      shortcut: "Command+Shift+x"
    }
  };

  return navigationKeys
    .map((key) => items[key])
    .filter(
      (item) =>
        (item.role === undefined ||
          item.role.some((role) => permissions.is(role as Role))) &&
        (item.permission === undefined ||
          permissions.can("view", item.permission))
    );
}
