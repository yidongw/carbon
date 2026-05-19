import {
  Button,
  Combobox,
  cn,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Enumerable } from "~/components/Enumerable";
import { useShape } from "~/components/Form/Shape";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { ConfigurationParameter } from "~/modules/items/types";
import { buildConfigTableActionResponse } from "~/modules/production/configTableOverlay";

type Row = Record<string, string | number | boolean>;

type ColumnType =
  | "quantity"
  | "text"
  | "numeric"
  | "boolean"
  | "list"
  | "material";

type Column = {
  key: string;
  label: string;
  type: ColumnType;
  options?: string[];
};

export type ConfigParamsTableModalProps = {
  parameters: ConfigurationParameter[];
  initialRows?: Row[];
  jobDisplayId?: string | null;
} & OverlayFormInjectedProps;

function buildColumns(
  parameters: ConfigurationParameter[],
  defaultQuantityLabel: string
): {
  primaryParam: ConfigurationParameter | null;
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

function makeDefaultRow(columns: Column[]): Row {
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

function getInitialRows(
  parameters: ConfigurationParameter[],
  primaryParam: ConfigurationParameter | null,
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

function computeTotal(rows: Row[], primaryKeys: string[]): number {
  return rows.reduce(
    (sum, row) =>
      sum +
      primaryKeys.reduce((rowSum, key) => rowSum + (Number(row[key]) || 0), 0),
    0
  );
}

function normalizeNumberInputValue(value: string): number | "" {
  if (value === "") return "";

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : "";
}

function normalizeRow(row: Row, columns: Column[]): Row {
  return Object.fromEntries(
    columns.map((col) => {
      const value = row[col.key];

      if (!["quantity", "numeric"].includes(col.type)) {
        return [col.key, value ?? ""];
      }

      return [col.key, normalizeNumberInputValue(String(value ?? ""))];
    })
  );
}

function isZeroOrEmpty(value: string | number | boolean | undefined): boolean {
  if (value === undefined) return true;

  const stringValue = String(value).trim();
  if (stringValue === "") return true;

  return Number(stringValue) === 0;
}

function hasValue(row: Row, columns: Column[]): boolean {
  const quantityColumns = columns.filter((col) => col.type === "quantity");
  if (quantityColumns.length > 0) {
    return quantityColumns.some((col) => !isZeroOrEmpty(row[col.key]));
  }

  return columns.some((col) => !isZeroOrEmpty(row[col.key]));
}

function getMergeKey(row: Row, columns: Column[]): string {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");

  if (descriptorColumns.length === 0) {
    return "__all__";
  }

  return JSON.stringify(
    descriptorColumns.map((col) => String(row[col.key] ?? "").trim())
  );
}

function mergeRows(rows: Row[], columns: Column[]): Row[] {
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

function getColumnWidthClass(column: Column): string {
  switch (column.type) {
    case "quantity":
      return "w-[7rem] min-w-[7rem] max-w-[7rem]";
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

function getCellKey(rowIndex: number, columnKey: string): string {
  return `${rowIndex}:${columnKey}`;
}

function validateCell(
  row: Row,
  column: Column,
  materialOptions: { value: string }[]
): boolean {
  const value = row[column.key];
  const stringValue = String(value ?? "").trim();

  switch (column.type) {
    case "quantity":
      return (
        stringValue !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0
      );
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

function ConfigParamsTableModal({
  parameters,
  initialRows,
  jobDisplayId,
  onDismiss,
  action: formAction,
  fetcher,
  confirmMode,
  onConfirmSuccess
}: ConfigParamsTableModalProps) {
  const { t } = useLingui();
  const materialShapeOptions = useShape();
  const materialOptions = materialShapeOptions.map((shape) => ({
    label: <Enumerable value={shape.label} />,
    value: shape.value
  }));
  const { primaryParam, primaryKeys, columns } = buildColumns(
    parameters,
    t`Quantities`
  );

  const [rows, setRows] = useState<Row[]>(() => {
    if (initialRows && initialRows.length > 0) {
      return initialRows.map((row) => normalizeRow(row, columns));
    }
    return getInitialRows(parameters, primaryParam, columns);
  });
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [validationError, setValidationError] = useState("");

  const total = computeTotal(rows, primaryKeys);

  const addRow = () => setRows((prev) => [...prev, makeDefaultRow(columns)]);

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

  const handleSubmit = () => {
    const normalizedRows = rows.map((row) => normalizeRow(row, columns));
    const populatedRows = normalizedRows
      .map((row, rowIndex) => ({ row, rowIndex }))
      .filter(({ row }) => hasValue(row, columns));
    const nextInvalidCells = new Set<string>();

    for (const { row, rowIndex } of populatedRows) {
      for (const column of columns) {
        if (!validateCell(row, column, materialOptions)) {
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

    const configuration = {
      configTable: mergedRows,
      configTablePrimaryKeys: primaryKeys
    };

    if (confirmMode === "client") {
      onConfirmSuccess(buildConfigTableActionResponse(configuration));
      return;
    }

    if (!formAction) return;

    const formData = new FormData();
    formData.append("configuration", JSON.stringify(configuration));
    fetcher.submit(formData, { method: "post", action: formAction });
  };

  const tableSection = (
    <>
      <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
        <Table className="w-auto min-w-max table-fixed">
          <Thead>
            <Tr>
              {columns.map((col) => (
                <Th
                  key={col.key}
                  className={cn(
                    "px-3 text-xs whitespace-nowrap",
                    getColumnWidthClass(col)
                  )}
                >
                  {col.label}
                </Th>
              ))}
              <Th className="px-3 w-10 min-w-10 max-w-10" />
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  const isInvalid = invalidCells.has(
                    getCellKey(rowIndex, col.key)
                  );
                  const inputClassName = cn(
                    "w-full rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                    col.type === "quantity" &&
                      "border-sky-300 bg-sky-50/30 dark:border-sky-700 dark:bg-sky-950/20",
                    isInvalid &&
                      "border-destructive focus:ring-destructive dark:border-destructive"
                  );

                  return (
                    <Td
                      key={col.key}
                      className={cn("px-3 py-1.5", getColumnWidthClass(col))}
                    >
                      {["quantity", "numeric"].includes(col.type) ? (
                        <input
                          type="number"
                          min={col.type === "quantity" ? 0 : undefined}
                          value={
                            typeof cellValue === "boolean"
                              ? ""
                              : (cellValue ?? "")
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
                          className={cn(inputClassName, "min-w-[64px]")}
                        />
                      ) : col.type === "list" ? (
                        <select
                          value={String(cellValue ?? "")}
                          onChange={(e) =>
                            updateCell(rowIndex, col.key, e.target.value)
                          }
                          className={cn(inputClassName, "min-w-[80px]")}
                        >
                          {col.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : col.type === "boolean" ? (
                        <select
                          value={String(cellValue ?? "")}
                          onChange={(e) =>
                            updateCell(rowIndex, col.key, e.target.value)
                          }
                          className={cn(inputClassName, "min-w-[80px]")}
                        >
                          <option value="" />
                          <option value="true">{t`True`}</option>
                          <option value="false">{t`False`}</option>
                        </select>
                      ) : col.type === "material" ? (
                        <Combobox
                          value={String(cellValue ?? "")}
                          options={materialOptions}
                          isClearable
                          onChange={(value) =>
                            updateCell(rowIndex, col.key, value)
                          }
                          className={cn(inputClassName, "min-w-[80px]")}
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(cellValue ?? "")}
                          onChange={(e) =>
                            updateCell(rowIndex, col.key, e.target.value)
                          }
                          className={cn(inputClassName, "min-w-[80px]")}
                        />
                      )}
                    </Td>
                  );
                })}
                <Td className="px-3 py-1.5 w-10 min-w-10 max-w-10">
                  <IconButton
                    icon={<LuTrash2 />}
                    aria-label={t`Delete row`}
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRow(rowIndex)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {validationError && (
        <div className="text-sm text-destructive">{validationError}</div>
      )}
      <HStack className="mt-4 justify-between">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addRow}
          leftIcon={<LuPlus />}
        >
          <Trans>Add Row</Trans>
        </Button>
        <span className="text-sm text-muted-foreground">
          <Trans>Total</Trans>:{" "}
          <strong className="text-foreground">{total}</strong>
        </span>
      </HStack>
    </>
  );

  const footer = (
    <HStack className="justify-end gap-2">
      <Button type="button" variant="ghost" onClick={onDismiss}>
        <Trans>Cancel</Trans>
      </Button>
      <Button type="button" variant="primary" onClick={handleSubmit}>
        <Trans>Confirm</Trans>
      </Button>
    </HStack>
  );

  return (
      <div className="flex w-max min-w-full max-w-full flex-col">
        <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
          <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
            <Trans>Configuration Parameters</Trans>
          </h3>
          {jobDisplayId ? (
            <p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-4">
          {tableSection}
        </div>
        <div className="shrink-0 border-t border-border px-6 py-4">
          {footer}
        </div>
      </div>
  );
}

export { ConfigParamsTableModal };
export default ConfigParamsTableModal;
