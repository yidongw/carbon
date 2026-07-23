import type { Database } from "@carbon/database";
import { Status } from "@carbon/react";
import { hasIncompleteJobs, SALES_STATUS_COLOR_MAP } from "@carbon/utils";

export { SALES_STATUS_COLOR_MAP } from "@carbon/utils";

type SalesOrderStatusProps = {
  status?: Database["public"]["Enums"]["salesOrderStatus"] | null;
  jobs?: Array<{
    salesOrderLineId: string;
    productionQuantity: number;
    quantityComplete: number;
    status: string;
  }>;
  lines?: Array<{
    id: string;
    methodType: "Purchase to Order" | "Make to Order" | "Pull from Inventory";
    saleQuantity: number;
  }>;
  disableTooltip?: boolean;
  iconOnly?: boolean;
};

const SalesStatus = ({
  status,
  jobs,
  lines,
  disableTooltip,
  iconOnly
}: SalesOrderStatusProps) => {
  if (!status) return null;

  const isManufacturing =
    jobs !== undefined &&
    lines !== undefined &&
    hasIncompleteJobs({ jobs, lines });

  if (isManufacturing && !(status === "Closed" || status === "Cancelled")) {
    return (
      <Status
        color="yellow"
        tooltip={status}
        disableTooltip={disableTooltip}
        iconOnly={iconOnly}
      >
        In Progress
      </Status>
    );
  }

  const color = SALES_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} disableTooltip={disableTooltip} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default SalesStatus;
