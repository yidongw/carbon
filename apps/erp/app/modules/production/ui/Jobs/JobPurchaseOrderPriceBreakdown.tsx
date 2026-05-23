import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from "@carbon/react";
import { getPurchaseOrderLineExtendedPrice } from "@carbon/utils";
import { Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useCurrencyFormatter } from "~/hooks";
import type { JobPurchaseOrderLine } from "~/modules/production";

type JobPurchaseOrderGroup = {
  purchaseOrder: NonNullable<JobPurchaseOrderLine["purchaseOrder"]>;
  lines: JobPurchaseOrderLine[];
  total: number;
};

export function groupJobPurchaseOrderLines(
  lines: JobPurchaseOrderLine[]
): JobPurchaseOrderGroup[] {
  const grouped = new Map<string, JobPurchaseOrderGroup>();

  for (const line of lines) {
    const purchaseOrder = line.purchaseOrder;
    if (!purchaseOrder?.id) continue;

    const existing = grouped.get(purchaseOrder.id);
    if (existing) {
      existing.lines.push(line);
      existing.total += getPurchaseOrderLineExtendedPrice(line);
      continue;
    }

    grouped.set(purchaseOrder.id, {
      purchaseOrder,
      lines: [line],
      total: getPurchaseOrderLineExtendedPrice(line)
    });
  }

  return Array.from(grouped.values()).sort((a, b) =>
    (a.purchaseOrder.purchaseOrderId ?? "").localeCompare(
      b.purchaseOrder.purchaseOrderId ?? ""
    )
  );
}

// Min-cost surcharge lines are inserted without a jobOperation link, so they
// are the only outside-processing lines with no joined operation row.
function isMinimumCostLine(line: JobPurchaseOrderLine) {
  return line.jobOperation == null;
}

function getLineBreakdown(
  line: JobPurchaseOrderLine,
  allLines: JobPurchaseOrderLine[]
) {
  const quantity = line.purchaseQuantity ?? 0;
  const unitPrice = line.supplierUnitPrice ?? line.unitPrice ?? 0;
  const extended = quantity * unitPrice;

  if (isMinimumCostLine(line)) {
    return {
      label: line.description ?? "Minimum cost",
      detail: null,
      extended: getPurchaseOrderLineExtendedPrice(line)
    };
  }

  const operation = line.jobOperation;
  const operationUnitCost = operation?.operationUnitCost ?? unitPrice;
  const hasSeparateMinimumLine = allLines.some(isMinimumCostLine);

  if (hasSeparateMinimumLine) {
    return {
      label: operation?.description ?? line.description ?? "Outside processing",
      detail: {
        unitCost: operationUnitCost,
        quantity,
        unitTotal: extended,
        minimumCost: null
      },
      extended: getPurchaseOrderLineExtendedPrice(line)
    };
  }

  const operationMinimumCost = operation?.operationMinimumCost ?? 0;
  const unitTotal = operationUnitCost * quantity;
  const minimumApplied = Math.max(0, operationMinimumCost - unitTotal);

  return {
    label: operation?.description ?? line.description ?? "Outside processing",
    detail:
      minimumApplied > 0
        ? {
            unitCost: operationUnitCost,
            quantity,
            unitTotal,
            minimumCost: operationMinimumCost
          }
        : {
            unitCost: operationUnitCost,
            quantity,
            unitTotal,
            minimumCost: null
          },
    extended: getPurchaseOrderLineExtendedPrice(line)
  };
}

export function JobPurchaseOrderPriceBreakdown({
  currencyCode,
  lines,
  total,
  children
}: {
  currencyCode: string;
  lines: JobPurchaseOrderLine[];
  total: number;
  children: ReactNode;
}) {
  const formatter = useCurrencyFormatter({ currency: currencyCode });

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <VStack spacing={0} className="w-full">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-medium">
              <Trans>Price breakdown</Trans>
            </p>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Trans>Line</Trans>
                </Th>
                <Th className="text-right">
                  <Trans>Total</Trans>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {lines.map((line) => {
                const breakdown = getLineBreakdown(line, lines);
                return (
                  <Tr key={line.id}>
                    <Td className="align-top">
                      <VStack spacing={1} className="items-start">
                        <span className="text-sm">{breakdown.label}</span>
                        {breakdown.detail ? (
                          <span className="text-xs text-muted-foreground">
                            {formatter.format(breakdown.detail.unitCost)} ×{" "}
                            {breakdown.detail.quantity} ={" "}
                            {formatter.format(breakdown.detail.unitTotal)}
                            {breakdown.detail.minimumCost != null ? (
                              <>
                                {" · "}
                                <Trans>Minimum</Trans>{" "}
                                {formatter.format(breakdown.detail.minimumCost)}
                              </>
                            ) : null}
                          </span>
                        ) : null}
                      </VStack>
                    </Td>
                    <Td className="text-right align-top tabular-nums">
                      {formatter.format(breakdown.extended)}
                    </Td>
                  </Tr>
                );
              })}
              <Tr>
                <Td className="font-medium">
                  <Trans>Total</Trans>
                </Td>
                <Td className="text-right font-medium tabular-nums">
                  {formatter.format(total)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </VStack>
      </PopoverContent>
    </Popover>
  );
}
