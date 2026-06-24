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
import {
  buildProductionConfigTableReferenceContext,
  type ConfigReferenceSource,
  type ConfigTableReferenceContext
} from "~/modules/production/configParamsTableColumns";
import { computeJobConfigTableTotal } from "~/modules/production/jobConfiguration";
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import { useConfigTableModal } from "./ConfigParamsTableModal";
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

function buildReferenceContextForLine(
  line: EditableProductionQuantityLine,
  lineKey: string,
  lines: EditableProductionQuantityLine[],
  configReferenceContext?: {
    originalConfiguration?: unknown;
    configReferenceSource?: ConfigReferenceSource | null;
  } | null,
  employeeId?: string
): ConfigTableReferenceContext | undefined {
  if (!configReferenceContext) return undefined;

  if (configReferenceContext.originalConfiguration != null) {
    return {
      mode: line.type === "Production" ? "original" : "remaining",
      originalConfiguration: configReferenceContext.originalConfiguration,
      otherLineConfigurations: lines
        .filter((l) => l.key !== lineKey)
        .map((l) => getConfigFromEditableLine(l))
        .filter(
          (config): config is Record<string, unknown> => config !== undefined
        )
    };
  }

  if (configReferenceContext.configReferenceSource) {
    const siblingLineConfigurations = lines
      .filter((line) => line.key !== lineKey)
      .map((line) => getConfigFromEditableLine(line))
      .filter(
        (config): config is Record<string, unknown> => config !== undefined
      );

    return buildProductionConfigTableReferenceContext({
      source: configReferenceContext.configReferenceSource,
      employeeId,
      siblingLineConfigurations
    });
  }

  return undefined;
}

export function ProductionQuantityLinesEditor({
  lines,
  setLines,
  configurationParameters,
  itemId,
  isDisabled = false,
  configReferenceContext,
  configReferenceSource,
  employeeId,
  jobId,
  jobOperationId
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
  /** When set (first submit), hints = job target − already reported on the operation. */
  configReferenceSource?: ConfigReferenceSource | null;
  /** When set, use pickup-based hints for this employee */
  employeeId?: string;
  jobId?: string;
  jobOperationId?: string;
}) {
  const { t } = useLingui();
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

  const lineConfigModal = useConfigTableModal();

  const openLineConfig = useCallback(
    (lineKey: string) => {
      if (!itemId) return;
      const line = lines.find((l) => l.key === lineKey);
      if (!line) return;

      lineConfigModal.open({
        itemId,
        configuration: getConfigFromEditableLine(line),
        jobId,
        jobOperationId,
        reportKind: "productionQuantity",
        // Built from the source the modal fetches for this operation (or the
        // in-memory original config for the "original" reference mode).
        buildReferenceContext: (source) =>
          buildReferenceContextForLine(
            line,
            lineKey,
            lines,
            configReferenceContext?.originalConfiguration != null
              ? {
                  originalConfiguration:
                    configReferenceContext.originalConfiguration
                }
              : { configReferenceSource: source },
            employeeId
          ),
        onConfirm: (data) =>
          updateLine(lineKey, {
            configuration: data.configuration,
            quantity: data.total > 0 ? data.total : line.quantity
          })
      });
    },
    [
      configReferenceContext,
      employeeId,
      itemId,
      jobId,
      jobOperationId,
      lines,
      lineConfigModal,
      updateLine
    ]
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

  const showConfig = Boolean(configurationParameters?.length && itemId);

  return (
    <VStack className="w-full items-stretch gap-3">
      {lines.map((line) => {
        const cfg = getConfigFromEditableLine(line);
        const configTotal = computeJobConfigTableTotal(cfg);

        return (
          <div
            key={line.key}
            className="flex w-full min-w-0 flex-col gap-2 rounded-md border border-border px-3 py-2"
          >
            <HStack className="w-full min-w-0 items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  disabled={showConfig ? isDisabled : false}
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
              isDisabled={showConfig ? isDisabled : false}
              isReadOnly={configTotal > 0}
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
          isDisabled={showConfig ? isDisabled : false}
          onClick={addLine}
          className="transition-transform active:scale-[0.96]"
        >
          <LuPlus className="mr-1.5 h-4 w-4" />
          <Trans>Add line</Trans>
        </Button>
      ) : null}
      {lineConfigModal.node}
    </VStack>
  );
}
