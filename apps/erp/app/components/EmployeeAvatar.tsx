import type { AvatarProps } from "@carbon/react";
import { cn, HStack } from "@carbon/react";
import type { PersonNameParts } from "@carbon/utils";
import { Trans } from "@lingui/react/macro";
import { useFormatPersonName } from "~/hooks";
import { usePeople } from "~/stores";
import Avatar from "./Avatar";

type EmployeeAvatarFallback = PersonNameParts & {
  avatarUrl?: string | null;
};

type EmployeeAvatarProps = AvatarProps & {
  employeeId: string | null;
  fallback?: EmployeeAvatarFallback;
  className?: string;
  withName?: boolean;
};

const EmployeeAvatar = ({
  employeeId,
  fallback,
  size,
  withName = true,
  className,
  ...props
}: EmployeeAvatarProps) => {
  const [people] = usePeople();
  const formatPersonName = useFormatPersonName();
  if (!employeeId) return null;

  if (employeeId === "system") {
    return (
      <HStack className="truncate no-underline hover:no-underline">
        <Avatar size={size ?? "xs"} path={undefined} />
        {withName && (
          <span>
            <Trans>System</Trans>
          </span>
        )}
      </HStack>
    );
  }

  const storePerson = people.find((p) => p.id === employeeId);
  const displayName = formatPersonName({
    firstName: storePerson?.firstName ?? fallback?.firstName,
    lastName: storePerson?.lastName ?? fallback?.lastName,
    fullName: storePerson?.name ?? fallback?.fullName
  });
  const avatarUrl = storePerson?.avatarUrl ?? fallback?.avatarUrl ?? undefined;

  if (!storePerson && !fallback) {
    return <Avatar size={size ?? "xs"} path={undefined} />;
  }

  return (
    <HStack
      className={cn(
        "min-w-0 gap-2 no-underline hover:no-underline",
        rowClassName ?? "items-center",
        className
      )}
    >
      <Avatar
        size={size ?? "xs"}
        path={avatarUrl}
        name={displayName}
        {...props}
      />
      {withName && (
        <span className="min-w-0 break-words text-sm font-medium leading-5">
          {displayName || "—"}
        </span>
      )}
    </HStack>
  );
};

export default EmployeeAvatar;
