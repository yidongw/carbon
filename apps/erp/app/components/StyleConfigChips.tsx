import { Badge, Td, Tr } from "@carbon/react";
import type { StyleConfigChip } from "~/modules/shared/styleConfigDisplay";

/** Collapsed summary badges under a Style line description. */
export function StyleConfigChips({ chips }: { chips: StyleConfigChip[] }) {
  if (chips.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="font-normal tabular-nums"
        >
          {chip.label}
        </Badge>
      ))}
    </div>
  );
}

/** Expand-panel Color · Size quantity rows (same table as line pricing). */
export function StyleConfigExpandRows({ chips }: { chips: StyleConfigChip[] }) {
  return chips.map((chip) => (
    <Tr key={chip.key}>
      <Td className="whitespace-nowrap">{chip.colorSize}</Td>
      <Td className="text-right">
        <span className="tabular-nums">{chip.quantity}</span>
      </Td>
    </Tr>
  ));
}
