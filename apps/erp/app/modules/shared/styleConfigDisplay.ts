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
function localizeColorNameMap(
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
