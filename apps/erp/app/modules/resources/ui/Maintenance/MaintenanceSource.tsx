import { Badge, cn } from "@carbon/react";
import { LuCalendarClock, LuRefreshCcwDot, LuShieldX } from "react-icons/lu";
import { useMaintenanceSourceLabel } from "~/modules/production/productionLabels";
import type { maintenanceSource } from "../../resources.models";

type MaintenanceSourceProps = {
  source?: (typeof maintenanceSource)[number] | null;
  className?: string;
};

function MaintenanceSource({ source, className }: MaintenanceSourceProps) {
  const getMaintenanceSourceLabel = useMaintenanceSourceLabel();

  if (!source) return null;

  const label = getMaintenanceSourceLabel(source);

  switch (source) {
    case "Scheduled":
      return (
        <Badge
          variant="outline"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuCalendarClock />
          {label}
        </Badge>
      );
    case "Reactive":
      return (
        <Badge
          variant="orange"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuRefreshCcwDot />
          {label}
        </Badge>
      );
    case "Non-Conformance":
      return (
        <Badge
          variant="gray"
          className={cn(className, "inline-flex items-center gap-1")}
        >
          <LuShieldX />
          {label}
        </Badge>
      );

    default:
      return null;
  }
}

export default MaintenanceSource;
