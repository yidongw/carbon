import type { Database } from "@carbon/database";
import { Status } from "@carbon/react";

type IssueStatusProps = {
  status?: Database["public"]["Enums"]["nonConformanceStatus"] | null;
  iconOnly?: boolean;
};

const IssueStatus = ({ status, iconOnly }: IssueStatusProps) => {
  switch (status) {
    case "Registered":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "In Progress":
      return (
        <Status color="blue" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    case "Closed":
      return (
        <Status color="green" iconOnly={iconOnly}>
          {status}
        </Status>
      );
    default:
      return null;
  }
};

export default IssueStatus;
