import { useLingui } from "@lingui/react/macro";
import {
  LuBox,
  LuChartLine,
  LuFileText,
  LuReceipt,
  LuTags
} from "react-icons/lu";
import { useParams } from "react-router";
import { useRouteData } from "~/hooks";
import { path } from "~/utils/path";
import { getStyleNavigationKeys } from "./styleNavigationConfig";

export function useStyleNavigation() {
  const { t } = useLingui();
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

  const items = {
    details: {
      name: t`Details`,
      to: path.to.styleDetails(itemId),
      icon: LuFileText,
      shortcut: "Command+Shift+d"
    },
    accounting: {
      name: t`Accounting`,
      to: path.to.styleCosting(itemId),
      icon: LuTags,
      shortcut: "Command+Shift+a"
    },
    planning: {
      name: t`Planning`,
      to: path.to.stylePlanning(itemId),
      icon: LuChartLine,
      shortcut: "Command+Shift+p"
    },
    inventory: {
      name: t`Inventory`,
      to: path.to.styleInventory(itemId),
      icon: LuBox,
      shortcut: "Command+Shift+i"
    },
    sales: {
      name: t`Sales`,
      to: path.to.styleSales(itemId),
      icon: LuReceipt,
      shortcut: "Command+Shift+x"
    }
  };

  return navigationKeys.map((key) => items[key]);
}
