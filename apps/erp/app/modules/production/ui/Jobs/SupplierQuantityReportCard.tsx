import { Button, HStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { LuExternalLink, LuHistory, LuPencil } from "react-icons/lu";
import { Link } from "react-router";
import { useDateFormatter, usePermissions } from "~/hooks";
import type { ConfigurationParameter } from "~/modules/items/types";
import type { JobOperationSupplierQuantityReportWithLines } from "~/modules/production/jobOperationSupplierQuantityReport.service";
import { path } from "~/utils/path";
import { ProductionQuantityLineBreakdown } from "./ProductionQuantityLineBreakdown";
import { SupplierQuantityReportCardHeader } from "./SupplierQuantityReportCardHeader";

export function SupplierQuantityReportCard({
  report,
  configurationParameters,
  canEdit,
  onEdit,
  onHistory,
  onCreatePo,
  isCreatingPo
}: {
  report: JobOperationSupplierQuantityReportWithLines;
  configurationParameters?: ConfigurationParameter[] | null;
  canEdit: boolean;
  onEdit: () => void;
  onHistory: () => void;
  onCreatePo: () => void;
  isCreatingPo?: boolean;
}) {
  const { formatDateTime } = useDateFormatter();
  const permissions = usePermissions();
  const supplierId = report.supplierProcess?.supplierId;

  const snapshot = report.subcontractSnapshot;
  const unitPrice = snapshot?.operationUnitCost ?? 0;
  const minCost = snapshot?.operationMinimumCost ?? 0;
  const purchaseOrderId = report.purchaseOrderLine?.purchaseOrderId;

  const headerActions = (
    <HStack className="shrink-0 items-center gap-1">
      {report.hasHistory ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="View history"
          onClick={onHistory}
          className="transition-transform active:scale-[0.96]"
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
          className="transition-transform active:scale-[0.96]"
        >
          <LuPencil className="h-4 w-4" />
        </Button>
      ) : null}
      {!report.purchaseOrderLineId && permissions.can("create", "purchasing") ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isLoading={isCreatingPo}
          onClick={onCreatePo}
          className="transition-transform active:scale-[0.96]"
        >
          <Trans>Create PO</Trans>
        </Button>
      ) : null}
      {purchaseOrderId ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          asChild
          className="transition-transform active:scale-[0.96]"
        >
          <Link to={path.to.purchaseOrder(purchaseOrderId)} target="_blank">
            <LuExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </HStack>
  );

  const quantitySummary = report.hasHistory ? (
    <Trans>
      Originally reported <span className="tabular-nums">{report.originalQuantity}</span> units
    </Trans>
  ) : (
    <Trans>
      Reported <span className="tabular-nums">{report.originalQuantity}</span> units
    </Trans>
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 dark:bg-muted/20">
      <SupplierQuantityReportCardHeader
        supplierId={supplierId}
        createdBy={report.createdBy}
        summary={quantitySummary}
        timestamp={formatDateTime(report.createdAt)}
        actions={headerActions}
      />

      {snapshot ? (
        <p className="text-xs text-muted-foreground">
          <Trans>
            PO pricing: min <span className="tabular-nums">{minCost}</span>, unit{" "}
            <span className="tabular-nums">{unitPrice}</span> (snapshotted)
          </Trans>
        </p>
      ) : null}

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
