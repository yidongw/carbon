import { Status } from "@carbon/react";
import { PURCHASE_ORDER_STATUS_COLOR_MAP } from "@carbon/utils";
import type { purchaseOrderStatusType } from "~/modules/purchasing";

type PurchasingStatusProps = {
  status?: (typeof purchaseOrderStatusType)[number] | null;
  iconOnly?: boolean;
};

const PurchasingStatus = ({ status, iconOnly }: PurchasingStatusProps) => {
  if (!status) return null;
  const color = PURCHASE_ORDER_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default PurchasingStatus;
