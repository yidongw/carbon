import { createContext, useContext } from "react";

/**
 * True when a cell is being rendered inside the mobile card view (TableCardRow)
 * rather than the desktop table. Cells use this to make their primary action
 * cover the whole field chip so the entire area is tappable on touch.
 */
export const CardCellContext = createContext(false);

export const useIsCardCell = () => useContext(CardCellContext);

/**
 * Apply to field chip roots that may contain a `[data-card-action]` overlay.
 * Underlines `.card-action-label` (field headers) and `.card-action-value`
 * (pinned nav text) when an action overlay is present.
 */
export const CARD_HAS_ACTION_CLASS = [
  "[&:has([data-card-action])]:cursor-pointer",
  "[&:has([data-card-action])]:transition-[transform,box-shadow,border-color]",
  "[&:has([data-card-action])]:hover:-translate-y-0.5",
  "[&:has([data-card-action])]:hover:shadow-md",
  "[&:has([data-card-action])_.card-action-label]:underline",
  "[&:has([data-card-action])_.card-action-label]:decoration-dotted",
  "[&:has([data-card-action])_.card-action-label]:decoration-foreground/65",
  "[&:has([data-card-action])_.card-action-label]:underline-offset-2",
  "[&:has([data-card-action])_.card-action-value]:underline",
  "[&:has([data-card-action])_.card-action-value]:decoration-dotted",
  "[&:has([data-card-action])_.card-action-value]:decoration-foreground/75",
  "[&:has([data-card-action])_.card-action-value]:underline-offset-2"
].join(" ");

/** Shared mobile card field chip chrome — transparent fill, border on hover/action. */
export const CARD_CHIP_BASE_CLASS = [
  "relative rounded-lg border border-transparent",
  "transition-[border-color,transform,box-shadow] duration-150 ease-out",
  "hover:border-border/70 dark:hover:border-border/60",
  CARD_HAS_ACTION_CLASS,
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
