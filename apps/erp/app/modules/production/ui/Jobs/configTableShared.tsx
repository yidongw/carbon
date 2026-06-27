import { Combobox, cn, IconButton } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { LuTrash2 } from "react-icons/lu";
import { fillValueFromReference } from "~/modules/production/configParamsTableColumns";
import { ResponsiveConfigTable } from "./ResponsiveConfigTable";

export type Row = Record<string, string | number | boolean>;

export type ColumnType =
  | "quantity"
  | "text"
  | "numeric"
  | "boolean"
  | "list"
  | "material";

export type Column = {
  key: string;
  label: string;
  type: ColumnType;
  options?: string[];
};

/** Delta = enter the change; Total = enter the target quantity. */
export type AdjustmentMode = "delta" | "total";

export type MaterialOption = { label: string | ReactElement; value: string };

type ConfigurationParameterInput = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

export function buildColumns(
  parameters: ConfigurationParameterInput[],
  defaultQuantityLabel: string
): {
  primaryParam: ConfigurationParameterInput | null;
  primaryKeys: string[];
  columns: Column[];
} {
  const primaryParam = parameters.find((p) => p.dataType === "list") ?? null;
  const otherParams = parameters.filter((p) => p !== primaryParam);

  const columns: Column[] = [];
  const primaryKeys: string[] = [];

  if (
    primaryParam &&
    primaryParam.listOptions &&
    primaryParam.listOptions.length > 0
  ) {
    for (const option of primaryParam.listOptions) {
      columns.push({ key: option, label: option, type: "quantity" });
      primaryKeys.push(option);
    }
  } else {
    columns.push({
      key: "Quantities",
      label: defaultQuantityLabel,
      type: "quantity"
    });
    primaryKeys.push("Quantities");
  }

  for (const param of otherParams) {
    columns.push({
      key: param.key,
      label: param.label,
      type: param.dataType as ColumnType,
      options: param.listOptions ?? []
    });
  }

  return { primaryParam, primaryKeys, columns };
}

export function makeDefaultRow(columns: Column[]): Row {
  return Object.fromEntries(
    columns.map((col) => [
      col.key,
      col.type === "quantity"
        ? 0
        : col.type === "list"
          ? (col.options?.[0] ?? "")
          : ""
    ])
  );
}

export function getInitialRows(
  parameters: ConfigurationParameterInput[],
  primaryParam: ConfigurationParameterInput | null,
  columns: Column[]
): Row[] {
  const nonPrimaryListParams = parameters.filter(
    (p) =>
      p !== primaryParam &&
      p.dataType === "list" &&
      (p.listOptions?.length ?? 0) > 0
  );

  if (nonPrimaryListParams.length === 0) {
    return [makeDefaultRow(columns)];
  }

  const firstListParam = nonPrimaryListParams[0];
  return (firstListParam.listOptions ?? []).map((option) => ({
    ...makeDefaultRow(columns),
    [firstListParam.key]: option
  }));
}

/** Copy a row but reset all quantity columns to 0 (keeps descriptor columns). */
export function zeroQuantities(row: Row, columns: Column[]): Row {
  const next: Row = { ...row };
  for (const col of columns) {
    if (col.type === "quantity") next[col.key] = 0;
  }
  return next;
}

export function computeTotal(rows: Row[], primaryKeys: string[]): number {
  return rows.reduce(
    (sum, row) =>
      sum +
      primaryKeys.reduce((rowSum, key) => rowSum + (Number(row[key]) || 0), 0),
    0
  );
}

export function normalizeNumberInputValue(value: string): number | "" {
  if (value === "") return "";

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : "";
}

