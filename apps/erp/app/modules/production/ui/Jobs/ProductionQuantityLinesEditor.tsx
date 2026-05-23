import {
  Button,
  HStack,
  IconButton,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useMemo } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useScrapReasons } from "~/components/Form/ScrapReason";
import { overlay, useOverlay } from "~/components/Overlay";
import type { ConfigTableReferenceContext } from "~/modules/production/configParamsTableColumns";
import { isConfigTableOverlaySuccess } from "~/modules/production/configTableOverlay";
import { computeJobConfigTableTotal } from "~/modules/production/jobConfiguration";
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import { ItemConfigQuantityInput } from "./ItemConfigQuantityInput";

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

export type EditableProductionQuantityLine = ProductionQuantityLineInput & {
  key: string;
};

const ALL_QUANTITY_LINE_TYPES = [
  "Production",
  "Rework",
  "Scrap"
] as const satisfies readonly ProductionQuantityLineInput["type"][];

export function normalizeUniqueLineTypes(
  lines: EditableProductionQuantityLine[]
): EditableProductionQuantityLine[] {
  const used = new Set<ProductionQuantityLineInput["type"]>();
  return lines.map((line) => {
    if (!used.has(line.type)) {
      used.add(line.type);
      return line;
    }
    const free = ALL_QUANTITY_LINE_TYPES.find((t) => !used.has(t));
    if (!free) {
      used.add(line.type);
      return line;
    }
    used.add(free);
    return {
      ...line,
      type: free,
      scrapReasonId: free === "Scrap" ? line.scrapReasonId : undefined
    };
  });
}

export function getConfigFromEditableLine(
  line: EditableProductionQuantityLine
) {
  if (!line.configuration || typeof line.configuration !== "object") {
    return undefined;
  }
  return line.configuration as Record<string, unknown>;
}

