import { Status } from "@carbon/react";
import type { salesRFQStatusType } from "../../sales.models";

type SalesRFQStatusProps = {
  status?: (typeof salesRFQStatusType)[number] | null;
  iconOnly?: boolean;
};

const SalesRFQStatus = ({ status, iconOnly }: SalesRFQStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Ready for Quote":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Quoted":
      return (
        <Status color="blue" iconOnly={iconOnly}>
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

export default SalesRFQStatus;
