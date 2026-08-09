import {
  localizeStyleColorName,
  styleColorEnglishNamesByCode
} from "@carbon/database/style-reference";
import { getVariantsQuantityCells } from "~/modules/production/variantsQuantityTableColumns";

export type VariantChip = {
  key: string;
  /** Badge text, e.g. `米色 · L ×2` when attributeValueNames are provided */
  label: string;
  /** Expand-row left column, e.g. `米色 · L` when attributeValueNames are provided */
  variantLabel: string;
  quantity: number;
};

export type VariantDisplay = {
  chips: VariantChip[];
};

function englishNameAliases(enName: string): string[] {
  const lower = enName.toLowerCase();
  return [enName, lower, lower.toUpperCase()];
}

/**
 * Build an attribute-value `code → localized name` map for Style chips, over ALL
 * attributes (not just Color) so any set (Garment, Shoes, …) renders values as
 * names. Standard color codes additionally get English-name aliases from the
 * seed reference so legacy grids that stored "Red"/"Blue" as keys still
 * translate; every other attribute value maps by its own code → name.
 */
export function buildAttributeValueNames(
  values: Array<{ code?: string | null; name?: string | null }>
): Record<string, string> {
  const names: Record<string, string> = {};
  for (const v of values) {
    if (v.code) names[v.code] = v.name ?? v.code;
  }

  const englishByCode = styleColorEnglishNamesByCode();
  for (const [code, enName] of Object.entries(englishByCode)) {
    const localized = names[code];
    if (!localized) continue;
    for (const alias of englishNameAliases(enName)) {
      names[alias] = localized;
    }
    // Seed uses "Gray"; older grids sometimes used British spelling.
    if (code === "GY") {
      for (const alias of englishNameAliases("Grey")) {
        names[alias] = localized;
      }
    }
  }

  return names;
}

/**
 * Parse a Style line's stored `configuration` JSON into a flat list of every
 * non-zero variant cell (for chips + expand quantity rows).
 *
 * Shared by Purchase Order and Sales Order summaries. Config tables may use
 * either sizes or colors as quantity columns — labels are always variant.
 * Pass `attributeValueNames` to show localized names instead of codes.
 */
/**
 * Re-point standard color codes (and their English-name aliases) in a
 * code→label map to the locale's color name, so chips read 黑色 · L in zh even
 * when the stored/loader name is the English base. Non-standard codes and other
 * attribute values are left untouched.
 */
export function localizeColorNameMap(
  attributeValueNames: Record<string, string> | undefined,
  locale: string | undefined
): Record<string, string> | undefined {
  if (!attributeValueNames || !locale) return attributeValueNames;
  const out = { ...attributeValueNames };
  for (const [code, enName] of Object.entries(styleColorEnglishNamesByCode())) {
    const localized = localizeStyleColorName(code, locale);
    if (!localized) continue;
    const lower = enName.toLowerCase();
    for (const key of [code, enName, lower, lower.toUpperCase()]) {
      if (key in out) out[key] = localized;
    }
  }
  return out;
}

export function getVariantDisplay(
  configuration: unknown,
  attributeValueNames?: Record<string, string>,
  locale?: string
): VariantDisplay | null {
  if (!configuration) return null;

  let parsed: unknown = configuration;
  if (typeof configuration === "string") {
    try {
      parsed = JSON.parse(configuration);
    } catch {
      return null;
    }
  }

  const cells = getVariantsQuantityCells(
    parsed,
    localizeColorNameMap(attributeValueNames, locale)
  );
  if (cells.length === 0) return null;

  return {
    chips: cells.map((cell) => ({
      key: cell.key,
      variantLabel: cell.label,
      label: `${cell.label} ×${cell.quantity}`,
      quantity: cell.quantity
    }))
  };
}

/**
 * Build attribute chips from expanded variant lines (no variantTable).
 * Used when PO/SO lines were replaced with child SKUs after expand.
 */
