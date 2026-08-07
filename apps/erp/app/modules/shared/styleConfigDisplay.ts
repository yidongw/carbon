import {
  localizeStyleColorName,
  styleColorEnglishNamesByCode
} from "@carbon/database/style-reference";
import { getConfigQuantityCells } from "~/modules/production/configParamsTableColumns";

export type StyleConfigChip = {
  key: string;
  /** Badge text, e.g. `米色 · L ×2` when colorNames are provided */
  label: string;
  /** Expand-row left column, e.g. `米色 · L` when colorNames are provided */
  colorSize: string;
  quantity: number;
};

export type StyleConfigDisplay = {
  chips: StyleConfigChip[];
};

function englishNameAliases(enName: string): string[] {
  const lower = enName.toLowerCase();
  return [enName, lower, lower.toUpperCase()];
}

/**
 * Build color-code → localized name map for Style chips, including English-name
 * aliases from the seed reference so legacy grids that stored "Red"/"Blue" as
 * keys still translate. New standard colors pick up aliases automatically when
 * added to styleReference; custom company colors rely on colorCode keys.
 */
export function buildStyleColorNames(
  colors: Array<{ colorCode?: string | null; colorName?: string | null }>
): Record<string, string> {
  const colorNames: Record<string, string> = {};
  for (const color of colors) {
    if (color.colorCode) {
      colorNames[color.colorCode] = color.colorName ?? color.colorCode;
    }
  }

  const englishByCode = styleColorEnglishNamesByCode();
  for (const [code, enName] of Object.entries(englishByCode)) {
    const localized = colorNames[code];
    if (!localized) continue;
    for (const alias of englishNameAliases(enName)) {
      colorNames[alias] = localized;
    }
    // Seed uses "Gray"; older grids sometimes used British spelling.
    if (code === "GY") {
      for (const alias of englishNameAliases("Grey")) {
        colorNames[alias] = localized;
      }
    }
  }

  return colorNames;
}

/**
 * Parse a Style line's stored `configuration` JSON into a flat list of every
 * non-zero Color · Size cell (for chips + expand quantity rows).
 *
 * Shared by Purchase Order and Sales Order summaries. Config tables may use
 * either sizes or colors as quantity columns — labels are always Color · Size.
 * Pass `colorNames` to show localized names instead of codes.
 */
/**
 * Re-point standard color codes (and their English-name aliases) in a
 * code→label map to the locale's color name, so chips read 黑色 · L in zh even
 * when the stored/loader name is the English base. Non-standard codes and size
 * columns are left untouched.
 */
