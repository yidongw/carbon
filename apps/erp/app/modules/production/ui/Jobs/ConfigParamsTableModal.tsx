import {
  Button,
  Combobox,
  cn,
  HStack,
  IconButton,
  Loading,
  Modal,
  ModalContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useFetcher } from "react-router";
import { Enumerable } from "~/components/Enumerable";
import { useShape } from "~/components/Form/Shape";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  buildConfigTableEditorState,
  type ConfigReferenceSource,
  type ConfigTableReferenceContext,
  fillValueFromReference
} from "~/modules/production/configParamsTableColumns";
import {
  buildConfigTableActionResponse,
  type ConfigTableOverlaySuccess,
  isConfigTableOverlaySuccess
} from "~/modules/production/configTableOverlay";
import type { ItemConfigTableOverlayLoaderData } from "~/routes/api+/items.$itemId.config-table";
import { path } from "~/utils/path";

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
  referenceByRowIndex?: Array<Record<string, number>>;
  jobDisplayId?: string | null;
} & Omit<OverlayFormInjectedProps, "fetcher" | "action"> & {
    // Optional so the same content can render as a plain local modal (client
    // confirm) without the overlay's submit fetcher.
    fetcher?: OverlayFormInjectedProps["fetcher"];
    action?: string;
  };

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

