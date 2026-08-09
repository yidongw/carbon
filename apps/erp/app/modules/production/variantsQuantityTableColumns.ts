import type { ConfigurationParameter } from "~/modules/items/types";

export type VariantsQuantityRow = Record<string, string | number | boolean>;

export type VariantsQuantityColumnType =
  | "quantity"
  | "text"
  | "numeric"
  | "boolean"
  | "list"
  | "material";

export type VariantsQuantityColumn = {
  key: string;
  label: string;
  type: VariantsQuantityColumnType;
  options?: string[];
};

/** Minimal parameter shape required to build config table columns. */
export type ConfigurationParameterColumnsInput = Pick<
  ConfigurationParameter,
  "key" | "label" | "dataType" | "listOptions"
>;

export function buildVariantsQuantityColumns(
  parameters: ConfigurationParameterColumnsInput[],
  defaultQuantityLabel: string
): {
  comboParam: ConfigurationParameterColumnsInput | null;
  columns: VariantsQuantityColumn[];
} {
  // Style combo: single valuesKey list → row labels + Quantities (not matrix).
  const firstList = parameters.find((p) => p.dataType === "list");
  const isStyleCombo =
    (parameters.length === 1 && parameters[0]?.key === "valuesKey") ||
    firstList?.key === "valuesKey";

  if (isStyleCombo && firstList) {
    return {
      comboParam: firstList,
      columns: [
        {
          key: "valuesKey",
          label: firstList.label || "Attributes",
          type: "list",
          options: firstList.listOptions ?? []
        },
        {
          key: "Quantities",
          label: defaultQuantityLabel,
          type: "quantity"
        }
      ]
    };
  }

  // The legacy Color×Size matrix model is retired: every quantity config is now
  // the attribute combo (valuesKey + Quantities) handled above. Any non-combo
  // config collapses to a single plain Quantities column.
  return {
    comboParam: null,
    columns: [
      { key: "Quantities", label: defaultQuantityLabel, type: "quantity" }
    ]
  };
}

function getMergeKey(
  row: VariantsQuantityRow,
  columns: VariantsQuantityColumn[]
): string {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");

  if (descriptorColumns.length === 0) {
    return "__all__";
  }

  return JSON.stringify(
    descriptorColumns.map((col) => String(row[col.key] ?? "").trim())
  );
}

export function mergeVariantsQuantityRows(
  rows: VariantsQuantityRow[],
  columns: VariantsQuantityColumn[]
): VariantsQuantityRow[] {
  const rowsByKey = new Map<string, VariantsQuantityRow>();

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

export function hasVariantRowValue(
  row: VariantsQuantityRow,
  columns: VariantsQuantityColumn[]
): boolean {
  const quantityColumns = columns.filter((col) => col.type === "quantity");
  if (quantityColumns.length > 0) {
    return quantityColumns.some((col) => !isZeroOrEmpty(row[col.key]));
  }

  return columns.some((col) => !isZeroOrEmpty(row[col.key]));
}

/** Current wire key for Style/combo qty rows. */
export const VARIANT_TABLE_KEY = "variantTable" as const;
/** Legacy wire key — still dual-read from stored SO/PO/job JSON. */
export const LEGACY_CONFIG_TABLE_KEY = "configTable" as const;

/** Read combo qty rows from `variantTable`, falling back to legacy `configTable`. */
export function getVariantsQuantityRows(
  configuration: unknown
): VariantsQuantityRow[] {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return [];
  }

  const cfg = configuration as Record<string, unknown>;
  const table = cfg[VARIANT_TABLE_KEY] ?? cfg[LEGACY_CONFIG_TABLE_KEY];
  if (!Array.isArray(table)) return [];

  return table as VariantsQuantityRow[];
}

/** Persist combo qty rows under the current wire key. */
export function toVariantTablePayload(rows: VariantsQuantityRow[]): {
  variantTable: VariantsQuantityRow[];
} {
  return { [VARIANT_TABLE_KEY]: rows };
}

export type VariantsQuantityCell = {
  key: string;
  label: string;
  quantity: number;
};

function optionLabelOf(
  value: string,
  optionLabels?: Record<string, string>
): string {
  if (!optionLabels) return value;
  if (optionLabels[value]) return optionLabels[value];
  const lower = value.toLowerCase();
  for (const [key, label] of Object.entries(optionLabels)) {
    if (key.toLowerCase() === lower) return label;
  }
  return value;
}

