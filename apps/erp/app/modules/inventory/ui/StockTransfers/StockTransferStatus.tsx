import { Status } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { stockTransferStatusType } from "~/modules/inventory";

type StockTransferStatusProps = {
  status?: (typeof stockTransferStatusType)[number] | null;
  iconOnly?: boolean;
};

const StockTransferStatus = ({ status, iconOnly }: StockTransferStatusProps) => {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          <Trans>Draft</Trans>
        </Status>
      );
    case "Released":
      return (
        <Status color="orange" iconOnly={iconOnly}>
          <Trans>Released</Trans>
        </Status>
      );
    case "In Progress":
      return (
        <Status color="blue" iconOnly={iconOnly}>
          <Trans>In Progress</Trans>
        </Status>
      );
    case "Completed":
      return (
        <Status color="green" iconOnly={iconOnly}>
          <Trans>Completed</Trans>
        </Status>
      );
    default:
      return null;
  }
};

export default StockTransferStatus;
