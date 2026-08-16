import { Badge, cn, Td, Tr } from "@carbon/react";
import type { VariantChip } from "~/modules/shared/variantDisplay";

/** Collapsed summary badges under a Style line description. */
export function VariantChips({
  chips,
  className
}: {
  chips: VariantChip[];
  className?: string;
}) {
  if (chips.length === 0) return null;
  return (
    <div className={cn("mt-2 flex flex-wrap gap-1.5", className)}>
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
