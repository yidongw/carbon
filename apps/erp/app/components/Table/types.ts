import "@tanstack/react-table";
import type { ReactElement } from "react";
import type { ColumnFilterData } from "./components/Filter/types";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  interface ColumnMeta<TData extends unknown, TValue> {
    filter?: ColumnFilterData;
    pluralHeader?: string;
    icon?: ReactElement;
    renderTotal?: boolean;
    formatter?: (
      val:
        | number
        | bigint
        | `${number}`
        | "Infinity"
        | "-Infinity"
        | "+Infinity"
    ) => string;
    /** When true, the mobile card row hides this column's pill. */
    isEmpty?: (row: TData) => boolean;
    /** When true, the mobile card pill navigates to the row href. */
    cardRowNav?: boolean;
    /** Accessible label for the mobile card row-nav pill overlay. */
    cardRowNavLabel?: string;
    /** Extra classes applied to the table cell (`Td`). */
    cellClassName?: string;
  }
}

export type ColumnSizeMap = Map<string, { width: number; startX: number }>;
