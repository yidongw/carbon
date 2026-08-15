export type StyleVariantQuantity = {
  variantItemId: string;
  quantity: number;
};

/**
 * Treat expanded mix quantities as WEIGHTS and allocate an integer week total
 * so sum(result) === weekTotal (largest-remainder / Hamilton method).
 *
 * Example: weights 1 + 2 with weekTotal 30 → 10 + 20.
 */
export function scaleVariantQuantitiesToTotal(
  variants: StyleVariantQuantity[],
  weekTotal: number
): StyleVariantQuantity[] {
  if (variants.length === 0 || !(weekTotal > 0)) {
    return [];
  }

  const weightSum = variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  if (!(weightSum > 0)) {
    return [];
  }

  const exact = variants.map(
    (v) => ((v.quantity || 0) * weekTotal) / weightSum
  );
  const floored = exact.map((n) => Math.floor(n));
  let remaining = weekTotal - floored.reduce((sum, n) => sum + n, 0);

  const order = exact
    .map((value, index) => ({ index, frac: value - floored[index] }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);

  const quantities = [...floored];
  for (let i = 0; i < remaining; i++) {
    quantities[order[i % order.length].index] += 1;
  }

  return variants
    .map((variant, index) => ({
      ...variant,
      quantity: quantities[index]
    }))
    .filter((variant) => variant.quantity > 0);
}

/** Stock-target fields that mix ratios split across variant SKUs. */
export const PLANNING_MIX_QUANTITY_KEYS = [
  "demandAccumulationSafetyStock",
  "reorderPoint",
  "reorderQuantity",
  "maximumInventoryQuantity"
] as const;

export type PlanningMixQuantityKey =
  (typeof PLANNING_MIX_QUANTITY_KEYS)[number];

/**
 * Allocate one SKU's share of parent planning totals using mix weights.
 * Policy, accumulation period, and lot-size fields are not scaled.
 */
export function scalePlanningQuantityFieldsForVariant(
  parentValues: Record<string, unknown>,
  mix: StyleVariantQuantity[],
  variantItemId: string
): Partial<Record<PlanningMixQuantityKey, number>> {
  const out: Partial<Record<PlanningMixQuantityKey, number>> = {};
  for (const key of PLANNING_MIX_QUANTITY_KEYS) {
    const raw = parentValues[key];
    if (raw == null || raw === "") continue;
    const total = Number(raw);
    if (!Number.isFinite(total)) continue;
    if (!(total > 0) || mix.length === 0) {
      out[key] = total;
      continue;
    }
    const scaled = scaleVariantQuantitiesToTotal(mix, total);
    out[key] =
      scaled.find((variant) => variant.variantItemId === variantItemId)
        ?.quantity ?? 0;
  }
  return out;
}

/** Stored on parent `itemPlanning.customFields` so mix reloads after save. */
export const PLANNING_VARIANT_MIX_CUSTOM_FIELD = "variantMix";

export type PlanningVariantMixPayload = {
  variantTable: Array<{ variantItemId: string; Quantities: number }>;
};

function isPlanningVariantMixPayload(
  value: unknown
): value is PlanningVariantMixPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const table = (value as { variantTable?: unknown }).variantTable;
  return Array.isArray(table) && table.length > 0;
}

export function parsePlanningVariantMixPayload(
  value: unknown
): PlanningVariantMixPayload | undefined {
  let parsed = value;
  if (typeof value === "string") {
    if (!value) return undefined;
    try {
      parsed = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return isPlanningVariantMixPayload(parsed) ? parsed : undefined;
}

/** Scale saved mix WEIGHTS so the variantTable quantities sum to `total`. */
export function scalePlanningMixToTotal(
  mix: unknown,
  total: number
): PlanningVariantMixPayload | undefined {
  const parsed = parsePlanningVariantMixPayload(mix);
  if (!parsed) return undefined;
  const scaled = scaleVariantQuantitiesToTotal(
    parsed.variantTable.map((row) => ({
      variantItemId: String(row.variantItemId),
      quantity: Number(row.Quantities) || 0
    })),
    total
  );
  if (scaled.length === 0) return undefined;
  return {
    variantTable: scaled.map((row) => ({
      variantItemId: row.variantItemId,
      Quantities: row.quantity
    }))
  };
}

/**
 * New Make rows inherit the Style planning mix. Existing Draft/Planned jobs
 * keep their saved mix (or plain qty) unless the user opens the grid.
 */
export function resolveOrderVariantQuantities(
  order: {
    existingId?: string | null;
    variantQuantities?: unknown;
    quantity: number;
  },
  parentMix: unknown
): unknown {
  if (order.variantQuantities) return order.variantQuantities;
  if (order.existingId) return undefined;
  return scalePlanningMixToTotal(parentMix, order.quantity);
}

export function readPlanningVariantMixCustomFields(
  customFields: unknown
): PlanningVariantMixPayload | undefined {
  if (!customFields || typeof customFields !== "object") return undefined;
  const mix = (customFields as Record<string, unknown>)[
    PLANNING_VARIANT_MIX_CUSTOM_FIELD
  ];
  return parsePlanningVariantMixPayload(mix);
}

export function withPlanningVariantMixCustomFields(
  customFields: unknown,
  variantQuantities: unknown
): Record<string, unknown> {
  const base =
    customFields &&
    typeof customFields === "object" &&
    !Array.isArray(customFields)
      ? { ...(customFields as Record<string, unknown>) }
      : {};
  const mix = parsePlanningVariantMixPayload(variantQuantities);
  if (mix) {
    base[PLANNING_VARIANT_MIX_CUSTOM_FIELD] = mix;
  } else {
    delete base[PLANNING_VARIANT_MIX_CUSTOM_FIELD];
  }
  return base;
}

export function omitPlanningVariantMixCustomFields(
  customFields: unknown
): Record<string, unknown> | null {
  if (
    !customFields ||
    typeof customFields !== "object" ||
    Array.isArray(customFields)
  ) {
    return customFields && typeof customFields === "object"
      ? (customFields as Record<string, unknown>)
      : null;
  }
  const { [PLANNING_VARIANT_MIX_CUSTOM_FIELD]: _mix, ...rest } =
    customFields as Record<string, unknown>;
  return rest;
}

/**
 * Rebuild mix rows from child SKU planning when customFields mix is missing.
 * Uses the stock-target field with the largest family total as weights.
 */
export function planningMixFromChildStockTargets(
  children: Array<
    { variantItemId: string } & Partial<
      Record<PlanningMixQuantityKey, number | null | undefined>
    >
  >
): PlanningVariantMixPayload | undefined {
  if (children.length === 0) return undefined;

  let bestKey: PlanningMixQuantityKey | undefined;
  let bestSum = 0;
  for (const key of PLANNING_MIX_QUANTITY_KEYS) {
    const sum = children.reduce((total, child) => {
      return total + (Number(child[key]) || 0);
    }, 0);
    if (sum > bestSum) {
      bestSum = sum;
      bestKey = key;
    }
  }
  if (!bestKey || !(bestSum > 0)) return undefined;

  return {
    variantTable: children.map((child) => ({
      variantItemId: child.variantItemId,
      Quantities: Number(child[bestKey]) || 0
    }))
  };
}
