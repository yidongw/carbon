import { Status } from "@carbon/react";
import type { quoteStatusType } from "../../sales.models";

type QuoteStatusProps = {
  status?: (typeof quoteStatusType)[number] | null;
  iconOnly?: boolean;
};

const QuoteStatus = ({ status, iconOnly }: QuoteStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Sent":
      return (
        <Status color="blue" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Ordered":
    case "Partial":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Cancelled":
    case "Expired":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Lost":
      return (
        <Status color="orange" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
};

export default QuoteStatus;
