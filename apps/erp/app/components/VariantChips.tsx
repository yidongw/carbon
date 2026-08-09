import { Badge, Td, Tr } from "@carbon/react";
import type { VariantChip } from "~/modules/shared/variantDisplay";

/** Collapsed summary badges under a Style line description. */
export function VariantChips({ chips }: { chips: VariantChip[] }) {
  if (chips.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="font-semibold tabular-nums"
        >
          {chip.label}
        </Badge>
      ))}
    </div>
  );
}

/** Expand-panel variant quantity rows (same table as line pricing). */
export function VariantExpandRows({ chips }: { chips: VariantChip[] }) {
  return chips.map((chip) => (
    <Tr key={chip.key}>
      <Td className="whitespace-nowrap">{chip.variantLabel}</Td>
      <Td className="text-right">
        <span className="tabular-nums">{chip.quantity}</span>
      </Td>
    </Tr>
  ));
}