/**
 * Flatten a stored config table into one cell per non-zero quantity, for
 * summary badges (`BK · S ×2`) and expand lists. Combo-only: each row is a
 * `valuesKey` + `Quantities`, labelled from `label` or the valuesKey
 * (`|` → ` · `). Legacy Color×Size matrix configs are retired (yield nothing).
 */
export function getVariantsQuantityCells(
  configuration: unknown,
  optionLabels?: Record<string, string>
): VariantsQuantityCell[] {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return [];
  }

  // Combo-only: quantity configs are { valuesKey, Quantities } rows. Legacy
  // Color×Size matrices are retired.
  const labelOf = (value: string) => optionLabelOf(value, optionLabels);
  const cells: VariantsQuantityCell[] = [];

  for (const [rowIndex, row] of getVariantsQuantityRows(
    configuration
  ).entries()) {
    const valuesKey = String(row.valuesKey ?? "").trim();
    if (!valuesKey) continue;
    const rawQty = row.Quantities;
    if (isZeroOrEmpty(rawQty)) continue;
    const quantity = Number(rawQty) || 0;
    if (quantity === 0) continue;

    const storedLabel = String(row.label ?? "").trim();
    const label = storedLabel
      ? storedLabel
      : valuesKey.split("|").map(labelOf).join(" · ");

    cells.push({ key: `${rowIndex}:Quantities`, label, quantity });
  }

  return cells;
}

export type ComboVariantsQuantityRow = {
  valuesKey: string;
  Quantities: number;
  label?: string;
};

/**
 * Read stored config → combo editor rows (`valuesKey` + `Quantities`).
 * Configs are combo-only now; anything else yields no rows.
 */
export function variantsQuantityToComboRows(
  configuration: unknown,
  optionLabels?: Record<string, string>
): ComboVariantsQuantityRow[] {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return [];
  }

  // Combo-only: pass through { valuesKey, Quantities } rows. Legacy Color×Size
  // matrix configs are retired.
  const labelOf = (value: string) => optionLabelOf(value, optionLabels);
  const out: ComboVariantsQuantityRow[] = [];

  for (const row of getVariantsQuantityRows(configuration)) {
    const valuesKey = String(row.valuesKey ?? "").trim();
    if (!valuesKey) continue;
    const quantity = Number(row.Quantities) || 0;
    if (quantity <= 0) continue;
    const storedLabel = String(row.label ?? "").trim();
    const label = storedLabel
      ? storedLabel
      : valuesKey.split("|").map(labelOf).join(" · ");
    out.push({ valuesKey, Quantities: quantity, ...(label ? { label } : {}) });
  }

  return out;
}

