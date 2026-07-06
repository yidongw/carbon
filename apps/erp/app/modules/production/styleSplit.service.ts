import type { Json } from "@carbon/database";

export type PendingSplitSourceRow = {
  sourceId: string;
  sourceRowKey?: string | null;
  reportId?: string | null;
  styleId: string;
  colorCode: string;
  sizeCode: string | null;
  shadeLot?: string | null;
  configurationKey: string;
  rowConfiguration?: Json | null;
  reportedQuantity: number;
  allocatedQuantity: number;
};

export type PendingSplitGroup = {
  styleId: string;
  colorCode: string;
  sizeCode: string | null;
  shadeLot: string | null;
  configurationKey: string;
  sourceIds: string[];
  reportedQuantity: number;
  allocatedQuantity: number;
  pendingQuantity: number;
};

export type PendingSplitAllocation = {
  bundleIndex: number;
  sourceId: string;
  sourceRowKey?: string | null;
  reportId: string | null;
  quantity: number;
};

const defaultGarmentColumnAliases = {
  colorCode: ["colorCode", "Color Code", "Color", "颜色代码", "颜色", "Colour"],
  sizeCode: ["sizeCode", "Size Code", "Size", "尺码", "鞋码"],
  shadeLot: ["shadeLot", "Shade Lot", "Shade", "色差批", "缸号", "批次"]
} as const;

type GarmentConfigRow = Record<string, string | number | boolean>;

function getConfigPrimaryKeys(
  configuration: Json | null | undefined
): string[] {
  if (
    !configuration ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return ["Quantities"];
  }

  const raw = (configuration as Record<string, unknown>).configTablePrimaryKeys;
  const keys = Array.isArray(raw)
    ? raw.filter((key): key is string => typeof key === "string")
    : [];

  return keys.length > 0 ? keys : ["Quantities"];
}

function getConfigRows(
  configuration: Json | null | undefined
): GarmentConfigRow[] {
  if (
    !configuration ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return [];
  }

  const raw = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(raw) ? (raw as GarmentConfigRow[]) : [];
}

function readGarmentValue(
  row: GarmentConfigRow,
  aliases: readonly string[]
): string | null {
  const aliasLookup = new Set(aliases.map((alias) => alias.toLowerCase()));

  for (const [key, value] of Object.entries(row)) {
    if (!aliasLookup.has(key.toLowerCase())) continue;
    const normalized = String(value ?? "").trim();
    if (normalized) return normalized;
  }

  return null;
}

function buildConfigurationKey(args: {
  row: GarmentConfigRow | null;
  primaryKeys: string[];
  colorCode: string;
  sizeCode: string | null;
  shadeLot: string | null;
}) {
  const descriptorEntries = Object.entries(args.row ?? {})
    .filter(([key]) => !args.primaryKeys.includes(key))
    .map(([key, value]) => [key, String(value ?? "").trim()] as const)
    .sort(([left], [right]) => left.localeCompare(right));

  return JSON.stringify({
    colorCode: args.colorCode,
    sizeCode: args.sizeCode,
    shadeLot: args.shadeLot,
    descriptors: descriptorEntries
  });
}

export function buildPendingSplitSourceRows(args: {
  sourceId: string;
  reportId?: string | null;
  styleId: string;
  fallbackColorCode: string;
  reportedQuantity?: number;
  allocatedQuantity?: number;
  configuration: Json | null;
  colorCodeAliases?: readonly string[];
  sizeCodeAliases?: readonly string[];
  shadeLotAliases?: readonly string[];
}): PendingSplitSourceRow[] {
  const primaryKeys = getConfigPrimaryKeys(args.configuration);
  const configRows = getConfigRows(args.configuration);
  const colorCodeAliases =
    args.colorCodeAliases ?? defaultGarmentColumnAliases.colorCode;
  const sizeCodeAliases =
    args.sizeCodeAliases ?? defaultGarmentColumnAliases.sizeCode;
  const shadeLotAliases =
    args.shadeLotAliases ?? defaultGarmentColumnAliases.shadeLot;

  if (configRows.length === 0) {
    const colorCode = args.fallbackColorCode.trim();
    return [
      {
        sourceId: args.sourceId,
        sourceRowKey: "row-1",
        reportId: args.reportId ?? null,
        styleId: args.styleId,
        colorCode,
        sizeCode: null,
        shadeLot: null,
        configurationKey: buildConfigurationKey({
          row: null,
          primaryKeys,
          colorCode,
          sizeCode: null,
          shadeLot: null
        }),
        rowConfiguration: null,
        reportedQuantity: args.reportedQuantity ?? 0,
        allocatedQuantity: args.allocatedQuantity ?? 0
      }
    ];
  }

  return configRows
    .map((row, index) => {
      const reportedQuantity = primaryKeys.reduce(
        (sum, key) => sum + (Number(row[key]) || 0),
        0
      );
      const colorCode =
        readGarmentValue(row, colorCodeAliases) ??
        args.fallbackColorCode.trim();
      const sizeCode = readGarmentValue(row, sizeCodeAliases);
      const shadeLot = readGarmentValue(row, shadeLotAliases);

      return {
        sourceId: args.sourceId,
        sourceRowKey: `row-${index + 1}`,
        reportId: args.reportId ?? null,
        styleId: args.styleId,
        colorCode,
        sizeCode,
        shadeLot,
        configurationKey: buildConfigurationKey({
          row,
          primaryKeys,
          colorCode,
          sizeCode,
          shadeLot
        }),
        rowConfiguration: row as Json,
        reportedQuantity,
        allocatedQuantity: 0
      } satisfies PendingSplitSourceRow;
    })
    .filter((row) => row.reportedQuantity > 0);
}

