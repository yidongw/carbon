import { Button, HStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { LuHistory, LuPencil } from "react-icons/lu";
import { useDateFormatter } from "~/hooks";
import type { ConfigurationParameter } from "~/modules/items/types";
import type { ProductionQuantityReportWithLines } from "~/modules/production/productionQuantityReport.service";
import { ProductionQuantityLineBreakdown } from "./ProductionQuantityLineBreakdown";
import { ProductionQuantityReportCardHeader } from "./ProductionQuantityReportCardHeader";

export function ProductionQuantityReportCard({
  report,
  configurationParameters,
  canEdit,
  onEdit,
  onHistory
}: {
  report: ProductionQuantityReportWithLines;
  configurationParameters?: ConfigurationParameter[] | null;
  canEdit: boolean;
  onEdit: () => void;
  onHistory: () => void;
}) {
  const { formatDateTime } = useDateFormatter();

  const headerActions = (
    <HStack className="shrink-0 items-center gap-1">
      {report.hasHistory ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="View history"
          onClick={onHistory}
        >
          <LuHistory className="h-4 w-4" />
        </Button>
      ) : null}
      {canEdit ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Edit report"
          onClick={onEdit}
        >
          <LuPencil className="h-4 w-4" />
        </Button>
      ) : null}
    </HStack>
  );

  const quantitySummary = report.hasHistory ? (
    <Trans>Originally reported {report.originalQuantity} units</Trans>
  ) : (
    <Trans>Reported {report.originalQuantity} units</Trans>
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 dark:bg-muted/20">
      <div>
        <ProductionQuantityReportCardHeader
          employeeId={report.employeeId}
          createdBy={report.createdBy}
          summary={quantitySummary}
          timestamp={formatDateTime(report.createdAt)}
          actions={headerActions}
        />
      </div>

      <div className="flex flex-col gap-2">
        {report.activeLines.map((line) => (
          <ProductionQuantityLineBreakdown
            key={line.id}
            line={line}
            configurationParameters={configurationParameters}
          />
        ))}
        {report.notes ? (
          <p className="break-words text-sm leading-relaxed text-muted-foreground">
            {report.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}
