import { Status } from "@carbon/react";
import type { supplierQuoteStatusType } from "../../purchasing.models";

type SupplierQuoteStatusProps = {
  status?: (typeof supplierQuoteStatusType)[number] | null;
  iconOnly?: boolean;
};

const SupplierQuoteStatus = ({ status, iconOnly }: SupplierQuoteStatusProps) => {
  switch (status) {
    case "Active":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Declined":
      return (
        <Status color="orange" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Expired":
    case "Cancelled":
      return (
        <Status color="red" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
};

export default SupplierQuoteStatus;
