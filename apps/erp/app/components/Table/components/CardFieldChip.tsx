import { cn } from "@carbon/react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import {
  CARD_CHIP_BASE_CLASS,
  CARD_CHIP_VARIANT_CLASS,
  CardCellContext,
  type CardFieldChipVariant
} from "./cardCell";

/** Marker for non-link interactive values inside mobile card field chips. */
export const CARD_ACTION_VALUE_CLASS = "card-action-value";

/** Wraps primary chip values that open drawers/modals instead of navigating via link. */
export function CardActionValue({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span className={cn(CARD_ACTION_VALUE_CLASS, className)} {...props} />
  );
}

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
  onRowNav,
  rowNavTabIndex = 0
}: {
  children: ReactNode;
  rowNav?: boolean;
  rowNavLabel?: string;
  onRowNav?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Set to -1 when a parent card already handles keyboard row navigation. */
  rowNavTabIndex?: number;
}) {
  if (!rowNav || !onRowNav) {
    return <>{children}</>;
  }

  const excludeFromTabOrder = rowNavTabIndex < 0;

  return (
    <div className="relative min-w-0">
      {children}
      <button
        type="button"
        aria-label={excludeFromTabOrder ? undefined : rowNavLabel}
        aria-hidden={excludeFromTabOrder ? true : undefined}
        tabIndex={rowNavTabIndex}
        data-card-action
        className="absolute inset-0 z-[1] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onRowNav}
      />
    </div>
  );
}
