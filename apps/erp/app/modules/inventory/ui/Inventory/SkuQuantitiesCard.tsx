import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useNumberFormatter } from "@react-aria/i18n";

export type SkuQuantityRow = {
  variantItemId: string;
  readableId: string;
  active?: boolean;
  quantities: {
    quantityOnHand?: number;
    quantityAvailable?: number;
  } | null;
};

/**
 * Per-variant (SKU) on-hand / available quantities for a Style item. Shown on
 * both the Style's Inventory tab and the inventory quantities detail panel.
 */
export function SkuQuantitiesCard({
  variantQuantities
}: {
  variantQuantities: SkuQuantityRow[];
}) {
  const numberFormatter = useNumberFormatter();
  const format = numberFormatter.format.bind(numberFormatter);

  if (variantQuantities.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans>SKU quantities</Trans>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <Thead>
            <Tr>
              <Th className="h-9 px-4 py-2 text-xs">
                <Trans>SKU</Trans>
              </Th>
              <Th className="h-9 px-4 py-2 text-right text-xs">
                <Trans>On Hand</Trans>
              </Th>
              <Th className="h-9 px-4 py-2 text-right text-xs">
                <Trans>Available</Trans>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {variantQuantities.map((row) => (
              <Tr
                key={row.variantItemId}
                className={row.active === false ? "text-muted-foreground" : ""}
              >
                <Td className="h-9 px-4 py-2 text-sm font-mono">
                  {row.readableId}
                  {row.active === false ? (
                    <span className="ml-2 text-xs">
                      <Trans>Inactive</Trans>
                    </span>
                  ) : null}
                </Td>
                <Td className="h-9 px-4 py-2 text-right tabular-nums text-sm">
                  {format(row.quantities?.quantityOnHand ?? 0)}
                </Td>
                <Td className="h-9 px-4 py-2 text-right tabular-nums text-sm">
                  {format(row.quantities?.quantityAvailable ?? 0)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
