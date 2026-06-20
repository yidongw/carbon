import { Badge, Status } from "@carbon/react";
import { LuLock } from "react-icons/lu";
import { useProcedureStatusLabel } from "../../productionLabels";
import type { procedureStatus } from "../../production.models";

type ProcedureStatusProps = {
  status?: (typeof procedureStatus)[number] | null;
};

const ProcedureStatus = ({ status, iconOnly }: ProcedureStatusProps) => {
  const getProcedureStatusLabel = useProcedureStatusLabel();

  if (!status) return null;

  const label = getProcedureStatusLabel(status);

  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {label}
        </Status>
      );
    case "Active":
      if (iconOnly) {
        return (
          <Status color="green" iconOnly>
            {label}
          </Status>
        );
      }
      return (
        <Badge variant="green">
          <LuLock className="size-3 mr-1" />
          {label}
        </Badge>
      );
    case "Archived":
      if (iconOnly) {
        return (
          <Status color="red" iconOnly>
            {label}
          </Status>
        );
      }
      return (
        <Badge variant="red">
          <LuLock className="size-3 mr-1" />
          {label}
        </Badge>
      );
    default:
      return null;
  }
};

export default ProcedureStatus;
