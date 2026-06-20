import type { Json } from "@carbon/database";
import { Badge, HStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ConfigurationParameter } from "~/modules/items/types";
import { getConfigRowDisplayParts } from "~/modules/production/configParamsTableColumns";
import { ConfigQuantityBreakdown } from "./ConfigQuantityBreakdown";

function getProductionQuantityBadgeVariant(type: string) {
  switch (type) {
    case "Production":
      return "green" as const;
    case "Rework":
      return "orange" as const;
    default:
      return "red" as const;
  }
}

export function ProductionQuantityLineBreakdown({
  line,
  configurationParameters
}: {
  line: {
    type: string;
    quantity: number;
    configuration: Json | null;
    scrapReason?: { name: string | null } | null;
  };
  configurationParameters?: ConfigurationParameter[] | null;
}) {
  const { t } = useLingui();
  const parts =
    configurationParameters?.length && line.configuration
      ? getConfigRowDisplayParts(
          line.configuration,
          configurationParameters,
          t`Quantities`
        )
      : [];

  return (
    <div className="rounded-md border border-border/60 bg-background px-3 py-2">
      <HStack className="mb-1 flex-wrap items-center gap-2">
        <Badge
          variant={getProductionQuantityBadgeVariant(line.type)}
          className="shrink-0 leading-none"
        >
          {line.type}
        </Badge>
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-xs leading-none shadow-sm tabular-nums">
          <span className="font-medium text-muted-foreground">
            <Trans>Total</Trans>
          </span>
          <span className="font-semibold text-foreground tabular-nums">
            {Number.isInteger(line.quantity)
              ? String(line.quantity)
              : line.quantity.toLocaleString(undefined, {
                  maximumFractionDigits: 4
                })}
          </span>
        </span>
        {line.type === "Scrap" && line.scrapReason?.name ? (
          <span className="text-xs leading-5 text-muted-foreground">
            {line.scrapReason.name}
          </span>
        ) : null}
      </HStack>
      {parts.length > 0 ? <ConfigQuantityBreakdown parts={parts} /> : null}
    </div>
  );
}
