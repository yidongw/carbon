import { cn, HStack, Tooltip, TooltipContent, TooltipTrigger } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import Avatar from "~/components/Avatar";
import { usePeople } from "~/stores";

function resolvePerson(
  people: ReturnType<typeof usePeople>[0],
  userId: string | null | undefined
) {
  if (!userId || userId === "system") return null;
  return people.find((p) => p.id === userId) ?? null;
}

export function ProductionQuantityReportReporter({
  employeeId,
  createdBy
}: {
  employeeId: string;
  createdBy?: string | null;
}) {
  const [people] = usePeople();

  const isSystem = employeeId === "system";
  const employee = resolvePerson(people, employeeId);
  const enteredById =
    createdBy && createdBy !== employeeId ? createdBy : null;
  const enteredByIsSystem = enteredById === "system";
  const enteredBy = enteredByIsSystem
    ? null
    : resolvePerson(people, enteredById);
  const showEnteredBy = Boolean(
    enteredById && (enteredBy || enteredByIsSystem)
  );

  const employeeName = isSystem ? (
    <Trans>System</Trans>
  ) : (
    employee?.name
  );

  const avatarStack = (
    <span
      className={cn(
        "inline-flex shrink-0",
        showEnteredBy ? "-space-x-2" : undefined
      )}
    >
      {showEnteredBy ? (
        enteredByIsSystem ? (
          <Avatar size="xs" className="ring-2 ring-background" />
        ) : (
          <Avatar
            size="xs"
            path={enteredBy?.avatarUrl ?? undefined}
            name={enteredBy?.name ?? ""}
            className="ring-2 ring-background"
          />
        )
      ) : null}
      {isSystem ? (
        <Avatar size="xs" className={showEnteredBy ? "ring-2 ring-background" : ""} />
      ) : (
        <Avatar
          size="xs"
          path={employee?.avatarUrl ?? undefined}
          name={employee?.name ?? ""}
          className={showEnteredBy ? "ring-2 ring-background" : ""}
        />
      )}
    </span>
  );

  const stackWithTooltip = showEnteredBy ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-default rounded-full">
          {avatarStack}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="px-2.5 py-2">
        <HStack className="items-center gap-2">
          {enteredByIsSystem ? (
            <Avatar size="xs" />
          ) : (
            <Avatar
              size="xs"
              path={enteredBy?.avatarUrl ?? undefined}
              name={enteredBy?.name ?? ""}
            />
          )}
          <span className="text-sm">
            {enteredByIsSystem ? (
              <Trans>Entered by System</Trans>
            ) : (
              <Trans>Entered by {enteredBy?.name}</Trans>
            )}
          </span>
        </HStack>
      </TooltipContent>
    </Tooltip>
  ) : (
    avatarStack
  );

  if (!employeeName && isSystem) {
    return (
      <HStack className="min-w-0 items-center gap-2">
        {stackWithTooltip}
        <span className="text-sm font-medium leading-5 text-foreground">
          <Trans>System</Trans>
        </span>
      </HStack>
    );
  }

  if (!employeeName) {
    return stackWithTooltip;
  }

  return (
    <HStack className="min-w-0 items-center gap-2">
      {stackWithTooltip}
      <span className="shrink-0 text-sm font-medium leading-5 text-foreground">
        {employeeName}
      </span>
    </HStack>
  );
}
