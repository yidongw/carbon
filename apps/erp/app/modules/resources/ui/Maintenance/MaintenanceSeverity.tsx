import { Badge, cn } from "@carbon/react";
import {
  LuSettings,
  LuSquareUser,
  LuTriangleAlert,
  LuWrench
} from "react-icons/lu";
import { useMaintenanceSeverityLabel } from "~/modules/production/productionLabels";
import type { maintenanceSeverity } from "../../resources.models";

type MaintenanceSeverityProps = {
  severity?: (typeof maintenanceSeverity)[number] | null;
  className?: string;
};

function MaintenanceSeverity({
  severity,
  className
}: MaintenanceSeverityProps) {
  const getMaintenanceSeverityLabel = useMaintenanceSeverityLabel();

  if (!severity) return null;

  const label = getMaintenanceSeverityLabel(severity);

  switch (severity) {
    case "Preventive":
      return (
        <Badge
          variant="outline"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuSettings />
          {label}
        </Badge>
      );
    case "Operator Performed":
      return (
        <Badge
          variant="blue"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuSquareUser />
          {label}
        </Badge>
      );
    case "Support Required":
      return (
        <Badge
          variant="yellow"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuWrench />
          {label}
        </Badge>
      );
    case "OEM Required":
      return (
        <Badge
          variant="red"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuTriangleAlert />
          {label}
        </Badge>
      );
    default:
      return null;
  }
}

export default MaintenanceSeverity;
