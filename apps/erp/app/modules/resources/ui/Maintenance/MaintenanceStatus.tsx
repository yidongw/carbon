import { Status } from "@carbon/react";
import { MAINTENANCE_DISPATCH_STATUS_COLOR_MAP } from "@carbon/utils";
import { useMaintenanceDispatchStatusLabel } from "~/modules/production/productionLabels";
import type { maintenanceDispatchStatus } from "../../resources.models";

type MaintenanceStatusProps = {
  status?: (typeof maintenanceDispatchStatus)[number] | null;
  className?: string;
  iconOnly?: boolean;
};

function MaintenanceStatus({
  status,
  className,
  iconOnly
}: MaintenanceStatusProps) {
  const getMaintenanceDispatchStatusLabel = useMaintenanceDispatchStatusLabel();

  if (!status) return null;
  const color = MAINTENANCE_DISPATCH_STATUS_COLOR_MAP[status];
  if (!color) return null;

  const label = getMaintenanceDispatchStatusLabel(status);

  return (
    <Status color={color} className={className} iconOnly={iconOnly}>
      {label}
    </Status>
  );
}

export default MaintenanceStatus;
