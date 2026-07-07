import { useLingui } from "@lingui/react/macro";
import { LuFileText } from "react-icons/lu";
import { useParams } from "react-router";
import { path } from "~/utils/path";

export function useStyleNavigation() {
  const { t } = useLingui();
  const { itemId } = useParams();
  if (!itemId) throw new Error("itemId not found");

  return [
    {
      name: t`Details`,
      to: path.to.style(itemId),
      icon: LuFileText,
      shortcut: "Command+Shift+d"
    }
  ];
}
