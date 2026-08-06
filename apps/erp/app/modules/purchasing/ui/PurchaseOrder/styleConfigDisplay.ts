type ConfigRow = Record<string, string | number | null | undefined>;

export type StyleConfigChip = {
  key: string;
  /** Badge text, e.g. `Beige · L ×2` when colorNames are provided */
  label: string;
  /** Expand-row left column, e.g. `Beige · L` when colorNames are provided */
  colorSize: string;
  quantity: number;
};

export type StyleConfigDisplay = {
  chips: StyleConfigChip[];
};

/**
 * Parse a Style line's stored `configuration` JSON into a flat list of every
 * non-zero color×size cell (for chips + a simple quantity breakdown).
 *
 * Config tables store color *codes*; pass `colorNames` to show localized names
 * in chips and the expand list.
 */
export function getStyleConfigDisplay(
  configuration: unknown,
  colorNames?: Record<string, string>
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

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("configTable" in parsed)
  ) {
    return null;
  }

  const config = parsed as {
    configTable?: ConfigRow[];
    configTablePrimaryKeys?: string[];
  };
  const rows = Array.isArray(config.configTable) ? config.configTable : null;
  if (!rows || rows.length === 0) return null;

  const primaryKeys = Array.isArray(config.configTablePrimaryKeys)
    ? config.configTablePrimaryKeys.filter(
        (k): k is string => typeof k === "string"
      )
    : [];
  if (primaryKeys.length === 0) return null;

  const dimKeys = Object.keys(rows[0] ?? {}).filter(
    (k) => !primaryKeys.includes(k)
  );

  const chips: StyleConfigChip[] = [];
  for (const row of rows) {
    const dimCodes = dimKeys
      .map((k) => String(row[k] ?? "").trim())
      .filter(Boolean);
    const dimsCode = dimCodes.join(" · ");
    const dimsName = dimCodes
      .map((code) => colorNames?.[code] ?? code)
      .join(" · ");

    for (const size of primaryKeys) {
      const quantity = Number(row[size]) || 0;
      if (quantity <= 0) continue;
      const colorSizeCode = dimsCode ? `${dimsCode} · ${size}` : size;
      const colorSize = dimsName ? `${dimsName} · ${size}` : size;
      chips.push({
        key: `${colorSizeCode}|${quantity}|${chips.length}`,
        colorSize,
        label: `${colorSize} ×${quantity}`,
        quantity
      });
    }
  }

  if (chips.length === 0) return null;

  return { chips };
}
