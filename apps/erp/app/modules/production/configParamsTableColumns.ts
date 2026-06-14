import type { ConfigurationParameter } from "~/modules/items/types";

export type ConfigTableRow = Record<string, string | number | boolean>;

export type ConfigColumnType =
  | "quantity"
  | "text"
  | "numeric"
  | "boolean"
  | "list"
  | "material";

export type ConfigColumn = {
  key: string;
  label: string;
  type: ConfigColumnType;
  options?: string[];
};

export function buildConfigColumns(
  parameters: ConfigurationParameter[],
  defaultQuantityLabel: string
): {
  primaryParam: ConfigurationParameter | null;
  primaryKeys: string[];
  columns: ConfigColumn[];
} {
  const primaryParam = parameters.find((p) => p.dataType === "list") ?? null;
  const otherParams = parameters.filter((p) => p !== primaryParam);

  const columns: ConfigColumn[] = [];
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
      type: param.dataType as ConfigColumnType,
      options: param.listOptions ?? []
    });
  }

  return { primaryParam, primaryKeys, columns };
}

function getMergeKey(row: ConfigTableRow, columns: ConfigColumn[]): string {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");

  if (descriptorColumns.length === 0) {
    return "__all__";
  }

  return JSON.stringify(
    descriptorColumns.map((col) => String(row[col.key] ?? "").trim())
  );
}

export function mergeConfigTableRows(
  rows: ConfigTableRow[],
  columns: ConfigColumn[]
): ConfigTableRow[] {
  const rowsByKey = new Map<string, ConfigTableRow>();

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

function isZeroOrEmpty(value: string | number | boolean | undefined): boolean {
  if (value === undefined) return true;

  const stringValue = String(value).trim();
  if (stringValue === "") return true;

  return Number(stringValue) === 0;
}

export function hasConfigRowValue(
  row: ConfigTableRow,
  columns: ConfigColumn[]
): boolean {
  const quantityColumns = columns.filter((col) => col.type === "quantity");
  if (quantityColumns.length > 0) {
    return quantityColumns.some((col) => !isZeroOrEmpty(row[col.key]));
  }

  return columns.some((col) => !isZeroOrEmpty(row[col.key]));
}

export function getConfigTableRows(
  configuration: unknown
): ConfigTableRow[] {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return [];
  }

  const configTable = (configuration as Record<string, unknown>).configTable;
  if (!Array.isArray(configTable)) return [];

  return configTable as ConfigTableRow[];
}

export function formatConfigRowLabel(
  row: ConfigTableRow,
  columns: ConfigColumn[]
): string {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");
  const quantityColumns = columns.filter((col) => col.type === "quantity");

  const descriptorParts = descriptorColumns
    .map((col) => String(row[col.key] ?? "").trim())
    .filter(Boolean);

  if (quantityColumns.length === 0) {
    return descriptorParts.join(", ");
  }

  if (quantityColumns.length === 1) {
    const qty = Number(row[quantityColumns[0]!.key]) || 0;
    if (descriptorParts.length === 0) {
      return String(qty);
    }
    return `${descriptorParts.join(", ")} ${qty}`;
  }

  const quantityParts = quantityColumns
    .map((col) => {
      const qty = Number(row[col.key]) || 0;
      if (isZeroOrEmpty(row[col.key])) return null;
      return `${col.label} ${qty}`;
    })
    .filter((part): part is string => part != null);

  if (descriptorParts.length === 0) {
    return quantityParts.join(", ");
  }

  return `${descriptorParts.join(", ")} ${quantityParts.join(", ")}`;
}

export function formatConfigRowLabels(
  configuration: unknown,
  parameters: ConfigurationParameter[],
  defaultQuantityLabel: string
): string[] {
  const { columns } = buildConfigColumns(parameters, defaultQuantityLabel);
  const rows = getConfigTableRows(configuration);

  return rows
    .filter((row) => hasConfigRowValue(row, columns))
    .map((row) => formatConfigRowLabel(row, columns));
}

export type ConfigRowDisplayPart = {
  descriptor: string | null;
  quantities: { label: string; value: number }[];
};

export function getConfigRowDisplayPart(
  row: ConfigTableRow,
  columns: ConfigColumn[]
): ConfigRowDisplayPart {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");
  const quantityColumns = columns.filter((col) => col.type === "quantity");

  const descriptor =
    descriptorColumns
      .map((col) => String(row[col.key] ?? "").trim())
      .filter(Boolean)
      .join(", ") || null;

  const quantities = quantityColumns
    .map((col) => {
      const value = Number(row[col.key]) || 0;
      if (isZeroOrEmpty(row[col.key])) return null;
      return {
        label: quantityColumns.length === 1 ? "" : col.label,
        value
      };
    })
    .filter((q): q is { label: string; value: number } => q != null);

  return { descriptor, quantities };
}

export function getConfigRowDisplayParts(
  configuration: unknown,
  parameters: ConfigurationParameter[],
  defaultQuantityLabel: string
): ConfigRowDisplayPart[] {
  const { columns } = buildConfigColumns(parameters, defaultQuantityLabel);
  const rows = getConfigTableRows(configuration);

  return rows
    .filter((row) => hasConfigRowValue(row, columns))
    .map((row) => getConfigRowDisplayPart(row, columns));
}

export type ReportedTargetCell = {
  reported: number;
  target: number;
};

export type ReportedTargetRow = ConfigTableRow & {
  cells: Record<string, ReportedTargetCell>;
};

export function buildReportedTargetRows({
  targetConfiguration,
  reportedConfigurations,
  parameters,
  defaultQuantityLabel
}: {
  targetConfiguration: unknown;
  reportedConfigurations: unknown[];
  parameters: ConfigurationParameter[];
  defaultQuantityLabel: string;
}): ReportedTargetRow[] {
  const { columns } = buildConfigColumns(parameters, defaultQuantityLabel);

  const targetRows = mergeConfigTableRows(
    getConfigTableRows(targetConfiguration),
    columns
  );
  const reportedRows = mergeConfigTableRows(
    reportedConfigurations.flatMap((config) => getConfigTableRows(config)),
    columns
  );

  const targetByKey = new Map(
    targetRows.map((row) => [getMergeKey(row, columns), row])
  );
  const reportedByKey = new Map(
    reportedRows.map((row) => [getMergeKey(row, columns), row])
  );

  const keys = new Set([...targetByKey.keys(), ...reportedByKey.keys()]);

  return Array.from(keys).map((key) => {
    const targetRow = targetByKey.get(key);
    const reportedRow = reportedByKey.get(key);
    const baseRow: ConfigTableRow = { ...(targetRow ?? reportedRow ?? {}) };

    const cells: Record<string, ReportedTargetCell> = {};
    for (const col of columns) {
      if (col.type !== "quantity") continue;
      cells[col.key] = {
        reported: Number(reportedRow?.[col.key]) || 0,
        target: Number(targetRow?.[col.key]) || 0
      };
    }

    return { ...baseRow, cells };
  });
}