export function localizeColorNameMap(
  colorNames: Record<string, string> | undefined,
  locale: string | undefined
): Record<string, string> | undefined {
  if (!colorNames || !locale) return colorNames;
  const out = { ...colorNames };
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

export function getStyleConfigDisplay(
  configuration: unknown,
  colorNames?: Record<string, string>,
  locale?: string
): StyleConfigDisplay | null {
  if (!configuration) return null;

  let parsed: unknown = configuration;
  if (typeof configuration === "string") {
    try {
      parsed = JSON.parse(configuration);
    } catch {
      return null;
    }
  }

  const cells = getConfigQuantityCells(
    parsed,
    localizeColorNameMap(colorNames, locale)
  );
  if (cells.length === 0) return null;

  return {
    chips: cells.map((cell) => ({
      key: cell.key,
      colorSize: cell.label,
      label: `${cell.label} ×${cell.quantity}`,
      quantity: cell.quantity
    }))
  };
}

/**
 * Build attribute chips from expanded variant lines (no configTable).
 * Used when PO/SO lines were replaced with child SKUs after expand.
 */
export function getStyleConfigDisplayFromVariants(
  variants: Array<{
    attributeCodes?: string[];
    /** @deprecated prefer attributeCodes */
    colorCode?: string;
    /** @deprecated prefer attributeCodes */
    sizeCode?: string;
    quantity: number;
  }>,
  colorNames?: Record<string, string>,
  locale?: string
): StyleConfigDisplay | null {
  const localized = localizeColorNameMap(colorNames, locale);
  const byKey = new Map<string, StyleConfigChip>();
  for (const variant of variants) {
    const codes =
      variant.attributeCodes?.filter(Boolean) ??
      [variant.colorCode, variant.sizeCode].filter(
        (c): c is string => !!c?.trim()
      );
    if (codes.length === 0) continue;
    const qty = Number(variant.quantity) || 0;
    if (qty <= 0) continue;
    const colorSize = codes
      .map((code) => localized?.[code] ?? code)
      .join(" · ");
    const key = codes.join("|");
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity += qty;
      existing.label = `${colorSize} ×${existing.quantity}`;
    } else {
      byKey.set(key, {
        key,
        colorSize,
        label: `${colorSize} ×${qty}`,
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
  /** @deprecated first attribute code — kept for transitional callers */
  colorCode: string;
  /** @deprecated second attribute code — kept for transitional callers */
  sizeCode: string;
};

type GroupableOrderLine = {
  id: string | null;
  itemId: string | null;
  configuration?: unknown;
};

export type StyleDisplayLineGroup<T extends GroupableOrderLine> =
  | {
      kind: "line";
      key: string;
      line: T;
      styleConfig: StyleConfigDisplay | null;
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
      styleConfig: StyleConfigDisplay | null;
    };

/**
 * Collapse expanded Style variant SKU lines under their parent for summary UI.
 * Parent lines that still carry a configTable (not yet expanded) stay as-is.
 * If both a configured parent and sibling variants exist, prefer the variants
 * for chips/totals so quantities are not double-counted.
 */
export function groupLinesForStyleDisplay<T extends GroupableOrderLine>(
  lines: T[],
  variantByItemId: Record<string, StyleVariantLineMeta>,
  colorNames?: Record<string, string>,
  quantityOf: (line: T) => number = () => 0,
  locale?: string
): StyleDisplayLineGroup<T>[] {
  const variantLinesByParent = new Map<string, T[]>();
  const parentLinesByItemId = new Map<string, T>();
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
    // Parent Style still holding a color×size grid (pre-expand).
    if (getStyleConfigDisplay(line.configuration, colorNames, locale)) {
      parentLinesByItemId.set(line.itemId, line);
      continue;
    }
    passthrough.push(line);
  }

  const groups: StyleDisplayLineGroup<T>[] = [];
  const consumedParents = new Set<string>();

  for (const [parentItemId, variantLines] of variantLinesByParent) {
    const meta = variantByItemId[variantLines[0]!.itemId!];
    const parentLine = parentLinesByItemId.get(parentItemId);
    if (parentLine) consumedParents.add(parentItemId);

    const styleConfig = getStyleConfigDisplayFromVariants(
      variantLines.map((line) => {
        const m = variantByItemId[line.itemId!];
        return {
          attributeCodes: m?.attributeCodes ?? [],
          colorCode: m?.colorCode ?? "",
          sizeCode: m?.sizeCode ?? "",
          quantity: quantityOf(line)
        };
      }),
      colorNames,
      locale
    );

    groups.push({
      kind: "style-group",
      key: `style:${parentItemId}`,
      parentItemId,
      parentReadableId: meta.parentReadableId,
      parentName: meta.parentName,
      parentThumbnailPath:
        meta.parentThumbnailPath ??
        (parentLine as { thumbnailPath?: string | null } | undefined)
          ?.thumbnailPath ??
        null,
      primaryLine: parentLine ?? variantLines[0]!,
      totalLines: variantLines,
      styleConfig
    });
  }

  for (const [parentItemId, parentLine] of parentLinesByItemId) {
    if (consumedParents.has(parentItemId)) continue;
    groups.push({
      kind: "line",
      key: parentLine.id!,
      line: parentLine,
      styleConfig: getStyleConfigDisplay(
        parentLine.configuration,
        colorNames,
        locale
      )
    });
  }

  for (const line of passthrough) {
    groups.push({
      kind: "line",
      key: line.id!,
      line,
      styleConfig: getStyleConfigDisplay(line.configuration, colorNames, locale)
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
