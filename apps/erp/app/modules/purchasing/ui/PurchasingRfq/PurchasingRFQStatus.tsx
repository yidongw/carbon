import { Status } from "@carbon/react";
import { PURCHASING_RFQ_STATUS_COLOR_MAP } from "@carbon/utils";
import type { purchasingRfqStatusType } from "../../purchasing.models";

type PurchasingRFQStatusProps = {
  status?: (typeof purchasingRfqStatusType)[number] | null;
  iconOnly?: boolean;
};

const PurchasingRFQStatus = ({
  status,
  iconOnly
}: PurchasingRFQStatusProps) => {
  if (!status) return null;
  const color = PURCHASING_RFQ_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default PurchasingRFQStatus;
