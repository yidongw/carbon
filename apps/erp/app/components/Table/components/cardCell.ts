import { createContext, useContext } from "react";
import type { Column } from "@tanstack/react-table";

/**
 * True when a cell is being rendered inside the mobile card view (TableCardRow)
 * rather than the desktop table. Cells use this to make their primary action
 * cover the whole field chip so the entire area is tappable on touch.
 */
export const CardCellContext = createContext(false);

export const useIsCardCell = () => useContext(CardCellContext);

/** Wrapper class for pinned-column cell content in mobile card rows. */
export const CARD_PINNED_VALUE_CLASS = "card-pinned-value";

/** Shared blue dotted underline for interactive mobile card field chips. */
const CARD_FIELD_CHIP_UNDERLINE_STYLES = [
  "underline",
  "decoration-dotted",
  "decoration-[2.5px]",
  "decoration-blue-600",
  "dark:decoration-blue-400",
  "underline-offset-2"
] as const;

function chipTargetStyles(
  selector: string,
  styles: readonly string[]
): string {
  return styles.map((style) => `[${selector}]:${style}`).join(" ");
}

/** Apply directly on links and pinned values inside field chips. */
export const CARD_FIELD_CHIP_UNDERLINE_CLASS =
  CARD_FIELD_CHIP_UNDERLINE_STYLES.join(" ");

/**
 * Underline interactive field chip labels and values across pinned, inline,
 * and featured variants.
 */
const CARD_FIELD_CHIP_INTERACTIVE_UNDERLINE_CLASS = [
  chipTargetStyles("&:has([data-card-action])_.card-action-label", CARD_FIELD_CHIP_UNDERLINE_STYLES),
  chipTargetStyles("&:has([data-card-action])_.card-action-value", CARD_FIELD_CHIP_UNDERLINE_STYLES),
  chipTargetStyles("&:has([data-card-action])_.card-pinned-value", CARD_FIELD_CHIP_UNDERLINE_STYLES),
  chipTargetStyles(
    "&:has(:is(a,[data-card-action],button,[role='button']))_.card-action-label",
    CARD_FIELD_CHIP_UNDERLINE_STYLES
  ),
  chipTargetStyles("&_.card-pinned-value_a", CARD_FIELD_CHIP_UNDERLINE_STYLES),
  chipTargetStyles("&_.card-pinned-value_.card-action-value", CARD_FIELD_CHIP_UNDERLINE_STYLES)
].join(" ");

/**
 * Apply to field chip roots that may contain a `[data-card-action]` overlay.
 */
export const CARD_HAS_ACTION_CLASS = [
  "[&:has([data-card-action])]:cursor-pointer",
  "[&:has([data-card-action])]:transition-[transform,box-shadow,border-color]",
  "[&:has([data-card-action])]:hover:-translate-y-0.5",
  "[&:has([data-card-action])]:hover:shadow-md"
].join(" ");

/** Shared mobile card field chip chrome — transparent fill, border on hover/action. */
export const CARD_CHIP_BASE_CLASS = [
  "relative rounded-lg border border-transparent",
  "transition-[border-color,transform,box-shadow] duration-150 ease-out",
  "hover:border-border/70 dark:hover:border-border/60",
  CARD_HAS_ACTION_CLASS,
  CARD_FIELD_CHIP_INTERACTIVE_UNDERLINE_CLASS,
  "[&:has([data-card-action])]:hover:border-primary/40 dark:[&:has([data-card-action])]:hover:border-primary/35"
].join(" ");

export const CARD_CHIP_VARIANT_CLASS = {
  /** Left pinned column — full-width stack. */
  pinned: "min-w-0 w-full px-2.5 py-2",
  /** Bottom metadata row — compact inline chip. */
  inline: "inline-flex max-w-full items-center gap-1.5 px-2 py-1 text-xs leading-snug",
  /** Right featured column — taller stack with label + value. */
  featured: "flex min-w-0 flex-col gap-1.5 px-3 py-2.5"
} as const;

export type CardFieldChipVariant = keyof typeof CARD_CHIP_VARIANT_CLASS;

/**
 * Whether a mobile card field chip should navigate to the row href.
 * Defaults to the first pinned column when the table supplies `getRowHref`.
 */
export function resolveCardRowNav<T extends object>(
  column: Column<T, unknown>,
  rowHref: string | undefined,
  pinnedColumnIds: readonly string[]
): boolean {
  if (!rowHref) return false;

  const cardRowNav = column.columnDef.meta?.cardRowNav;
  if (cardRowNav === true) return true;
  if (cardRowNav === false) return false;

  const primaryPinnedId = pinnedColumnIds[0];
  return primaryPinnedId != null && column.id === primaryPinnedId;
}
