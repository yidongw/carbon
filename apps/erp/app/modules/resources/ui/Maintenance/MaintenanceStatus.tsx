import { Status } from "@carbon/react";
import { useMaintenanceDispatchStatusLabel } from "~/modules/production/productionLabels";
import type { maintenanceDispatchStatus } from "../../resources.models";

type MaintenanceStatusProps = {
  status?: (typeof maintenanceDispatchStatus)[number] | null;
  className?: string;
};

function MaintenanceStatus({ status, className, iconOnly }: MaintenanceStatusProps) {
  const getMaintenanceDispatchStatusLabel = useMaintenanceDispatchStatusLabel();

  if (!status) return null;

  const label = getMaintenanceDispatchStatusLabel(status);

  switch (status) {
    case "Open":
      return (
        <Status color="gray" className={className} iconOnly={iconOnly}>
          {label}
        </Status>
      );
    case "Assigned":
      return (
        <Status color="yellow" className={className} iconOnly={iconOnly}>
          {label}
        </Status>
      );
    case "In Progress":
      return (
        <Status color="blue" className={className} iconOnly={iconOnly}>
          {label}
        </Status>
      );
    case "Completed":
      return (
        <Status color="green" className={className} iconOnly={iconOnly}>
          {label}
        </Status>
      );
    case "Cancelled":
      return (
        <Status color="red" className={className} iconOnly={iconOnly}>
          {label}
        </Status>
      );
    default:
      return null;
  }
}

export default MaintenanceStatus;
