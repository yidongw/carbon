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

/**
 * Underline interactive field chip labels when the value area is interactive.
 * Underline spec: `.card-field-chip-underline` in app/styles/tailwind.css
 */
const CARD_FIELD_CHIP_LABEL_UNDERLINE_CLASS = [
  "[&:has(:is([data-card-action],a,button,[role='button']))_.card-action-label]:card-field-chip-underline"
].join(" ");

/** Underline navigable values inside a field chip (links + explicit markers). */
const CARD_FIELD_CHIP_VALUE_UNDERLINE_CLASS = [
  "[&_a]:card-field-chip-underline",
  "[&_.card-action-value]:card-field-chip-underline"
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

/** Shared mobile card field chip chrome — interaction + underline affordances. */
export const CARD_CHIP_BASE_CLASS = [
  "relative rounded-lg",
  "transition-[border-color,transform,box-shadow] duration-150 ease-out",
  CARD_HAS_ACTION_CLASS,
  CARD_FIELD_CHIP_LABEL_UNDERLINE_CLASS,
  CARD_FIELD_CHIP_VALUE_UNDERLINE_CLASS
].join(" ");

export const CARD_CHIP_VARIANT_CLASS = {
  /** Left pinned column — transparent fill, border on hover/action. */
  pinned: [
    "min-w-0 w-full px-2.5 py-2",
    "border border-transparent",
    "hover:border-border/70 dark:hover:border-border/60",
    "[&:has([data-card-action])]:hover:border-primary/40 dark:[&:has([data-card-action])]:hover:border-primary/35"
  ].join(" "),
  /** Bottom metadata row — muted inline chip. */
  inline: [
    "inline-flex max-w-full items-center gap-1.5 px-2 py-1 text-xs leading-snug",
    "border border-border/50 bg-muted/30",
    "hover:border-border/70 dark:hover:border-border/60",
    "[&:has([data-card-action])]:hover:border-border"
  ].join(" "),
  /** Right featured column — elevated card surface. */
  featured: [
    "flex min-w-0 flex-col gap-1.5 px-3 py-2.5",
    "border border-primary/25 bg-white shadow-sm",
    "dark:border-primary/30 dark:bg-card",
    "[&:has([data-card-action])]:hover:border-primary/40 dark:[&:has([data-card-action])]:hover:border-primary/35"
  ].join(" ")
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
