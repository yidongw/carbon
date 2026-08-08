import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useNumberFormatter } from "@react-aria/i18n";
import { type ReactNode, useMemo } from "react";
import { sortBreakdown } from "../../styleBreakdown";
import type { BreakdownEntry } from "../../types";

const entryLabel = (e: BreakdownEntry) => e.label ?? e.valuesKey ?? "—";

export function StyleBreakdownGrid({
  breakdown,
  quantityHeader,
  locationColumns
}: {
  breakdown: BreakdownEntry[];
  /** Header for the quantity column. Defaults to "On Hand". */
  quantityHeader?: ReactNode;
  /**
   * When provided, the quantity is split into one column per warehouse (reading
   * each entry's `byLocation[key]`), plus a Total column. Used by the
   * cross-location Stock Overview modal.
   */
  locationColumns?: { key: string; label: ReactNode }[];
}) {
  const numberFormatter = useNumberFormatter();
  const format = numberFormatter.format.bind(numberFormatter);

  const { sorted, totalOnHand } = useMemo(() => {
    const sorted = sortBreakdown(breakdown);
    const totalOnHand = sorted.reduce((s, e) => s + e.quantityOnHand, 0);
    return { sorted, totalOnHand };
  }, [breakdown]);

  if (sorted.length === 0) return null;

  // Cross-location matrix: one quantity column per warehouse + a Total column.
  if (locationColumns && locationColumns.length > 0) {
    const showTotal = locationColumns.length > 1;
    return (
      <Table>
        <Thead>
          <Tr>
            <Th className="h-9 px-4 py-2 text-xs">
              <Trans>SKU</Trans>
            </Th>
            {locationColumns.map((col) => (
              <Th
                key={col.key}
                className="h-9 px-4 py-2 text-right text-xs whitespace-nowrap"
              >
                {col.label}
              </Th>
            ))}
            {showTotal && (
              <Th className="h-9 px-4 py-2 text-right text-xs">
                <Trans>Total</Trans>
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((e, i) => (
            <Tr key={i}>
              <Td className="h-9 px-4 py-2 text-sm whitespace-nowrap">
                {entryLabel(e)}
              </Td>
              {locationColumns.map((col) => (
                <Td
                  key={col.key}
                  className="h-9 px-4 py-2 text-right tabular-nums text-sm"
                >
                  {format(e.byLocation?.[col.key] ?? 0)}
                </Td>
              ))}
              {showTotal && (
                <Td className="h-9 px-4 py-2 text-right tabular-nums text-sm font-medium">
                  {format(e.quantityOnHand)}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr className="border-t border-border">
            <Td className="h-9 px-4 py-2 text-sm">
              <Trans>Total</Trans>
            </Td>
            {locationColumns.map((col) => (
              <Td
                key={col.key}
                className="h-9 px-4 py-2 text-right tabular-nums text-sm"
              >
                {format(
                  sorted.reduce((s, e) => s + (e.byLocation?.[col.key] ?? 0), 0)
                )}
              </Td>
            ))}
            {showTotal && (
              <Td className="h-9 px-4 py-2 text-right tabular-nums text-sm">
                {format(totalOnHand)}
              </Td>
            )}
          </Tr>
        </Tfoot>
      </Table>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th className="h-9 px-4 py-2 text-xs">
            <Trans>SKU</Trans>
          </Th>
          <Th className="h-9 px-4 py-2 text-right text-xs">
            {quantityHeader ?? <Trans>On Hand</Trans>}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {sorted.map((e, i) => (
          <Tr key={i}>
            <Td className="h-9 px-4 py-2 text-sm">{entryLabel(e)}</Td>
            <Td className="h-9 px-4 py-2 text-right tabular-nums text-sm">
              {format(e.quantityOnHand)}
            </Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr className="border-t border-border">
          <Td className="h-9 px-4 py-2 text-sm">
            <Trans>Total</Trans>
          </Td>
          <Td className="h-9 px-4 py-2 text-right tabular-nums text-sm">
            {format(totalOnHand)}
          </Td>
        </Tr>
      </Tfoot>
    </Table>
  );
}
