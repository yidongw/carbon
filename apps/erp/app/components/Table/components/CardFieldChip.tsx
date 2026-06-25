import { cn } from "@carbon/react";
import type { MouseEvent, ReactNode } from "react";
import {
  CARD_CHIP_BASE_CLASS,
  CARD_CHIP_VARIANT_CLASS,
  CardCellContext,
  type CardFieldChipVariant
} from "./cardCell";

export function CardFieldChip({
  variant,
  className,
  children
}: {
  variant: CardFieldChipVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        CARD_CHIP_BASE_CLASS,
        CARD_CHIP_VARIANT_CLASS[variant],
        className
      )}
    >
      <CardCellContext.Provider value={true}>{children}</CardCellContext.Provider>
    </div>
  );
}

export function CardFieldChipBody({
  children,
  rowNav,
  rowNavLabel,
  onRowNav
}: {
  children: ReactNode;
  rowNav?: boolean;
  rowNavLabel?: string;
  onRowNav?: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  if (!rowNav || !onRowNav) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-w-0">
      {children}
      <button
        type="button"
        aria-label={rowNavLabel}
        data-card-action
        className="absolute inset-0 z-[1] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onRowNav}
      />
    </div>
  );
}
