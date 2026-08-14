import { useMemo } from "react";

export type StyleAttributeColumn = {
  attributeId: string;
  code: string;
  name: string;
  values: Array<{ id: string; code: string; name: string }>;
};

export function styleAttributes(row: object): StyleAttributeColumn[] {
  const attrs = (row as { attributes?: unknown }).attributes;
  return Array.isArray(attrs) ? (attrs as StyleAttributeColumn[]) : [];
}

const rank = (code: string) => (code === "Color" ? 0 : code === "Size" ? 1 : 2);

/**
 * Derives the per-attribute column metadata (Color, Size, …) present in the
 * current rows. The returned array is referentially stable across data
 * refreshes that keep the same attribute set, so column definitions built
 * from it keep their identity too. Rebuilding the columns on every data
 * update tears down react-table's row reconciliation with the shared
 * Table's memoized rows/cells and leaves the list frozen on the previous
 * result after client-side search/sort/filter/pagination.
 */
export function useStyleAttributeColumnMeta(
  data: object[]
): Array<{ code: string; name: string }> {
  const derived = useMemo(() => {
    const meta = new Map<string, { code: string; name: string }>();
    for (const row of data) {
      for (const a of styleAttributes(row)) {
        if (!a.code) continue;
        if (!meta.has(a.code)) {
          meta.set(a.code, { code: a.code, name: a.name || a.code });
        }
      }
    }
    return Array.from(meta.values()).sort(
      (a, b) => rank(a.code) - rank(b.code) || a.code.localeCompare(b.code)
    );
  }, [data]);

  const fingerprint = JSON.stringify(derived);
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the serialized content so the reference only changes when the attribute set does
  return useMemo(() => derived, [fingerprint]);
}