export function summarizePendingSplitGroups(
  rows: PendingSplitSourceRow[]
): PendingSplitGroup[] {
  const groups = new Map<string, PendingSplitGroup>();

  for (const row of rows) {
    const key = [
      row.styleId,
      row.colorCode,
      row.sizeCode ?? "",
      row.shadeLot ?? "",
      row.configurationKey
    ].join("::");

    const current =
      groups.get(key) ??
      ({
        styleId: row.styleId,
        colorCode: row.colorCode,
        sizeCode: row.sizeCode,
        shadeLot: row.shadeLot ?? null,
        configurationKey: row.configurationKey,
        sourceIds: [],
        reportedQuantity: 0,
        allocatedQuantity: 0,
        pendingQuantity: 0
      } satisfies PendingSplitGroup);

    current.sourceIds.push(row.sourceId);
    current.reportedQuantity += row.reportedQuantity;
    current.allocatedQuantity += row.allocatedQuantity;
    current.pendingQuantity =
      current.reportedQuantity - current.allocatedQuantity;

    groups.set(key, current);
  }

  return [...groups.values()];
}

export function validateSplitBatchBundles(args: {
  availableQuantity: number;
  bundleQuantities: number[];
}) {
  const createdQuantity = args.bundleQuantities.reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  if (args.bundleQuantities.some((quantity) => quantity <= 0)) {
    return {
      error: new Error("Bundle quantities must be greater than zero"),
      createdQuantity,
      deferredQuantity: args.availableQuantity - createdQuantity
    };
  }

  if (createdQuantity > args.availableQuantity) {
    return {
      error: new Error("Bundle quantities exceed available pending quantity"),
      createdQuantity,
      deferredQuantity: args.availableQuantity - createdQuantity
    };
  }

  return {
    error: null,
    createdQuantity,
    deferredQuantity: args.availableQuantity - createdQuantity
  };
}

export function allocatePendingSplitRows(args: {
  rows: PendingSplitSourceRow[];
  bundleQuantities: number[];
}): {
  error: Error | null;
  allocations: PendingSplitAllocation[];
  pendingQuantityAfterAllocation: number;
} {
  const availableQuantity = args.rows.reduce(
    (sum, row) => sum + (row.reportedQuantity - row.allocatedQuantity),
    0
  );
  const totals = validateSplitBatchBundles({
    availableQuantity,
    bundleQuantities: args.bundleQuantities
  });

  if (totals.error) {
    return {
      error: totals.error,
      allocations: [],
      pendingQuantityAfterAllocation: totals.deferredQuantity
    };
  }

  const allocations: PendingSplitAllocation[] = [];
  const pendingRows = args.rows
    .map((row) => ({
      ...row,
      remainingQuantity: row.reportedQuantity - row.allocatedQuantity
    }))
    .filter((row) => row.remainingQuantity > 0);

  let rowIndex = 0;

  for (const [bundleIndex, quantity] of args.bundleQuantities.entries()) {
    let remainingBundleQuantity = quantity;

    while (remainingBundleQuantity > 0) {
      const row = pendingRows[rowIndex];

      if (!row) {
        return {
          error: new Error(
            "Bundle quantities exceed remaining cutting quantity rows"
          ),
          allocations: [],
          pendingQuantityAfterAllocation: totals.deferredQuantity
        };
      }

      const allocatedQuantity = Math.min(
        row.remainingQuantity,
        remainingBundleQuantity
      );

      allocations.push({
        bundleIndex,
        sourceId: row.sourceId,
        sourceRowKey: row.sourceRowKey ?? null,
        reportId: row.reportId ?? null,
        quantity: allocatedQuantity
      });

      row.remainingQuantity -= allocatedQuantity;
      remainingBundleQuantity -= allocatedQuantity;

      if (row.remainingQuantity === 0) {
        rowIndex += 1;
      }
    }
  }

  return {
    error: null,
    allocations,
    pendingQuantityAfterAllocation: totals.deferredQuantity
  };
}
