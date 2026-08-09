import { Button, cn, HStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useRef, useState } from "react";
import { PillSegmentedControl } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useShape } from "~/components/Form/Shape";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { ConfigurationParameter } from "~/modules/items/types";
import { variantsQuantityToComboRows } from "~/modules/production/variantsQuantityTableColumns";
import { applyVariantTableAdjustment } from "~/modules/production/variantTable";
import { localizeColorNameMap } from "~/modules/shared/variantDisplay";
import type { AdjustmentMode, Row } from "./variantsQuantityShared";
import {
  buildColumns,
  computeTotal,
  EditableVariantsQuantityGrid,
  formatSignedTotal,
  getCellKey,
  getInitialRows,
  getMergeKey,
  hasValue,
  isStyleComboParameters,
  jobVariantsQuantityModalBodyClassName,
  jobVariantsQuantityModalShellClassName,
  mergeRows,
  normalizeRow,
  ReadOnlyVariantsQuantityTable,
  validateCell,
  zeroQuantities
} from "./variantsQuantityShared";

export type JobVariantsQuantityProps = {
  parameters: ConfigurationParameter[];
  initialRows?: Row[];
  jobDisplayId?: string | null;
  /** Display label per list-option value (e.g. color code -> color name). */
  optionLabels?: Record<string, string>;
} & OverlayFormInjectedProps;