export function getVariantDisplayFromVariants(
  variants: Array<{
    attributeCodes?: string[];
    quantity: number;
  }>,
  attributeValueNames?: Record<string, string>,
  locale?: string
): VariantDisplay | null {
  const localized = localizeColorNameMap(attributeValueNames, locale);
  const byKey = new Map<string, VariantChip>();
  for (const variant of variants) {
    const codes = variant.attributeCodes?.filter(Boolean) ?? [];
    if (codes.length === 0) continue;
    const qty = Number(variant.quantity) || 0;
    if (qty <= 0) continue;
    const variantLabel = codes
      .map((code) => localized?.[code] ?? code)
      .join(" · ");
    const key = codes.join("|");
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity += qty;
      existing.label = `${variantLabel} ×${existing.quantity}`;
    } else {
      byKey.set(key, {
        key,
        variantLabel,
        label: `${variantLabel} ×${qty}`,
        quantity: qty
      });
    }
  }
  if (byKey.size === 0) return null;
  return { chips: [...byKey.values()] };
}

/** Parent Style/Consumable metadata for a variant SKU line on an order. */
export type StyleVariantLineMeta = {
  variantItemId: string;
  parentItemId: string;
  parentReadableId: string;
  parentName: string | null;
  parentThumbnailPath: string | null;
  /** Attribute value codes in set order (from valuesKey / variant attrs). */
  attributeCodes: string[];
};

type GroupableOrderLine = {
  id: string | null;
  itemId: string | null;
};

export type StyleDisplayLineGroup<T extends GroupableOrderLine> =
  | {
      kind: "line";
      key: string;
      line: T;
      variantDisplay: VariantDisplay | null;
    }
  | {
      kind: "style-group";
      key: string;
      parentItemId: string;
      parentReadableId: string;
      parentName: string | null;
      parentThumbnailPath: string | null;
      /** Prefer parent line for edit/delete when present; else first variant. */
      primaryLine: T;
      /** Lines that contribute to totals (variants when expanded; else parent). */
      totalLines: T[];
      variantDisplay: VariantDisplay | null;
    };

/**
 * Collapse expanded Style variant SKU lines under their parent for summary UI.
 * SO/PO persist expanded variant SKU lines only (no parent+grid column).
 */
export function groupLinesForStyleDisplay<T extends GroupableOrderLine>(
  lines: T[],
  variantByItemId: Record<string, StyleVariantLineMeta>,
  attributeValueNames?: Record<string, string>,
  quantityOf: (line: T) => number = () => 0,
  locale?: string
): StyleDisplayLineGroup<T>[] {
  const variantLinesByParent = new Map<string, T[]>();
  const passthrough: T[] = [];

  for (const line of lines) {
    if (!line.id || !line.itemId) {
      if (line.id) passthrough.push(line);
      continue;
    }
    const meta = variantByItemId[line.itemId];
    if (meta) {
      const list = variantLinesByParent.get(meta.parentItemId) ?? [];
      list.push(line);
      variantLinesByParent.set(meta.parentItemId, list);
      continue;
    }
    passthrough.push(line);
  }

  const groups: StyleDisplayLineGroup<T>[] = [];

  for (const [parentItemId, variantLines] of variantLinesByParent) {
    const meta = variantByItemId[variantLines[0]!.itemId!];

    const variantDisplay = getVariantDisplayFromVariants(
      variantLines.map((line) => {
        const m = variantByItemId[line.itemId!];
        return {
          attributeCodes: m?.attributeCodes ?? [],
          quantity: quantityOf(line)
        };
      }),
      attributeValueNames,
      locale
    );

    groups.push({
      kind: "style-group",
      key: `style:${parentItemId}`,
      parentItemId,
      parentReadableId: meta.parentReadableId,
      parentName: meta.parentName,
      parentThumbnailPath: meta.parentThumbnailPath ?? null,
      primaryLine: variantLines[0]!,
      totalLines: variantLines,
      variantDisplay
    });
  }

  for (const line of passthrough) {
    groups.push({
      kind: "line",
      key: line.id!,
      line,
      variantDisplay: null
    });
  }

  // Preserve original line order: first occurrence of each group's members.
  const orderIndex = new Map(lines.map((l, i) => [l.id, i]));
  const firstIndex = (group: StyleDisplayLineGroup<T>) => {
    if (group.kind === "line") return orderIndex.get(group.line.id) ?? 0;
    return Math.min(
      ...group.totalLines.map((l) => orderIndex.get(l.id) ?? 0),
      orderIndex.get(group.primaryLine.id) ?? Number.MAX_SAFE_INTEGER
    );
  };
  groups.sort((a, b) => firstIndex(a) - firstIndex(b));
  return groups;
}