export function normalizeRow(row: Row, columns: Column[]): Row {
  return Object.fromEntries(
    columns.map((col) => {
      const value = row[col.key];

      if (col.type === "quantity") {
        if (value === undefined || value === null || value === "") {
          return [col.key, 0];
        }
        const parsed = Number(value);
        return [col.key, Number.isFinite(parsed) ? parsed : 0];
      }

      if (col.type === "numeric") {
        if (value === undefined || value === null || value === "") {
          return [col.key, ""];
        }
        return [col.key, normalizeNumberInputValue(String(value))];
      }

      return [col.key, value ?? ""];
    })
  );
}

function isZeroOrEmpty(value: string | number | boolean | undefined): boolean {
  if (value === undefined) return true;

  const stringValue = String(value).trim();
  if (stringValue === "") return true;

  return Number(stringValue) === 0;
}

export function hasValue(row: Row, columns: Column[]): boolean {
  const quantityColumns = columns.filter((col) => col.type === "quantity");
  if (quantityColumns.length > 0) {
    return quantityColumns.some((col) => !isZeroOrEmpty(row[col.key]));
  }

  return columns.some((col) => !isZeroOrEmpty(row[col.key]));
}

export function getMergeKey(row: Row, columns: Column[]): string {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");

  if (descriptorColumns.length === 0) {
    return "__all__";
  }

  return JSON.stringify(
    descriptorColumns.map((col) => String(row[col.key] ?? "").trim())
  );
}

export function mergeRows(rows: Row[], columns: Column[]): Row[] {
  const rowsByKey = new Map<string, Row>();

  for (const row of rows) {
    const key = getMergeKey(row, columns);
    const existingRow = rowsByKey.get(key);

    if (!existingRow) {
      rowsByKey.set(key, { ...row });
      continue;
    }

    for (const col of columns) {
      if (col.type !== "quantity") continue;

      existingRow[col.key] =
        (Number(existingRow[col.key]) || 0) + (Number(row[col.key]) || 0);
    }
  }

  return Array.from(rowsByKey.values());
}

export function getColumnWidthClass(
  column: Column,
  hasReferences: boolean
): string {
  switch (column.type) {
    case "quantity":
      return hasReferences
        ? "w-[10rem] min-w-[10rem] max-w-[10rem]"
        : "w-[7rem] min-w-[7rem] max-w-[7rem]";
    case "numeric":
    case "boolean":
      return "w-[8rem] min-w-[8rem] max-w-[8rem]";
    case "list":
    case "material":
      return "w-[9rem] min-w-[9rem] max-w-[9rem]";
    default:
      return "w-[10rem] min-w-[10rem] max-w-[10rem]";
  }
}

export function getCellKey(rowIndex: number, columnKey: string): string {
  return `${rowIndex}:${columnKey}`;
}

/** Modal shell shared by config-table overlays and the local editor modal. */
export const configParamsModalContentClassName = cn(
  "flex max-h-[92vh] w-fit min-w-[20rem] max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0 pt-0",
  "sm:w-fit md:w-fit sm:max-w-[calc(100vw-1.5rem)]",
  "[&>button]:z-20"
);

export const configParamsModalShellClassName =
  "flex min-h-0 w-max min-w-full max-w-[calc(100vw-1.5rem)] flex-1 flex-col";

export const configParamsModalBodyClassName =
  "min-w-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-4";

/** Job config overlay: keep a stable width while switching Delta/Total tabs. */
export const jobConfigQuantitiesModalShellClassName =
  "flex min-h-0 w-max min-w-full max-w-full flex-1 flex-col";

export const jobConfigQuantitiesModalBodyClassName =
  "min-w-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-4";

export function validateCell(
  row: Row,
  column: Column,
  materialOptions: { value: string }[],
  allowNegative: boolean
): boolean {
  const value = row[column.key];
  const stringValue = String(value ?? "").trim();

  switch (column.type) {
    case "quantity": {
      if (value === "" || value === undefined || value === null) return true;
      const num = Number(value);
      return Number.isFinite(num) && (allowNegative || num >= 0);
    }
    case "numeric":
      return stringValue !== "" && Number.isFinite(Number(value));
    case "boolean":
      return ["true", "false"].includes(stringValue);
    case "list":
      return !!column.options?.includes(stringValue);
    case "material":
      return materialOptions.some((option) => option.value === stringValue);
    default:
      return stringValue.length > 0;
  }
}