function JobVariantsQuantity({
  parameters,
  initialRows,
  jobDisplayId,
  optionLabels: rawOptionLabels,
  onDismiss,
  action: formAction,
  fetcher
}: JobVariantsQuantityProps) {
  const { t, i18n } = useLingui();
  // Loader attributeValueNames are the English base; translate to the user's locale so
  // headers/cells show 米色 rather than "Beige" or the raw "BG" code.
  const optionLabels =
    localizeColorNameMap(rawOptionLabels, i18n.locale) ?? rawOptionLabels;
  const materialShapeOptions = useShape();
  const materialOptions = materialShapeOptions.map((shape) => ({
    label: <Enumerable value={shape.label} />,
    value: shape.value
  }));

  const defaultQuantityLabel = t`Quantities`;
  const attributesLabel = t`Attributes`;
  const { comboParam, columns } = useMemo(
    () => buildColumns(parameters, defaultQuantityLabel, attributesLabel),
    [parameters, defaultQuantityLabel, attributesLabel]
  );

  const currentRows = useMemo(() => {
    if (!initialRows || initialRows.length === 0) return [];
    const isCombo = isStyleComboParameters(parameters);
    const needsConvert =
      isCombo &&
      !initialRows.some((r) => String(r.valuesKey ?? "").trim().length > 0);
    const seed = needsConvert
      ? (variantsQuantityToComboRows(
          { variantTable: initialRows },
          optionLabels
        ) as Row[])
      : initialRows;
    return seed.map((row) => {
      const normalized = normalizeRow(row, columns);
      const label = String(row.label ?? "").trim();
      if (label) normalized.label = label;
      return normalized;
    });
  }, [initialRows, columns, parameters, optionLabels]);

  const [rows, setRows] = useState<Row[]>(() =>
    currentRows.length > 0
      ? currentRows.map((row) => zeroQuantities(row, columns))
      : getInitialRows(parameters, comboParam, columns)
  );
  const initialRowKeysRef = useRef<Set<string> | null>(null);
  if (initialRowKeysRef.current === null) {
    initialRowKeysRef.current = new Set(
      rows.map((row) => getMergeKey(row, columns))
    );
  }
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [validationError, setValidationError] = useState("");
  // Delta = enter the change (default); Total = enter the target quantity.
  // Either way the underlying state stays the signed delta, so the two tabs
  // are just different views of the same pending edit.
  const [mode, setMode] = useState<AdjustmentMode>("delta");

  // Match an adjustment row to its current-quantity baseline by descriptor
  // columns, so Total view can show current+delta and clicks can compute deltas.
  const currentByKey = useMemo(() => {
    const map = new Map<string, Row>();
    for (const row of currentRows) {
      map.set(getMergeKey(row, columns), row);
    }
    return map;
  }, [currentRows, columns]);

  const baselineFor = (row: Row, colKey: string): number => {
    const current = currentByKey.get(getMergeKey(row, columns));
    return current ? Number(current[colKey]) || 0 : 0;
  };

  const preview = useMemo(
    () =>
      applyVariantTableAdjustment(
        { variantTable: currentRows },
        { variantTable: rows }
      ),
    [currentRows, rows]
  );

  const hasAdjustment = rows.some((row) => (Number(row.Quantities) || 0) !== 0);

  const deleteRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const canDeleteRow = (rowIndex: number) => {
    const key = getMergeKey(rows[rowIndex], columns);
    return !initialRowKeysRef.current?.has(key);
  };

  const updateCell = (
    rowIndex: number,
    colKey: string,
    value: string | number
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [colKey]: value } : row))
    );
    setInvalidCells((prev) => {
      const next = new Set(prev);
      next.delete(getCellKey(rowIndex, colKey));
      return next;
    });
    setValidationError("");
  };

  // Clicking a process quantity targets that absolute value on the matching
  // adjustment row (by descriptor merge key): stored delta becomes
  // (value - current baseline) so both Delta and Total views agree.
  const handleSubmit = () => {
    const normalizedRows = rows.map((row) => normalizeRow(row, columns));
    const populatedRows = normalizedRows
      .map((row, rowIndex) => ({ row, rowIndex }))
      .filter(({ row }) => hasValue(row, columns));
    const nextInvalidCells = new Set<string>();

    for (const { row, rowIndex } of populatedRows) {
      for (const column of columns) {
        if (!validateCell(row, column, materialOptions, true)) {
          nextInvalidCells.add(getCellKey(rowIndex, column.key));
        }
      }
    }

    if (nextInvalidCells.size > 0) {
      setInvalidCells(nextInvalidCells);
      setValidationError(
        t`Some cells have invalid values. Fix the highlighted cells before saving.`
      );
      return;
    }

    setInvalidCells(new Set());
    setValidationError("");
    const rowsToSave = populatedRows.map(({ row }) => row);
    const mergedRows = mergeRows(rowsToSave, columns);

    if (mergedRows.length === 0) {
      setValidationError(t`Enter an adjustment before saving.`);
      return;
    }
    if (preview.hasNegative) {
      setValidationError(t`This adjustment would take a quantity below zero.`);
      return;
    }
    if (!formAction) return;

    const formData = new FormData();
    formData.append(
      "adjustment",
      JSON.stringify({
        variantTable: mergedRows
      })
    );
    fetcher.submit(formData, { method: "post", action: formAction });
  };

  const confirmDisabled =
    fetcher.state !== "idle" || !hasAdjustment || preview.hasNegative;

  return (
    <div className={jobVariantsQuantityModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Variants Quantity</Trans>
        </h3>
        {jobDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>
        ) : null}
      </div>
      <div className={jobVariantsQuantityModalBodyClassName}>
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                <Trans>Current</Trans>
              </h4>
              <span className="text-sm text-muted-foreground">
                <Trans>Total</Trans>:{" "}
                <strong className="text-foreground">
                  {computeTotal(currentRows)}
                </strong>
              </span>
            </div>
            {currentRows.length > 0 ? (
              <ReadOnlyVariantsQuantityTable
                columns={columns}
                rows={currentRows}
                optionLabels={optionLabels}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                <Trans>No quantity recorded yet.</Trans>
              </p>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium text-foreground">
                <Trans>Add or remove quantity</Trans>
              </h4>
              <PillSegmentedControl
                value={mode}
                onChange={setMode}
                aria-label={t`Adjustment input mode`}
                options={[
                  { value: "delta", label: <Trans>Delta</Trans> },
                  { value: "total", label: <Trans>Total</Trans> }
                ]}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {mode === "delta" ? (
                <Trans>
                  Enter a positive number to add or a negative number to
                  subtract.
                </Trans>
              ) : (
                <Trans>Enter the target quantity for each size.</Trans>
              )}
            </p>
            <EditableVariantsQuantityGrid
              columns={columns}
              rows={rows}
              invalidCells={invalidCells}
              hasReferences={false}
              allowNegative
              mode={mode}
              baselineFor={baselineFor}
              materialOptions={materialOptions}
              updateCell={updateCell}
              deleteRow={deleteRow}
              allowRowMutations={false}
              canDeleteRow={canDeleteRow}
              optionLabels={optionLabels}
            />
            {validationError && (
              <div className="text-sm text-destructive">{validationError}</div>
            )}
            <HStack className="mt-4 justify-end">
              <span className="text-sm text-muted-foreground">
                <Trans>Adjustment</Trans>:{" "}
                <strong className="text-foreground">
                  {formatSignedTotal(preview.deltaTotal)}
                </strong>
              </span>
            </HStack>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="text-muted-foreground">
                <Trans>New total</Trans>:
              </span>
              <strong
                className={cn(
                  "tabular-nums",
                  preview.hasNegative ? "text-destructive" : "text-foreground"
                )}
              >
                {preview.total}
              </strong>
            </div>
          </section>
        </div>
      </div>
      <div className="shrink-0 border-t border-border px-6 py-4">
        <HStack className="justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={fetcher.state !== "idle"}
            isDisabled={confirmDisabled}
            onClick={handleSubmit}
          >
            <Trans>Confirm</Trans>
          </Button>
        </HStack>
      </div>
    </div>
  );
}

export { JobVariantsQuantity };
export default JobVariantsQuantity;
