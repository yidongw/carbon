import { Status } from "@carbon/react";
import { SUPPLIER_QUOTE_STATUS_COLOR_MAP } from "@carbon/utils";
import type { supplierQuoteStatusType } from "../../purchasing.models";

type SupplierQuoteStatusProps = {
  status?: (typeof supplierQuoteStatusType)[number] | null;
  iconOnly?: boolean;
};

const SupplierQuoteStatus = ({
  status,
  iconOnly
}: SupplierQuoteStatusProps) => {
  if (!status) return null;
  const color = SUPPLIER_QUOTE_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default SupplierQuoteStatus;
