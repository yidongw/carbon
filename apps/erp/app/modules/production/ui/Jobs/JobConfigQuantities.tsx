import { Button, cn, HStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { PillSegmentedControl } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useShape } from "~/components/Form/Shape";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { useDateFormatter } from "~/hooks";
import type { ConfigurationParameter } from "~/modules/items/types";
import { applyConfigAdjustment } from "~/modules/production/jobConfiguration";
import type { AdjustmentMode, Column, Row } from "./configTableShared";
import {
  buildColumns,
  computeTotal,
  jobConfigQuantitiesModalBodyClassName,
  jobConfigQuantitiesModalShellClassName,
  EditableConfigGrid,
  formatSignedTotal,
  getCellKey,
  getInitialRows,
  getMergeKey,
  hasValue,
  mergeRows,
  normalizeRow,
  ReadOnlyConfigTable,
  validateCell,
  zeroQuantities
} from "./configTableShared";

type HistoryEntry = {
  id: string;
  quantity: number;
  configuration: { configTable: Row[]; configTablePrimaryKeys: string[] };
  createdAt: string;
  createdByName: string | null;
};

type ProcessQuantityEntry = {
  operationId: string;
  label: string;
  quantity: number;
  configuration: { configTable: Row[]; configTablePrimaryKeys: string[] };
};

export type JobConfigQuantitiesProps = {
  parameters: ConfigurationParameter[];
  initialRows?: Row[];
  jobDisplayId?: string | null;
  history?: HistoryEntry[];
  processQuantities?: ProcessQuantityEntry[];
} & OverlayFormInjectedProps;

function HistoryList({
  history,
  columns
}: {
  history: HistoryEntry[];
  columns: Column[];
}) {
  const { formatDateTime } = useDateFormatter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        <Trans>No changes yet.</Trans>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {history.map((entry) => {
        const isExpanded = expanded.has(entry.id);
        return (
          <div key={entry.id} className="rounded border border-border bg-card">
            <button
              type="button"
              onClick={() => toggle(entry.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50"
            >
              <LuChevronRight
                className={cn(
                  "shrink-0 text-muted-foreground transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
              <span
                className={cn(
                  "w-16 shrink-0 font-medium tabular-nums",
                  entry.quantity < 0 ? "text-destructive" : "text-emerald-600"
                )}
              >
                {formatSignedTotal(entry.quantity)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {entry.createdByName ? `${entry.createdByName} · ` : ""}
                {formatDateTime(entry.createdAt)}
              </span>
            </button>
            {isExpanded ? (
              <div className="border-t border-border px-3 py-2">
                <ReadOnlyConfigTable
                  columns={columns}
                  rows={entry.configuration.configTable ?? []}
                  signed
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ProcessQuantitiesList({
  processQuantities,
  columns,
  onApply
}: {
  processQuantities: ProcessQuantityEntry[];
  columns: Column[];
  onApply: (colKey: string, value: number) => void;
}) {
  const { t } = useLingui();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (processQuantities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        <Trans>No production reported yet.</Trans>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {processQuantities.map((entry) => {
        const isExpanded = expanded.has(entry.operationId);
        return (
          <div
            key={entry.operationId}
            className="rounded border border-border bg-card"
          >
            <button
              type="button"
              onClick={() => toggle(entry.operationId)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50"
            >
              <LuChevronRight
                className={cn(
                  "shrink-0 text-muted-foreground transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
              <span className="w-16 shrink-0 font-medium tabular-nums text-foreground">
                {entry.quantity}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {entry.label || t`Operation`}
              </span>
            </button>
            {isExpanded ? (
              <div className="border-t border-border px-3 py-2">
                <ReadOnlyConfigTable
                  columns={columns}
                  rows={entry.configuration.configTable ?? []}
                  onQuantityClick={onApply}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function JobConfigQuantities({
  parameters,
  initialRows,
  jobDisplayId,
  history,
  processQuantities,
  onDismiss,
  action: formAction,
  fetcher
}: JobConfigQuantitiesProps) {
  const { t } = useLingui();
  const materialShapeOptions = useShape();
  const materialOptions = materialShapeOptions.map((shape) => ({
    label: <Enumerable value={shape.label} />,
    value: shape.value
  }));

  const defaultQuantityLabel = t`Quantities`;
  const { primaryParam, primaryKeys, columns } = useMemo(
    () => buildColumns(parameters, defaultQuantityLabel),
    [parameters, defaultQuantityLabel]
  );

  const currentRows = useMemo(
    () =>
      initialRows && initialRows.length > 0
        ? initialRows.map((row) => normalizeRow(row, columns))
        : [],
    [initialRows, columns]
  );

  const [rows, setRows] = useState<Row[]>(() =>
    currentRows.length > 0
      ? currentRows.map((row) => zeroQuantities(row, columns))
      : getInitialRows(parameters, primaryParam, columns)
  );
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [validationError, setValidationError] = useState("");
  // Delta = enter the change (default); Total = enter the target quantity.
  // Either way the underlying state stays the signed delta, so the two tabs
  // are just different views of the same pending edit and history keeps deltas.
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
      applyConfigAdjustment(
        { configTable: currentRows, configTablePrimaryKeys: primaryKeys },
        { configTable: rows, configTablePrimaryKeys: primaryKeys }
      ),
    [currentRows, rows, primaryKeys]
  );

  const hasAdjustment = rows.some((row) =>
    primaryKeys.some((key) => (Number(row[key]) || 0) !== 0)
  );

  const deleteRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

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

  // Clicking a process quantity targets that absolute value: the stored delta
  // becomes (value - current baseline) so both Delta and Total views agree.
  const applyProcessValue = (colKey: string, value: number) => {
    setRows((prev) => {
      if (prev.length === 0) return prev;
      const baseline = baselineFor(prev[0], colKey);
      return prev.map((row, i) =>
        i === 0 ? { ...row, [colKey]: value - baseline } : row
      );
    });
    setValidationError("");
  };

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
        configTable: mergedRows,
        configTablePrimaryKeys: primaryKeys
      })
    );
    fetcher.submit(formData, { method: "post", action: formAction });
  };

  const confirmDisabled =
    fetcher.state !== "idle" || !hasAdjustment || preview.hasNegative;

  return (
    <div className={jobConfigQuantitiesModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Configuration Parameters</Trans>
        </h3>
        {jobDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>
        ) : null}
      </div>
      <div className={jobConfigQuantitiesModalBodyClassName}>
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                <Trans>Current</Trans>
              </h4>
              <span className="text-sm text-muted-foreground">
                <Trans>Total</Trans>:{" "}
                <strong className="text-foreground">
                  {computeTotal(currentRows, primaryKeys)}
                </strong>
              </span>
            </div>
            {currentRows.length > 0 ? (
              <ReadOnlyConfigTable columns={columns} rows={currentRows} />
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
                  Enter a positive number to add or a negative number to subtract.
                </Trans>
              ) : (
                <Trans>Enter the target quantity for each size.</Trans>
              )}
            </p>
            <EditableConfigGrid
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

          <section className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-foreground">
              <Trans>Reported by process</Trans>
            </h4>
            <p className="text-xs text-muted-foreground">
              <Trans>
                Production already reported per operation. Click a number to
                pull it into the editor above.
              </Trans>
            </p>
            <ProcessQuantitiesList
              processQuantities={processQuantities ?? []}
              columns={columns}
              onApply={applyProcessValue}
            />
          </section>

          <section className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-foreground">
              <Trans>History</Trans>
            </h4>
            <HistoryList history={history ?? []} columns={columns} />
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

export { JobConfigQuantities };
export default JobConfigQuantities;
