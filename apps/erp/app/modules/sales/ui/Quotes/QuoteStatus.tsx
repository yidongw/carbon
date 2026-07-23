import { Status } from "@carbon/react";
import { QUOTE_STATUS_COLOR_MAP } from "@carbon/utils";
import type { quoteStatusType } from "../../sales.models";

type QuoteStatusProps = {
  status?: (typeof quoteStatusType)[number] | null;
  iconOnly?: boolean;
};

const QuoteStatus = ({ status, iconOnly }: QuoteStatusProps) => {
  if (!status) return null;

  const color = QUOTE_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default QuoteStatus;
