import type { AvatarProps } from "@carbon/react";
import { cn, HStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { usePeople } from "~/stores";
import Avatar from "./Avatar";

type EmployeeAvatarProps = AvatarProps & {
  employeeId: string | null;
  className?: string;
  withName?: boolean;
  /** Applied to the avatar+name row (e.g. `items-start` so the name lines up with the avatar top in dense headers). */
  rowClassName?: string;
};

const EmployeeAvatar = ({
  employeeId,
  size,
  withName = true,
  className,
  rowClassName,
  ...props
}: EmployeeAvatarProps) => {
  const [people] = usePeople();
  if (!employeeId) return null;

  if (employeeId === "system") {
    return (
      <HStack
        className={cn(
          "min-w-0 gap-2 no-underline hover:no-underline",
          rowClassName ?? "items-center"
        )}
      >
        <Avatar size={size ?? "xs"} path={undefined} />
        {withName && (
          <span className="min-w-0 break-words text-sm font-medium leading-5">
            <Trans>System</Trans>
          </span>
        )}
      </HStack>
    );
  }

  const person = people.find((p) => p.id === employeeId);

  if (!person) {
    return <Avatar size={size ?? "xs"} path={undefined} />;
  }

  return (
    <HStack
      className={cn(
        "min-w-0 gap-2 no-underline hover:no-underline",
        rowClassName ?? "items-center"
      )}
    >
      <Avatar
        size={size ?? "xs"}
        path={person.avatarUrl ?? undefined}
        name={person?.name ?? ""}
      />
      {withName && (
        <span className="min-w-0 break-words text-sm font-medium leading-5">
          {person.name}
        </span>
      )}
    </HStack>
  );
};

export default EmployeeAvatar;