export function ProductionQuantityLinesEditor({
  lines,
  setLines,
  configurationParameters,
  itemId,
  isDisabled = false,
  configReferenceContext
}: {
  lines: EditableProductionQuantityLine[];
  setLines: React.Dispatch<
    React.SetStateAction<EditableProductionQuantityLine[]>
  >;
  configurationParameters?: ConfigurationParameter[] | null;
  itemId?: string | null;
  isDisabled?: boolean;
  /** When set (disposition), config table shows original/remaining reference values. */
  configReferenceContext?: {
    originalConfiguration: unknown;
  } | null;
}) {
  const { t } = useLingui();
  const { openOverlay } = useOverlay();
  const scrapReasonOptions = useScrapReasons();

  const scrapOptions = useMemo(
    () =>
      scrapReasonOptions.map((o) => ({
        value: o.value,
        label: typeof o.label === "string" ? o.label : String(o.label)
      })),
    [scrapReasonOptions]
  );

  const updateLine = useCallback(
    (key: string, patch: Partial<EditableProductionQuantityLine>) => {
      setLines((prev) =>
        prev.map((line) => (line.key === key ? { ...line, ...patch } : line))
      );
    },
    [setLines]
  );

  const openLineConfig = useCallback(
    (lineKey: string) => {
      if (!itemId) return;
      const line = lines.find((l) => l.key === lineKey);
      if (!line) return;

      const cfg = getConfigFromEditableLine(line);
      const referenceContext: ConfigTableReferenceContext | undefined =
        configReferenceContext
          ? {
              mode: line.type === "Production" ? "original" : "remaining",
              originalConfiguration:
                configReferenceContext.originalConfiguration,
              otherLineConfigurations: lines
                .filter((l) => l.key !== lineKey)
                .map((l) => getConfigFromEditableLine(l))
                .filter(
                  (config): config is Record<string, unknown> =>
                    config !== undefined
                )
            }
          : undefined;

      openOverlay(
        overlay.to.itemConfigTable(itemId, {
          configuration: cfg,
          referenceContext
        }),
        {
          onSuccess: (data) => {
            if (!isConfigTableOverlaySuccess(data)) return;
            updateLine(lineKey, {
              configuration: data.configuration,
              quantity: data.total > 0 ? data.total : line.quantity
            });
          }
        }
      );
    },
    [configReferenceContext, itemId, lines, openOverlay, updateLine]
  );

  const addLine = () => {
    const nextType = ALL_QUANTITY_LINE_TYPES.find(
      (t) => !lines.some((l) => l.type === t)
    );
    if (!nextType) return;
    setLines((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}`,
        type: nextType,
        quantity: 0
      }
    ]);
  };

  const hasZeroQuantityLine = lines.some((line) => line.quantity <= 0);
  const canAddLine =
    lines.length < ALL_QUANTITY_LINE_TYPES.length && !hasZeroQuantityLine;

  const removeLine = (key: string) => {
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)
    );
  };

  return (
    <VStack className="w-full items-stretch gap-3">
      {lines.map((line) => {
        const cfg = getConfigFromEditableLine(line);
        const configTotal = computeJobConfigTableTotal(cfg);
        const showConfig = Boolean(configurationParameters?.length && itemId);

        return (
          <div
            key={line.key}
            className="flex w-full min-w-0 flex-col gap-2 rounded-md border border-border px-3 py-2"
          >
            <HStack className="w-full min-w-0 items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  disabled={isDisabled}
                  value={line.type}
                  onValueChange={(value) =>
                    updateLine(line.key, {
                      type: value as EditableProductionQuantityLine["type"],
                      scrapReasonId:
                        value === "Scrap" ? line.scrapReasonId : undefined
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Production"
                      disabled={
                        line.type !== "Production" &&
                        lines.some(
                          (l) => l.key !== line.key && l.type === "Production"
                        )
                      }
                    >
                      <Trans>Production</Trans>
                    </SelectItem>
                    <SelectItem
                      value="Rework"
                      disabled={
                        line.type !== "Rework" &&
                        lines.some(
                          (l) => l.key !== line.key && l.type === "Rework"
                        )
                      }
                    >
                      <Trans>Rework</Trans>
                    </SelectItem>
                    <SelectItem
                      value="Scrap"
                      disabled={
                        line.type !== "Scrap" &&
                        lines.some(
                          (l) => l.key !== line.key && l.type === "Scrap"
                        )
                      }
                    >
                      <Trans>Scrap</Trans>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <IconButton
                type="button"
                variant="ghost"
                aria-label={t`Remove line`}
                icon={<LuTrash2 />}
                isDisabled={isDisabled || lines.length <= 1}
                onClick={() => removeLine(line.key)}
                className="transition-transform active:scale-[0.96]"
              />
            </HStack>
            <ItemConfigQuantityInput
              id={`qty-${line.key}`}
              label={t`Quantity`}
              value={line.quantity}
              onChange={(quantity) => updateLine(line.key, { quantity })}
              minValue={0}
              isDisabled={isDisabled || configTotal > 0}
              hasConfigurationParameters={showConfig}
              onOpenConfigTable={
                showConfig && !isDisabled
                  ? () => openLineConfig(line.key)
                  : undefined
              }
              configTableTotal={configTotal}
              openConfigAccessibilityLabel={t`Edit configuration`}
            />
            {line.type === "Scrap" ? (
              <VStack className="w-full min-w-0 gap-1">
                <Label>{t`Scrap reason`}</Label>
                <Select
                  disabled={isDisabled}
                  value={line.scrapReasonId ?? "__unset__"}
                  onValueChange={(value) =>
                    updateLine(line.key, {
                      scrapReasonId: value === "__unset__" ? undefined : value
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder={t`Select scrap reason`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__unset__">
                      <Trans>Select scrap reason</Trans>
                    </SelectItem>
                    {scrapOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </VStack>
            ) : null}
          </div>
        );
      })}
      {canAddLine ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isDisabled={isDisabled}
          onClick={addLine}
          className="transition-transform active:scale-[0.96]"
        >
          <LuPlus className="mr-1.5 h-4 w-4" />
          <Trans>Add line</Trans>
        </Button>
      ) : null}
    </VStack>
  );
}
