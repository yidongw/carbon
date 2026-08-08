import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle
} from "@carbon/react";
import { useNumberFormatter } from "@react-aria/i18n";
import { type ReactNode, useMemo, useState } from "react";
import { LuLayoutGrid } from "react-icons/lu";
import { padBreakdownToTotal } from "~/modules/inventory/styleBreakdown";
import type { BreakdownEntry } from "~/modules/inventory/types";
import { StyleBreakdownGrid } from "~/modules/inventory/ui/Inventory/StyleBreakdownGrid";

type Props = {
  value: number;
  breakdown: BreakdownEntry[];
  title?: string;
  /** Extra classes for the trigger button — use to match the surrounding text size. */
  className?: string;
  /** Header for the quantity column in the modal grid. Defaults to "On Hand". */
  quantityHeader?: ReactNode;
  /** When set, the modal grid shows one quantity column per warehouse. */
  locationColumns?: { key: string; label: ReactNode }[];
};

export function StyleQuantityCell({
  value,
  breakdown,
  title,
  className,
  quantityHeader,
  locationColumns
}: Props) {
  const [open, setOpen] = useState(false);
  const numberFormatter = useNumberFormatter();
  const format = numberFormatter.format.bind(numberFormatter);

  // Ensure the breakdown always sums to `value`. If the DB only has color/size
  // tags for part of the stock, the remainder shows as an untagged catch-all row.
  const adjustedBreakdown = useMemo(
    () => padBreakdownToTotal(breakdown, value),
    [breakdown, value]
  );

  if (adjustedBreakdown.length === 0) {
    // No color/size trigger, but keep the caller's sizing (e.g. the text-4xl
    // stat cards) so a zero value matches the other cards instead of shrinking.
    return <span className={className ?? "tabular-nums"}>{format(value)}</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "flex items-center gap-1 tabular-nums underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
        }
      >
        {format(value)}
        <LuLayoutGrid className="h-3 w-3 text-muted-foreground shrink-0" />
      </button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent size="medium">
          <ModalHeader>{title && <ModalTitle>{title}</ModalTitle>}</ModalHeader>
          <ModalBody className="overflow-auto pb-6">
            <StyleBreakdownGrid
              breakdown={adjustedBreakdown}
              quantityHeader={quantityHeader}
              locationColumns={locationColumns}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
