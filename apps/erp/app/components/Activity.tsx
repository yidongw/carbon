import type { ReactNode } from "react";
import { useDateFormatter } from "~/hooks";
import { usePeople } from "~/stores";
import Avatar from "./Avatar";

type ActivityProps = {
  employeeId: string;
  activityMessage: ReactNode;
  activityTime: string;
  /** Formatted absolute time shown above the relative time. */
  activityTimeDetail?: string;
  activityIcon?: ReactNode;
  comment?: ReactNode;
};

const Activity = ({
  employeeId,
  activityMessage,
  activityTime,
  activityTimeDetail,
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
      <div
        className={
          activityIcon != null ? "flex items-start gap-2" : "flex flex-col"
        }
      >
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <span className="font-semibold">
              {person?.name ?? "Jilio Admin"}
            </span>
            <span className="text-muted-foreground">{activityMessage}</span>
          </p>
          {comment ? <div className="mt-2 text-sm">{comment}</div> : null}
          <div className="mt-1.5 space-y-0.5">
            {activityTimeDetail ? (
              <time
                dateTime={activityTime}
                className="block text-sm tabular-nums text-muted-foreground"
              >
                {activityTimeDetail}
              </time>
            ) : null}
            <div className="text-sm text-muted-foreground">
              {formatTimeAgo(activityTime)}
            </div>
          </div>
        </div>
        {activityIcon != null ? (
          <div className="shrink-0">{activityIcon}</div>
        ) : null}
      </div>
    </li>
  );
};

export default Activity;
