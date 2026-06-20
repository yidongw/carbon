import type { Database } from "@carbon/database";
import { Status } from "@carbon/react";

type SalesInvoicingStatusProps = {
  status?: Database["public"]["Enums"]["salesInvoiceStatus"] | null;
  iconOnly?: boolean;
};

const SalesInvoicingStatus = ({ status, iconOnly }: SalesInvoicingStatusProps) => {
  switch (status) {
    case "Draft":
    case "Return":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Submitted":
      return (
        <Status color="blue" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Pending":
    case "Partially Paid":
      return (
        <Status color="yellow" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Voided":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Overdue":
      return (
        <Status color="orange" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Credit Note Issued":
    case "Paid":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
};

export default SalesInvoicingStatus;