function formatReferenceValue(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function formatSignedTotal(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function quantityCellMatchesReference(
  cellValue: string | number | boolean | undefined,
  referenceValue: number | undefined
) {
  if (referenceValue === undefined) return true;
  const input = Number(cellValue) || 0;
  return Math.abs(input - referenceValue) <= 0.0001;
}

/** Read-only rendering of a config table (used for the current snapshot, history
 * rows, and reported-by-process rows). When `onQuantityClick` is set, quantity
 * cells become buttons that pull the value into the adjustment editor. */
export function ReadOnlyConfigTable({
  columns,
  rows,
  signed,
  onQuantityClick
}: {
  columns: Column[];
  rows: Row[];
  signed?: boolean;
  onQuantityClick?: (row: Row, colKey: string, value: number) => void;
}) {
  return (
    <ResponsiveConfigTable
      columns={columns}
      rows={rows}
      hasReferences={false}
      hideZeroValuesInVertical
      renderCell={(col, row) => {
        const raw = row[col.key];
        const numeric = Number(raw) || 0;
        const display =
          col.type === "quantity"
            ? signed
              ? formatSignedTotal(numeric)
              : String(numeric)
            : String(raw ?? "");
        const clickable = col.type === "quantity" && !!onQuantityClick;
        return clickable ? (
          <button
            type="button"
            onClick={() => onQuantityClick?.(row, col.key, numeric)}
            className="rounded px-1.5 py-0.5 text-sm tabular-nums text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {display}
          </button>
        ) : (
          <span className="text-sm tabular-nums">{display}</span>
        );
      }}
    />
  );
}

/** The editable quantity grid shared by the item draft editor and the job
 * adjustment editor. In `mode === "total"` quantity inputs show current + delta
 * and convert the entered total back to a delta via `baselineFor`. */
export function EditableConfigGrid({
  columns,
  rows,
  invalidCells,
  referenceByRowIndex,
  hasReferences,
  allowNegative,
  mode,
  baselineFor,
  materialOptions,
  updateCell,
  deleteRow,
  readOnly = false,
  allowRowMutations = true
}: {
  columns: Column[];
  rows: Row[];
  invalidCells: Set<string>;
  referenceByRowIndex?: Array<Record<string, number>>;
  hasReferences: boolean;
  allowNegative: boolean;
  mode: AdjustmentMode;
  baselineFor: (row: Row, colKey: string) => number;
  materialOptions: MaterialOption[];
  updateCell: (
    rowIndex: number,
    colKey: string,
    value: string | number
  ) => void;
  deleteRow: (index: number) => void;
  readOnly?: boolean;
  allowRowMutations?: boolean;
}) {
  const { t } = useLingui();

  const renderCell = (col: Column, row: Row, rowIndex: number) => {
    const cellValue = row[col.key];
    const referenceValue =
      col.type === "quantity"
        ? referenceByRowIndex?.[rowIndex]?.[col.key]
        : undefined;
    const isInvalid = invalidCells.has(getCellKey(rowIndex, col.key));
    const referenceMismatch =
      referenceValue !== undefined &&
      !quantityCellMatchesReference(cellValue, referenceValue);
    const inputClassName = cn(
      "w-full rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
      col.type === "quantity" && "border-sky-300 dark:border-sky-700",
      col.type === "quantity" &&
        !referenceMismatch &&
        "bg-sky-50/30 dark:bg-sky-950/20",
      col.type === "quantity" &&
        referenceMismatch &&
        "bg-yellow-100 dark:bg-yellow-950/40",
      isInvalid && "border-destructive focus:ring-destructive dark:border-destructive"
    );

    const isTotalMode = mode === "total" && col.type === "quantity";
    const baseline = isTotalMode ? baselineFor(row, col.key) : 0;

    if (["quantity", "numeric"].includes(col.type)) {
      if (col.type === "quantity" && referenceValue !== undefined) {
        return (
          <div className="flex min-w-0 items-center gap-1">
            <input
              type="number"
              min={0}
              disabled={readOnly}
              value={
                typeof cellValue === "boolean" ? "" : (cellValue ?? "")
              }
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) =>
                updateCell(
                  rowIndex,
                  col.key,
                  normalizeNumberInputValue(e.target.value)
                )
              }
              onBlur={(e) => {
                if (e.currentTarget.value === "") {
                  updateCell(rowIndex, col.key, 0);
                }
              }}
              className={cn(inputClassName, "min-w-0 flex-1")}
            />
            {readOnly ? null : (
              <button
                type="button"
                className={cn(
                  "shrink-0 rounded px-1 py-0.5 text-xs tabular-nums transition-colors hover:bg-muted",
                  referenceValue < 0
                    ? "text-destructive"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={t`Fill cell`}
                onClick={() =>
                  updateCell(
                    rowIndex,
                    col.key,
                    fillValueFromReference(referenceValue)
                  )
                }
              >
                {formatReferenceValue(referenceValue)}
              </button>
            )}
          </div>
        );
      }

      return (
        <input
          type="number"
          min={
            col.type === "quantity" && (isTotalMode || !allowNegative)
              ? 0
              : undefined
          }
          disabled={readOnly}
          value={
            isTotalMode
              ? cellValue === "" || cellValue === undefined
                ? ""
                : baseline + (Number(cellValue) || 0)
              : typeof cellValue === "boolean"
                ? ""
                : (cellValue ?? "")
          }
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            const next = normalizeNumberInputValue(e.target.value);
            updateCell(
              rowIndex,
              col.key,
              isTotalMode && next !== "" ? next - baseline : next
            );
          }}
          onBlur={(e) => {
            if (e.currentTarget.value === "") {
              updateCell(rowIndex, col.key, 0);
            }
          }}
          className={cn(inputClassName, "w-full min-w-0 max-w-full tabular-nums")}
        />
      );
    }

    if (col.type === "list") {
      return (
        <select
          value={String(cellValue ?? "")}
          disabled={readOnly}
          onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
          className={cn(inputClassName, "min-w-[80px]")}
        >
          {col.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (col.type === "boolean") {
      return (
        <select
          value={String(cellValue ?? "")}
          disabled={readOnly}
          onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
          className={cn(inputClassName, "min-w-[80px]")}
        >
          <option value="" />
          <option value="true">{t`True`}</option>
          <option value="false">{t`False`}</option>
        </select>
      );
    }

    if (col.type === "material") {
      return (
        <Combobox
          value={String(cellValue ?? "")}
          options={materialOptions}
          isClearable
          isReadOnly={readOnly}
          onChange={(value) => updateCell(rowIndex, col.key, value)}
          className={cn(inputClassName, "min-w-[80px]")}
        />
      );
    }

    return (
      <input
        type="text"
        value={String(cellValue ?? "")}
        disabled={readOnly}
        onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
        className={cn(inputClassName, "min-w-[80px]")}
      />
    );
  };

  return (
    <ResponsiveConfigTable
      columns={columns}
      rows={rows}
      hasReferences={hasReferences}
      hideZeroValuesInVertical={readOnly}
      renderCell={renderCell}
      renderRowActions={
        readOnly || !allowRowMutations
          ? undefined
          : (rowIndex) => (
              <IconButton
                icon={<LuTrash2 />}
                aria-label={t`Delete row`}
                variant="ghost"
                size="sm"
                onClick={() => deleteRow(rowIndex)}
              />
            )
      }
    />
  );
}
