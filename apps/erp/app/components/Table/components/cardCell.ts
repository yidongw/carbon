import { createContext, useContext } from "react";

/**
 * True when a cell is being rendered inside the mobile card view (TableCardRow)
 * rather than the desktop table. Cells use this to make their primary action
 * cover the whole card "pill" so the entire area is tappable on touch.
 */
export const CardCellContext = createContext(false);

export const useIsCardCell = () => useContext(CardCellContext);
