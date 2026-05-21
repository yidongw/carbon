import {
  Badge,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState, type ReactNode } from "react";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  buildConfigColumns,
  getConfigRowDisplayPart,
  getConfigTableRows,
  mergeConfigTableRows,
  type ConfigRowDisplayPart
} from "~/modules/production/configParamsTableColumns";
import type { OperationQuantitySummary } from "~/modules/production/productionQuantityReport.service";
import { ConfigQuantityBreakdown } from "./ConfigQuantityBreakdown";

type OperationQuantitySummaryProps = {
  summary: OperationQuantitySummary | null;
  configurationParameters?: ConfigurationParameter[] | null;
};

function formatTotal(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function useConfigParts(
  configurations: unknown[],
  configurationParameters: ConfigurationParameter[] | null | undefined
) {
  const { t } = useLingui();

  return useMemo(() => {
    if (!configurations.length || !configurationParameters?.length) {
      return [];
    }
    const { columns } = buildConfigColumns(
      configurationParameters,
      t`Quantities`
    );
    const merged = mergeConfigTableRows(
      configurations.flatMap((config) => getConfigTableRows(config)),
      columns
    );
    return merged
      .map((row) => getConfigRowDisplayPart(row, columns))
      .filter((part) => part.descriptor || part.quantities.length > 0);
  }, [configurations, configurationParameters, t]);
}

function OperationTotalBadge({
  label,
  variant,
  total,
  parts
}: {
  label: ReactNode;
  variant: "green" | "orange" | "red";
  total: number;
  parts: ConfigRowDisplayPart[];
}) {
  const [open, setOpen] = useState(false);
  const hasBreakdown = parts.length > 0;

  const badge = (
    <Badge
      variant={variant}
      className="cursor-default gap-1.5 normal-case tracking-normal"
    >
      {label}
      <span className="tabular-nums">{formatTotal(total)}</span>
    </Badge>
  );

  if (!hasBreakdown) {
    return badge;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {badge}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto max-w-sm p-3"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <ConfigQuantityBreakdown parts={parts} />
      </PopoverContent>
    </Popover>
  );
}

export function OperationQuantitySummaryView({
  summary,
  configurationParameters
}: OperationQuantitySummaryProps) {
  const productionParts = useConfigParts(
    summary?.productionConfigurations ?? [],
    configurationParameters
  );
  const scrapParts = useConfigParts(
    summary?.scrapConfigurations ?? [],
    configurationParameters
  );
  const reworkParts = useConfigParts(
    summary?.reworkConfigurations ?? [],
    configurationParameters
  );

  if (!summary) return null;

  const hasTotals =
    summary.production > 0 || summary.scrap > 0 || summary.rework > 0;

  if (!hasTotals) return null;

  return (
    <HStack className="flex-wrap gap-2">
      {summary.production > 0 ? (
        <OperationTotalBadge
          label={<Trans>Production</Trans>}
          variant="green"
          total={summary.production}
          parts={productionParts}
        />
      ) : null}
      {summary.rework > 0 ? (
        <OperationTotalBadge
          label={<Trans>Rework</Trans>}
          variant="orange"
          total={summary.rework}
          parts={reworkParts}
        />
      ) : null}
      {summary.scrap > 0 ? (
        <OperationTotalBadge
          label={<Trans>Scrap</Trans>}
          variant="red"
          total={summary.scrap}
          parts={scrapParts}
        />
      ) : null}
    </HStack>
  );
}