function getColumnWidthClass(column: Column, hasReferences: boolean): string {
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
    case "quantity": {
      if (value === "" || value === undefined || value === null) return true;
      const num = Number(value);
      return Number.isFinite(num) && num >= 0;
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

function quantityCellMatchesReference(
  cellValue: string | number | boolean | undefined,
  referenceValue: number | undefined
) {
  if (referenceValue === undefined) return true;
  const input = Number(cellValue) || 0;
  return Math.abs(input - referenceValue) <= 0.0001;
}

function ConfigParamsTableModal({
  parameters,
  initialRows,
  referenceByRowIndex,
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

  const hasReferences = (referenceByRowIndex?.length ?? 0) > 0;
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

    if (!formAction || !fetcher) return;

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
                    getColumnWidthClass(col, hasReferences)
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
                  const referenceValue =
                    col.type === "quantity"
                      ? referenceByRowIndex?.[rowIndex]?.[col.key]
                      : undefined;
                  const isInvalid = invalidCells.has(
                    getCellKey(rowIndex, col.key)
                  );
                  const referenceMismatch =
                    referenceValue !== undefined &&
                    !quantityCellMatchesReference(cellValue, referenceValue);
                  const inputClassName = cn(
                    "w-full rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                    col.type === "quantity" &&
                      "border-sky-300 dark:border-sky-700",
                    col.type === "quantity" &&
                      !referenceMismatch &&
                      "bg-sky-50/30 dark:bg-sky-950/20",
                    col.type === "quantity" &&
                      referenceMismatch &&
                      "bg-yellow-100 dark:bg-yellow-950/40",
                    isInvalid &&
                      "border-destructive focus:ring-destructive dark:border-destructive"
                  );

                  return (
                    <Td
                      key={col.key}
                      className={cn(
                        "px-3 py-1.5",
                        getColumnWidthClass(col, hasReferences)
                      )}
                    >
                      {["quantity", "numeric"].includes(col.type) ? (
                        col.type === "quantity" && referenceValue !== undefined ? (
                          <div className="flex min-w-0 items-center gap-1">
                            <input
                              type="number"
                              min={0}
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
                              className={cn(inputClassName, "min-w-0 flex-1")}
                            />
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
                          </div>
                        ) : (
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
                        )
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
      <Button
        type="button"
        variant="primary"
        isLoading={fetcher ? fetcher.state !== "idle" : false}
        isDisabled={fetcher ? fetcher.state !== "idle" : false}
        onClick={handleSubmit}
      >
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

function extractConfigTable(configuration: unknown): Row[] | undefined {
  if (
    !configuration ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return undefined;
  }
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) ? (table as Row[]) : undefined;
}

/**
 * Compute editor rows + click-to-fill hints (client-side) from the raw inputs:
 * the fetched `parameters`, the in-memory draft `configuration`, and (when there
 * are reference hints) a fully-built `referenceContext`. Shared by the local
 * modal and the table-cell overlay render.
 */
export function buildConfigEditorRows({
  parameters,
  configuration,
  referenceContext
}: {
  parameters: ConfigurationParameter[];
  configuration?: unknown;
  referenceContext?: ConfigTableReferenceContext;
}): { initialRows?: Row[]; referenceByRowIndex?: Array<Record<string, number>> } {
  const configTable = extractConfigTable(configuration);
  if (!referenceContext) return { initialRows: configTable };
  const editor = buildConfigTableEditorState({
    parameters,
    defaultQuantityLabel: "Quantities",
    currentConfiguration:
      configTable !== undefined ? { configTable } : undefined,
    referenceContext
  });
  return {
    initialRows: editor.rows,
    referenceByRowIndex: editor.referenceByRowIndex
  };
}

/** Endpoint URL carrying only the fetch keys (ids) — never the draft config. */
function configSourceUrl(
  itemId: string,
  keys: {
    jobId?: string;
    jobOperationId?: string;
    reportKind?: "pickup" | "productionQuantity";
  }
): string {
  const base = path.to.api.itemConfigTable(itemId);
  const params = new URLSearchParams();
  if (keys.jobId) params.set("jobId", keys.jobId);
  if (keys.jobOperationId) params.set("jobOperationId", keys.jobOperationId);
  if (keys.reportKind) params.set("reportKind", keys.reportKind);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Local (non-overlay) config-table editor. A parent form owns the open state and
 * gets the edited config via `onConfirm`.
 *
 * Clean fetch/pass split: only fetch keys (`itemId` + `jobId`/`jobOperationId`/
 * `reportKind`) go to the loader, which returns `parameters` + the DB-resolved
 * `referenceSource`. The in-memory draft `configuration` is a prop, and the
 * parent supplies `buildReferenceContext(source)` (it owns the in-memory
 * reference inputs). Editor rows + hints are computed here, client-side.
 */
export function ConfigParamsTableLocalModal({
  open,
  onClose,
  onConfirm,
  itemId,
  jobId,
  jobOperationId,
  reportKind,
  configuration,
  buildReferenceContext,
  jobDisplayId
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: unknown) => void;
  itemId: string;
  jobId?: string;
  jobOperationId?: string;
  reportKind?: "pickup" | "productionQuantity";
  configuration?: unknown;
  buildReferenceContext?: (
    source: ConfigReferenceSource | null
  ) => ConfigTableReferenceContext | undefined;
  jobDisplayId?: string | null;
}) {
  const fetcher = useFetcher<ItemConfigTableOverlayLoaderData | null>();
  const load = useRef(fetcher.load);
  load.current = fetcher.load;

  useEffect(() => {
    if (!open || !itemId) return;
    void load.current(
      configSourceUrl(itemId, { jobId, jobOperationId, reportKind })
    );
  }, [open, itemId, jobId, jobOperationId, reportKind]);

  if (!open) return null;

  const data = fetcher.data;
  const isLoading = data === undefined && fetcher.state !== "idle";
  const referenceContext = data
    ? buildReferenceContext?.(data.referenceSource)
    : undefined;
  const { initialRows, referenceByRowIndex } = data?.parameters?.length
    ? buildConfigEditorRows({
        parameters: data.parameters,
        configuration,
        referenceContext
      })
    : {};

  return (
    <Modal
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <ModalContent className="flex max-h-[92vh] w-fit min-w-[20rem] max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0 pt-0 [&>button]:z-20">
        <div className="min-h-0 flex-1 overflow-auto">
          {data?.parameters?.length ? (
            <ConfigParamsTableModal
              parameters={data.parameters}
              initialRows={initialRows}
              referenceByRowIndex={referenceByRowIndex}
              jobDisplayId={jobDisplayId ?? data.itemReadableId}
              confirmMode="client"
              onConfirmSuccess={onConfirm}
              onDismiss={onClose}
            />
          ) : (
            <div className="flex min-h-[200px] items-center justify-center p-6">
              <Loading isLoading={isLoading} />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}

/**
 * Build the editor's `configuration` input from the current table rows, falling
 * back to a saved/initial configuration when nothing has been edited yet.
 */
export function toConfigTableValue(
  rows: Row[] | null | undefined,
  primaryKeys: string[],
  fallback?: unknown
): unknown {
  return rows && primaryKeys.length > 0
    ? { configTable: rows, configTablePrimaryKeys: primaryKeys }
    : fallback;
}

type ConfigTableModalRequest = {
  itemId: string;
  configuration?: unknown;
  jobId?: string;
  jobOperationId?: string;
  reportKind?: "pickup" | "productionQuantity";
  buildReferenceContext?: (
    source: ConfigReferenceSource | null
  ) => ConfigTableReferenceContext | undefined;
  jobDisplayId?: string | null;
  /** Receives the validated edited config when the user confirms. */
  onConfirm: (result: ConfigTableOverlaySuccess) => void;
};

/**
 * Manage a single local config-table editor. Call `open(request)` to show it;
 * render `node`. Handles open state, the success check, and closing — so callers
 * just describe what to fetch/pass and what to do on confirm.
 */
export function useConfigTableModal(): {
  open: (request: ConfigTableModalRequest) => void;
  node: ReactNode;
} {
  const [request, setRequest] = useState<ConfigTableModalRequest | null>(null);
  const open = useCallback(
    (next: ConfigTableModalRequest) => setRequest(next),
    []
  );
  const close = useCallback(() => setRequest(null), []);

  const node = request ? (
    <ConfigParamsTableLocalModal
      open
      onClose={close}
      onConfirm={(data) => {
        if (isConfigTableOverlaySuccess(data)) request.onConfirm(data);
        close();
      }}
      itemId={request.itemId}
      jobId={request.jobId}
      jobOperationId={request.jobOperationId}
      reportKind={request.reportKind}
      configuration={request.configuration}
      buildReferenceContext={request.buildReferenceContext}
      jobDisplayId={request.jobDisplayId}
    />
  ) : null;

  return { open, node };
}

export { ConfigParamsTableModal };
export default ConfigParamsTableModal;
