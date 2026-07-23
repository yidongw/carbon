import type { Database } from "@carbon/database";
import { Status } from "@carbon/react";
import { ISSUE_STATUS_COLOR_MAP } from "@carbon/utils";

type IssueStatusProps = {
  status?: Database["public"]["Enums"]["nonConformanceStatus"] | null;
  iconOnly?: boolean;
};

const IssueStatus = ({ status, iconOnly }: IssueStatusProps) => {
  if (!status) return null;
  const color = ISSUE_STATUS_COLOR_MAP[status];
  if (!color) return null;

  return (
    <Status color={color} iconOnly={iconOnly}>
      {status}
    </Status>
  );
};

export default IssueStatus;
