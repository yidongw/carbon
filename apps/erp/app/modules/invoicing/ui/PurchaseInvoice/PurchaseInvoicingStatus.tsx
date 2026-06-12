import { Status } from "@carbon/react";
import type { purchaseInvoiceStatusType } from "~/modules/invoicing";

type PurchaseInvoicingStatusProps = {
  status?: (typeof purchaseInvoiceStatusType)[number] | null;
  iconOnly?: boolean;
};

const PurchaseInvoicingStatus = ({
  status,
  iconOnly
}: PurchaseInvoicingStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Open":
      return (
        <Status color="blue" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Pending":
    case "Partially Paid":
      return (
        <Status color="orange" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Overdue":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Voided":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Debit Note Issued":
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

export default PurchaseInvoicingStatus;
