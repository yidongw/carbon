import { Status } from "@carbon/react";
import type { maintenanceDispatchStatus } from "../../resources.models";

type MaintenanceStatusProps = {
  status?: (typeof maintenanceDispatchStatus)[number] | null;
  className?: string;
  iconOnly?: boolean;
};

function MaintenanceStatus({ status, className, iconOnly }: MaintenanceStatusProps) {
  switch (status) {
    case "Open":
      return (
        <Status color="gray" className={className} iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Assigned":
      return (
        <Status color="yellow" className={className} iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "In Progress":
      return (
        <Status color="blue" className={className} iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Completed":
      return (
        <Status color="green" className={className} iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Cancelled":
      return (
        <Status color="red" className={className} iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
}

export default MaintenanceStatus;