export function formatVariantRowLabel(
  row: VariantsQuantityRow,
  columns: VariantsQuantityColumn[],
  /** Display label per list-option value (e.g. color code -> color name). The
   * stored value stays the code; only the shown text changes. */
  optionLabels?: Record<string, string>
): string {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");
  const quantityColumns = columns.filter((col) => col.type === "quantity");

  const descriptorParts = descriptorColumns
    .map((col) => {
      const value = String(row[col.key] ?? "").trim();
      return value ? (optionLabels?.[value] ?? value) : value;
    })
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

export function formatVariantRowLabels(
  configuration: unknown,
  parameters: ConfigurationParameterColumnsInput[],
  defaultQuantityLabel: string,
  optionLabels?: Record<string, string>
): string[] {
  const { columns } = buildVariantsQuantityColumns(
    parameters,
    defaultQuantityLabel
  );
  const rows = getVariantsQuantityRows(configuration);

  return rows
    .filter((row) => hasVariantRowValue(row, columns))
    .map((row) => formatVariantRowLabel(row, columns, optionLabels));
}

export type VariantsQuantityRowDisplayPart = {
  descriptor: string | null;
  quantities: { label: string; value: number }[];
};

export function getConfigRowDisplayPart(
  row: VariantsQuantityRow,
  columns: VariantsQuantityColumn[],
  /** Display label per list-option value (e.g. color code -> color name). The
   * stored value stays the code; only the shown text changes. */
  optionLabels?: Record<string, string>
): VariantsQuantityRowDisplayPart {
  const descriptorColumns = columns.filter((col) => col.type !== "quantity");
  const quantityColumns = columns.filter((col) => col.type === "quantity");

  const descriptor =
    descriptorColumns
      .map((col) => {
        const value = String(row[col.key] ?? "").trim();
        return value ? (optionLabels?.[value] ?? value) : value;
      })
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
  parameters: ConfigurationParameterColumnsInput[],
  defaultQuantityLabel: string,
  optionLabels?: Record<string, string>
): VariantsQuantityRowDisplayPart[] {
  const { columns } = buildVariantsQuantityColumns(
    parameters,
    defaultQuantityLabel
  );
  const rows = getVariantsQuantityRows(configuration);

  return rows
    .filter((row) => hasVariantRowValue(row, columns))
    .map((row) => getConfigRowDisplayPart(row, columns, optionLabels));
}

export type ReportedTargetCell = {
  reported: number;
  pickup: number;
  target: number;
};

export type ReportedTargetRow = {
  [key: string]: string | number | boolean | Record<string, ReportedTargetCell>;
  cells: Record<string, ReportedTargetCell>;
};

export function buildReportedTargetRows({
  targetConfiguration,
  reportedConfigurations,
  pickupConfigurations = [],
  parameters,
  defaultQuantityLabel
}: {
  targetConfiguration: unknown;
  reportedConfigurations: unknown[];
  pickupConfigurations?: unknown[];
  parameters: ConfigurationParameterColumnsInput[];
  defaultQuantityLabel: string;
}): ReportedTargetRow[] {
  const { columns } = buildVariantsQuantityColumns(
    parameters,
    defaultQuantityLabel
  );

  const targetRows = mergeVariantsQuantityRows(
    getVariantsQuantityRows(targetConfiguration),
    columns
  );
  const reportedRows = mergeVariantsQuantityRows(
    reportedConfigurations.flatMap((config) => getVariantsQuantityRows(config)),
    columns
  );
  const pickupRows = mergeVariantsQuantityRows(
    pickupConfigurations.flatMap((config) => getVariantsQuantityRows(config)),
    columns
  );

  const targetByKey = new Map(
    targetRows.map((row) => [getMergeKey(row, columns), row])
  );
  const reportedByKey = new Map(
    reportedRows.map((row) => [getMergeKey(row, columns), row])
  );
  const pickupByKey = new Map(
    pickupRows.map((row) => [getMergeKey(row, columns), row])
  );

  const keys = new Set([
    ...targetByKey.keys(),
    ...reportedByKey.keys(),
    ...pickupByKey.keys()
  ]);

  return Array.from(keys).map((key) => {
    const targetRow = targetByKey.get(key);
    const reportedRow = reportedByKey.get(key);
    const pickupRow = pickupByKey.get(key);
    const baseRow: VariantsQuantityRow = {
      ...(targetRow ?? reportedRow ?? pickupRow ?? {})
    };

    const cells: Record<string, ReportedTargetCell> = {};
    for (const col of columns) {
      if (col.type !== "quantity") continue;
      cells[col.key] = {
        reported: Number(reportedRow?.[col.key]) || 0,
        pickup: Number(pickupRow?.[col.key]) || 0,
        target: Number(targetRow?.[col.key]) || 0
      };
    }

    return { ...baseRow, cells };
  });
}

export type VariantsQuantityTableReferenceMode = "original" | "remaining";

/** Context for disposition variants-quantity editing with click-to-fill reference values. */
export type VariantsQuantityReferenceContext = {
  mode: VariantsQuantityTableReferenceMode;
  originalVariantTable: unknown;
  /** Active sibling line configurations (excluding the line being edited). */
  otherLineVariantTables: unknown[];
  /** When set, use pickup-based hints for this employee instead of job target hints */
  employeeId?: string;
  /** Pickup quantities by employee (for pickup-based hint calculation) */
  pickupsByEmployee?: Record<
    string,
    { quantity: number; configuration: unknown }[]
  >;
  /** Production quantities already reported by the selected employee */
  employeeReportedConfigurations?: unknown[];
  /** When set, the variants-quantity loader fetches fresh pickup/reported data for this job operation */
  jobId?: string;
  jobOperationId?: string;
  /** Sibling line configs in the current form (excluding the line being edited). */
  siblingLineConfigurations?: unknown[];
};

export function buildVariantsQuantityEditorState({
  parameters,
  defaultQuantityLabel,
  currentConfiguration,
  referenceContext,
  prefillFromReference = false
}: {
  parameters: ConfigurationParameterColumnsInput[];
  defaultQuantityLabel: string;
  currentConfiguration: unknown;
  referenceContext?: VariantsQuantityReferenceContext | null;
  /**
   * Seed each editable quantity cell that has no current draft value with its
   * reference (remaining) quantity, so e.g. reporting cutting starts pre-filled
   * with what's still planned per variant combo instead of all zeros.
   */
  prefillFromReference?: boolean;
}): {
  rows: VariantsQuantityRow[];
  referenceByRowIndex: Array<Record<string, number>>;
} {
  const { columns } = buildVariantsQuantityColumns(
    parameters,
    defaultQuantityLabel
  );

  if (!referenceContext) {
    const currentRows = mergeVariantsQuantityRows(
      getVariantsQuantityRows(currentConfiguration),
      columns
    );
    return {
      rows: currentRows.length > 0 ? currentRows : [],
      referenceByRowIndex: []
    };
  }

  const originalRows = mergeVariantsQuantityRows(
    getVariantsQuantityRows(referenceContext.originalVariantTable),
    columns
  );
  const currentRows = mergeVariantsQuantityRows(
    getVariantsQuantityRows(currentConfiguration),
    columns
  );
  const otherRows = mergeVariantsQuantityRows(
    referenceContext.otherLineVariantTables.flatMap((config) =>
      getVariantsQuantityRows(config)
    ),
    columns
  );

  const originalByKey = new Map(
    originalRows.map((row) => [getMergeKey(row, columns), row])
  );
  const currentByKey = new Map(
    currentRows.map((row) => [getMergeKey(row, columns), row])
  );
  const otherByKey = new Map(
    otherRows.map((row) => [getMergeKey(row, columns), row])
  );

  const employeePickups =
    referenceContext.employeeId && referenceContext.pickupsByEmployee
      ? (referenceContext.pickupsByEmployee[referenceContext.employeeId] ?? [])
      : [];
  const usePickupHints = employeePickups.length > 0;

  const pickupRows = usePickupHints
    ? mergeVariantsQuantityRows(
        employeePickups.flatMap((pickup) =>
          getVariantsQuantityRows(pickup.configuration)
        ),
        columns
      )
    : [];

  const employeeProducedRows = usePickupHints
    ? mergeVariantsQuantityRows(
        (referenceContext.employeeReportedConfigurations ?? []).flatMap(
          (config) => getVariantsQuantityRows(config)
        ),
        columns
      )
    : [];
  const employeeProducedByKey = new Map(
    employeeProducedRows.map((row) => [getMergeKey(row, columns), row])
  );

  const orderedKeys = [
    ...originalRows.map((row) => getMergeKey(row, columns)),
    ...currentRows
      .map((row) => getMergeKey(row, columns))
      .filter((key) => !originalByKey.has(key)),
    ...pickupRows
      .map((row) => getMergeKey(row, columns))
      .filter(
        (key) =>
          !originalByKey.has(key) &&
          !currentRows.some((row) => getMergeKey(row, columns) === key)
      )
  ];

  const rows: VariantsQuantityRow[] = [];
  const referenceByRowIndex: Array<Record<string, number>> = [];

  for (const key of orderedKeys) {
    const template =
      originalByKey.get(key) ??
      currentByKey.get(key) ??
      ({} as VariantsQuantityRow);
    const current = currentByKey.get(key);
    const row: VariantsQuantityRow = { ...template };

    for (const col of columns) {
      if (
        col.type !== "quantity" &&
        current &&
        current[col.key] !== undefined
      ) {
        row[col.key] = current[col.key] ?? row[col.key] ?? "";
      }
    }

    const refs: Record<string, number> = {};
    for (const col of columns) {
      if (col.type !== "quantity") continue;

      if (usePickupHints) {
        let pickupQty = 0;
        for (const pickup of employeePickups) {
          for (const pickupRow of getVariantsQuantityRows(
            pickup.configuration
          )) {
            if (getMergeKey(pickupRow, columns) === key) {
              pickupQty += Number(pickupRow[col.key]) || 0;
            }
          }
        }

        const producedQty =
          Number(employeeProducedByKey.get(key)?.[col.key]) || 0;
        refs[col.key] = Math.max(0, pickupQty - producedQty);
      } else {
        // Default behavior: job target - already produced
        const originalQty = Number(originalByKey.get(key)?.[col.key]) || 0;
        const otherQty = Number(otherByKey.get(key)?.[col.key]) || 0;
        refs[col.key] =
          referenceContext.mode === "original"
            ? originalQty
            : originalQty - otherQty;
      }
    }

    // Set editable quantity cells: keep any current draft value, otherwise fall
    // back to the reference (remaining) when prefilling is requested, else 0.
    for (const col of columns) {
      if (col.type !== "quantity") continue;
      const currentQty = Number(current?.[col.key]) || 0;
      row[col.key] =
        prefillFromReference && current === undefined
          ? fillValueFromReference(refs[col.key] ?? 0)
          : currentQty;
    }

    rows.push(row);
    referenceByRowIndex.push(refs);
  }

  return { rows, referenceByRowIndex };
}

export function fillValueFromReference(referenceValue: number) {
  return Math.max(0, referenceValue);
}

/** Job target config plus already-reported line configs for an operation. */
export type VariantsQuantityReferenceSource = {
  jobVariantTable: unknown;
  reportedConfigurations: unknown[];
  /** Pickup data grouped by employee for pickup-based hints */
  pickupsByEmployee?: Record<
    string,
    { quantity: number; configuration: unknown }[]
  >;
  /** Production quantities grouped by employee */
  reportedConfigurationsByEmployee?: Record<string, unknown[]>;
};

/** Hint quantities = job required − already reported (per config row/column).
 * When employeeId is provided, uses pickup-based hints (pickup - produced) instead. */
export function buildJobRemainingReferenceContext(
  source: VariantsQuantityReferenceSource,
  options?: {
    excludeConfigurations?: unknown[];
    employeeId?: string;
    /** Sibling line configs in the current form (excluding the line being edited). */
    siblingLineConfigurations?: unknown[];
  }
): VariantsQuantityReferenceContext {
  const exclude = new Set(
    (options?.excludeConfigurations ?? []).filter((config) => config != null)
  );
  const siblingLineConfigurations = (
    options?.siblingLineConfigurations ?? []
  ).filter((config) => config != null && !exclude.has(config));

  const employeeId = options?.employeeId?.trim() || undefined;
  const employeeReportedConfigurations = employeeId
    ? [
        ...(source.reportedConfigurationsByEmployee?.[employeeId] ?? []),
        ...siblingLineConfigurations
      ].filter((config) => config != null && !exclude.has(config))
    : undefined;

  return {
    mode: "remaining",
    originalVariantTable: source.jobVariantTable,
    otherLineVariantTables: [
      ...source.reportedConfigurations,
      ...siblingLineConfigurations
    ].filter((config) => config != null && !exclude.has(config)),
    employeeId,
    pickupsByEmployee: source.pickupsByEmployee,
    employeeReportedConfigurations
  };
}

/** Build reference context for the item variants-quantity overlay.
 * When job + operation ids are available, the server reloads pickup/reported data. */
export function buildProductionVariantsQuantityReferenceContext({
  source,
  employeeId,
  jobId,
  jobOperationId,
  siblingLineConfigurations = []
}: {
  source?: VariantsQuantityReferenceSource | null;
  employeeId?: string;
  jobId?: string;
  jobOperationId?: string;
  siblingLineConfigurations?: unknown[];
}): VariantsQuantityReferenceContext | undefined {
  const trimmedJobId = jobId?.trim();
  const trimmedJobOperationId = jobOperationId?.trim();
  const trimmedEmployeeId = employeeId?.trim() || undefined;

  if (trimmedJobOperationId) {
    return {
      mode: "remaining",
      originalVariantTable: null,
      otherLineVariantTables: [],
      employeeId: trimmedEmployeeId,
      jobId: trimmedJobId,
      jobOperationId: trimmedJobOperationId,
      siblingLineConfigurations
    };
  }

  if (!source) return undefined;

  return buildJobRemainingReferenceContext(source, {
    employeeId: trimmedEmployeeId,
    siblingLineConfigurations
  });
}
