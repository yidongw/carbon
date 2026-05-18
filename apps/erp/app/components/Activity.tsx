import type { ReactNode } from "react";
import { useDateFormatter } from "~/hooks";
import { usePeople } from "~/stores";
import Avatar from "./Avatar";

type ActivityProps = {
  employeeId: string;
  activityMessage: ReactNode;
  activityTime: string;
  activityIcon?: ReactNode;
  comment?: ReactNode;
};

const Activity = ({
  employeeId,
  activityMessage,
  activityTime,
  activityIcon,
  comment
}: ActivityProps) => {
  const { formatTimeAgo } = useDateFormatter();
  const [people] = usePeople();
  if (!employeeId) return null;

  const person = people.find((p) => p.id === employeeId);

  return (
    <li className="relative flex-grow w-full border rounded-lg bg-card p-6 pl-14">
      <div className="absolute left-3 top-6 flex items-center justify-center w-10 h-10">
        <Avatar
          path={person?.avatarUrl ?? undefined}
          name={person?.name ?? ""}
        />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <p>
            <span className="font-semibold mr-1">
              {person?.name ?? "Carbon Admin"}
            </span>
            <span className="text-gray-400">{activityMessage}</span>
          </p>
          {comment ? (
            <div className="mt-1 text-sm text-muted-foreground">{comment}</div>
          ) : null}
          <div className="text-sm text-gray-400 mt-1">
            {formatTimeAgo(activityTime)}
          </div>
        </div>
        <div className="flex-shrink-0">{activityIcon}</div>
      </div>
    </li>
  );
};

export default Activity;
