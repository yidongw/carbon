import { createContext, useContext } from "react";

/**
 * True when a cell is being rendered inside the mobile card view (TableCardRow)
 * rather than the desktop table. Cells use this to make their primary action
 * cover the whole card "pill" so the entire area is tappable on touch.
 */
export const CardCellContext = createContext(false);

export const useIsCardCell = () => useContext(CardCellContext);

/**
 * Apply to pill roots that may contain a `[data-card-action]` overlay.
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
