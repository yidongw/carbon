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
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import {
  buildProductionVariantsQuantityReferenceContext,
  type VariantsQuantityReferenceContext,
  type VariantsQuantityReferenceSource
} from "~/modules/production/variantsQuantityTableColumns";
import { computeVariantTableTotal } from "~/modules/production/variantTable";
import { getOverlaySuccessVariantTable } from "../../variantsQuantityOverlay";
import { ItemVariantsQuantityInput } from "./ItemVariantsQuantityInput";
import { useVariantsQuantityModal } from "./VariantsQuantityModal";

type VariantQuantityParameter = {
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
  if (!line.variantQuantities || typeof line.variantQuantities !== "object") {
    return undefined;
  }
  return line.variantQuantities as Record<string, unknown>;
}

function buildReferenceContextForLine(
  line: EditableProductionQuantityLine,
  lineKey: string,
  lines: EditableProductionQuantityLine[],
  configReferenceContext?: {
    originalVariantTable?: unknown;
    variantsQuantityReferenceSource?: VariantsQuantityReferenceSource | null;
  } | null,
  employeeId?: string
): VariantsQuantityReferenceContext | undefined {
  if (!configReferenceContext) return undefined;

  if (configReferenceContext.originalVariantTable != null) {
    return {
      mode: line.type === "Production" ? "original" : "remaining",
      originalVariantTable: configReferenceContext.originalVariantTable,
      otherLineVariantTables: lines
        .filter((l) => l.key !== lineKey)
        .map((l) => getConfigFromEditableLine(l))
        .filter(
          (config): config is Record<string, unknown> => config !== undefined
        )
    };
  }

  if (configReferenceContext.variantsQuantityReferenceSource) {
    const siblingLineConfigurations = lines
      .filter((line) => line.key !== lineKey)
      .map((line) => getConfigFromEditableLine(line))
      .filter(
        (config): config is Record<string, unknown> => config !== undefined
      );

    return buildProductionVariantsQuantityReferenceContext({
      source: configReferenceContext.variantsQuantityReferenceSource,
      employeeId,
      siblingLineConfigurations
    });
  }

  return undefined;
}

export function ProductionQuantityLinesEditor({
  lines,
  setLines,
  variantQuantityParameters,
  itemId,
  isDisabled = false,
  configReferenceContext,
  variantsQuantityReferenceSource,
  employeeId,
  jobId,
  jobOperationId
}: {
  lines: EditableProductionQuantityLine[];
  setLines: React.Dispatch<
    React.SetStateAction<EditableProductionQuantityLine[]>
  >;
  variantQuantityParameters?: VariantQuantityParameter[] | null;
  itemId?: string | null;
  isDisabled?: boolean;
  /** When set (disposition), config table shows original/remaining reference values. */
  configReferenceContext?: {
    originalVariantTable: unknown;
  } | null;
  /** When set (first submit), hints = job target − already reported on the operation. */
  variantsQuantityReferenceSource?: VariantsQuantityReferenceSource | null;
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

  const lineVariantsQuantityModal = useVariantsQuantityModal();

  const openLineConfig = useCallback(
    (lineKey: string) => {
      if (!itemId) return;
      const line = lines.find((l) => l.key === lineKey);
      if (!line) return;

      lineVariantsQuantityModal.open({
        itemId,
        variantQuantities: getConfigFromEditableLine(line),
        jobId,
        jobOperationId,
        reportKind: "productionQuantity",
        // Report config uses the flat one-row-per-combo editor (multiple
        // rows per cell), which also captures the raw cut breakdown.
        splitMode: true,
        // Production reports what's planned/remaining per variant combo, so seed the
        // cells from the reference. Scrap/Rework start empty (you don't scrap the
        // whole remaining by default).
        prefillFromReference: line.type === "Production",
        // Built from the source the modal fetches for this operation (or the
        // in-memory original config for the "original" reference mode).
        buildReferenceContext: (source) =>
          buildReferenceContextForLine(
            line,
            lineKey,
            lines,
            configReferenceContext?.originalVariantTable != null
              ? {
                  originalVariantTable:
                    configReferenceContext.originalVariantTable
                }
              : { variantsQuantityReferenceSource: source },
            employeeId
          ),
        onConfirm: (data) =>
          updateLine(lineKey, {
            variantQuantities: {
              variantTable: getOverlaySuccessVariantTable(data)
            },
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
      lineVariantsQuantityModal,
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

  const showConfig = Boolean(variantQuantityParameters?.length && itemId);

  return (
    <VStack className="w-full items-stretch gap-3">
      {lines.map((line) => {
        const cfg = getConfigFromEditableLine(line);
        const configTotal = computeVariantTableTotal(cfg);

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
            <ItemVariantsQuantityInput
              id={`qty-${line.key}`}
              label={t`Quantity`}
              value={line.quantity}
              onChange={(quantity) => updateLine(line.key, { quantity })}
              minValue={0}
              isDisabled={showConfig ? isDisabled : false}
              isReadOnly={configTotal > 0}
              hasVariantsQuantity={showConfig}
              onOpenVariantsQuantity={
                showConfig && !isDisabled
                  ? () => openLineConfig(line.key)
                  : undefined
              }
              variantsQuantityTotal={configTotal}
              openVariantsQuantityAccessibilityLabel={t`Edit configuration`}
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
      {lineVariantsQuantityModal.node}
    </VStack>
  );
}
