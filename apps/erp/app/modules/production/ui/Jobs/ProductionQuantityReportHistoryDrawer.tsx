import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Loading,
  VStack
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import { useDateFormatter } from "~/hooks";
import type { ConfigurationParameter } from "~/modules/items/types";
import type { ProductionQuantityReportLine } from "~/modules/production/productionQuantityReport.service";
import { path } from "~/utils/path";
import { ProductionQuantityLineBreakdown } from "./ProductionQuantityLineBreakdown";
import { ProductionQuantityReportCardHeader } from "./ProductionQuantityReportCardHeader";

type HistoryBatch = {
  invalidatedAt: string;
  invalidatedBy: string;
  lines: ProductionQuantityReportLine[];
};

function batchTotalQuantity(lines: ProductionQuantityReportLine[]) {
  return lines.reduce((sum, line) => sum + (line.quantity ?? 0), 0);
}

function batchEmployeeId(lines: ProductionQuantityReportLine[]) {
  return lines.find((l) => l.employeeId)?.employeeId ?? null;
}

function batchCreatedBy(lines: ProductionQuantityReportLine[]) {
  return lines.find((l) => l.createdBy)?.createdBy ?? null;
}

function batchCreatedAt(lines: ProductionQuantityReportLine[]) {
  const timestamps = lines
    .map((l) => l.createdAt)
    .filter((t): t is string => Boolean(t));
  if (timestamps.length === 0) return null;
  return timestamps.reduce((earliest, t) =>
    new Date(t).getTime() < new Date(earliest).getTime() ? t : earliest
  );
}

function groupInvalidatedLines(
  lines: ProductionQuantityReportLine[]
): HistoryBatch[] {
  const invalidated = lines.filter((l) => l.invalidatedAt);
  const batches = new Map<string, HistoryBatch>();

  for (const line of invalidated) {
    const key = `${line.invalidatedAt}|${line.invalidatedBy ?? ""}`;
    const existing = batches.get(key);
    if (existing) {
      existing.lines.push(line);
    } else {
      batches.set(key, {
        invalidatedAt: line.invalidatedAt!,
        invalidatedBy: line.invalidatedBy ?? "",
        lines: [line]
      });
    }
  }

  return [...batches.values()].sort(
    (a, b) =>
      new Date(b.invalidatedAt).getTime() - new Date(a.invalidatedAt).getTime()
  );
}

export function ProductionQuantityReportHistoryDrawer({
  reportId,
  configurationParameters,
  open,
  onClose
}: {
  reportId: string;
  configurationParameters?: ConfigurationParameter[] | null;
  open: boolean;
  onClose: () => void;
}) {
  const { formatDateTime } = useDateFormatter();
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<ProductionQuantityReportLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !reportId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetch(path.to.api.quantityReportLines(reportId, true))
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? "Failed to load history");
        }
        return res.json() as Promise<{ lines: ProductionQuantityReportLine[] }>;
      })
      .then((data) => {
        if (!cancelled) {
          setLines(data.lines ?? []);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, reportId]);

  const batches = useMemo(() => groupInvalidatedLines(lines), [lines]);

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Report history</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="flex min-h-0 min-w-0 flex-col items-stretch gap-4">
          {loading ? <Loading isLoading /> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {!loading && !error ? (
            batches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                <Trans>No previous versions</Trans>
              </p>
            ) : (
              <VStack className="w-full items-stretch gap-4">
                {batches.map((batch) => {
                  const totalQuantity = batchTotalQuantity(batch.lines);
                  const employeeId = batchEmployeeId(batch.lines);
                  const createdBy = batchCreatedBy(batch.lines);
                  const createdAt = batchCreatedAt(batch.lines);

                  return (
                    <div
                      key={`${batch.invalidatedAt}-${batch.invalidatedBy}`}
                      className="flex w-full flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 dark:bg-muted/20"
                    >
                      {employeeId ? (
                        <ProductionQuantityReportCardHeader
                          employeeId={employeeId}
                          createdBy={createdBy}
                          summary={
                            <Trans>Reported {totalQuantity} units</Trans>
                          }
                          timestamp={
                            createdAt ? formatDateTime(createdAt) : ""
                          }
                        />
                      ) : (
                        <div>
                          <p className="text-sm font-medium leading-5 text-foreground">
                            <Trans>Reported {totalQuantity} units</Trans>
                          </p>
                          {createdAt ? (
                            <p className="text-xs tabular-nums leading-5 text-muted-foreground">
                              {formatDateTime(createdAt)}
                            </p>
                          ) : null}
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        {batch.lines.map((line) => (
                          <ProductionQuantityLineBreakdown
                            key={line.id}
                            line={line}
                            configurationParameters={configurationParameters}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </VStack>
            )
          ) : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
