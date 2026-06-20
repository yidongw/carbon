import { Status } from "@carbon/react";
import type { purchaseOrderStatusType } from "~/modules/purchasing";

type PurchasingStatusProps = {
  status?: (typeof purchaseOrderStatusType)[number] | null;
  iconOnly?: boolean;
};

const PurchasingStatus = ({ status, iconOnly }: PurchasingStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Planned":
    case "To Review":
    case "Needs Approval":
      return (
        <Status color="yellow" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "To Receive":
    case "To Receive and Invoice":
      return (
        <Status color="orange" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "To Invoice":
      return (
        <Status color="blue" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Completed":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Closed":
    case "Rejected":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
};

export default PurchasingStatus;
