import { Status } from "@carbon/react";
import { PURCHASE_INVOICE_STATUS_COLOR_MAP } from "@carbon/utils";
import type { purchaseInvoiceStatusType } from "~/modules/invoicing";

type PurchaseInvoicingStatusProps = {
  status?: (typeof purchaseInvoiceStatusType)[number] | null;
  iconOnly?: boolean;
};

const PurchaseInvoicingStatus = ({
  status,
  iconOnly
}: PurchaseInvoicingStatusProps) => {
  if (!status) return null;
  const color = PURCHASE_INVOICE_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default PurchaseInvoicingStatus;
