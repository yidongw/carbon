import { Status } from "@carbon/react";
import type { purchasingRfqStatusType } from "../../purchasing.models";

type PurchasingRFQStatusProps = {
  status?: (typeof purchasingRfqStatusType)[number] | null;
  iconOnly?: boolean;
};

const PurchasingRFQStatus = ({ status, iconOnly }: PurchasingRFQStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Requested":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Closed":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
};

export default PurchasingRFQStatus;
