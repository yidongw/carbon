import { Badge, Status } from "@carbon/react";
import { LuLock } from "react-icons/lu";
import type { qualityDocumentStatus } from "../../quality.models";

type QualityDocumentStatusProps = {
  status?: (typeof qualityDocumentStatus)[number] | null;
  iconOnly?: boolean;
};

const QualityDocumentStatus = ({ status, iconOnly }: QualityDocumentStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Active":
      if (iconOnly) {
        return (
          <Status color="green" iconOnly>
            {status}
          </Status>
        );
      }
      return (
        <Badge variant="green">
          <LuLock className="size-3 mr-1" />
          {status}
        </Badge>
      );
    case "Archived":
      if (iconOnly) {
        return (
          <Status color="red" iconOnly>
            {status}
          </Status>
        );
      }
      return (
        <Badge variant="red">
          <LuLock className="size-3 mr-1" />
          {status}
        </Badge>
      );
    default:
      return null;
  }
};

export default QualityDocumentStatus;
