import { Status } from "@carbon/react";
import type { trainingStatus } from "~/modules/resources";

type TrainingStatusProps = {
  status: (typeof trainingStatus)[number] | null;
  iconOnly?: boolean;
};

export default function TrainingStatus({ status, iconOnly }: TrainingStatusProps) {
  switch (status) {
    case "Draft":
      return (
        <Status color="gray" iconOnly={iconOnly}>
          Draft
        </Status>
      );
    case "Active":
      return (
        <Status color="green" iconOnly={iconOnly}>
          Active
        </Status>
      );
    case "Archived":
      return (
        <Status color="red" iconOnly={iconOnly}>
          Archived
        </Status>
      );
    default:
      return null;
  }
}
