import { HStack } from "@carbon/react";
import type { ReactNode } from "react";
import { ProductionQuantityReportReporter } from "./ProductionQuantityReportReporter";

export function ProductionQuantityReportCardHeader({
  employeeId,
  createdBy,
  summary,
  timestamp,
  actions
}: {
  employeeId: string;
  createdBy?: string | null;
  summary: ReactNode;
  timestamp: string;
  actions?: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-2 sm:hidden">
        <HStack className="items-center justify-between gap-2">
          <ProductionQuantityReportReporter
            employeeId={employeeId}
            createdBy={createdBy}
          />
          {actions}
        </HStack>
        <p className="text-sm font-medium leading-5 text-foreground">{summary}</p>
        <p className="text-xs tabular-nums leading-5 text-muted-foreground">
          {timestamp}
        </p>
      </div>

      <div className="hidden sm:block">
        <HStack className="items-center justify-between gap-2">
          <HStack className="min-w-0 flex-1 items-center gap-3">
            <ProductionQuantityReportReporter
              employeeId={employeeId}
              createdBy={createdBy}
            />
            <HStack className="min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className="text-sm font-medium leading-5 text-foreground">
                {summary}
              </p>
              <p className="shrink-0 text-xs tabular-nums leading-5 text-muted-foreground">
                {timestamp}
              </p>
            </HStack>
          </HStack>
          {actions}
        </HStack>
      </div>
    </>
  );
}
