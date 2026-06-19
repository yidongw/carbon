import { Badge, cn } from "@carbon/react";
import {
  LuCalendar,
  LuCircleCheck,
  LuCircleX,
  LuTriangleAlert
} from "react-icons/lu";
import { useOeeImpactLabel } from "~/modules/production/productionLabels";
import type { oeeImpact } from "../../resources.models";

type MaintenanceOeeImpactProps = {
  oeeImpact?: (typeof oeeImpact)[number] | null;
  className?: string;
};

function MaintenanceOeeImpact({
  oeeImpact,
  className
}: MaintenanceOeeImpactProps) {
  const getOeeImpactLabel = useOeeImpactLabel();

  if (!oeeImpact) return null;

  const label = getOeeImpactLabel(oeeImpact);

  switch (oeeImpact) {
    case "Down":
      return (
        <Badge
          variant="red"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuCircleX className="h-3 w-3" />
          {label}
        </Badge>
      );
    case "Planned":
      return (
        <Badge
          variant="secondary"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuCalendar className="h-3 w-3" />
          {label}
        </Badge>
      );
    case "Impact":
      return (
        <Badge
          variant="yellow"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuTriangleAlert className="h-3 w-3" />
          {label}
        </Badge>
      );
    case "No Impact":
      return (
        <Badge
          variant="blue"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuCircleCheck className="h-3 w-3" />
          {label}
        </Badge>
      );
    default:
      return null;
  }
}

export default MaintenanceOeeImpact;
